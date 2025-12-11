/**
 * Accessible Animation Component
 * Provides animation with full accessibility support and graceful fallbacks
 */

import React, { forwardRef, useEffect, useState } from 'react';
import { motion, MotionProps, Variants } from 'framer-motion';
import { useAccessibilitySettings, useScreenReaderAnnouncements } from '../../lib/accessibility';
import { usePerformanceAwareAnimation } from '../../hooks/usePerformanceAwareAnimations';
import { motionVariants, animationConfigs } from '../../lib/animation-config';

export interface AccessibleAnimationProps extends Omit<MotionProps, 'variants'> {
  // Animation configuration
  animationType?: keyof typeof animationConfigs;
  customVariants?: Variants;
  fallbackVariants?: Variants;
  
  // Accessibility options
  announceOnEnter?: string;
  announceOnComplete?: string;
  respectReducedMotion?: boolean;
  provideFallback?: boolean;
  
  // Performance options
  priority?: 'low' | 'medium' | 'high';
  essential?: boolean;
  
  // Children and styling
  children: React.ReactNode;
  className?: string;
  
  // Animation lifecycle
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

export const AccessibleAnimation = forwardRef<HTMLDivElement, AccessibleAnimationProps>(
  ({
    animationType = 'fadeIn',
    customVariants,
    fallbackVariants,
    announceOnEnter,
    announceOnComplete,
    respectReducedMotion = true,
    provideFallback = true,
    priority = 'medium',
    essential = false,
    children,
    className,
    initial = 'hidden',
    animate = 'visible',
    onAnimationStart,
    onAnimationComplete,
    ...motionProps
  }, ref) => {
    const accessibilitySettings = useAccessibilitySettings();
    const { announce } = useScreenReaderAnnouncements();
    const [animationId] = useState(() => `animation-${Math.random().toString(36).substr(2, 9)}`);
    
    // Get performance-aware animation settings
    const performanceAnimation = usePerformanceAwareAnimation({
      animationType,
      fallbackVariants,
      priority,
      essential,
    });

    // Determine if animations should be disabled
    const shouldDisableAnimation = respectReducedMotion && accessibilitySettings.prefersReducedMotion;
    const shouldUsePerformanceFallback = !performanceAnimation.shouldAnimate;
    
    // Select appropriate variants
    const getVariants = (): Variants => {
      if (shouldDisableAnimation) {
        // Return static variants for reduced motion
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 },
        };
      }
      
      if (shouldUsePerformanceFallback && fallbackVariants) {
        return fallbackVariants;
      }
      
      if (customVariants) {
        return customVariants;
      }
      
      return performanceAnimation.variants;
    };

    // Get transition settings
    const getTransition = () => {
      if (shouldDisableAnimation) {
        return { duration: 0.01 };
      }
      
      return performanceAnimation.transition;
    };

    // Handle animation lifecycle
    const handleAnimationStart = () => {
      if (announceOnEnter && accessibilitySettings.screenReaderActive) {
        announce(announceOnEnter, 'polite');
      }
      
      onAnimationStart?.();
    };

    const handleAnimationComplete = () => {
      if (announceOnComplete && accessibilitySettings.screenReaderActive) {
        announce(announceOnComplete, 'polite');
      }
      
      // Animation completed - could add performance tracking here if needed
      
      onAnimationComplete?.();
    };

    // Animation requested - could add performance tracking here if needed

