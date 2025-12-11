'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTouchHover, useTouchFeedback } from '@/hooks/useTouchInteractions';
import { useDeviceType } from '@/lib/responsive';
import { useAdaptiveAnimation } from '@/hooks/useAnimations';

export interface TouchButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'luxury';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  hapticFeedback?: boolean;
  touchOptimized?: boolean;
  children: React.ReactNode;
}

const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    hapticFeedback = true,
    touchOptimized = true,
    children,
    className = '',
    disabled,
    onClick,
    ...props
  }, ref) => {
    const deviceType = useDeviceType();
    const adaptiveConfig = useAdaptiveAnimation('buttonHover');
    const { triggerFeedback, feedbackActive } = useTouchFeedback({
      haptic: hapticFeedback,
      visual: true,
      duration: 150,
    });

    // Touch hover with optimized timing for mobile
    const touchHover = useTouchHover({
      touchDelay: deviceType === 'mobile' ? 50 : 100,
      hoverTimeout: 200,
      preventScroll: false,
    });

    // Enhanced touch target sizes for accessibility
    const touchSizes = {
      sm: touchOptimized ? 'min-h-[44px] min-w-[44px] h-10 px-4' : 'h-8 px-3',
      md: touchOptimized ? 'min-h-[48px] min-w-[48px] h-12 px-6' : 'h-10 px-6',
      lg: touchOptimized ? 'min-h-[52px] min-w-[52px] h-14 px-8' : 'h-12 px-8',
      xl: touchOptimized ? 'min-h-[56px] min-w-[56px] h-16 px-10' : 'h-14 px-10',
    };

    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'touch-manipulation select-none', // Optimize for touch
      'active:scale-95', // Touch feedback
      touchOptimized && 'rounded-xl', // Larger touch-friendly radius
      !touchOptimized && 'rounded-lg'
    );

    const variantStyles = {
      primary: cn(
        'bg-primary-600 text-white border border-primary-600',
        'hover:bg-primary-700 hover:border-primary-700',
        'focus-visible:ring-primary-500',
        touchHover.isHovered && 'bg-primary-700 border-primary-700',
        feedbackActive && 'bg-primary-800'
      ),
      secondary: cn(
        'bg-white text-primary-600 border border-primary-600',
        'hover:bg-primary-50 hover:text-primary-700',
        'focus-visible:ring-primary-500',
        touchHover.isHovered && 'bg-primary-50 text-primary-700',
        feedbackActive && 'bg-primary-100'
      ),
      ghost: cn(
        'bg-transparent text-primary-600 border border-transparent',
        'hover:bg-primary-50 hover:text-primary-700',
        'focus-visible:ring-primary-500',
        touchHover.isHovered && 'bg-primary-50 text-primary-700',
        feedbackActive && 'bg-primary-100'
      ),
      luxury: cn(
        'bg-gradient-to-r from-accent-gold to-accent-copper text-white border-0',
        'hover:from-accent-gold hover:to-accent-copper hover:shadow-luxury-lg',
        'focus-visible:ring-accent-gold shadow-luxury-md',
        touchHover.isHovered && 'shadow-luxury-lg',
        feedbackActive && 'shadow-luxury-xl'
      ),
    };

    const textSizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    };

    const buttonClasses = cn(
      baseStyles,
      variantStyles[variant],
      touchSizes[size],
      textSizes[size],
      className
    );

    // Enhanced click handler with touch feedback
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      // Trigger haptic and visual feedback
      triggerFeedback(variant === 'luxury' ? 'medium' : 'light');

      if (onClick) {
        onClick(e);
      }
    };

    // Animation variants optimized for touch
    const animationVariants = {
      rest: { 
        scale: 1, 
        y: 0,
        boxShadow: variant === 'luxury' 
          ? '0 4px 16px rgba(212, 175, 55, 0.2)' 
          : '0 2px 8px rgba(0, 0, 0, 0.1)'
      },
      hover: { 
        scale: deviceType === 'mobile' ? 1.02 : 1.05,
        y: deviceType === 'mobile' ? -1 : -2,
        boxShadow: variant === 'luxury'
          ? '0 8px 32px rgba(212, 175, 55, 0.3), 0 4px 16px rgba(184, 115, 51, 0.2)'
          : '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)'
      },
      tap: { 
        scale: 0.95, 
        y: 0,
        transition: { duration: 0.1 }
      },
    };

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        variants={!adaptiveConfig.disabled ? animationVariants : undefined}
        initial="rest"
        animate={touchHover.isHovered ? 'hover' : 'rest'}
        whileTap={!adaptiveConfig.disabled ? 'tap' : undefined}
        transition={{
          duration: adaptiveConfig.duration || 0.2,
          ease: (adaptiveConfig.easing || 'easeOut') as any,
        }}
        {...touchHover.touchProps}
        {...(deviceType !== 'mobile' ? touchHover.mouseProps : {})}
        {...props}
      >
        {loading && (
          <motion.svg
            className={cn(
              'animate-spin mr-2',
              size === 'sm' ? 'h-4 w-4' :
              size === 'md' ? 'h-5 w-5' :
              size === 'lg' ? 'h-6 w-6' : 'h-7 w-7'
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </motion.svg>
        )}

        <span className="relative z-10">{children}</span>

        {/* Touch feedback overlay */}
        <motion.div
          className="absolute inset-0 rounded-inherit bg-white/20 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: feedbackActive ? 1 : 0,
            scale: feedbackActive ? 1 : 0.8
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Ripple effect for touch feedback */}
        {touchHover.isTouched && (
          <motion.div
            className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none"
          >
            <motion.div
              className="absolute bg-white/30 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                width: 20,
                height: 20,
                marginLeft: -10,
                marginTop: -10,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </motion.div>
        )}

        {/* Enhanced glow for luxury variant */}
        {variant === 'luxury' && touchHover.isHovered && (
          <motion.div
            className="absolute inset-0 rounded-inherit bg-gradient-to-r from-accent-gold/30 to-accent-copper/30 blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>
    );
  }
);

TouchButton.displayName = 'TouchButton';

export default TouchButton;