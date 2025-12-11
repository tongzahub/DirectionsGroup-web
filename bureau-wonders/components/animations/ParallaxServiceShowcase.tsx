'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef, useEffect, useState } from 'react';
import { usePerformanceMetrics } from '@/lib/performance-monitor';
import { cn } from '@/lib/utils';

interface ServiceElement {
  id: string;
  content: ReactNode;
  speed: number;
  className?: string;
  zIndex?: number;
  offset?: [number, number];
}

interface ParallaxServiceShowcaseProps {
  children: ReactNode;
  backgroundElements?: ServiceElement[];
  foregroundElements?: ServiceElement[];
  className?: string;
  disabled?: boolean;
  intensity?: number;
  enableInteraction?: boolean;
}

export default function ParallaxServiceShowcase({
  children,
  backgroundElements = [],
  foregroundElements = [],
  className = '',
  disabled = false,
  intensity = 1,
  enableInteraction = true,
}: ParallaxServiceShowcaseProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const performanceMetrics = usePerformanceMetrics();
  
  // Check if parallax should be disabled
  const shouldDisableParallax = disabled || 
    performanceMetrics.isLowEndDevice || 
    performanceMetrics.fps < 45 ||
    performanceMetrics.batteryLevel < 0.2;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const renderElements = (elements: ServiceElement[], isBackground: boolean = true) => {
    if (!isClient || shouldDisableParallax) {
      return elements.map((element) => (
        <div
          key={element.id}
          className={cn(
            'absolute',
            element.className
          )}
          style={{ zIndex: element.zIndex || (isBackground ? 0 : 10) }}
        >
          {element.content}
        </div>
      ));
    }

    return elements.map((element) => {
      const adjustedSpeed = element.speed * intensity;
      const offset = element.offset || [0, 1];
      
      const y = useTransform(
        scrollYProgress, 
        offset, 
        [50 * adjustedSpeed, -50 * adjustedSpeed]
      );

      const scale = enableInteraction && activeElement === element.id 
        ? useTransform(() => 1.1) 
        : useTransform(() => 1);

      return (
        <motion.div
          key={element.id}
          className={cn(
            'absolute cursor-pointer',
            element.className
          )}
          style={{ 
            y,
            scale,
            zIndex: element.zIndex || (isBackground ? 0 : 10),
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
          }}
          onHoverStart={() => enableInteraction && setActiveElement(element.id)}
          onHoverEnd={() => enableInteraction && setActiveElement(null)}
          whileHover={enableInteraction ? { 
            scale: 1.05,
            transition: { duration: 0.3, ease: 'easeOut' }
          } : {}}
        >
          {element.content}
        </motion.div>
      );
    });
  };

  // Static version for performance or SSR
  if (!isClient || shouldDisableParallax) {
    return (
      <section 
        ref={sectionRef}
        className={cn('relative', className)}
      >
        {renderElements(backgroundElements, true)}
        <div className="relative z-20">
          {children}
        </div>
        {renderElements(foregroundElements, false)}
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={cn('relative overflow-hidden', className)}
    >
      {/* Background Elements */}
      {renderElements(backgroundElements, true)}
      
      {/* Main Content */}
      <div className="relative z-20">
        {children}
      </div>
      
      {/* Foreground Elements */}
      {renderElements(foregroundElements, false)}
    </section>
  );
}

// Preset configurations for common service showcase patterns
export const serviceShowcasePresets = {
  communications: {
    backgroundElements: [
      {
        id: 'comm-bg-1',
        speed: 0.2,
        className: 'top-10 left-10 opacity-10',
        zIndex: 1,
        content: (
          <div className="w-32 h-32 bg-blue-200 rounded-full blur-xl" />
        ),
      },
      {
        id: 'comm-bg-2',
        speed: 0.4,
        className: 'bottom-20 right-20 opacity-15',
        zIndex: 2,
        content: (
          <div className="w-24 h-24 bg-purple-200 rounded-full blur-lg" />
        ),
      },
    ],
    foregroundElements: [
      {
        id: 'comm-fg-1',
        speed: 0.6,
        className: 'top-1/4 right-10 opacity-20',
        zIndex: 10,
        content: (
          <div className="w-16 h-16 bg-white rounded-full blur-md" />
        ),
      },
    ],
  },
  
  events: {
    backgroundElements: [
      {
        id: 'event-bg-1',
        speed: 0.3,
        className: 'top-0 left-1/4 opacity-10',
        zIndex: 1,
        content: (
          <div className="w-40 h-40 bg-yellow-200 rounded-full blur-2xl" />
        ),
      },
      {
        id: 'event-bg-2',
        speed: 0.5,
        className: 'bottom-10 left-10 opacity-12',
        zIndex: 2,
        content: (
          <div className="w-28 h-28 bg-pink-200 rounded-full blur-lg" />
        ),
      },
    ],
    foregroundElements: [
      {
        id: 'event-fg-1',
        speed: 0.7,
        className: 'top-1/3 left-1/2 opacity-25',
        zIndex: 10,
        content: (
          <div className="w-20 h-20 bg-white rounded-full blur-sm" />
        ),
      },
    ],
  },
  
  crm: {
    backgroundElements: [
      {
        id: 'crm-bg-1',
        speed: 0.25,
        className: 'top-1/4 right-1/4 opacity-8',
        zIndex: 1,
        content: (
          <div className="w-36 h-36 bg-green-200 rounded-full blur-xl" />
        ),
      },
      {
        id: 'crm-bg-2',
        speed: 0.45,
        className: 'bottom-1/4 left-1/3 opacity-12',
        zIndex: 2,
        content: (
          <div className="w-32 h-32 bg-teal-200 rounded-full blur-lg" />
        ),
      },
    ],
    foregroundElements: [
      {
        id: 'crm-fg-1',
        speed: 0.65,
        className: 'top-2/3 right-1/3 opacity-18',
        zIndex: 10,
        content: (
          <div className="w-18 h-18 bg-white rounded-full blur-md" />
        ),
      },
    ],
  },
} as const;