    const variants = getVariants();
    const transition = getTransition();

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={variants}
        initial={initial}
        animate={animate}
        transition={transition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

AccessibleAnimation.displayName = 'AccessibleAnimation';

// Specialized accessible animation components
export const AccessibleFadeIn = forwardRef<HTMLDivElement, Omit<AccessibleAnimationProps, 'animationType'>>(
  (props, ref) => (
    <AccessibleAnimation ref={ref} animationType="fadeIn" {...props} />
  )
);

AccessibleFadeIn.displayName = 'AccessibleFadeIn';

export const AccessibleSlideUp = forwardRef<HTMLDivElement, Omit<AccessibleAnimationProps, 'animationType'>>(
  (props, ref) => (
    <AccessibleAnimation ref={ref} animationType="slideUp" {...props} />
  )
);

AccessibleSlideUp.displayName = 'AccessibleSlideUp';

export const AccessibleScaleIn = forwardRef<HTMLDivElement, Omit<AccessibleAnimationProps, 'animationType'>>(
  (props, ref) => (
    <AccessibleAnimation ref={ref} animationType="scaleIn" {...props} />
  )
);

AccessibleScaleIn.displayName = 'AccessibleScaleIn';

// Accessible stagger container
export interface AccessibleStaggerProps extends Omit<AccessibleAnimationProps, 'animationType'> {
  staggerDelay?: number;
  maxChildren?: number;
}

export const AccessibleStagger = forwardRef<HTMLDivElement, AccessibleStaggerProps>(
  ({ staggerDelay = 0.1, maxChildren = 10, children, ...props }, ref) => {
    const accessibilitySettings = useAccessibilitySettings();
    
    // Disable stagger for reduced motion
    const effectiveStaggerDelay = accessibilitySettings.prefersReducedMotion ? 0 : staggerDelay;
    
    const staggerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: effectiveStaggerDelay,
          delayChildren: 0.1,
        },
      },
    };

    return (
      <AccessibleAnimation
        ref={ref}
        customVariants={staggerVariants}
        {...props}
      >
        {children}
      </AccessibleAnimation>
    );
  }
);

AccessibleStagger.displayName = 'AccessibleStagger';

// Accessible scroll reveal
export interface AccessibleScrollRevealProps extends AccessibleAnimationProps {
  threshold?: number;
  triggerOnce?: boolean;
}

export const AccessibleScrollReveal = forwardRef<HTMLDivElement, AccessibleScrollRevealProps>(
  ({ threshold = 0.1, triggerOnce = true, ...props }, ref) => {
    const [isInView, setIsInView] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
      const element = (ref as React.MutableRefObject<HTMLDivElement>)?.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          const inView = entry.isIntersecting;
          
          if (inView && (!triggerOnce || !hasTriggered)) {
            setIsInView(true);
            setHasTriggered(true);
          } else if (!triggerOnce) {
            setIsInView(inView);
          }
        },
        { threshold }
      );

      observer.observe(element);

      return () => observer.disconnect();
    }, [threshold, triggerOnce, hasTriggered, ref]);

    return (
      <AccessibleAnimation
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        {...props}
      />
    );
  }
);

AccessibleScrollReveal.displayName = 'AccessibleScrollReveal';

// Accessible button with enhanced states
export interface AccessibleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onDragStart' | 'onDrag' | 'onDragEnd'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'medium', 
    loading = false, 
    loadingText = 'Loading...', 
    children, 
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const accessibilitySettings = useAccessibilitySettings();
    const { announce } = useScreenReaderAnnouncements();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) {
        e.preventDefault();
        return;
      }
      
      props.onClick?.(e);
    };

    useEffect(() => {
      if (loading && accessibilitySettings.screenReaderActive) {
        announce(loadingText, 'polite');
      }
    }, [loading, loadingText, accessibilitySettings.screenReaderActive, announce]);

    const buttonClasses = [
      'button',
      `button--${variant}`,
      `button--${size}`,
      loading && 'loading',
      className,
    ].filter(Boolean).join(' ');

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        whileHover={accessibilitySettings.prefersReducedMotion ? {} : { scale: 1.02 }}
        whileTap={accessibilitySettings.prefersReducedMotion ? {} : { scale: 0.98 }}
        transition={{ duration: accessibilitySettings.prefersReducedMotion ? 0.01 : 0.2 }}
        onClick={handleClick}
        {...props}
      >
        <span className={loading ? 'sr-only' : undefined}>
          {loading ? loadingText : children}
        </span>
        {loading && (
          <span aria-hidden="true" className="loading-spinner">
            {/* Loading spinner will be styled with CSS */}
          </span>
        )}
      </motion.button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';