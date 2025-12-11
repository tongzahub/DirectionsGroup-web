'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAdaptiveAnimation } from '@/hooks/useAnimations';
import { createResponsiveTransition } from '@/lib/animation-config';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  transitionType?: 'fade' | 'slide' | 'scale';
  duration?: number;
  performanceOptimized?: boolean;
  accessibilityEnhanced?: boolean;
}

export default function PageTransition({ 
  children,
  className = '',
  transitionType = 'fade',
  duration,
  performanceOptimized = true,
  accessibilityEnhanced = true
}: PageTransitionProps) {
  const pathname = usePathname();
  const adaptiveConfig = useAdaptiveAnimation('pageTransition');
  
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
  
  const getVariants = () => {
    switch (transitionType) {
      case 'slide':
        return {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.05 }
        };
      default: // fade
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };
  
  const variants = getVariants();
  const transition = createResponsiveTransition('pageTransition', animationDuration);
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transition}
        className={cn(
          'will-change-transform will-change-opacity',
          accessibilityEnhanced && 'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none',
          className
        )}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}