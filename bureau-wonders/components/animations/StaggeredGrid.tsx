'use client';

import { motion } from 'framer-motion';
import { ReactNode, Children, cloneElement, isValidElement } from 'react';
import { useOptimizedIntersection, useAdaptiveAnimation, useAnimationQueue } from '@/hooks/useAnimations';
import { createResponsiveTransition } from '@/lib/animation-config';
import { cn } from '@/lib/utils';

interface StaggeredGridProps {
  children: ReactNode;
  columns?: number;
  staggerDelay?: number;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  distance?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean;
  animateOnHover?: boolean;
}

export default function StaggeredGrid({
  children,
  columns = 3,
  staggerDelay = 0.1,
  delay = 0,
  duration,
  direction = 'up',
  distance = 30,
  threshold = 0.1,
  className = '',
  triggerOnce = true,
  animateOnHover = false
}: StaggeredGridProps) {
  const { ref, isIntersecting, hasIntersected } = useOptimizedIntersection(threshold, '0px');
  const adaptiveConfig = useAdaptiveAnimation('staggerReveal');
  const { addToQueue, removeFromQueue, canAnimate } = useAnimationQueue();
  
  // Use adaptive duration and stagger if not specified
  const animationDuration = duration || adaptiveConfig.duration;
  const adaptiveStagger = adaptiveConfig.stagger || staggerDelay;
  
  // Determine if animations should be enabled
  const shouldAnimate = !adaptiveConfig.disabled && canAnimate;
  const shouldTrigger = triggerOnce ? hasIntersected : isIntersecting;
  
  // Handle animation queue
  const animationId = `staggeredGrid-${Math.random().toString(36).substr(2, 9)}`;
  
  if (!shouldAnimate) {
    return (
      <div 
        ref={ref} 
        className={cn(
          'grid gap-6',
          `grid-cols-1 md:grid-cols-${Math.min(columns, 2)} lg:grid-cols-${columns}`,
          className
        )}
      >
        {children}
      </div>
    );
  }
  
  const getInitialState = () => {
    switch (direction) {
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      case 'scale':
        return { opacity: 0, scale: 0.8 };
      default: // up
        return { opacity: 0, y: distance };
    }
  };
  
  const getAnimateState = () => {
    return { opacity: 1, y: 0, x: 0, scale: 1 };
  };
  
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
    hidden: getInitialState(),
    visible: {
      ...getAnimateState(),
      transition: createResponsiveTransition('staggerReveal', animationDuration)
    }
  };
  
  const hoverVariants = animateOnHover ? {
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' as any }
    }
  } : {};
  
  // Wrap each child in a motion.div with item variants
  const animatedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;
    
    return (
      <motion.div
        key={index}
        variants={animateOnHover ? { ...itemVariants, ...hoverVariants } : itemVariants}
        whileHover={animateOnHover ? "hover" : undefined}
        className={cn(
          'will-change-transform will-change-opacity',
          'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none'
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
        'grid gap-6',
        `grid-cols-1 md:grid-cols-${Math.min(columns, 2)} lg:grid-cols-${columns}`,
        'will-change-opacity',
        className
      )}
    >
      {animatedChildren}
    </motion.div>
  );
}