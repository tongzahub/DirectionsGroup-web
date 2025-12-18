/**
 * Responsive Typography System
 * Provides consistent typography scaling across devices
 */

import { useResponsiveValue, type ResponsiveValue } from './responsive';

// Typography scale definitions
export const typographyScale = {
  // Display sizes (for hero headlines)
  'display-xs': {
    xs: 'text-2xl',      // 24px
    sm: 'text-3xl',      // 30px
    md: 'text-4xl',      // 36px
    lg: 'text-5xl',      // 48px
    xl: 'text-6xl',      // 60px
  },
  'display-sm': {
    xs: 'text-3xl',      // 30px
    sm: 'text-4xl',      // 36px
    md: 'text-5xl',      // 48px
    lg: 'text-6xl',      // 60px
    xl: 'text-7xl',      // 72px
  },
  'display-md': {
    xs: 'text-4xl',      // 36px
    sm: 'text-5xl',      // 48px
    md: 'text-6xl',      // 60px
    lg: 'text-7xl',      // 72px
    xl: 'text-8xl',      // 96px
  },
  'display-lg': {
    xs: 'text-5xl',      // 48px
    sm: 'text-6xl',      // 60px
    md: 'text-7xl',      // 72px
    lg: 'text-8xl',      // 96px
    xl: 'text-9xl',      // 128px
  },
  
  // Heading sizes
  'heading-xs': {
    xs: 'text-lg',       // 18px
    sm: 'text-xl',       // 20px
    md: 'text-2xl',      // 24px
    lg: 'text-2xl',      // 24px
  },
  'heading-sm': {
    xs: 'text-xl',       // 20px
    sm: 'text-2xl',      // 24px
    md: 'text-3xl',      // 30px
    lg: 'text-3xl',      // 30px
  },
  'heading-md': {
    xs: 'text-2xl',      // 24px
    sm: 'text-3xl',      // 30px
    md: 'text-4xl',      // 36px
    lg: 'text-4xl',      // 36px
  },
  'heading-lg': {
    xs: 'text-3xl',      // 30px
    sm: 'text-4xl',      // 36px
    md: 'text-5xl',      // 48px
    lg: 'text-5xl',      // 48px
  },
  
  // Body text sizes
  'body-xs': {
    xs: 'text-sm',       // 14px
    sm: 'text-sm',       // 14px
    md: 'text-base',     // 16px
    lg: 'text-base',     // 16px
  },
  'body-sm': {
    xs: 'text-base',     // 16px
    sm: 'text-base',     // 16px
    md: 'text-lg',       // 18px
    lg: 'text-lg',       // 18px
  },
  'body-md': {
    xs: 'text-lg',       // 18px
    sm: 'text-lg',       // 18px
    md: 'text-xl',       // 20px
    lg: 'text-xl',       // 20px
  },
  'body-lg': {
    xs: 'text-xl',       // 20px
    sm: 'text-xl',       // 20px
    md: 'text-2xl',      // 24px
    lg: 'text-2xl',      // 24px
  },
} as const;

export type TypographySize = keyof typeof typographyScale;

// Line height mappings
export const lineHeightMap = {
  'display-xs': 'leading-tight',
  'display-sm': 'leading-tight',
  'display-md': 'leading-tight',
  'display-lg': 'leading-none',
  'heading-xs': 'leading-snug',
  'heading-sm': 'leading-snug',
  'heading-md': 'leading-snug',
  'heading-lg': 'leading-tight',
  'body-xs': 'leading-relaxed',
  'body-sm': 'leading-relaxed',
  'body-md': 'leading-relaxed',
  'body-lg': 'leading-normal',
} as const;

// Font weight mappings
export const fontWeightMap = {
  'display-xs': 'font-bold',
  'display-sm': 'font-bold',
  'display-md': 'font-bold',
  'display-lg': 'font-black',
  'heading-xs': 'font-semibold',
  'heading-sm': 'font-semibold',
  'heading-md': 'font-bold',
  'heading-lg': 'font-bold',
  'body-xs': 'font-normal',
  'body-sm': 'font-normal',
  'body-md': 'font-medium',
  'body-lg': 'font-medium',
} as const;

// Letter spacing mappings
export const letterSpacingMap = {
  'display-xs': 'tracking-tight',
  'display-sm': 'tracking-tight',
  'display-md': 'tracking-tighter',
  'display-lg': 'tracking-tighter',
  'heading-xs': 'tracking-normal',
  'heading-sm': 'tracking-normal',
  'heading-md': 'tracking-tight',
  'heading-lg': 'tracking-tight',
  'body-xs': 'tracking-normal',
  'body-sm': 'tracking-normal',
  'body-md': 'tracking-normal',
  'body-lg': 'tracking-normal',
} as const;

// Hook for responsive typography
export const useResponsiveTypography = (size: TypographySize) => {
  const fontSize = useResponsiveValue(typographyScale[size]);
  const lineHeight = lineHeightMap[size];
  const fontWeight = fontWeightMap[size];
  const letterSpacing = letterSpacingMap[size];
  
  return {
    fontSize,
    lineHeight,
    fontWeight,
    letterSpacing,
    className: `${fontSize} ${lineHeight} ${fontWeight} ${letterSpacing}`,
  };
};

// Utility function to get typography classes
export const getTypographyClasses = (
  size: TypographySize,
  options?: {
    customWeight?: string;
    customSpacing?: string;
    customLineHeight?: string;
  }
): ResponsiveValue<string> => {
  const baseClasses = typographyScale[size];
  const lineHeight = options?.customLineHeight || lineHeightMap[size];
  const fontWeight = options?.customWeight || fontWeightMap[size];
  const letterSpacing = options?.customSpacing || letterSpacingMap[size];
  
  // Combine classes for each breakpoint
  const combinedClasses: ResponsiveValue<string> = {};
  
  Object.entries(baseClasses).forEach(([breakpoint, fontSize]) => {
    combinedClasses[breakpoint as keyof typeof baseClasses] = 
      `${fontSize} ${lineHeight} ${fontWeight} ${letterSpacing}`;
  });
  
  return combinedClasses;
};

// Predefined typography combinations for common use cases
export const typographyPresets = {
  heroHeadline: {
    size: 'display-md' as TypographySize,
    className: 'font-bold tracking-tight leading-tight',
  },
  heroSubheadline: {
    size: 'body-lg' as TypographySize,
    className: 'font-medium tracking-normal leading-relaxed',
  },
  sectionHeading: {
    size: 'heading-lg' as TypographySize,
    className: 'font-bold tracking-tight leading-tight',
  },
  subsectionHeading: {
    size: 'heading-md' as TypographySize,
    className: 'font-semibold tracking-normal leading-snug',
  },
  bodyText: {
    size: 'body-sm' as TypographySize,
    className: 'font-normal tracking-normal leading-relaxed',
  },
  caption: {
    size: 'body-xs' as TypographySize,
    className: 'font-normal tracking-normal leading-normal',
  },
} as const;

// Hook for typography presets
export const useTypographyPreset = (preset: keyof typeof typographyPresets) => {
  const config = typographyPresets[preset];
  const responsive = useResponsiveTypography(config.size);
  
  return {
    ...responsive,
    className: `${responsive.className} ${config.className}`,
  };
};