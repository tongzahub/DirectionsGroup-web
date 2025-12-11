'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { useOptimizedIntersection, useAdaptiveAnimation } from '@/hooks/useAnimations';
import { createResponsiveTransition } from '@/lib/animation-config';
import { cn } from '@/lib/utils';

interface ContentSectionRevealProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  animationType?: 'fade' | 'slide' | 'scale' | 'parallax';
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  threshold?: number;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  triggerOnce?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number;
  parallaxIntensity?: number;
}

export default function ContentSectionReveal({
  children,
  title,
  subtitle,
  animationType = 'slide',
  direction = 'up',
  distance = 50,
  threshold = 0.2,
  className = '',
  headerClassName = '',
  contentClassName = '',
  triggerOnce = true,
  staggerChildren = false,
  staggerDelay = 0.1,
  parallaxIntensity = 0.5
}: ContentSectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { ref: intersectionRef, isIntersecting, hasIntersected } = useOptimizedIntersection(threshold, '0px');
  const adaptiveConfig = useAdaptiveAnimation('scrollReveal');
  
  // Parallax scroll animation
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const parallaxY = useTransform(
    scrollYProgress, 
    [0, 1], 
    [distance * parallaxIntensity, -distance * parallaxIntensity]
  );
  
  const shouldAnimate = !adaptiveConfig.disabled;
  const shouldTrigger = triggerOnce ? hasIntersected : isIntersecting;
  
  if (!shouldAnimate) {
    return (
      <section 
        ref={intersectionRef} 
        className={cn('opacity-100', className)}
      >
        {(title || subtitle) && (
          <div className={cn('mb-8', headerClassName)}>
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={contentClassName}>
          {children}
        </div>
      </section>
    );
  }
  
  const getVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    };
    
    switch (animationType) {
      case 'slide':
        return {
          hidden: {
            opacity: 0,
            y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
            x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
          },
          visible: {
            opacity: 1,
            y: 0,
            x: 0,
          }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 }
        };
      case 'parallax':
        return baseVariants; // Parallax uses transform style
      default: // fade
        return baseVariants;
    }
  };
  
  const variants = getVariants();
  const transition = createResponsiveTransition('scrollReveal', adaptiveConfig.duration);
  
  const containerVariants = staggerChildren ? {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  } : variants;
  
  const MotionComponent = animationType === 'parallax' ? motion.section : motion.section;
  const motionProps = animationType === 'parallax' 
    ? {
        ref: (node: HTMLDivElement) => {
          ref.current = node;
          intersectionRef.current = node;
        },
        style: { y: parallaxY },
        initial: { opacity: 0 },
        animate: { opacity: shouldTrigger ? 1 : 0 },
        transition
      }
    : {
        ref: intersectionRef,
        initial: "hidden",
        animate: shouldTrigger ? "visible" : "hidden",
        variants: containerVariants,
        transition
      };
  
  return (
    <MotionComponent
      {...motionProps}
      className={cn(
        'will-change-transform will-change-opacity',
        'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none',
        className
      )}
    >
      {(title || subtitle) && (
        <motion.div 
          className={cn('mb-8', headerClassName)}
          variants={staggerChildren ? {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          } : undefined}
        >
          {title && (
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              variants={staggerChildren ? {
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              } : undefined}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl"
              variants={staggerChildren ? {
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              } : undefined}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      )}
      
      <motion.div 
        className={contentClassName}
        variants={staggerChildren ? {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        } : undefined}
      >
        {children}
      </motion.div>
    </MotionComponent>
  );
}