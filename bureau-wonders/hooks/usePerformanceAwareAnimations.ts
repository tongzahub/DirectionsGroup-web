/**
 * Performance-Aware Animation Hook
 * Automatically adjusts animations based on device performance
 */

import { useState, useEffect, useCallback } from 'react';
import { Variants, Transition } from 'framer-motion';
import { 
  useAnimationSettings, 
  useNetworkSettings, 
  usePerformanceAlerts,
  AnimationDegradationSettings,
  NetworkAwareSettings,
  PerformanceAlert
} from '../lib/performance-monitor';
import { 
  getAnimationConfig, 
  createResponsiveTransition,
  createPerformanceAwareVariants,
  animationQueue,
  animationConfigs,
  motionVariants
} from '../lib/animation-config';

export interface PerformanceAwareAnimationOptions {
  animationType: keyof typeof animationConfigs;
  fallbackVariants?: Variants;
  priority?: 'low' | 'medium' | 'high';
  essential?: boolean; // If true, animation won't be disabled even on low performance
}

export interface AnimationState {
  variants: Variants;
  transition: Transition;
  shouldAnimate: boolean;
  isQueued: boolean;
  degradationLevel: number;
}

export const usePerformanceAwareAnimation = (
  options: PerformanceAwareAnimationOptions
): AnimationState => {
  const animationSettings = useAnimationSettings();
  const networkSettings = useNetworkSettings();
  const alerts = usePerformanceAlerts();
  
  const [animationState, setAnimationState] = useState<AnimationState>(() => {
    const config = getAnimationConfig(options.animationType);
    // Map animation types to available variants
    const variantMap: Record<string, keyof typeof motionVariants> = {
      slideUp: 'fadeInUp',
      scrollReveal: 'fadeIn',
      staggerReveal: 'staggerContainer',
      buttonHover: 'fadeIn',
      cardHover: 'scaleIn',
      pageTransition: 'fadeIn',
      parallax: 'fadeIn',
    };
    
    const variantKey = variantMap[options.animationType] || options.animationType as keyof typeof motionVariants;
    const baseVariants = motionVariants[variantKey] || motionVariants.fadeIn;
    
    return {
      variants: baseVariants,
      transition: createResponsiveTransition(options.animationType),
      shouldAnimate: true,
      isQueued: false,
      degradationLevel: 0,
    };
  });

  // Update animation state based on performance settings
  useEffect(() => {
    const updateAnimationState = () => {
      const config = getAnimationConfig(
        options.animationType,
        undefined,
        {
          shortenDurations: animationSettings.shortenDurations,
          reduceComplexity: animationSettings.reduceComplexity,
          disableParallax: animationSettings.disableParallax,
        }
      );

      // Map animation types to available variants
      const variantMap: Record<string, keyof typeof motionVariants> = {
        slideUp: 'fadeInUp',
        scrollReveal: 'fadeIn',
        staggerReveal: 'staggerContainer',
        buttonHover: 'fadeIn',
        cardHover: 'scaleIn',
        pageTransition: 'fadeIn',
        parallax: 'fadeIn',
      };
      
      const variantKey = variantMap[options.animationType] || options.animationType as keyof typeof motionVariants;
      let baseVariants = motionVariants[variantKey] || motionVariants.fadeIn;
      
      // Apply performance-aware variants
      const variants = createPerformanceAwareVariants(baseVariants, {
        shortenDurations: animationSettings.shortenDurations,
        reduceComplexity: animationSettings.reduceComplexity,
        useSimpleFallbacks: animationSettings.useSimpleFallbacks,
      });

      const transition = createResponsiveTransition(
        options.animationType,
        undefined,
        {
          shortenDurations: animationSettings.shortenDurations,
          reduceComplexity: animationSettings.reduceComplexity,
          disableParallax: animationSettings.disableParallax,
        }
      );

      // Determine if animation should be enabled
      let shouldAnimate = true;
      
      if (!options.essential) {
        // Disable non-essential animations based on settings
        if (animationSettings.useSimpleFallbacks && options.priority === 'low') {
          shouldAnimate = false;
        }
        
        if (animationSettings.disableHoverEffects && options.animationType.includes('Hover')) {
          shouldAnimate = false;
        }
        
        if (animationSettings.disableParallax && options.animationType === 'parallax') {
          shouldAnimate = false;
        }
      }

      // Use fallback variants if provided and performance is poor
      if (options.fallbackVariants && animationSettings.useSimpleFallbacks) {
        baseVariants = options.fallbackVariants;
      }

      setAnimationState(prev => ({
        ...prev,
        variants: shouldAnimate ? variants : { hidden: {}, visible: {} },
        transition: shouldAnimate ? transition : { duration: 0 },
        shouldAnimate,
        degradationLevel: getDegradationLevel(animationSettings),
      }));
    };

    updateAnimationState();
  }, [animationSettings, networkSettings, options]);

  // Handle animation queueing for performance
  const requestAnimation = useCallback((animationId: string) => {
    if (!animationState.shouldAnimate) return false;
    
    const priority = options.priority || 'medium';
    const maxAnimations = animationSettings.limitConcurrentAnimations;
    
    // Update queue limit based on performance settings
    animationQueue.setMaxConcurrentAnimations(maxAnimations);
    
    const canStart = animationQueue.requestAnimation(animationId, () => {
      setAnimationState(prev => ({ ...prev, isQueued: false }));
    });
    
    if (!canStart) {
      setAnimationState(prev => ({ ...prev, isQueued: true }));
    }
    
    return canStart;
  }, [animationState.shouldAnimate, animationSettings.limitConcurrentAnimations, options.priority]);

  const completeAnimation = useCallback((animationId: string) => {
    animationQueue.completeAnimation(animationId);
  }, []);

  return {
    ...animationState,
    requestAnimation,
    completeAnimation,
  } as AnimationState & {
    requestAnimation: (id: string) => boolean;
    completeAnimation: (id: string) => void;
  };
};

