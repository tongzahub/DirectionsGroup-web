/**
 * Animation Configuration System
 * Centralized animation settings with responsive and accessibility support
 */

import { Variants, Transition } from 'framer-motion';

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  stagger?: number;
  threshold?: number;
}

export interface ResponsiveAnimationConfig {
  mobile: AnimationConfig;
  tablet: AnimationConfig;
  desktop: AnimationConfig;
  reducedMotion: AnimationConfig;
}

// Base animation configurations
export const animationConfigs = {
  // Entrance animations
  fadeIn: {
    mobile: { duration: 0.3, easing: 'easeOut', delay: 0 },
    tablet: { duration: 0.4, easing: 'easeOut', delay: 0 },
    desktop: { duration: 0.5, easing: 'easeOut', delay: 0 },
    reducedMotion: { duration: 0.01, easing: 'linear', delay: 0 },
  },
  
  slideUp: {
    mobile: { duration: 0.4, easing: 'easeOut', delay: 0 },
    tablet: { duration: 0.5, easing: 'easeOut', delay: 0 },
    desktop: { duration: 0.6, easing: 'easeOut', delay: 0 },
    reducedMotion: { duration: 0.01, easing: 'linear', delay: 0 },
  },
  
  scaleIn: {
    mobile: { duration: 0.3, easing: 'easeOut', delay: 0 },
    tablet: { duration: 0.4, easing: 'easeOut', delay: 0 },
    desktop: { duration: 0.4, easing: 'easeOutBack', delay: 0 },
    reducedMotion: { duration: 0.01, easing: 'linear', delay: 0 },
  },
  
  // Scroll-triggered animations
  scrollReveal: {
    mobile: { duration: 0.5, easing: 'easeOut', threshold: 0.1 },
    tablet: { duration: 0.6, easing: 'easeOut', threshold: 0.2 },
    desktop: { duration: 0.7, easing: 'easeOut', threshold: 0.3 },
    reducedMotion: { duration: 0.01, easing: 'linear', threshold: 0.1 },
  },
  
  staggerReveal: {
    mobile: { duration: 0.4, easing: 'easeOut', stagger: 0.1, threshold: 0.1 },
    tablet: { duration: 0.5, easing: 'easeOut', stagger: 0.15, threshold: 0.2 },
    desktop: { duration: 0.6, easing: 'easeOut', stagger: 0.2, threshold: 0.3 },
    reducedMotion: { duration: 0.01, easing: 'linear', stagger: 0, threshold: 0.1 },
  },
  
  // Micro-interactions
  buttonHover: {
    mobile: { duration: 0.15, easing: 'easeOut' },
    tablet: { duration: 0.2, easing: 'easeOut' },
    desktop: { duration: 0.2, easing: 'easeOut' },
    reducedMotion: { duration: 0.01, easing: 'linear' },
  },
  
  cardHover: {
    mobile: { duration: 0.2, easing: 'easeOut' },
    tablet: { duration: 0.25, easing: 'easeOut' },
    desktop: { duration: 0.3, easing: 'easeOut' },
    reducedMotion: { duration: 0.01, easing: 'linear' },
  },
  
  // Page transitions
  pageTransition: {
    mobile: { duration: 0.3, easing: 'easeInOut' },
    tablet: { duration: 0.4, easing: 'easeInOut' },
    desktop: { duration: 0.5, easing: 'easeInOut' },
    reducedMotion: { duration: 0.01, easing: 'linear' },
  },
  
  // Parallax animations
  parallax: {
    mobile: { duration: 0, easing: 'linear', threshold: 0.1 },
    tablet: { duration: 0, easing: 'linear', threshold: 0.1 },
    desktop: { duration: 0, easing: 'linear', threshold: 0.1 },
    reducedMotion: { duration: 0, easing: 'linear', threshold: 0.1 },
  },
} as const;

// Framer Motion variants
export const motionVariants = {
  // Fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } as Variants,
  
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  } as Variants,
  
  fadeInDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  } as Variants,
  
  fadeInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  } as Variants,
  
  fadeInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  } as Variants,
  
  // Scale animations
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  } as Variants,
  
  scaleInUp: {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0 },
  } as Variants,
  
  // Stagger container
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  } as Variants,
  
  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  } as Variants,
  
  // Hover animations
  buttonHover: {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -2 },
    tap: { scale: 0.98 },
  } as Variants,
  
  cardHover: {
    rest: { scale: 1, y: 0, rotateX: 0 },
    hover: { scale: 1.02, y: -8, rotateX: 5 },
  } as Variants,
  
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  } as Variants,
  
  slideTransition: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  } as Variants,
  
  // Parallax variants
  parallaxSlow: {
    initial: { y: 0 },
    animate: { y: 0 },
  } as Variants,
  
  parallaxMedium: {
    initial: { y: 0 },
    animate: { y: 0 },
  } as Variants,
  
  parallaxFast: {
    initial: { y: 0 },
    animate: { y: 0 },
  } as Variants,
} as const;

// Transition presets
export const transitionPresets = {
  easeOut: { type: 'tween', ease: 'easeOut' } as Transition,
  easeInOut: { type: 'tween', ease: 'easeInOut' } as Transition,
  easeOutBack: { type: 'tween', ease: [0.34, 1.56, 0.64, 1] } as Transition,
  easeOutQuart: { type: 'tween', ease: [0.25, 1, 0.5, 1] } as Transition,
  spring: { type: 'spring', stiffness: 100, damping: 15 } as Transition,
  springBouncy: { type: 'spring', stiffness: 200, damping: 10 } as Transition,
  springGentle: { type: 'spring', stiffness: 80, damping: 20 } as Transition,
} as const;

