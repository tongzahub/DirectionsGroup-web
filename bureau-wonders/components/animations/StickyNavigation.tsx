'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { usePerformanceMetrics } from '@/lib/performance-monitor';
import { throttleScroll } from '@/lib/smooth-scroll';
import { cn } from '@/lib/utils';

interface StickyNavigationProps {
  children: ReactNode;
  className?: string;
  hideOnScrollDown?: boolean;
  showOnScrollUp?: boolean;
  threshold?: number;
  backgroundBlur?: boolean;
  shadowOnScroll?: boolean;
  disabled?: boolean;
}

export default function StickyNavigation({
  children,
  className = '',
  hideOnScrollDown = true,
  showOnScrollUp = true,
  threshold = 100,
  backgroundBlur = true,
  shadowOnScroll = true,
  disabled = false,
}: StickyNavigationProps) {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);
  const performanceMetrics = usePerformanceMetrics();
  
  // Disable on low-end devices or when explicitly disabled
  const isDisabled = disabled || 
    performanceMetrics.isLowEndDevice || 
    performanceMetrics.fps < 30;

  // Handle scroll direction and visibility
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (isDisabled) return;
    
    const direction = latest > lastScrollY.current ? 'down' : 'up';
    const scrolledPastThreshold = latest > threshold;
    
    setScrollDirection(direction);
    setIsScrolled(scrolledPastThreshold);
    
    if (hideOnScrollDown && showOnScrollUp) {
      if (direction === 'down' && latest > threshold) {
        setIsVisible(false);
      } else if (direction === 'up' || latest <= threshold) {
        setIsVisible(true);
      }
    }
    
    lastScrollY.current = latest;
  });

  // Throttled scroll handler for additional effects
  useEffect(() => {
    if (isDisabled) return;
    
    const handleScroll = throttleScroll(() => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > threshold);
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, isDisabled]);

  // Static version for low-end devices
  if (isDisabled) {
    return (
      <div className={cn('sticky top-0 z-40', className)}>
        {children}
      </div>
    );
  }

  const variants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <motion.div
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        {
          'backdrop-blur-md': backgroundBlur && isScrolled,
          'shadow-lg': shadowOnScroll && isScrolled,
          'bg-white/95': isScrolled,
          'bg-transparent': !isScrolled,
        },
        className
      )}
      initial="visible"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Background overlay for better contrast */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 0.95 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Bottom border that appears on scroll */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-gray-light to-transparent"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ 
          opacity: isScrolled ? 1 : 0,
          scaleX: isScrolled ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </motion.div>
  );
}

// Table of Contents Navigation Component
interface TableOfContentsProps {
  headings: Array<{
    id: string;
    text: string;
    level: number;
  }>;
  className?: string;
  activeHeading?: string;
  onHeadingClick?: (id: string) => void;
}

export function TableOfContents({
  headings,
  className = '',
  activeHeading,
  onHeadingClick,
}: TableOfContentsProps) {
  const [currentActive, setCurrentActive] = useState(activeHeading || '');
  const performanceMetrics = usePerformanceMetrics();
  
  const isDisabled = performanceMetrics.isLowEndDevice || performanceMetrics.fps < 30;

  useEffect(() => {
    if (isDisabled) return;
    
    const handleScroll = throttleScroll(() => {
      // Find the currently visible heading
      let currentHeading = '';
      
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 0) {
            currentHeading = heading.id;
          }
        }
      }
      
      if (currentHeading && currentHeading !== currentActive) {
        setCurrentActive(currentHeading);
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings, currentActive, isDisabled]);

  const handleClick = (id: string) => {
    setCurrentActive(id);
    onHeadingClick?.(id);
  };

  if (headings.length === 0) return null;

  return (
    <nav className={cn('space-y-2', className)}>
      <h3 className="text-sm font-semibold text-neutral-gray-dark mb-3">
        Table of Contents
      </h3>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <motion.li
            key={heading.id}
            className={cn(
              'text-sm transition-colors duration-200',
              {
                'ml-0': heading.level === 1,
                'ml-3': heading.level === 2,
                'ml-6': heading.level === 3,
                'ml-9': heading.level >= 4,
              }
            )}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => handleClick(heading.id)}
              className={cn(
                'text-left w-full py-1 px-2 rounded transition-all duration-200 hover:bg-accent-mist-blue/20',
                {
                  'text-primary-blue font-medium bg-accent-mist-blue/30': 
                    currentActive === heading.id,
                  'text-neutral-gray hover:text-neutral-gray-dark': 
                    currentActive !== heading.id,
                }
              )}
            >
              {heading.text}
            </button>
          </motion.li>
        ))}
      </ul>
    </nav>
  );
}

// Scroll to Top Button
interface ScrollToTopButtonProps {
  className?: string;
  threshold?: number;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
}

export function ScrollToTopButton({
  className = '',
  threshold = 400,
  position = 'bottom-right',
  size = 'md',
}: ScrollToTopButtonProps) {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const performanceMetrics = usePerformanceMetrics();
  
  const isDisabled = performanceMetrics.isLowEndDevice || performanceMetrics.fps < 30;

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsVisible(latest > threshold);
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg',
  };

  if (isDisabled) {
    return isVisible ? (
      <button
        onClick={handleClick}
        className={cn(
          'fixed z-50 bg-primary-blue text-white rounded-full shadow-lg hover:bg-primary-blue/90 transition-colors',
          positionClasses[position],
          sizeClasses[size],
          className
        )}
      >
        ↑
      </button>
    ) : null;
  }

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        'fixed z-50 bg-primary-blue text-white rounded-full shadow-lg hover:bg-primary-blue/90 transition-colors flex items-center justify-center',
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        y: isVisible ? 0 : 20,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 10l7-7m0 0l7 7m-7-7v18" 
        />
      </svg>
    </motion.button>
  );
}