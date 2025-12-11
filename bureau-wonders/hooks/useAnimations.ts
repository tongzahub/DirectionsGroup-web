/**
 * Animation Hooks
 * React hooks for consistent animation management
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useInView } from 'framer-motion';
import { 
  getAnimationConfig, 
  getDeviceType, 
  getPrefersReducedMotion,
  performanceSettings 
} from '@/lib/animation-config';
import { useMobileAnimationConfig, useBatteryConsciousAnimation } from '@/lib/mobile-animation-config';
import { useDeviceType } from '@/lib/responsive';

// Hook for entrance animations with mobile optimization
export const useEntranceAnimation = (
  animationType: 'fadeIn' | 'slideUp' | 'scaleIn' = 'fadeIn',
  delay: number = 0
) => {
  const [isVisible, setIsVisible] = useState(false);
  const deviceType = useDeviceType();
  const { config: mobileConfig, shouldAnimate } = useMobileAnimationConfig();
  const baseConfig = getAnimationConfig(animationType);
  
  // Use mobile-optimized config for mobile devices
  const config = deviceType === 'mobile' ? 
    useBatteryConsciousAnimation(baseConfig) : 
    baseConfig;
  
  useEffect(() => {
    if (!shouldAnimate) {
      setIsVisible(true);
      return;
    }
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [delay, shouldAnimate]);
  
  return {
    isVisible,
    config,
    shouldAnimate,
    variants: {
      hidden: { 
        opacity: 0, 
        y: animationType === 'slideUp' ? (deviceType === 'mobile' ? 20 : 30) : 0, 
        scale: animationType === 'scaleIn' ? 0.9 : 1 
      },
      visible: { opacity: 1, y: 0, scale: 1 },
    },
    transition: {
      duration: config.duration,
      ease: config.easing,
      delay: config.delay || 0,
    },
  };
};

// Hook for scroll-triggered animations with mobile optimization
export const useScrollReveal = (
  threshold: number = 0.2,
  triggerOnce: boolean = true
) => {
  const ref = useRef<HTMLElement>(null);
  const deviceType = useDeviceType();
  const { shouldAnimate } = useMobileAnimationConfig();
  
  // Adjust threshold for mobile devices
  const mobileThreshold = deviceType === 'mobile' ? Math.max(threshold, 0.1) : threshold;
  
  const isInView = useInView(ref, { 
    once: triggerOnce,
    margin: `-${(1 - mobileThreshold) * 100}% 0px` as any,
  });
  
  const baseConfig = getAnimationConfig('scrollReveal');
  const config = deviceType === 'mobile' ? 
    useBatteryConsciousAnimation(baseConfig) : 
    baseConfig;
  
  return {
    ref,
    isInView: shouldAnimate ? isInView : true,
    config,
    shouldAnimate,
    variants: {
      hidden: { 
        opacity: 0, 
        y: deviceType === 'mobile' ? 20 : 30 
      },
      visible: { opacity: 1, y: 0 },
    },
    transition: {
      duration: config.duration,
      ease: config.easing,
    },
  };
};

// Hook for staggered animations with mobile optimization
export const useStaggerAnimation = (
  itemCount: number,
  animationType: 'staggerReveal' = 'staggerReveal'
) => {
  const deviceType = useDeviceType();
  const { config: mobileConfig, shouldAnimate } = useMobileAnimationConfig();
  const baseConfig = getAnimationConfig(animationType);
  
  const config = deviceType === 'mobile' ? 
    useBatteryConsciousAnimation(baseConfig) : 
    baseConfig;
  
  // Limit concurrent animations on mobile
  const maxConcurrent = deviceType === 'mobile' ? mobileConfig.maxConcurrent : itemCount;
  const staggerDelay = deviceType === 'mobile' ? 
    Math.max(config.staggerChildren || 0.1, 0.05) : 
    config.stagger || 0.1;
  
  return {
    config,
    shouldAnimate,
    maxConcurrent,
    containerVariants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: shouldAnimate ? {
          staggerChildren: staggerDelay,
          delayChildren: config.delay || 0,
        } : { duration: 0 },
      },
    },
    itemVariants: {
      hidden: { 
        opacity: 0, 
        y: deviceType === 'mobile' ? 15 : 20 
      },
      visible: { opacity: 1, y: 0 },
    },
    transition: {
      duration: config.duration,
      ease: config.easing,
    },
  };
};

// Hook for hover animations
export const useHoverAnimation = (
  animationType: 'buttonHover' | 'cardHover' = 'buttonHover'
) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = getAnimationConfig(animationType);
  
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };
  
  const variants = animationType === 'cardHover' 
    ? {
        rest: { scale: 1, y: 0, rotateX: 0 },
        hover: { scale: 1.02, y: -8, rotateX: 2 },
      }
    : {
        rest: { scale: 1, y: 0 },
        hover: { scale: 1.02, y: -2 },
        tap: { scale: 0.98 },
      };
  
  return {
    isHovered,
    hoverProps,
    variants,
    transition: {
      duration: config.duration,
      ease: config.easing,
    },
  };
};

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    isLowEnd: false,
    batteryLevel: 1,
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const animationFrame = useRef<number | null>(null);
  
  const measureFPS = useCallback(() => {
    const now = performance.now();
    frameCount.current++;
    
    if (now - lastTime.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
      
      setPerformanceMetrics(prev => ({
        ...prev,
        fps,
        isLowEnd: fps < performanceSettings.targetFPS * 0.8,
      }));
      
      frameCount.current = 0;
      lastTime.current = now;
    }
    
    animationFrame.current = requestAnimationFrame(measureFPS);
  }, []);
  
  useEffect(() => {
    // Start FPS monitoring
    animationFrame.current = requestAnimationFrame(measureFPS);
    
    // Monitor memory usage if available
    if ('memory' in performance) {
      const updateMemory = () => {
        const memory = (performance as any).memory;
        setPerformanceMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit,
        }));
      };
      
      const memoryInterval = setInterval(updateMemory, 5000);
      return () => {
        clearInterval(memoryInterval);
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
        }
      };
    }
    
    // Monitor battery if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setPerformanceMetrics(prev => ({
            ...prev,
            batteryLevel: battery.level,
          }));
        };
        
        battery.addEventListener('levelchange', updateBattery);
        updateBattery();
      });
    }
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [measureFPS]);
  
  return performanceMetrics;
};

// Hook for adaptive animations based on performance
export const useAdaptiveAnimation = (
  baseAnimationType: keyof typeof import('@/lib/animation-config').animationConfigs
) => {
  const performanceMetrics = usePerformanceMonitor();
  const prefersReducedMotion = getPrefersReducedMotion();
  
  const getAdaptedConfig = useCallback(() => {
    if (prefersReducedMotion) {
      return {
        duration: 0.01,
        easing: 'linear',
        disabled: true,
      };
    }
    
    const config = getAnimationConfig(baseAnimationType);
    
    // Adapt based on performance
    if (performanceMetrics.isLowEnd || performanceMetrics.batteryLevel < 0.2) {
      return {
        ...config,
        duration: config.duration * 0.5, // Faster animations
        disabled: performanceMetrics.fps < 30,
      };
    }
    
    return { ...config, disabled: false };
  }, [baseAnimationType, performanceMetrics, prefersReducedMotion]);
  
  return getAdaptedConfig();
};

// Hook for intersection observer with performance optimization
export const useOptimizedIntersection = (
  threshold: number = 0.1,
  rootMargin: string = '0px'
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, hasIntersected]);
  
  return {
    ref,
    isIntersecting,
    hasIntersected,
  };
};

// Hook for managing animation queue to prevent performance issues
export const useAnimationQueue = (maxConcurrent: number = 3) => {
  const [activeAnimations, setActiveAnimations] = useState<Set<string>>(new Set());
  const queueRef = useRef<Array<{ id: string; callback: () => void }>>([]);
  
  const addToQueue = useCallback((id: string, callback: () => void) => {
    if (activeAnimations.size < maxConcurrent) {
      setActiveAnimations(prev => new Set(prev).add(id));
      callback();
    } else {
      queueRef.current.push({ id, callback });
    }
  }, [activeAnimations.size, maxConcurrent]);
  
  const removeFromQueue = useCallback((id: string) => {
    setActiveAnimations(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      
      // Process next in queue
      if (queueRef.current.length > 0 && newSet.size < maxConcurrent) {
        const next = queueRef.current.shift();
        if (next) {
          newSet.add(next.id);
          next.callback();
        }
      }
      
      return newSet;
    });
  }, [maxConcurrent]);
  
  return {
    addToQueue,
    removeFromQueue,
    activeCount: activeAnimations.size,
    canAnimate: activeAnimations.size < maxConcurrent,
  };
};