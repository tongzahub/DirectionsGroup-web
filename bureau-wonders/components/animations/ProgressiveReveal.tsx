'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef, useState, useEffect } from 'react';
import { useOptimizedIntersection, useAdaptiveAnimation } from '@/hooks/useAnimations';
import { createResponsiveTransition } from '@/lib/animation-config';
import { cn } from '@/lib/utils';

interface ProgressiveRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean;
  useScrollProgress?: boolean;
  delay?: number;
}

export default function ProgressiveReveal({
  children,
  direction = 'up',
  distance = 50,
  threshold = 0.1,
  className = '',
  triggerOnce = true,
  useScrollProgress = false,
  delay = 0
}: ProgressiveRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const intersectionRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  
  // Custom intersection observer for this component
  useEffect(() => {
    const element = intersectionRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin: '0px',
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [threshold, hasIntersected]);
  const adaptiveConfig = useAdaptiveAnimation('scrollReveal');
  
  // Scroll-based animation
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Transform scroll progress to animation values
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [distance, 0]);
  const x = useTransform(scrollYProgress, [0, 0.3], [
    direction === 'left' ? -distance : direction === 'right' ? distance : 0, 
    0
  ]);
  
  const shouldAnimate = !adaptiveConfig.disabled;
  const shouldTrigger = triggerOnce ? hasIntersected : isIntersecting;
  
  if (!shouldAnimate) {
    return (
      <div ref={intersectionRef} className={cn('opacity-100', className)}>
        {children}
      </div>
    );
  }
  
  const getInitialTransform = () => {
    switch (direction) {
      case 'down':
        return { opacity: 0, y: -distance };
      case 'left':
        return { opacity: 0, x: distance };
      case 'right':
        return { opacity: 0, x: -distance };
      default: // up
        return { opacity: 0, y: distance };
    }
  };
  
  const getAnimateTransform = () => {
    return { opacity: 1, y: 0, x: 0 };
  };
  
  if (useScrollProgress) {
    return (
      <motion.div
        ref={(node) => {
          ref.current = node;
          intersectionRef.current = node;
        }}
        style={{
          opacity,
          y: direction === 'up' || direction === 'down' ? y : 0,
          x: direction === 'left' || direction === 'right' ? x : 0,
        }}
        className={cn(
          'will-change-transform will-change-opacity',
          'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none',
          className
        )}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <motion.div
      ref={intersectionRef}
      initial={getInitialTransform()}
      animate={shouldTrigger ? getAnimateTransform() : getInitialTransform()}
      transition={{
        ...createResponsiveTransition('scrollReveal', adaptiveConfig.duration),
        delay: adaptiveConfig.delay || delay,
      }}
      className={cn(
        'will-change-transform will-change-opacity',
        'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none',
        className
      )}
    >
      {children}
    </motion.div>
  );
}