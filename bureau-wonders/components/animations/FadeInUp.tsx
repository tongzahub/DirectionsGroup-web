'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useOptimizedIntersection, useAdaptiveAnimation, useAnimationQueue } from '@/hooks/useAnimations';
import { motionVariants, createResponsiveTransition } from '@/lib/animation-config';
import { cn } from '@/lib/utils';

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean;
  performanceOptimized?: boolean;
  accessibilityEnhanced?: boolean;
}

export default function FadeInUp({ 
  children, 
  delay = 0, 
  duration,
  distance = 30,
  threshold = 0.1,
  className = '',
  triggerOnce = true,
  performanceOptimized = true,
  accessibilityEnhanced = true
}: FadeInUpProps) {
  const { ref, isIntersecting, hasIntersected } = useOptimizedIntersection(threshold, '0px');
  const adaptiveConfig = useAdaptiveAnimation('fadeIn');
  const { addToQueue, removeFromQueue, canAnimate } = useAnimationQueue();
  
  // Use adaptive duration if not specified
  const animationDuration = duration || adaptiveConfig.duration;
  
  // Determine if animations should be enabled
  const shouldAnimate = !adaptiveConfig.disabled && performanceOptimized && canAnimate;
  const shouldTrigger = triggerOnce ? hasIntersected : isIntersecting;
  
  // Handle animation queue
  const animationId = `fadeInUp-${Math.random().toString(36).substr(2, 9)}`;
  
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
      y: distance,
      transition: { duration: 0 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: createResponsiveTransition('fadeIn', animationDuration)
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
        accessibilityEnhanced && 'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none',
        className
      )}
    >
      {children}
    </motion.div>
  );
}