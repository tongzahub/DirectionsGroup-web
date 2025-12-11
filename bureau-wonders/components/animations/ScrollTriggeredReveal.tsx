'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { cn } from '@/lib/utils';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface ScrollTriggeredRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
  disabled?: boolean;
  stagger?: boolean;
  staggerDelay?: number;
}

const createRevealVariants = (
  direction: RevealDirection,
  distance: number = 50
): Variants => {
  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }
    },
  };

  switch (direction) {
    case 'up':
      variants.hidden = { ...variants.hidden, y: distance };
      variants.visible = { ...variants.visible, y: 0 };
      break;
    case 'down':
      variants.hidden = { ...variants.hidden, y: -distance };
      variants.visible = { ...variants.visible, y: 0 };
      break;
    case 'left':
      variants.hidden = { ...variants.hidden, x: distance };
      variants.visible = { ...variants.visible, x: 0 };
      break;
    case 'right':
      variants.hidden = { ...variants.hidden, x: -distance };
      variants.visible = { ...variants.visible, x: 0 };
      break;
    case 'scale':
      variants.hidden = { ...variants.hidden, scale: 0.8 };
      variants.visible = { ...variants.visible, scale: 1 };
      break;
    case 'fade':
      // Already set up with opacity
      break;
  }

  return variants;
};

export default function ScrollTriggeredReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = '',
  threshold = 0.1,
  triggerOnce = true,
  disabled = false,
  stagger = false,
  staggerDelay = 0.1,
}: ScrollTriggeredRevealProps) {
  const { ref, isInView, isDisabled } = useScrollTrigger({
    threshold,
    triggerOnce,
    disabled,
    delay,
  });

  const variants = createRevealVariants(direction, distance);
  
  // Override duration in variants
  if (variants.visible && typeof variants.visible === 'object' && 'transition' in variants.visible) {
    variants.visible.transition = {
      ...variants.visible.transition,
      duration,
      delay: stagger ? 0 : delay / 1000, // Convert ms to seconds
    };
  }

  // If disabled, render without animation
  if (isDisabled) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn('will-change-transform', className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      style={{
        backfaceVisibility: 'hidden',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {children}
    </motion.div>
  );
}

// Staggered reveal container for multiple children
interface StaggeredRevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  staggerDelay?: number;
  className?: string;
  threshold?: number;
  disabled?: boolean;
}

export function StaggeredReveal({
  children,
  direction = 'up',
  staggerDelay = 0.1,
  className = '',
  threshold = 0.1,
  disabled = false,
}: StaggeredRevealProps) {
  const { ref, isInView, isDisabled } = useScrollTrigger({
    threshold,
    triggerOnce: true,
    disabled,
  });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = createRevealVariants(direction);

  if (isDisabled) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="will-change-transform"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div
          variants={itemVariants}
          className="will-change-transform"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

// Progressive reveal for long content sections
interface ProgressiveRevealProps {
  children: ReactNode;
  sections?: number;
  direction?: RevealDirection;
  className?: string;
  threshold?: number;
  disabled?: boolean;
}

export function ProgressiveReveal({
  children,
  sections = 3,
  direction = 'up',
  className = '',
  threshold = 0.2,
  disabled = false,
}: ProgressiveRevealProps) {
  const { ref, progress, isDisabled } = useScrollTrigger({
    threshold: Array.from({ length: sections + 1 }, (_, i) => i / sections),
    triggerOnce: false,
    disabled,
  });

  const variants = createRevealVariants(direction);
  
  // Calculate which sections should be visible based on progress
  const visibleSections = Math.floor(progress * sections);

  if (isDisabled) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      variants={variants}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate={index <= visibleSections ? 'visible' : 'hidden'}
            variants={variants}
            transition={{
              duration: 0.6,
              delay: (index % sections) * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="will-change-transform"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            {child}
          </motion.div>
        ))
      ) : (
        children
      )}
    </motion.div>
  );
}