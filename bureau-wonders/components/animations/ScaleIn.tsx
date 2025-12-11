'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useOptimizedIntersection, useAdaptiveAnimation, useAnimationQueue } from '@/hooks/useAnimations';
import { createResponsiveTransition } from '@/lib/animation-config';
import { cn } from '@/lib/utils';

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  scale?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean;
  performanceOptimized?: boolean;
  accessibilityEnhanced?: boolean;
}

export default function ScaleIn({ 
  children, 
  delay = 0, 
  duration,
  scale = 0.8,
  threshold = 0.1,
  className = '',
  triggerOnce = true,
  performanceOptimized = true,
  accessibilityEnhanced = true
}: ScaleInProps) {
  const { ref, isIntersecting, hasIntersected } = useOptimizedIntersection(threshold, '0px');
  const adaptiveConfig = useAdaptiveAnimation('scaleIn');
  const { addToQueue, removeFromQueue, canAnimate } = useAnimationQueue();
  
  // Use adaptive duration if not specified
  const animationDuration = duration || adaptiveConfig.duration;
  
  // Determine if animations should be enabled
  const shouldAnimate = !adaptiveConfig.disabled && performanceOptimized && canAnimate;
  const shouldTrigger = triggerOnce ? hasIntersected : isIntersecting;
  
  // Handle animation queue
  const animationId = `scaleIn-${Math.random().toString(36).substr(2, 9)}`;
  
  if (!shouldAnimate) {
    return (
      <div ref={ref} className={cn('opacity-100', className)}>
        {children}
      </div>
    );
  }
  
  const variants = {
    hidden: { 
      opacity: 0, 
      scale: scale,
      transition: { duration: 0 }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: createResponsiveTransition('scaleIn', animationDuration)
    }
  };
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldTrigger ? "visible" : "hidden"}
      variants={variants}
      transition={{
        delay: adaptiveConfig.delay || delay,
      }}
      onAnimationStart={() => addToQueue(animationId, () => {})}
      onAnimationComplete={() => removeFromQueue(animationId)}
      className={cn(
        'will-change-transform will-change-opacity',
        accessibilityEnhanced && 'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:scale-100',
        className
      )}
    >
      {children}
    </motion.div>
  );
}