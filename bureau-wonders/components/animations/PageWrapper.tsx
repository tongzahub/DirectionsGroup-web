'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAdaptiveAnimation } from '@/hooks/useAnimations';
import { createResponsiveTransition } from '@/lib/animation-config';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  maintainScrollPosition?: boolean;
  transitionType?: 'fade' | 'slide' | 'scale';
  duration?: number;
  preserveContext?: boolean;
}

export default function PageWrapper({
  children,
  className = '',
  maintainScrollPosition = false,
  transitionType = 'fade',
  duration,
  preserveContext = true
}: PageWrapperProps) {
  const pathname = usePathname();
  const adaptiveConfig = useAdaptiveAnimation('pageTransition');
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Use adaptive duration if not specified
  const animationDuration = duration || adaptiveConfig.duration;
  
  // Handle scroll position preservation
  useEffect(() => {
    if (maintainScrollPosition) {
      const handleScroll = () => {
        setScrollPosition(window.scrollY);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [maintainScrollPosition]);
  
  // Restore scroll position after route change
  useEffect(() => {
    if (maintainScrollPosition && scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }
  }, [pathname, maintainScrollPosition, scrollPosition]);
  
  const getVariants = () => {
    const baseVariants = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    };
    
    if (adaptiveConfig.disabled) {
      return baseVariants;
    }
    
    switch (transitionType) {
      case 'slide':
        return {
          initial: { opacity: 0, x: 20, scale: 0.98 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: -20, scale: 0.98 }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.95, y: 10 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 1.05, y: -10 }
        };
      default: // fade
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 }
        };
    }
  };
  
  const variants = getVariants();
  const transition = createResponsiveTransition('pageTransition', animationDuration);
  
  // Add context preservation data attributes
  const contextAttributes = preserveContext ? {
    'data-page-path': pathname,
    'data-transition-type': transitionType,
    'data-scroll-position': scrollPosition
  } : {};
  
  return (
    <motion.main
      key={pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
      className={cn(
        'min-h-screen',
        'will-change-transform will-change-opacity',
        'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none',
        className
      )}
      {...contextAttributes}
    >
      {children}
    </motion.main>
  );
}