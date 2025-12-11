/**
 * Design Token System
 * Centralized configuration for colors, typography, spacing, and animations
 */

export const designTokens = {
  colors: {
    primary: {
      50: '#faf9f7',
      100: '#f0ede6',
      200: '#e1dbc9',
      300: '#d2c9ac',
      400: '#c3b78f',
      500: '#8b7355',
      600: '#7a6449',
      700: '#69553d',
      800: '#584631',
      900: '#2d251a',
    },
    neutral: {
      white: '#ffffff',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    accent: {
      gold: '#d4af37',
      goldLight: '#f4e4a6',
      copper: '#b87333',
      copperLight: '#d4a574',
    },
    interactive: {
      hoverOverlay: 'rgba(139, 115, 85, 0.1)',
      activeState: 'rgba(139, 115, 85, 0.2)',
      focusRing: 'rgba(139, 115, 85, 0.5)',
    },
    status: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  
  typography: {
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    displaySizes: {
      sm: 'clamp(2rem, 4vw, 2.5rem)',
      md: 'clamp(2.5rem, 5vw, 3.5rem)',
      lg: 'clamp(3rem, 6vw, 4.5rem)',
      xl: 'clamp(3.5rem, 7vw, 6rem)',
      '2xl': 'clamp(4rem, 8vw, 8rem)',
    },
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    fontWeights: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
  },
  
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    luxury: {
      sm: '0 2px 8px rgba(139, 115, 85, 0.08)',
      md: '0 4px 16px rgba(139, 115, 85, 0.12)',
      lg: '0 8px 32px rgba(139, 115, 85, 0.16)',
      xl: '0 16px 64px rgba(139, 115, 85, 0.2)',
    },
  },
  
  animations: {
    durations: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
      inOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
  
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    auto: 'auto',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type DesignTokens = typeof designTokens;

// Helper functions for accessing tokens
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = designTokens.colors;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value as string;
};

export const getSpacing = (key: keyof typeof designTokens.spacing) => {
  return designTokens.spacing[key];
};

export const getFontSize = (key: keyof typeof designTokens.typography.fontSizes) => {
  return designTokens.typography.fontSizes[key];
};

export const getDisplaySize = (key: keyof typeof designTokens.typography.displaySizes) => {
  return designTokens.typography.displaySizes[key];
};

export const getShadow = (key: keyof typeof designTokens.shadows | string) => {
  if (key.includes('.')) {
    const [category, variant] = key.split('.');
    return (designTokens.shadows as any)[category]?.[variant];
  }
  return (designTokens.shadows as any)[key];
};

export const getDuration = (key: keyof typeof designTokens.animations.durations) => {
  return designTokens.animations.durations[key];
};

export const getEasing = (key: keyof typeof designTokens.animations.easing) => {
  return designTokens.animations.easing[key];
};

// Responsive breakpoint utilities
export const mediaQueries = {
  sm: `@media (min-width: ${designTokens.breakpoints.sm})`,
  md: `@media (min-width: ${designTokens.breakpoints.md})`,
  lg: `@media (min-width: ${designTokens.breakpoints.lg})`,
  xl: `@media (min-width: ${designTokens.breakpoints.xl})`,
  '2xl': `@media (min-width: ${designTokens.breakpoints['2xl']})`,
};