// Helper function to determine degradation level
const getDegradationLevel = (settings: AnimationDegradationSettings): number => {
  if (settings.useSimpleFallbacks && settings.disableHoverEffects) return 3;
  if (settings.disableParallax && settings.reduceComplexity) return 2;
  if (settings.shortenDurations || settings.reduceComplexity) return 1;
  return 0;
};

// Hook for monitoring animation performance
export const useAnimationPerformanceMonitor = () => {
  const alerts = usePerformanceAlerts();
  const animationSettings = useAnimationSettings();
  const networkSettings = useNetworkSettings();
  
  const [performanceReport, setPerformanceReport] = useState({
    activeAnimations: 0,
    queuedAnimations: 0,
    degradationLevel: 0,
    recentAlerts: [] as PerformanceAlert[],
  });

  useEffect(() => {
    const updateReport = () => {
      setPerformanceReport({
        activeAnimations: animationQueue.getActiveCount(),
        queuedAnimations: animationQueue.getQueueLength(),
        degradationLevel: getDegradationLevel(animationSettings),
        recentAlerts: alerts.slice(-3), // Last 3 alerts
      });
    };

    const interval = setInterval(updateReport, 1000);
    updateReport(); // Initial update
    
    return () => clearInterval(interval);
  }, [alerts, animationSettings]);

  return performanceReport;
};

// Hook for network-aware asset loading
export const useNetworkAwareLoading = () => {
  const networkSettings = useNetworkSettings();
  
  const getImageSrc = useCallback((
    highQualitySrc: string,
    lowQualitySrc?: string
  ): string => {
    if (!networkSettings.loadHighQualityImages && lowQualitySrc) {
      return lowQualitySrc;
    }
    return highQualitySrc;
  }, [networkSettings.loadHighQualityImages]);

  const shouldPreload = useCallback((priority: 'low' | 'medium' | 'high'): boolean => {
    if (!networkSettings.preloadAnimations) return false;
    if (priority === 'high') return true;
    if (priority === 'medium' && networkSettings.loadHighQualityImages) return true;
    return false;
  }, [networkSettings.preloadAnimations, networkSettings.loadHighQualityImages]);

  const shouldLazyLoad = useCallback((): boolean => {
    return networkSettings.enableLazyLoading;
  }, [networkSettings.enableLazyLoading]);

  return {
    networkSettings,
    getImageSrc,
    shouldPreload,
    shouldLazyLoad,
  };
};

// Hook for accessibility-aware animations
export const useAccessibilityAwareAnimation = (
  baseVariants: Variants,
  options?: {
    respectReducedMotion?: boolean;
    provideFallback?: boolean;
  }
) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [variants, setVariants] = useState(baseVariants);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion && options?.respectReducedMotion !== false) {
      // Create reduced motion variants
      const reducedVariants: Variants = {};
      
      Object.keys(baseVariants).forEach(key => {
        const variant = baseVariants[key];
        if (typeof variant === 'object' && variant !== null) {
          reducedVariants[key] = {
            opacity: variant.opacity !== undefined ? variant.opacity : 1,
            // Remove all transforms and movements
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          };
        } else {
          reducedVariants[key] = variant;
        }
      });
      
      setVariants(reducedVariants);
    } else {
      setVariants(baseVariants);
    }
  }, [prefersReducedMotion, baseVariants, options?.respectReducedMotion]);

  return {
    variants,
    prefersReducedMotion,
    transition: prefersReducedMotion ? { duration: 0.01 } : undefined,
  };
};