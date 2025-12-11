'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef, useEffect, useState } from 'react';
import { usePerformanceMetrics } from '@/lib/performance-monitor';
import { cn } from '@/lib/utils';

interface ParallaxElement {
  id: string;
  content: ReactNode;
  speed: number;
  className?: string;
  zIndex?: number;
}

interface ParallaxSectionProps {
  children: ReactNode;
  elements?: ParallaxElement[];
  className?: string;
  disabled?: boolean;
  intensity?: number;
}

export default function ParallaxSection({
  children,
  elements = [],
  className = '',
  disabled = false,
  intensity = 1,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
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

  // Static version for performance or SSR
  if (!isClient || shouldDisableParallax || elements.length === 0) {
    return (
      <section 
        ref={sectionRef}
        className={cn('relative', className)}
      >
        {elements.map((element) => (
          <div
            key={element.id}
            className={cn('absolute', element.className)}
            style={{ zIndex: element.zIndex || 0 }}
          >
            {element.content}
          </div>
        ))}
        <div className="relative z-50">
          {children}
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className={cn('relative', className)}
    >
      {/* Parallax Elements */}
      {elements.map((element) => {
        const adjustedSpeed = element.speed * intensity;
        const y = useTransform(
          scrollYProgress, 
          [0, 1], 
          [50 * adjustedSpeed, -50 * adjustedSpeed]
        );

        return (
          <motion.div
            key={element.id}
            className={cn('absolute will-change-transform', element.className)}
            style={{ 
              y,
              zIndex: element.zIndex || 0,
              transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
            }}
          >
            {element.content}
          </motion.div>
        );
      })}
      
      {/* Main Content */}
      <div className="relative z-50">
        {children}
      </div>
    </section>
  );
}