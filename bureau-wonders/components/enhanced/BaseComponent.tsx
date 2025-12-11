/**
 * Enhanced Base Component
 * Foundation component with consistent styling and animation support
 */

'use client';

import React, { forwardRef, useMemo } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEntranceAnimation, useHoverAnimation, useAdaptiveAnimation } from '@/hooks/useAnimations';
import { EnhancedComponentProps } from '@/types/enhanced-components';

interface BaseComponentConfig {
  defaultVariant?: string;
  variants?: Record<string, string>;
  animations?: Record<string, any>;
  responsive?: boolean;
}

// Enhanced base component factory
export function createEnhancedComponent<T extends EnhancedComponentProps>(
  displayName: string,
  config: BaseComponentConfig = {}
) {
  const Component = forwardRef<HTMLDivElement, T & HTMLMotionProps<'div'>>(
    (
      {
        className,
        children,
        animate = true,
        animationType = 'fadeIn',
        animationDelay = 0,
        luxury = false,
        performanceOptimized = true,
        accessibilityEnhanced = true,
        responsive,
        variants,
        transition,
        initial,
        whileHover,
        whileTap,
        whileInView,
        ...props
      },
      ref
    ) => {
      // Animation hooks
      const entranceAnimation = useEntranceAnimation(
        animationType === 'staggerReveal' ? 'fadeIn' : animationType, 
        animationDelay
      );
      const hoverAnimation = useHoverAnimation('buttonHover');
      const adaptiveConfig = useAdaptiveAnimation(animationType);

      // Determine if animations should be enabled
      const shouldAnimate = animate && !adaptiveConfig.disabled && performanceOptimized;

      // Build class names
      const baseClasses = useMemo(() => {
        const classes = ['enhanced-component'];
        
        if (luxury) {
          classes.push('luxury-enhanced');
        }
        
        if (responsive) {
          classes.push('responsive-enhanced');
        }
        
        if (accessibilityEnhanced) {
          classes.push('accessibility-enhanced', 'luxury-focus-ring');
        }
        
        return classes;
      }, [luxury, responsive, accessibilityEnhanced]);

      // Animation variants
      const animationVariants = useMemo(() => {
        if (!shouldAnimate) return undefined;
        
        return variants || entranceAnimation.variants;
      }, [shouldAnimate, variants, entranceAnimation.variants]);

      // Animation transition
      const animationTransition = useMemo(() => {
        if (!shouldAnimate) return undefined;
        
        return transition || {
          duration: adaptiveConfig.duration,
          ease: adaptiveConfig.easing as any,
        };
      }, [shouldAnimate, transition, adaptiveConfig]);

      // Responsive styles
      const responsiveStyles = useMemo(() => {
        if (!responsive?.mobile && !responsive?.tablet && !responsive?.desktop) {
          return undefined;
        }

        const styles: Record<string, any> = {};
        
        if (responsive.mobile) {
          styles['@media (max-width: 767px)'] = responsive.mobile;
        }
        
        if (responsive.tablet) {
          styles['@media (min-width: 768px) and (max-width: 1023px)'] = responsive.tablet;
        }
        
        if (responsive.desktop) {
          styles['@media (min-width: 1024px)'] = responsive.desktop;
        }
        
        return styles;
      }, [responsive]);

      // Accessibility props
      const accessibilityProps = useMemo(() => {
        if (!accessibilityEnhanced) return {};
        
        return {
          role: props.role || 'presentation',
          tabIndex: props.tabIndex !== undefined ? props.tabIndex : 0,
          'aria-label': props['aria-label'],
          'aria-describedby': props['aria-describedby'],
        };
      }, [accessibilityEnhanced, props]);

      return (
        <motion.div
          ref={ref}
          className={cn(baseClasses, className)}
          style={responsiveStyles}
          variants={animationVariants}
          initial={shouldAnimate ? (initial || 'hidden') : false}
          animate={shouldAnimate ? (entranceAnimation.isVisible ? 'visible' : 'hidden') : false}
          transition={animationTransition}
          whileHover={shouldAnimate ? whileHover : undefined}
          whileTap={shouldAnimate ? whileTap : undefined}
          whileInView={shouldAnimate ? whileInView : undefined}
          {...accessibilityProps}
          {...props}
        >
          {children}
        </motion.div>
      );
    }
  );

  Component.displayName = displayName;
  return Component;
}

// Pre-configured enhanced components
export const EnhancedDiv = createEnhancedComponent('EnhancedDiv');
export const EnhancedSection = createEnhancedComponent('EnhancedSection');
export const EnhancedArticle = createEnhancedComponent('EnhancedArticle');
export const EnhancedHeader = createEnhancedComponent('EnhancedHeader');
export const EnhancedFooter = createEnhancedComponent('EnhancedFooter');
export const EnhancedMain = createEnhancedComponent('EnhancedMain');

// Utility function for creating class names
export const createComponentClasses = (
  baseClass: string,
  variant?: string,
  size?: string,
  state?: string,
  luxury?: boolean,
  additional?: string[]
): string => {
  const classes = [baseClass];
  
  if (variant) {
    classes.push(`${baseClass}--${variant}`);
  }
  
  if (size) {
    classes.push(`${baseClass}--${size}`);
  }
  
  if (state) {
    classes.push(`${baseClass}--${state}`);
  }
  
  if (luxury) {
    classes.push(`${baseClass}--luxury`);
  }
  
  if (additional) {
    classes.push(...additional);
  }
  
  return classes.join(' ');
};

// Responsive utility component
export const ResponsiveWrapper = forwardRef<
  HTMLDivElement,
  EnhancedComponentProps & {
    breakpoints?: {
      mobile?: React.CSSProperties;
      tablet?: React.CSSProperties;
      desktop?: React.CSSProperties;
    };
  }
>(({ children, className, breakpoints, ...props }, ref) => {
  const responsiveStyles = useMemo(() => {
    if (!breakpoints) return undefined;
    
    const styles: Record<string, React.CSSProperties> = {};
    
    if (breakpoints.mobile) {
      styles['@media (max-width: 767px)'] = breakpoints.mobile;
    }
    
    if (breakpoints.tablet) {
      styles['@media (min-width: 768px) and (max-width: 1023px)'] = breakpoints.tablet;
    }
    
    if (breakpoints.desktop) {
      styles['@media (min-width: 1024px)'] = breakpoints.desktop;
    }
    
    return styles;
  }, [breakpoints]);

  return (
    <div
      ref={ref}
      className={cn('responsive-wrapper', className)}
      style={responsiveStyles as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
});

ResponsiveWrapper.displayName = 'ResponsiveWrapper';