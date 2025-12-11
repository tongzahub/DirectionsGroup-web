/**
 * Responsive Breakpoint System
 * Consistent cross-device behavior utilities
 */

import { useEffect, useState } from 'react';

// Breakpoint definitions
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Media query strings
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
  
  // Max width queries
  'max-xs': `(max-width: ${breakpoints.sm - 1}px)`,
  'max-sm': `(max-width: ${breakpoints.md - 1}px)`,
  'max-md': `(max-width: ${breakpoints.lg - 1}px)`,
  'max-lg': `(max-width: ${breakpoints.xl - 1}px)`,
  'max-xl': `(max-width: ${breakpoints['2xl'] - 1}px)`,
  
  // Range queries
  'sm-only': `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  'md-only': `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  'lg-only': `(min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
  'xl-only': `(min-width: ${breakpoints.xl}px) and (max-width: ${breakpoints['2xl'] - 1}px)`,
} as const;

// Device type detection
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const getDeviceType = (width: number): DeviceType => {
  if (width < breakpoints.md) return 'mobile';
  if (width < breakpoints.lg) return 'tablet';
  return 'desktop';
};

// Hook for current breakpoint
export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= breakpoints['2xl']) {
        setBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setBreakpoint('md');
      } else if (width >= breakpoints.sm) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('xs');
      }
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return breakpoint;
};

// Hook for device type
export const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  
  useEffect(() => {
    const updateDeviceType = () => {
      setDeviceType(getDeviceType(window.innerWidth));
    };
    
    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);
  
  return deviceType;
};

// Hook for media query matching
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);
  
  return matches;
};

// Hook for window dimensions
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return windowSize;
};

// Responsive value utility
export type ResponsiveValue<T> = T | {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

export const getResponsiveValue = <T>(
  value: ResponsiveValue<T>,
  currentBreakpoint: Breakpoint
): T => {
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }
  
  const responsiveValue = value as Record<Breakpoint, T>;
  
  // Find the appropriate value for current breakpoint
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  
  // Look for exact match first
  if (responsiveValue[currentBreakpoint] !== undefined) {
    return responsiveValue[currentBreakpoint];
  }
  
  // Fall back to smaller breakpoints
  for (let i = currentIndex - 1; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (responsiveValue[bp] !== undefined) {
      return responsiveValue[bp];
    }
  }
  
  // Fall back to any available value
  for (const bp of breakpointOrder) {
    if (responsiveValue[bp] !== undefined) {
      return responsiveValue[bp];
    }
  }
  
  // Should not reach here, but return undefined as fallback
  return undefined as T;
};

// Hook for responsive values
export const useResponsiveValue = <T>(value: ResponsiveValue<T>): T => {
  const currentBreakpoint = useBreakpoint();
  return getResponsiveValue(value, currentBreakpoint);
};

// Container max-widths for each breakpoint
export const containerMaxWidths = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Grid system utilities
export const gridColumns = {
  1: '1fr',
  2: 'repeat(2, 1fr)',
  3: 'repeat(3, 1fr)',
  4: 'repeat(4, 1fr)',
  5: 'repeat(5, 1fr)',
  6: 'repeat(6, 1fr)',
  7: 'repeat(7, 1fr)',
  8: 'repeat(8, 1fr)',
  9: 'repeat(9, 1fr)',
  10: 'repeat(10, 1fr)',
  11: 'repeat(11, 1fr)',
  12: 'repeat(12, 1fr)',
} as const;

export const getGridColumns = (columns: ResponsiveValue<number>, breakpoint: Breakpoint): string => {
  const columnCount = getResponsiveValue(columns, breakpoint);
  return gridColumns[columnCount as keyof typeof gridColumns] || gridColumns[1];
};

// Spacing utilities
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
} as const;

// Typography scale
export const typographyScale = {
  xs: {
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  sm: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
  base: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  lg: {
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
  },
  xl: {
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
  },
  '2xl': {
    fontSize: '1.5rem',
    lineHeight: '2rem',
  },
  '3xl': {
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
  },
  '4xl': {
    fontSize: '2.25rem',
    lineHeight: '2.5rem',
  },
  '5xl': {
    fontSize: '3rem',
    lineHeight: '1',
  },
  '6xl': {
    fontSize: '3.75rem',
    lineHeight: '1',
  },
  '7xl': {
    fontSize: '4.5rem',
    lineHeight: '1',
  },
  '8xl': {
    fontSize: '6rem',
    lineHeight: '1',
  },
  '9xl': {
    fontSize: '8rem',
    lineHeight: '1',
  },
} as const;

// Utility for creating responsive CSS
export const createResponsiveCSS = (
  property: string,
  values: ResponsiveValue<string | number>
): Record<string, string | number> => {
  if (typeof values !== 'object' || values === null) {
    return { [property]: values };
  }
  
  const css: Record<string, string | number> = {};
  const responsiveValues = values as Record<Breakpoint, string | number>;
  
  Object.entries(responsiveValues).forEach(([breakpoint, value]) => {
    if (value !== undefined) {
      const bp = breakpoint as Breakpoint;
      if (bp === 'xs') {
        css[property] = value;
      } else {
        css[`@media ${mediaQueries[bp]}`] = {
          [property]: value,
        };
      }
    }
  });
  
  return css;
};