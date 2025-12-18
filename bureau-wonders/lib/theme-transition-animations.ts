/**
 * Theme Transition Animation System
 * Smooth color and shadow changes with performance optimization
 */

import { Variants, Transition } from 'framer-motion';
import { lightThemeTokens, darkThemeTokens, type ThemeTokens } from './theme-tokens';

export interface ThemeTransitionConfig {
  duration: number;
  easing: string;
  staggerDelay: number;
  cascadeDirection: 'top-down' | 'bottom-up' | 'center-out' | 'left-right';
  respectReducedMotion: boolean;
}

export interface ThemeTransitionMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  frameRate: number;
  elementsTransitioned: number;
}

// Default theme transition configuration
export const defaultThemeTransitionConfig: ThemeTransitionConfig = {
  duration: 300,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  staggerDelay: 50,
  cascadeDirection: 'top-down',
  respectReducedMotion: true,
};

// Theme transition variants for different component types
export const themeTransitionVariants = {
  // Surface components (backgrounds, cards, etc.)
  surface: {
    light: {
      backgroundColor: 'var(--color-surface-primary)',
      borderColor: 'var(--color-border-primary)',
      boxShadow: 'var(--shadow-md)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    dark: {
      backgroundColor: 'var(--color-surface-primary)',
      borderColor: 'var(--color-border-primary)',
      boxShadow: 'var(--shadow-md)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  } as Variants,
  
  // Text components
  text: {
    light: {
      color: 'var(--color-text-primary)',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    dark: {
      color: 'var(--color-text-primary)',
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  } as Variants,
  
  // Interactive components (buttons, links, etc.)
  interactive: {
    light: {
      backgroundColor: 'var(--color-accent-primary)',
      color: 'var(--color-text-inverse)',
      boxShadow: 'var(--shadow-luxury-sm)',
      transition: {
        duration: 0.25,
        ease: 'easeOut',
      },
    },
    dark: {
      backgroundColor: 'var(--color-accent-primary)',
      color: 'var(--color-text-inverse)',
      boxShadow: 'var(--shadow-luxury-sm)',
      transition: {
        duration: 0.25,
        ease: 'easeOut',
      },
    },
  } as Variants,
  
  // Luxury components with enhanced shadows
  luxury: {
    light: {
      backgroundColor: 'var(--color-surface-elevated)',
      borderColor: 'var(--color-border-secondary)',
      boxShadow: 'var(--shadow-luxury-md)',
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    dark: {
      backgroundColor: 'var(--color-surface-elevated)',
      borderColor: 'var(--color-border-secondary)',
      boxShadow: 'var(--shadow-luxury-md)',
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  } as Variants,
} as const;

// Cascade animation for theme transitions
export const createCascadeTransition = (
  elementCount: number,
  config: Partial<ThemeTransitionConfig> = {}
): Variants => {
  const finalConfig = { ...defaultThemeTransitionConfig, ...config };
  
  return {
    light: {
      transition: {
        staggerChildren: finalConfig.staggerDelay / 1000,
        delayChildren: 0,
        duration: finalConfig.duration / 1000,
        ease: finalConfig.easing as any,
      },
    },
    dark: {
      transition: {
        staggerChildren: finalConfig.staggerDelay / 1000,
        delayChildren: 0,
        duration: finalConfig.duration / 1000,
        ease: finalConfig.easing as any,
      },
    },
  };
};

// Individual element transition for cascade
export const cascadeElementVariants: Variants = {
  light: {
    backgroundColor: 'var(--color-surface-primary)',
    color: 'var(--color-text-primary)',
    borderColor: 'var(--color-border-primary)',
    opacity: 1,
    scale: 1,
  },
  dark: {
    backgroundColor: 'var(--color-surface-primary)',
    color: 'var(--color-text-primary)',
    borderColor: 'var(--color-border-primary)',
    opacity: 1,
    scale: 1,
  },
};

// Theme transition with morphing effect
export const morphingTransitionVariants: Variants = {
  light: {
    backgroundColor: 'var(--color-surface-primary)',
    color: 'var(--color-text-primary)',
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
      backgroundColor: { duration: 0.3 },
      color: { duration: 0.2, delay: 0.1 },
      scale: { duration: 0.4, ease: 'backOut' },
    },
  },
  dark: {
    backgroundColor: 'var(--color-surface-primary)',
    color: 'var(--color-text-primary)',
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
      backgroundColor: { duration: 0.3 },
      color: { duration: 0.2, delay: 0.1 },
      scale: { duration: 0.4, ease: 'backOut' },
    },
  },
};

// Performance-aware theme transition
export const createPerformanceAwareTransition = (
  performanceLevel: 'high' | 'medium' | 'low',
  baseVariants: Variants
): Variants => {
  const performanceMultipliers = {
    high: 1,
    medium: 0.7,
    low: 0.3,
  };
  
  const multiplier = performanceMultipliers[performanceLevel];
  
  const optimizedVariants: Variants = {};
  
  Object.keys(baseVariants).forEach(key => {
    const variant = baseVariants[key];
    if (typeof variant === 'object' && variant !== null && 'transition' in variant) {
      optimizedVariants[key] = {
        ...variant,
        transition: {
          ...variant.transition,
          duration: (variant.transition as any).duration * multiplier,
          // Simplify easing for low performance
          ease: performanceLevel === 'low' ? 'linear' : (variant.transition as any).ease,
        },
      };
    } else {
      optimizedVariants[key] = variant;
    }
  });
  
  return optimizedVariants;
};

// Theme transition manager class
export class ThemeTransitionManager {
  private activeTransitions = new Set<string>();
  private transitionMetrics: Map<string, ThemeTransitionMetrics> = new Map();
  private config: ThemeTransitionConfig;
  
  constructor(config: Partial<ThemeTransitionConfig> = {}) {
    this.config = { ...defaultThemeTransitionConfig, ...config };
  }
  
  // Start a theme transition
  startTransition(
    elementId: string,
    fromTheme: 'light' | 'dark',
    toTheme: 'light' | 'dark'
  ): Promise<void> {
    return new Promise((resolve) => {
      if (this.activeTransitions.has(elementId)) {
        // Transition already in progress
        return;
      }
      
      this.activeTransitions.add(elementId);
      
      const startTime = performance.now();
      const metrics: ThemeTransitionMetrics = {
        startTime,
        endTime: 0,
        duration: 0,
        frameRate: 0,
        elementsTransitioned: 1,
      };
      
      this.transitionMetrics.set(elementId, metrics);
      
      // Simulate transition completion
      setTimeout(() => {
        const endTime = performance.now();
        metrics.endTime = endTime;
        metrics.duration = endTime - startTime;
        
        this.activeTransitions.delete(elementId);
        resolve();
      }, this.config.duration);
    });
  }
  
  // Get transition metrics
  getMetrics(elementId: string): ThemeTransitionMetrics | undefined {
    return this.transitionMetrics.get(elementId);
  }
  
  // Check if transition is active
  isTransitioning(elementId?: string): boolean {
    if (elementId) {
      return this.activeTransitions.has(elementId);
    }
    return this.activeTransitions.size > 0;
  }
  
  // Get active transition count
  getActiveTransitionCount(): number {
    return this.activeTransitions.size;
  }
  
  // Clear all transitions (for cleanup)
  clearAllTransitions(): void {
    this.activeTransitions.clear();
    this.transitionMetrics.clear();
  }
  
  // Update configuration
  updateConfig(newConfig: Partial<ThemeTransitionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Global theme transition manager instance
export const themeTransitionManager = new ThemeTransitionManager();

// Utility functions for theme transitions
export const getThemeTransitionCSS = (
  fromTheme: 'light' | 'dark',
  toTheme: 'light' | 'dark',
  duration: number = 300
): string => {
  const properties = [
    'background-color',
    'color',
    'border-color',
    'box-shadow',
    'fill',
    'stroke',
  ];
  
  return `
    transition: ${properties.map(prop => `${prop} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`).join(', ')};
  `;
};

// Create theme-aware keyframes
export const createThemeKeyframes = (
  property: string,
  lightValue: string,
  darkValue: string
): string => {
  return `
    @keyframes theme-transition-${property} {
      from { ${property}: ${lightValue}; }
      to { ${property}: ${darkValue}; }
    }
  `;
};

// Reduced motion variants
export const reducedMotionVariants: Variants = {
  light: {
    backgroundColor: 'var(--color-surface-primary)',
    color: 'var(--color-text-primary)',
    borderColor: 'var(--color-border-primary)',
    transition: { duration: 0 },
  },
  dark: {
    backgroundColor: 'var(--color-surface-primary)',
    color: 'var(--color-text-primary)',
    borderColor: 'var(--color-border-primary)',
    transition: { duration: 0 },
  },
};

// Theme transition with accessibility support
export const createAccessibleThemeTransition = (
  baseVariants: Variants,
  respectReducedMotion: boolean = true
): Variants => {
  if (respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return reducedMotionVariants;
  }
  
  return baseVariants;
};

// Color interpolation for smooth theme transitions
export const interpolateThemeColors = (
  progress: number,
  lightColor: string,
  darkColor: string
): string => {
  // Simple RGB interpolation (could be enhanced with better color space handling)
  const parseColor = (color: string): [number, number, number] => {
    // This is a simplified parser - in production, use a proper color library
    const hex = color.replace('#', '');
    return [
      parseInt(hex.substr(0, 2), 16),
      parseInt(hex.substr(2, 2), 16),
      parseInt(hex.substr(4, 2), 16),
    ];
  };
  
  try {
    const [r1, g1, b1] = parseColor(lightColor);
    const [r2, g2, b2] = parseColor(darkColor);
    
    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);
    
    return `rgb(${r}, ${g}, ${b})`;
  } catch (error) {
    // Fallback to CSS custom properties
    return progress > 0.5 ? darkColor : lightColor;
  }
};