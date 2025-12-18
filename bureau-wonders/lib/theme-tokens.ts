/**
 * Apple-Inspired Dual Theme Design Token System
 * Comprehensive design tokens for both light and dark themes with luxury aesthetics
 */

// Import theme types
import type { ThemeMode, ThemeConfig, ThemeTokens } from '@/types/theme';

// Use the imported ThemeTokens interface


// Light theme tokens inspired by Apple's sophisticated approach
export const lightThemeTokens: ThemeTokens = {
  colors: {
    surface: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: '#f1f3f4',
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.05)',
    },
    text: {
      primary: '#1d1d1f',
      secondary: '#86868b',
      tertiary: '#a1a1a6',
      inverse: '#ffffff',
      accent: '#8b7355',
    },
    border: {
      primary: '#d2d2d7',
      secondary: '#e5e5ea',
      tertiary: '#f2f2f7',
      focus: '#8b7355',
      interactive: '#c6c6c8',
    },
    interactive: {
      hover: 'rgba(139, 115, 85, 0.08)',
      active: 'rgba(139, 115, 85, 0.12)',
      focus: 'rgba(139, 115, 85, 0.2)',
      disabled: 'rgba(139, 115, 85, 0.3)',
    },
    accent: {
      gold: '#d4af37',
      goldLight: '#f4e4a6',
      copper: '#b87333',
      copperLight: '#d4a574',
      primary: '#8b7355',
      secondary: '#c3b78f',
    },
    status: {
      success: '#30d158',
      warning: '#ff9f0a',
      error: '#ff3b30',
      info: '#007aff',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    none: 'none',
    luxury: {
      sm: '0 2px 8px rgba(139, 115, 85, 0.08)',
      md: '0 4px 16px rgba(139, 115, 85, 0.12)',
      lg: '0 8px 32px rgba(139, 115, 85, 0.16)',
      xl: '0 16px 64px rgba(139, 115, 85, 0.2)',
    },
    interactive: {
      hover: '0 4px 12px rgba(139, 115, 85, 0.15)',
      focus: '0 0 0 4px rgba(139, 115, 85, 0.2)',
      active: '0 2px 4px rgba(139, 115, 85, 0.2)',
    },
  },
  transitions: {
    theme: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
      accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
};

// Dark theme tokens inspired by Apple's sophisticated approach
export const darkThemeTokens: ThemeTokens = {
  colors: {
    surface: {
      primary: '#000000',
      secondary: '#1d1d1f',
      tertiary: '#2d2d30',
      elevated: '#1d1d1f',
      overlay: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#f5f5f7',
      secondary: '#a1a1a6',
      tertiary: '#86868b',
      inverse: '#1d1d1f',
      accent: '#c4a882',
    },
    border: {
      primary: '#424245',
      secondary: '#38383a',
      tertiary: '#2d2d30',
      focus: '#c4a882',
      interactive: '#48484a',
    },
    interactive: {
      hover: 'rgba(196, 168, 130, 0.12)',
      active: 'rgba(196, 168, 130, 0.16)',
      focus: 'rgba(196, 168, 130, 0.24)',
      disabled: 'rgba(196, 168, 130, 0.3)',
    },
    accent: {
      gold: '#ffd60a',
      goldLight: '#ffed4e',
      copper: '#ff9500',
      copperLight: '#ffb340',
      primary: '#c4a882',
      secondary: '#8b7355',
    },
    status: {
      success: '#32d74b',
      warning: '#ff9f0a',
      error: '#ff453a',
      info: '#0a84ff',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
    none: 'none',
    luxury: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.4)',
      md: '0 4px 16px rgba(0, 0, 0, 0.5)',
      lg: '0 8px 32px rgba(0, 0, 0, 0.6)',
      xl: '0 16px 64px rgba(0, 0, 0, 0.7)',
    },
    interactive: {
      hover: '0 4px 12px rgba(196, 168, 130, 0.2)',
      focus: '0 0 0 4px rgba(196, 168, 130, 0.3)',
      active: '0 2px 4px rgba(0, 0, 0, 0.4)',
    },
  },
  transitions: {
    theme: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
      accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
};

// Shared tokens that don't change between themes
export const sharedTokens = {
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





// Default theme configuration
export const defaultThemeConfig: ThemeConfig = {
  mode: 'system',
  systemPreference: 'light',
  transitionDuration: 300,
  persistPreference: true,
  reducedMotion: false,
  autoDetectSystemPreference: true,
};

// Helper function to get current theme tokens
export const getThemeTokens = (mode: 'light' | 'dark'): ThemeTokens => {
  return mode === 'dark' ? darkThemeTokens : lightThemeTokens;
};

// Helper function to generate CSS custom properties
export const generateCSSCustomProperties = (tokens: ThemeTokens): Record<string, string> => {
  const properties: Record<string, string> = {};
  
  // Surface colors
  Object.entries(tokens.colors.surface).forEach(([key, value]) => {
    properties[`--color-surface-${key}`] = value;
  });
  
  // Text colors
  Object.entries(tokens.colors.text).forEach(([key, value]) => {
    properties[`--color-text-${key}`] = value;
  });
  
  // Border colors
  Object.entries(tokens.colors.border).forEach(([key, value]) => {
    properties[`--color-border-${key}`] = value;
  });
  
  // Interactive colors
  Object.entries(tokens.colors.interactive).forEach(([key, value]) => {
    properties[`--color-interactive-${key}`] = value;
  });
  
  // Accent colors
  Object.entries(tokens.colors.accent).forEach(([key, value]) => {
    properties[`--color-accent-${key}`] = value;
  });
  
  // Status colors
  Object.entries(tokens.colors.status).forEach(([key, value]) => {
    properties[`--color-status-${key}`] = value;
  });
  
  // Shadows
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        properties[`--shadow-${key}-${subKey}`] = subValue as string;
      });
    } else {
      properties[`--shadow-${key}`] = value as string;
    }
  });
  
  // Transitions
  Object.entries(tokens.transitions).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([subKey, subValue]) => {
        properties[`--transition-${key}-${subKey}`] = subValue as string;
      });
    } else {
      properties[`--transition-${key}`] = value as string;
    }
  });
  
  return properties;
};

// Responsive design tokens that adapt to screen sizes
export const responsiveTokens = {
  mobile: {
    containerPadding: sharedTokens.spacing[4],
    sectionPadding: sharedTokens.spacing[12],
    cardPadding: sharedTokens.spacing[4],
    buttonHeight: '44px',
    touchTarget: '44px',
  },
  tablet: {
    containerPadding: sharedTokens.spacing[6],
    sectionPadding: sharedTokens.spacing[16],
    cardPadding: sharedTokens.spacing[6],
    buttonHeight: '48px',
    touchTarget: '48px',
  },
  desktop: {
    containerPadding: sharedTokens.spacing[8],
    sectionPadding: sharedTokens.spacing[24],
    cardPadding: sharedTokens.spacing[8],
    buttonHeight: '40px',
    touchTarget: '40px',
  },
} as const;

export type ResponsiveTokens = typeof responsiveTokens;