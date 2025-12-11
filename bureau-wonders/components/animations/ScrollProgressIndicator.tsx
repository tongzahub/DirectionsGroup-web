'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useAdaptiveAnimation } from '@/hooks/useAnimations';
import { usePerformanceMetrics } from '@/lib/performance-monitor';
import { cn } from '@/lib/utils';

interface ScrollProgressIndicatorProps {
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  thickness?: number;
  color?: string;
  showPercentage?: boolean;
  smoothness?: number;
  target?: React.RefObject<HTMLElement>;
  showReadingTime?: boolean;
  estimatedReadingTime?: number; // in minutes
}

export default function ScrollProgressIndicator({
  className = '',
  position = 'top',
  thickness = 3,
  color = 'bg-gradient-to-r from-primary-blue to-accent-mist-blue',
  showPercentage = false,
  smoothness = 0.3,
  target,
  showReadingTime = false,
  estimatedReadingTime = 5
}: ScrollProgressIndicatorProps) {
  const { scrollYProgress } = useScroll({
    target: target || undefined,
    offset: target ? ["start start", "end end"] : undefined
  });
  
  const adaptiveConfig = useAdaptiveAnimation('scrollReveal');
  const performanceMetrics = usePerformanceMetrics();
  const [isVisible, setIsVisible] = useState(false);
  const [readingTimeLeft, setReadingTimeLeft] = useState(estimatedReadingTime);
  
  // Disable on low-end devices
  const isDisabled = adaptiveConfig.disabled || 
    performanceMetrics.isLowEndDevice || 
    performanceMetrics.fps < 30;
  
  // Smooth the scroll progress with performance consideration
  const scaleX = useSpring(scrollYProgress, {
    stiffness: isDisabled ? 200 : 100,
    damping: (smoothness * 100) * (isDisabled ? 2 : 1),
    restDelta: 0.001
  });
  
  // Calculate reading time based on progress
  const progress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // Show indicator when user starts scrolling
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setIsVisible(latest > 0.01);
      
      if (showReadingTime && latest > 0) {
        const remainingTime = estimatedReadingTime * (1 - latest);
        setReadingTimeLeft(Math.max(0, remainingTime));
      }
    });
    
    return unsubscribe;
  }, [scrollYProgress, showReadingTime, estimatedReadingTime]);
  
  if (isDisabled) {
    return null;
  }
  
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'fixed bottom-0 left-0 right-0 origin-left';
      case 'left':
        return 'fixed top-0 left-0 bottom-0 origin-top';
      case 'right':
        return 'fixed top-0 right-0 bottom-0 origin-top';
      default: // top
        return 'fixed top-0 left-0 right-0 origin-left';
    }
  };
  
  const getSizeClasses = () => {
    const isHorizontal = position === 'top' || position === 'bottom';
    return isHorizontal 
      ? `h-${thickness}px w-full` 
      : `w-${thickness}px h-full`;
  };
  
  const getScaleProperty = () => {
    return position === 'left' || position === 'right' ? 'scaleY' : 'scaleX';
  };
  
  return (
    <>
      <motion.div
        className={cn(
          'z-50 pointer-events-none',
          color,
          getPositionClasses(),
          className
        )}
        style={{
          [getScaleProperty()]: scaleX,
          height: position === 'top' || position === 'bottom' ? thickness : '100%',
          width: position === 'left' || position === 'right' ? thickness : '100%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      
      {(showPercentage || showReadingTime) && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-medium text-neutral-gray-dark shadow-lg border border-neutral-gray-light/20"
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ 
            opacity: isVisible ? 1 : 0,
            scale: isVisible ? 1 : 0.8,
            y: isVisible ? 0 : -10
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="flex items-center space-x-3">
            {showPercentage && (
              <motion.span className="font-semibold text-primary-blue">
                {Math.round(progress.get())}%
              </motion.span>
            )}
            {showReadingTime && (
              <motion.span className="text-neutral-gray text-xs">
                {readingTimeLeft > 1 
                  ? `${Math.ceil(readingTimeLeft)} min left`
                  : readingTimeLeft > 0.1 
                    ? `${Math.ceil(readingTimeLeft * 60)} sec left`
                    : 'Complete'
                }
              </motion.span>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}