/**
 * Component Library Configuration
 * Centralized configuration for all enhanced components
 */

import { ComponentFactoryOptions, ThemeConfig } from '@/types/enhanced-components';

// Default component configurations
export const defaultComponentConfigs: Record<string, ComponentFactoryOptions> = {
  Button: {
    defaultProps: {
      variant: 'primary',
      size: 'md',
      luxury: false,
      performanceOptimized: true,
      accessibilityEnhanced: true,
    },
    variants: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700',
      secondary: 'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50',
      tertiary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
      ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
      luxury: 'bg-gradient-to-r from-accent-gold to-accent-copper text-white shadow-luxury-md',
    },
    animations: {
      hover: { y: -2, scale: 1.02 },
      tap: { scale: 0.98 },
    },
    responsive: true,
    accessibility: true,
    performance: true,
  },
  
  Card: {
    defaultProps: {
      variant: 'default',
      size: 'md',
      luxury: false,
      performanceOptimized: true,
      accessibilityEnhanced: true,
    },
    variants: {
      default: 'bg-white border border-neutral-200 shadow-sm',
      elevated: 'bg-white shadow-lg',
      outlined: 'bg-white border-2 border-primary-200',
      luxury: 'bg-white shadow-luxury-md border border-primary-100',
      interactive: 'bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer',
    },
    animations: {
      hover: { y: -4, scale: 1.02 },
      tap: { scale: 0.98 },
    },
    responsive: true,
    accessibility: true,
    performance: true,
  },
  
  Input: {
    defaultProps: {
      variant: 'default',
      size: 'md',
      luxury: false,
      performanceOptimized: true,
      accessibilityEnhanced: true,
    },
    variants: {
      default: 'border border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
      luxury: 'border border-primary-200 focus:border-accent-gold focus:ring-accent-gold shadow-luxury-sm',
      minimal: 'border-0 border-b-2 border-neutral-300 focus:border-primary-500 rounded-none',
    },
    animations: {
      focus: { scale: 1.02 },
      blur: { scale: 1 },
    },
    responsive: true,
    accessibility: true,
    performance: true,
  },
  
  Typography: {
    defaultProps: {
      variant: 'body-md',
      weight: 'normal',
      luxury: false,
      performanceOptimized: true,
      accessibilityEnhanced: true,
    },
    variants: {
      'display-xl': 'text-6xl font-bold tracking-tight',
      'display-lg': 'text-5xl font-bold tracking-tight',
      'display-md': 'text-4xl font-bold tracking-tight',
      'display-sm': 'text-3xl font-bold tracking-tight',
      h1: 'text-4xl font-bold',
      h2: 'text-3xl font-semibold',
      h3: 'text-2xl font-semibold',
      h4: 'text-xl font-semibold',
      h5: 'text-lg font-medium',
      h6: 'text-base font-medium',
      'body-xl': 'text-xl',
      'body-lg': 'text-lg',
      'body-md': 'text-base',
      'body-sm': 'text-sm',
      'body-xs': 'text-xs',
      caption: 'text-xs text-neutral-600',
      overline: 'text-xs uppercase tracking-wide text-neutral-600',
    },
    responsive: true,
    accessibility: true,
    performance: true,
  },
  
  Container: {
    defaultProps: {
      size: 'xl',
      padding: 'md',
      luxury: false,
      performanceOptimized: true,
      accessibilityEnhanced: true,
    },
    variants: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      full: 'max-w-full',
    },
    responsive: true,
    accessibility: true,
    performance: true,
  },
};

