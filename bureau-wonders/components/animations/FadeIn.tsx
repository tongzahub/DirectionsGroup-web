'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useEntranceAnimation, useAdaptiveAnimation } from '@/hooks/useAnimations';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  performanceOptimized?: boolean;
  accessibilityEnhanced?: boolean;
}

export default function FadeIn({ 
  children, 
  delay = 0, 
  duration,
  className = '',
  performanceOptimized = true,
  accessibilityEnhanced = true
}: FadeInProps) {
  const entranceAnimation = useEntranceAnimation('fadeIn', delay);
  const adaptiveConfig = useAdaptiveAnimation('fadeIn');
  
  // Use adaptive duration if not specified
  const animationDuration = duration || adaptiveConfig.duration;
  
  // Determine if animations should be enabled
  const shouldAnimate = !adaptiveConfig.disabled && performanceOptimized;
  
  if (!shouldAnimate) {
    return (
      <div className={cn('opacity-100', className)}>
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: entranceAnimation.isVisible ? 1 : 0 }}
      transition={{ 
        duration: animationDuration,
        delay: adaptiveConfig.delay || 0,
        ease: adaptiveConfig.easing as any // Type assertion for easing compatibility
      }}
      className={cn(
        'will-change-opacity',
        accessibilityEnhanced && 'motion-reduce:animate-none motion-reduce:opacity-100',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
