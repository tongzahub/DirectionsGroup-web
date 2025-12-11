/**
 * Parallax Utilities
 * Helper functions for parallax effects and performance optimization
 */

import { MotionValue } from 'framer-motion';

export interface ParallaxSettings {
  intensity: number;
  maxElements: number;
  disableOnLowEnd: boolean;
  useSimpleTransforms: boolean;
}

// Default parallax settings based on device performance
export const getDefaultParallaxSettings = (
  isLowEndDevice: boolean = false,
  fps: number = 60,
  batteryLevel: number = 1
): ParallaxSettings => {
  if (isLowEndDevice || fps < 30 || batteryLevel < 0.2) {
    return {
      intensity: 0,
      maxElements: 0,
      disableOnLowEnd: true,
      useSimpleTransforms: true,
    };
  }
  
  if (fps < 45 || batteryLevel < 0.3) {
    return {
      intensity: 0.3,
      maxElements: 3,
      disableOnLowEnd: false,
      useSimpleTransforms: true,
    };
  }
  
  return {
    intensity: 1,
    maxElements: 8,
    disableOnLowEnd: false,
    useSimpleTransforms: false,
  };
};

// Calculate optimal parallax speed based on element position and viewport
export const calculateOptimalSpeed = (
  elementIndex: number,
  totalElements: number,
  baseSpeed: number = 0.5
): number => {
  // Distribute speeds to create depth
  const speedMultiplier = 0.2 + (elementIndex / totalElements) * 0.8;
  return baseSpeed * speedMultiplier;
};

// Create staggered parallax speeds for multiple elements
export const createStaggeredSpeeds = (
  count: number,
  minSpeed: number = 0.2,
  maxSpeed: number = 0.8
): number[] => {
  const speeds: number[] = [];
  const step = (maxSpeed - minSpeed) / (count - 1);
  
  for (let i = 0; i < count; i++) {
    speeds.push(minSpeed + (step * i));
  }
  
  return speeds;
};

// Parallax layer presets for common use cases
export const parallaxPresets = {
  hero: {
    background: { speed: 0.3, zIndex: 1 },
    midground: { speed: 0.6, zIndex: 2 },
    foreground: { speed: 0.9, zIndex: 3 },
  },
  
  section: {
    decoration: { speed: 0.2, zIndex: 1 },
    content: { speed: 0.4, zIndex: 2 },
  },
  
  gallery: {
    background: { speed: 0.1, zIndex: 1 },
    images: { speed: 0.3, zIndex: 2 },
    overlay: { speed: 0.5, zIndex: 3 },
  },
} as const;

// CSS transform optimization
export const getOptimizedTransform = (
  y: MotionValue<number> | number,
  useSimpleTransforms: boolean = false
): string => {
  if (useSimpleTransforms) {
    return `translateY(${typeof y === 'number' ? y : 0}px)`;
  }
  
  return `translate3d(0, ${typeof y === 'number' ? y : 0}px, 0)`;
};

// Intersection observer options for parallax elements
export const getParallaxObserverOptions = (
  threshold: number = 0.1,
  rootMargin: string = '50px'
): IntersectionObserverInit => ({
  threshold,
  rootMargin,
});

// Debounce scroll events for performance
export const createScrollDebouncer = (
  callback: () => void,
  delay: number = 16 // ~60fps
): (() => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

// Check if reduced motion is preferred
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Validate parallax configuration
export const validateParallaxConfig = (config: {
  speed?: number;
  intensity?: number;
  elements?: number;
}): boolean => {
  const { speed = 0.5, intensity = 1, elements = 1 } = config;
  
  // Check for reasonable values
  if (speed < 0 || speed > 2) {
    console.warn('Parallax speed should be between 0 and 2');
    return false;
  }
  
  if (intensity < 0 || intensity > 1) {
    console.warn('Parallax intensity should be between 0 and 1');
    return false;
  }
  
  if (elements < 0 || elements > 10) {
    console.warn('Number of parallax elements should be between 0 and 10');
    return false;
  }
  
  return true;
};

// Performance monitoring for parallax
export class ParallaxPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private animationId: number | null = null;
  private callbacks: Array<(fps: number) => void> = [];
  
  start(): void {
    if (this.animationId) return;
    
    const measure = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        
        this.callbacks.forEach(callback => callback(fps));
        
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      this.animationId = requestAnimationFrame(measure);
    };
    
    this.animationId = requestAnimationFrame(measure);
  }
  
  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  onFpsUpdate(callback: (fps: number) => void): () => void {
    this.callbacks.push(callback);
    
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }
}

// Singleton performance monitor
export const parallaxPerformanceMonitor = new ParallaxPerformanceMonitor();

// Utility to create responsive parallax values
export const createResponsiveParallax = (
  baseSpeed: number,
  breakpoints: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  } = {}
): number => {
  if (typeof window === 'undefined') return baseSpeed;
  
  const width = window.innerWidth;
  
  if (width < 768 && breakpoints.mobile !== undefined) {
    return baseSpeed * breakpoints.mobile;
  }
  
  if (width < 1024 && breakpoints.tablet !== undefined) {
    return baseSpeed * breakpoints.tablet;
  }
  
  if (breakpoints.desktop !== undefined) {
    return baseSpeed * breakpoints.desktop;
  }
  
  return baseSpeed;
};