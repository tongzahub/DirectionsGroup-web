/**
 * Theme-Aware Animation System
 * React hooks for entrance animations, scroll-triggered reveals, and micro-interactions
 * that adapt to current theme with performance monitoring
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useInView } from 'framer-motion';
import { useThemePerformanceMonitor } from '../lib/theme-performance-monitor';
import { 
  animationConfigs, 
  motionVariants, 
  transitionPresets,
  getAnimationConfig,
  createResponsiveTransition,
  animationQueue,
  type AnimationConfig,
  type ResponsiveAnimationConfig
} from '../lib/animation-config';
import { useTheme } from './useTheme';
// Removed unused import

// Theme-aware animation configuration
export interface ThemeAwareAnimationConfig extends AnimationConfig {
  themeAdaptive: boolean;
  lightThemeMultiplier?: number;
  darkThemeMultiplier?: number;
  themeSpecificEasing?: {
    light?: string;
    dark?: string;
  };
}

// Animation performance metrics
export interface AnimationMetrics {
  frameRate: number;
  duration: number;
  complexity: number;
  themeTransitionTime: number;
}

// Theme-aware entrance animations hook
export const useThemeAwareEntrance = (
  animationType: keyof typeof animationConfigs = 'fadeIn',
  options: {
    delay?: number;
    threshold?: number;
    triggerOnce?: boolean;
    themeAdaptive?: boolean;
  } = {}
) => {
  const { currentTheme, isTransitioning } = useTheme();
  const { getAdaptiveConfiguration } = useThemePerformanceMonitor();
  const adaptiveConfig = getAdaptiveConfiguration();
  const isLowPerformance = adaptiveConfig.shouldReduceAnimations;
  const [isVisible, setIsVisible] = useState(false);
  const [animationId] = useState(() => `entrance-${Math.random().toString(36).substr(2, 9)}`);
  const ref = useRef<HTMLElement>(null);
  
  // Get theme-adapted animation configuration
  const animationConfig = useMemo(() => {
    const baseConfig = getAnimationConfig(animationType, undefined, {
      shortenDurations: isLowPerformance,
      reduceComplexity: isLowPerformance,
    });
    
    if (options.themeAdaptive) {
      // Adjust animation based on theme
      const themeMultiplier = currentTheme === 'dark' ? 1.1 : 0.9;
      return {
        ...baseConfig,
        duration: baseConfig.duration * themeMultiplier,
        delay: (options.delay || baseConfig.delay || 0) + (isTransitioning ? 100 : 0),
      };
    }
    
    return {
      ...baseConfig,
      delay: options.delay || baseConfig.delay || 0,
    };
  }, [animationType, currentTheme, isTransitioning, isLowPerformance, options.delay, options.themeAdaptive]);
  
  // Intersection observer for scroll-triggered animations
  const isInView = useInView(ref, {
    amount: options.threshold || 0.1,
    once: options.triggerOnce !== false,
  });
  
  // Handle animation triggering with performance awareness
  useEffect(() => {
    if (isInView && !isVisible) {
      const startAnimation = () => {
        setIsVisible(true);
        // Track animation completion
        setTimeout(() => {
          animationQueue.completeAnimation(animationId);
        }, animationConfig.duration * 1000);
      };
      
      // Queue animation for performance management
      const queued = animationQueue.requestAnimation(animationId, startAnimation);
      if (!queued) {
        // Animation was queued, will start when resources are available
        console.debug(`Animation ${animationId} queued due to performance constraints`);
      }
    }
  }, [isInView, isVisible, animationId, animationConfig.duration]);
  
  // Create theme-aware motion variants
  const variants = useMemo(() => {
    const baseVariants = motionVariants[animationType as keyof typeof motionVariants] || motionVariants.fadeIn;
    
    if (options.themeAdaptive && currentTheme === 'dark') {
      // Enhance animations for dark theme
      return {
        ...baseVariants,
        visible: {
          ...baseVariants.visible,
          transition: {
            ...createResponsiveTransition(animationType, animationConfig.duration),
            ease: 'easeOut',
          },
        },
      };
    }
    
    return {
      ...baseVariants,
      visible: {
        ...baseVariants.visible,
        transition: createResponsiveTransition(animationType, animationConfig.duration),
      },
    };
  }, [animationType, currentTheme, options.themeAdaptive, animationConfig.duration]);
  
  return {
    ref,
    isVisible,
    variants,
    animationConfig,
    isInView,
  };
};

// Theme-aware scroll-triggered reveal hook
export const useThemeAwareScrollReveal = (
  elements: number = 1,
  options: {
    stagger?: number;
    threshold?: number;
    themeAdaptive?: boolean;
    direction?: 'up' | 'down' | 'left' | 'right';
  } = {}
) => {
  const { currentTheme, isTransitioning } = useTheme();
  const { getAdaptiveConfiguration } = useThemePerformanceMonitor();
  const adaptiveConfig = getAdaptiveConfiguration();
  const isLowPerformance = adaptiveConfig.shouldReduceAnimations;
  const [revealedElements, setRevealedElements] = useState<boolean[]>(
    new Array(elements).fill(false)
  );
  const refs = useRef<(HTMLElement | null)[]>(new Array(elements).fill(null));
  
  // Theme-adapted stagger timing
  const staggerDelay = useMemo(() => {
    const baseStagger = options.stagger || 0.1;
    if (isLowPerformance) return baseStagger * 0.5;
    if (currentTheme === 'dark') return baseStagger * 1.2;
    return baseStagger;
  }, [options.stagger, currentTheme, isLowPerformance]);
  
  // Create intersection observers for each element
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    refs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !revealedElements[index]) {
              // Delay based on stagger and theme transition state
              const delay = index * staggerDelay * 1000 + (isTransitioning ? 200 : 0);
              
              setTimeout(() => {
                setRevealedElements(prev => {
                  const newState = [...prev];
                  newState[index] = true;
                  return newState;
                });
              }, delay);
            }
          },
          {
            threshold: options.threshold || 0.2,
            rootMargin: '0px 0px -50px 0px',
          }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [elements, staggerDelay, isTransitioning, options.threshold, revealedElements]);
  
  // Create theme-aware variants based on direction
  const createDirectionalVariants = useCallback((index: number) => {
    const direction = options.direction || 'up';
    const isRevealed = revealedElements[index];
    
    const directionMap = {
      up: { y: 30, x: 0 },
      down: { y: -30, x: 0 },
      left: { y: 0, x: 30 },
      right: { y: 0, x: -30 },
    };
    
    const offset = directionMap[direction];
    
    return {
      hidden: {
        opacity: 0,
        ...offset,
        scale: options.themeAdaptive && currentTheme === 'dark' ? 0.95 : 1,
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          duration: isLowPerformance ? 0.3 : 0.6,
          ease: currentTheme === 'dark' ? 'easeOut' : 'easeInOut',
          delay: index * staggerDelay,
        },
      },
    };
  }, [options.direction, options.themeAdaptive, currentTheme, revealedElements, staggerDelay, isLowPerformance]);
  
  return {
    refs,
    revealedElements,
    createDirectionalVariants,
    staggerDelay,
  };
};

// Theme-aware micro-interactions hook
export const useThemeAwareMicroInteractions = (
  interactionType: 'button' | 'card' | 'input' | 'custom' = 'button',
  options: {
    hoverScale?: number;
    tapScale?: number;
    themeAdaptive?: boolean;
    customVariants?: any;
  } = {}
) => {
  const { currentTheme } = useTheme();
  const { getAdaptiveConfiguration } = useThemePerformanceMonitor();
  const adaptiveConfig = getAdaptiveConfiguration();
  const isLowPerformance = adaptiveConfig.shouldReduceAnimations;
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Theme-adapted interaction variants
  const variants = useMemo(() => {
    if (options.customVariants) {
      return options.customVariants;
    }
    
    const baseVariants = motionVariants[`${interactionType}Hover` as keyof typeof motionVariants] || motionVariants.buttonHover;
    
    if (isLowPerformance) {
      return {
        rest: { scale: 1 },
        hover: { scale: 1.01 },
        tap: { scale: 0.99 },
      };
    }
    
    if (options.themeAdaptive) {
      const themeMultiplier = currentTheme === 'dark' ? 1.1 : 1.0;
      
      return {
        rest: { 
          scale: 1,
          y: 0,
          boxShadow: currentTheme === 'dark' 
            ? '0 2px 8px rgba(0, 0, 0, 0.4)'
            : '0 2px 8px rgba(139, 115, 85, 0.08)',
        },
        hover: { 
          scale: (options.hoverScale || 1.02) * themeMultiplier,
          y: -2 * themeMultiplier,
          boxShadow: currentTheme === 'dark'
            ? '0 8px 32px rgba(196, 168, 130, 0.2)'
            : '0 8px 32px rgba(139, 115, 85, 0.16)',
        },
        tap: { 
          scale: options.tapScale || 0.98,
          y: 0,
        },
        focus: {
          scale: 1,
          boxShadow: currentTheme === 'dark'
            ? '0 0 0 4px rgba(196, 168, 130, 0.3)'
            : '0 0 0 4px rgba(139, 115, 85, 0.2)',
        },
      };
    }
    
    return baseVariants;
  }, [interactionType, currentTheme, isLowPerformance, options]);
  
  // Interaction handlers
  const handlers = {
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    onTapStart: () => setIsTapped(true),
    onTap: () => setIsTapped(false),
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };
  
  // Current animation state
  const currentState = isTapped ? 'tap' : isFocused ? 'focus' : isHovered ? 'hover' : 'rest';
  
  return {
    variants,
    handlers,
    currentState,
    isHovered,
    isTapped,
    isFocused,
  };
};

// Theme transition animation hook
export const useThemeTransitionAnimation = () => {
  const { currentTheme, isTransitioning } = useTheme();
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [transitionMetrics, setTransitionMetrics] = useState<AnimationMetrics | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Track theme transition performance
  useEffect(() => {
    if (isTransitioning) {
      startTimeRef.current = performance.now();
      setTransitionProgress(0);
      
      const animationFrame = () => {
        const elapsed = performance.now() - startTimeRef.current;
        const progress = Math.min(elapsed / 300, 1); // 300ms transition
        
        setTransitionProgress(progress);
        
        if (progress < 1) {
          requestAnimationFrame(animationFrame);
        } else {
          // Calculate final metrics
          const totalTime = performance.now() - startTimeRef.current;
          setTransitionMetrics({
            frameRate: 60, // Estimated
            duration: totalTime,
            complexity: 1,
            themeTransitionTime: totalTime,
          });
        }
      };
      
      requestAnimationFrame(animationFrame);
    }
  }, [isTransitioning]);
  
  // Theme transition variants for components
  const transitionVariants = {
    light: {
      backgroundColor: 'var(--color-surface-primary)',
      color: 'var(--color-text-primary)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    dark: {
      backgroundColor: 'var(--color-surface-primary)',
      color: 'var(--color-text-primary)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };
  
  return {
    transitionProgress,
    transitionMetrics,
    transitionVariants,
    currentTheme,
    isTransitioning,
  };
};

// Performance monitoring for theme-aware animations
export const useAnimationPerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<AnimationMetrics>({
    frameRate: 60,
    duration: 0,
    complexity: 1,
    themeTransitionTime: 0,
  });
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  
  // Monitor animation performance
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;
    
    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setMetrics(prev => ({
          ...prev,
          frameRate: fps,
        }));
        
        // Adjust performance level based on FPS
        if (fps < 30) {
          setPerformanceLevel('low');
        } else if (fps < 50) {
          setPerformanceLevel('medium');
        } else {
          setPerformanceLevel('high');
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };
    
    animationId = requestAnimationFrame(measurePerformance);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  
  return {
    metrics,
    performanceLevel,
    isLowPerformance: performanceLevel === 'low',
  };
};

// Utility hook for theme-aware animation configuration
export const useThemeAnimationConfig = (
  animationType: keyof typeof animationConfigs,
  customConfig?: Partial<ThemeAwareAnimationConfig>
) => {
  const { currentTheme } = useTheme();
  const { getAdaptiveConfiguration } = useThemePerformanceMonitor();
  const adaptiveConfig = getAdaptiveConfiguration();
  const isLowPerformance = adaptiveConfig.shouldReduceAnimations;
  
  return useMemo(() => {
    const baseConfig = getAnimationConfig(animationType, undefined, {
      shortenDurations: isLowPerformance,
      reduceComplexity: isLowPerformance,
    });
    
    if (customConfig?.themeAdaptive) {
      const multiplier = currentTheme === 'dark' 
        ? (customConfig.darkThemeMultiplier || 1.1)
        : (customConfig.lightThemeMultiplier || 0.9);
      
      return {
        ...baseConfig,
        ...customConfig,
        duration: baseConfig.duration * multiplier,
        easing: customConfig.themeSpecificEasing?.[currentTheme] || baseConfig.easing,
      };
    }
    
    return { ...baseConfig, ...customConfig };
  }, [animationType, currentTheme, isLowPerformance, customConfig]);
};