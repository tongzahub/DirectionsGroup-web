'use client';

import { motion } from 'framer-motion';
import { ReactNode, Children, cloneElement, isValidElement } from 'react';
import { useOptimizedIntersection, useAdaptiveAnimation, useAnimationQueue } from '@/hooks/useAnimations';
import { createResponsiveTransition } from '@/lib/animation-config';
import { cn } from '@/lib/utils';

interface StaggerRevealProps {
  children: ReactNode;
  staggerDelay?: number;
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean;
  performanceOptimized?: boolean;
  accessibilityEnhanced?: boolean;
}

export default function StaggerReveal({ 
  children, 
  staggerDelay = 0.1,
  delay = 0, 
  duration,
  distance = 20,
  threshold = 0.1,
  className = '',
  triggerOnce = true,
  performanceOptimized = true,
  accessibilityEnhanced = true
}: StaggerRevealProps) {
  const { ref, isIntersecting, hasIntersected } = useOptimizedIntersection(threshold, '0px');
  const adaptiveConfig = useAdaptiveAnimation('staggerReveal');
  const { addToQueue, removeFromQueue, canAnimate } = useAnimationQueue();
  
  // Use adaptive duration and stagger if not specified
  const animationDuration = duration || adaptiveConfig.duration;
  const adaptiveStagger = adaptiveConfig.stagger || staggerDelay;
  
  // Determine if animations should be enabled
  const shouldAnimate = !adaptiveConfig.disabled && performanceOptimized && canAnimate;
  const shouldTrigger = triggerOnce ? hasIntersected : isIntersecting;
  
  // Handle animation queue
  const animationId = `staggerReveal-${Math.random().toString(36).substr(2, 9)}`;
  
  if (!shouldAnimate) {
    return (
      <div ref={ref} className={cn('opacity-100', className)}>
        {children}
      </div>
    );
  }
  
  const containerVariants = {
    hidden: { 
      opacity: 0,
      transition: { duration: 0 }
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: adaptiveStagger,
        delayChildren: adaptiveConfig.delay || delay,
        duration: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: distance,
      transition: { duration: 0 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: createResponsiveTransition('staggerReveal', animationDuration)
    }
  };
  
  // Wrap each child in a motion.div with item variants
  const animatedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;
    
    return (
      <motion.div
        key={index}
        variants={itemVariants}
        className={cn(
          accessibilityEnhanced && 'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none'
        )}
      >
        {child}
      </motion.div>
    );
  });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldTrigger ? "visible" : "hidden"}
      variants={containerVariants}
      onAnimationStart={() => addToQueue(animationId, () => {})}
      onAnimationComplete={() => removeFromQueue(animationId)}
      className={cn(
        'will-change-opacity',
        className
      )}
    >
      {animatedChildren}
    </motion.div>
  );
}