'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHoverAnimation, useAdaptiveAnimation } from '@/hooks/useAnimations';
import { useTouchHover, useTouchFeedback } from '@/hooks/useTouchInteractions';
import { useDeviceType } from '@/lib/responsive';
import { EnhancedButtonProps } from '@/types/enhanced-components';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'luxury';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Partial<EnhancedButtonProps> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  hapticFeedback?: boolean;
  touchOptimized?: boolean;
  children: React.ReactNode;
  
  // Mouse event handlers
  onMouseMove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseUp?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  
  // Other common props
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  'data-testid'?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    hapticFeedback = true,
    touchOptimized = true,
    luxury = false,
    performanceOptimized = true,
    accessibilityEnhanced = true,
    children, 
    className = '', 
    disabled, 
    icon,
    iconPosition = 'left',
    ...props 
  }, ref) => {
    // Device and animation hooks
    const deviceType = useDeviceType();
    const hoverAnimation = useHoverAnimation('buttonHover');
    const adaptiveConfig = useAdaptiveAnimation('buttonHover');
    
    // Touch interaction hooks
    const { triggerFeedback, feedbackActive } = useTouchFeedback({
      haptic: hapticFeedback,
      visual: true,
      duration: 150,
    });
    
    const touchHover = useTouchHover({
      touchDelay: deviceType === 'mobile' ? 50 : 100,
      hoverTimeout: 200,
    });
    
    // Determine if animations should be enabled
    const shouldAnimate = !adaptiveConfig.disabled && performanceOptimized;
    
    // Base styles with luxury and touch enhancements
    const baseStyles = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'touch-manipulation select-none', // Better mobile interaction
      'active:scale-95', // Touch feedback
      luxury && 'luxury-focus-ring font-semibold',
      (accessibilityEnhanced || touchOptimized) && 'min-h-[44px] min-w-[44px]', // Touch targets
      touchOptimized && deviceType === 'mobile' && 'min-h-[48px]' // Enhanced mobile targets
    );
    
    // Enhanced variant styles with luxury options
    const variantStyles = {
      primary: cn(
        'bg-primary-600 text-white border border-primary-600',
        'hover:bg-primary-700 hover:border-primary-700',
        'focus-visible:ring-primary-500',
        luxury && 'bg-gradient-to-r from-primary-600 to-primary-700 shadow-luxury-sm hover:shadow-luxury-md',
        touchHover.isHovered && 'bg-primary-700 border-primary-700',
        feedbackActive && 'bg-primary-800'
      ),
      secondary: cn(
        'bg-white text-primary-600 border border-primary-600',
        'hover:bg-primary-50 hover:text-primary-700',
        'focus-visible:ring-primary-500',
        luxury && 'hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 shadow-luxury-sm',
        touchHover.isHovered && 'bg-primary-50 text-primary-700',
        feedbackActive && 'bg-primary-100'
      ),
      tertiary: cn(
        'bg-neutral-100 text-neutral-700 border border-neutral-200',
        'hover:bg-neutral-200 hover:text-neutral-800',
        'focus-visible:ring-neutral-500',
        touchHover.isHovered && 'bg-neutral-200 text-neutral-800',
        feedbackActive && 'bg-neutral-300'
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
    
    // Enhanced size styles
    const sizeStyles = {
      xs: 'h-8 px-3 text-xs rounded-md gap-1',
      sm: 'h-9 px-4 text-sm rounded-lg gap-1.5',
      md: 'h-10 px-6 text-base rounded-xl gap-2',
      lg: 'h-12 px-8 text-lg rounded-xl gap-2.5',
      xl: 'h-14 px-10 text-xl rounded-2xl gap-3',
    };
    
    const buttonClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );
    
    // Enhanced hover animations with multi-layer effects and touch optimization
    const animationVariants = {
      rest: { 
        scale: 1, 
        y: 0,
        boxShadow: luxury 
          ? '0 4px 16px rgba(212, 175, 55, 0.2)' 
          : '0 2px 8px rgba(0, 0, 0, 0.1)'
      },
      hover: { 
        y: deviceType === 'mobile' ? -2 : -3,
        scale: deviceType === 'mobile' ? 1.02 : 1.02,
        boxShadow: luxury 
          ? '0 8px 32px rgba(212, 175, 55, 0.3), 0 4px 16px rgba(184, 115, 51, 0.2)' 
          : '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      tap: { 
        scale: 0.95, 
        y: 0,
        transition: { duration: 0.1 }
      },
    };

    const hoverProps = shouldAnimate ? {
      variants: animationVariants,
      initial: "rest",
      animate: touchHover.isHovered ? "hover" : "rest",
      whileTap: "tap",
      transition: {
        duration: adaptiveConfig.duration || 0.2,
        ease: adaptiveConfig.easing || 'easeOut',
      }
    } : {};

    // Ripple effect for click animation
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      // Trigger haptic and visual feedback
      triggerFeedback(variant === 'luxury' ? 'medium' : 'light');

      if (shouldAnimate) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { id: Date.now(), x, y };
        
        setRipples(prev => [...prev, newRipple]);
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
      }
      
      if (props.onClick) {
        props.onClick();
      }
    };
    
    return (
      <motion.button
        ref={ref}
        className={cn(buttonClasses, 'relative overflow-hidden')}
        disabled={disabled || loading}
        onClick={handleClick}
        {...hoverProps}
        {...touchHover.touchProps}
        {...(deviceType !== 'mobile' ? touchHover.mouseProps : {})}
        {...(props as any)}
      >
        {loading && (
          <motion.svg
            className={cn(
              'animate-spin',
              size === 'xs' ? 'h-3 w-3' :
              size === 'sm' ? 'h-4 w-4' :
              size === 'md' ? 'h-4 w-4' :
              size === 'lg' ? 'h-5 w-5' : 'h-6 w-6',
              iconPosition === 'right' ? 'ml-2' : 'mr-2'
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
        
        {icon && iconPosition === 'left' && !loading && (
          <span className={cn(
            size === 'xs' ? 'h-3 w-3' :
            size === 'sm' ? 'h-4 w-4' :
            size === 'md' ? 'h-4 w-4' :
            size === 'lg' ? 'h-5 w-5' : 'h-6 w-6'
          )}>
            {icon}
          </span>
        )}
        
        <span>{children}</span>
        
        {icon && iconPosition === 'right' && !loading && (
          <span className={cn(
            size === 'xs' ? 'h-3 w-3' :
            size === 'sm' ? 'h-4 w-4' :
            size === 'md' ? 'h-4 w-4' :
            size === 'lg' ? 'h-5 w-5' : 'h-6 w-6'
          )}>
            {icon}
          </span>
        )}

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

        {/* Ripple Effects */}
        {shouldAnimate && ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}

        {/* Enhanced ripple for touch */}
        {touchHover.isTouched && shouldAnimate && (
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
        {luxury && touchHover.isHovered && shouldAnimate && (
          <motion.div
            className="absolute inset-0 rounded-inherit bg-gradient-to-r from-accent-gold/30 to-accent-copper/30 blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Pulse animation for CTA buttons */}
        {variant === 'primary' && shouldAnimate && (
          <motion.div
            className="absolute inset-0 rounded-inherit bg-primary-400/20"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