// Theme configuration
export const themeConfig: ThemeConfig = {
  colors: {
    'primary-50': 'var(--color-primary-50)',
    'primary-100': 'var(--color-primary-100)',
    'primary-200': 'var(--color-primary-200)',
    'primary-300': 'var(--color-primary-300)',
    'primary-400': 'var(--color-primary-400)',
    'primary-500': 'var(--color-primary-500)',
    'primary-600': 'var(--color-primary-600)',
    'primary-700': 'var(--color-primary-700)',
    'primary-800': 'var(--color-primary-800)',
    'primary-900': 'var(--color-primary-900)',
    'neutral-white': 'var(--color-neutral-white)',
    'neutral-50': 'var(--color-neutral-50)',
    'neutral-100': 'var(--color-neutral-100)',
    'neutral-200': 'var(--color-neutral-200)',
    'neutral-300': 'var(--color-neutral-300)',
    'neutral-400': 'var(--color-neutral-400)',
    'neutral-500': 'var(--color-neutral-500)',
    'neutral-600': 'var(--color-neutral-600)',
    'neutral-700': 'var(--color-neutral-700)',
    'neutral-800': 'var(--color-neutral-800)',
    'neutral-900': 'var(--color-neutral-900)',
    'accent-gold': 'var(--color-accent-gold)',
    'accent-gold-light': 'var(--color-accent-gold-light)',
    'accent-copper': 'var(--color-accent-copper)',
    'accent-copper-light': 'var(--color-accent-copper-light)',
  },
  typography: {
    fontSizes: {
      xs: 'var(--font-size-xs)',
      sm: 'var(--font-size-sm)',
      base: 'var(--font-size-base)',
      lg: 'var(--font-size-lg)',
      xl: 'var(--font-size-xl)',
      '2xl': 'var(--font-size-2xl)',
      '3xl': 'var(--font-size-3xl)',
      '4xl': 'var(--font-size-4xl)',
      '5xl': 'var(--font-size-5xl)',
      '6xl': 'var(--font-size-6xl)',
    },
    lineHeights: {
      none: 'var(--line-height-none)',
      tight: 'var(--line-height-tight)',
      snug: 'var(--line-height-snug)',
      normal: 'var(--line-height-normal)',
      relaxed: 'var(--line-height-relaxed)',
      loose: 'var(--line-height-loose)',
    },
    fontWeights: {
      thin: 'var(--font-weight-thin)',
      light: 'var(--font-weight-light)',
      normal: 'var(--font-weight-normal)',
      medium: 'var(--font-weight-medium)',
      semibold: 'var(--font-weight-semibold)',
      bold: 'var(--font-weight-bold)',
      extrabold: 'var(--font-weight-extrabold)',
    },
  },
  spacing: {
    0: 'var(--spacing-0)',
    1: 'var(--spacing-1)',
    2: 'var(--spacing-2)',
    3: 'var(--spacing-3)',
    4: 'var(--spacing-4)',
    5: 'var(--spacing-5)',
    6: 'var(--spacing-6)',
    8: 'var(--spacing-8)',
    10: 'var(--spacing-10)',
    12: 'var(--spacing-12)',
    16: 'var(--spacing-16)',
    20: 'var(--spacing-20)',
    24: 'var(--spacing-24)',
    32: 'var(--spacing-32)',
    40: 'var(--spacing-40)',
    48: 'var(--spacing-48)',
    64: 'var(--spacing-64)',
  },
  shadows: {
    xs: 'var(--shadow-xs)',
    sm: 'var(--shadow-sm)',
    base: 'var(--shadow-base)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    '2xl': 'var(--shadow-2xl)',
    'luxury-sm': 'var(--shadow-luxury-sm)',
    'luxury-md': 'var(--shadow-luxury-md)',
    'luxury-lg': 'var(--shadow-luxury-lg)',
    'luxury-xl': 'var(--shadow-luxury-xl)',
  },
  borderRadius: {
    none: 'var(--radius-none)',
    sm: 'var(--radius-sm)',
    base: 'var(--radius-base)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    '3xl': 'var(--radius-3xl)',
    full: 'var(--radius-full)',
  },
  animations: {
    durations: {
      75: 'var(--duration-75)',
      100: 'var(--duration-100)',
      150: 'var(--duration-150)',
      200: 'var(--duration-200)',
      300: 'var(--duration-300)',
      500: 'var(--duration-500)',
      700: 'var(--duration-700)',
      1000: 'var(--duration-1000)',
    },
    easing: {
      linear: 'var(--ease-linear)',
      in: 'var(--ease-in)',
      out: 'var(--ease-out)',
      inOut: 'var(--ease-in-out)',
      outBack: 'var(--ease-out-back)',
      outQuart: 'var(--ease-out-quart)',
      inOutQuart: 'var(--ease-in-out-quart)',
      spring: 'var(--ease-spring)',
    },
  },
  breakpoints: {
    mobile: {
      minWidth: 0,
      maxWidth: 767,
    },
    tablet: {
      minWidth: 768,
      maxWidth: 1023,
    },
    desktop: {
      minWidth: 1024,
    },
  },
};