// Performance optimization settings
export const performanceSettings = {
  // Target frame rate
  targetFPS: 60,
  
  // Performance thresholds
  thresholds: {
    lowEnd: {
      maxAnimations: 3,
      reducedComplexity: true,
      disableParallax: true,
    },
    midRange: {
      maxAnimations: 6,
      reducedComplexity: false,
      disableParallax: false,
    },
    highEnd: {
      maxAnimations: 12,
      reducedComplexity: false,
      disableParallax: false,
    },
  },
  
  // Battery-conscious settings
  batterySaver: {
    reducedFrameRate: 30,
    simplifiedAnimations: true,
    disableParallax: true,
    shortenDurations: true,
  },
} as const;

// Device detection utilities
export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const getPrefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Performance-aware animation configuration getter
export const getAnimationConfig = (
  animationType: keyof typeof animationConfigs,
  deviceType?: 'mobile' | 'tablet' | 'desktop',
  performanceSettings?: {
    shortenDurations?: boolean;
    reduceComplexity?: boolean;
    disableParallax?: boolean;
  }
): AnimationConfig => {
  const device = deviceType || getDeviceType();
  const prefersReducedMotion = getPrefersReducedMotion();
  
  const config = animationConfigs[animationType];
  
  if (prefersReducedMotion) {
    return config.reducedMotion;
  }
  
  let selectedConfig = config[device];
  
  // Apply performance optimizations if provided
  if (performanceSettings) {
    selectedConfig = { ...selectedConfig };
    
    if (performanceSettings.shortenDurations) {
      selectedConfig.duration = Math.max(0.1, selectedConfig.duration * 0.5);
    }
    
    if (performanceSettings.reduceComplexity) {
      selectedConfig.easing = 'linear';
      if (selectedConfig.stagger) {
        selectedConfig.stagger = Math.max(0.05, selectedConfig.stagger * 0.5);
      }
    }
    
    if (performanceSettings.disableParallax && animationType === 'parallax') {
      return config.reducedMotion;
    }
  }
  
  return selectedConfig;
};

// Create responsive transition with performance awareness
export const createResponsiveTransition = (
  animationType: keyof typeof animationConfigs,
  customDuration?: number,
  performanceSettings?: {
    shortenDurations?: boolean;
    reduceComplexity?: boolean;
    disableParallax?: boolean;
  }
): Transition => {
  const config = getAnimationConfig(animationType, undefined, performanceSettings);
  const duration = customDuration || config.duration;
  
  return {
    duration,
    ease: config.easing === 'easeOut' ? 'easeOut' : 
          config.easing === 'easeInOut' ? 'easeInOut' :
          config.easing === 'easeOutBack' ? [0.34, 1.56, 0.64, 1] :
          config.easing === 'linear' ? 'linear' :
          'easeOut',
    delay: config.delay || 0,
  };
};

// Performance-aware animation utilities
export const createPerformanceAwareVariants = (
  baseVariants: Variants,
  performanceSettings?: {
    shortenDurations?: boolean;
    reduceComplexity?: boolean;
    useSimpleFallbacks?: boolean;
  }
): Variants => {
  if (!performanceSettings?.useSimpleFallbacks) {
    return baseVariants;
  }
  
  // Create simplified variants for low-performance scenarios
  const simplifiedVariants: Variants = {};
  
  Object.keys(baseVariants).forEach(key => {
    const variant = baseVariants[key];
    if (typeof variant === 'object' && variant !== null) {
      simplifiedVariants[key] = {
        opacity: variant.opacity || 1,
        // Remove complex transforms for performance
        scale: 1,
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
      };
    } else {
      simplifiedVariants[key] = variant;
    }
  });
  
  return simplifiedVariants;
};

// Animation queue manager for performance
class AnimationQueueManager {
  private activeAnimations = new Set<string>();
  private maxConcurrentAnimations = 12;
  private queue: Array<{ id: string; callback: () => void }> = [];

  setMaxConcurrentAnimations(max: number): void {
    this.maxConcurrentAnimations = max;
    this.processQueue();
  }

  requestAnimation(id: string, callback: () => void): boolean {
    if (this.activeAnimations.size < this.maxConcurrentAnimations) {
      this.startAnimation(id, callback);
      return true;
    } else {
      this.queue.push({ id, callback });
      return false;
    }
  }

  private startAnimation(id: string, callback: () => void): void {
    this.activeAnimations.add(id);
    callback();
  }

  completeAnimation(id: string): void {
    this.activeAnimations.delete(id);
    this.processQueue();
  }

  private processQueue(): void {
    while (this.queue.length > 0 && this.activeAnimations.size < this.maxConcurrentAnimations) {
      const next = this.queue.shift();
      if (next) {
        this.startAnimation(next.id, next.callback);
      }
    }
  }

  getActiveCount(): number {
    return this.activeAnimations.size;
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

export const animationQueue = new AnimationQueueManager();

// React hook for performance-aware animations
import { useState, useEffect } from 'react';

export const usePerformanceAwareAnimation = (animationType: keyof typeof animationConfigs) => {
  const [config, setConfig] = useState(() => getAnimationConfig(animationType));
  
  useEffect(() => {
    // This would be connected to the performance monitor
    // For now, we'll use a simple implementation
    const updateConfig = () => {
      const newConfig = getAnimationConfig(animationType);
      setConfig(newConfig);
    };
    
    // Listen for performance changes
    const interval = setInterval(updateConfig, 1000);
    
    return () => clearInterval(interval);
  }, [animationType]);
  
  return config;
};