// Component size configurations
export const sizeConfigs = {
  xs: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    fontSize: 'var(--font-size-xs)',
    height: '2rem',
  },
  sm: {
    padding: 'var(--spacing-2) var(--spacing-4)',
    fontSize: 'var(--font-size-sm)',
    height: '2.25rem',
  },
  md: {
    padding: 'var(--spacing-3) var(--spacing-6)',
    fontSize: 'var(--font-size-base)',
    height: '2.5rem',
  },
  lg: {
    padding: 'var(--spacing-4) var(--spacing-8)',
    fontSize: 'var(--font-size-lg)',
    height: '3rem',
  },
  xl: {
    padding: 'var(--spacing-5) var(--spacing-10)',
    fontSize: 'var(--font-size-xl)',
    height: '3.5rem',
  },
};

// Animation presets for different component types
export const animationPresets = {
  subtle: {
    duration: 200,
    easing: 'easeOut',
    scale: 1.01,
    y: -1,
  },
  moderate: {
    duration: 300,
    easing: 'easeOut',
    scale: 1.02,
    y: -2,
  },
  pronounced: {
    duration: 400,
    easing: 'easeOutBack',
    scale: 1.05,
    y: -4,
  },
  luxury: {
    duration: 500,
    easing: 'easeOutQuart',
    scale: 1.03,
    y: -3,
    shadow: 'var(--shadow-luxury-lg)',
  },
};

// Accessibility configurations
export const accessibilityConfigs = {
  focusRing: {
    width: '2px',
    color: 'var(--color-focus-ring)',
    offset: '2px',
    style: 'solid',
  },
  touchTarget: {
    minHeight: '44px',
    minWidth: '44px',
  },
  colorContrast: {
    normal: 4.5,
    large: 3,
  },
  reducedMotion: {
    duration: '0.01ms',
    easing: 'linear',
  },
};

// Performance optimization settings
export const performanceConfigs = {
  lazyLoading: {
    threshold: 0.1,
    rootMargin: '50px',
  },
  animation: {
    maxConcurrent: 6,
    frameRate: 60,
    willChange: ['transform', 'opacity'],
  },
  debounce: {
    scroll: 16, // ~60fps
    resize: 100,
    input: 300,
  },
  throttle: {
    scroll: 16,
    mousemove: 16,
  },
};

// Utility function to get component configuration
export const getComponentConfig = (componentName: string): ComponentFactoryOptions => {
  return defaultComponentConfigs[componentName] || {};
};

// Utility function to merge configurations
export const mergeConfigs = (
  baseConfig: ComponentFactoryOptions,
  customConfig: Partial<ComponentFactoryOptions>
): ComponentFactoryOptions => {
  return {
    ...baseConfig,
    ...customConfig,
    defaultProps: {
      ...baseConfig.defaultProps,
      ...customConfig.defaultProps,
    },
    variants: {
      ...baseConfig.variants,
      ...customConfig.variants,
    },
    animations: {
      ...baseConfig.animations,
      ...customConfig.animations,
    },
  };
};