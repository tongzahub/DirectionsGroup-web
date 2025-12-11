/**
 * Enhanced Scroll Trigger Hook
 * Advanced intersection observer system for scroll-triggered animations
 */

import { useEffect, useRef, useState, RefObject } from 'react';
import { usePerformanceMetrics } from '@/lib/performance-monitor';

export interface ScrollTriggerConfig {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  disabled?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onProgress?: (progress: number) => void;
}

export interface ScrollTriggerReturn {
  ref: RefObject<HTMLDivElement | null>;
  isInView: boolean;
  hasTriggered: boolean;
  progress: number;
  isDisabled: boolean;
}

export const useScrollTrigger = (config: ScrollTriggerConfig = {}): ScrollTriggerReturn => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -10% 0px',
    triggerOnce = false,
    delay = 0,
    disabled = false,
    onEnter,
    onLeave,
    onProgress,
  } = config;

  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [progress, setProgress] = useState(0);
  const performanceMetrics = usePerformanceMetrics();
  
  // Check if animations should be disabled
  const isDisabled = disabled || 
    performanceMetrics.isLowEndDevice || 
    performanceMetrics.fps < 30 ||
    performanceMetrics.batteryLevel < 0.15;

  useEffect(() => {
    if (isDisabled || !ref.current) return;

    const element = ref.current;
    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const inView = entry.isIntersecting;
          const intersectionRatio = entry.intersectionRatio;
          
          // Calculate progress based on intersection ratio
          const currentProgress = Array.isArray(threshold) 
            ? intersectionRatio 
            : Math.min(intersectionRatio / (threshold as number), 1);
          
          setProgress(currentProgress);
          onProgress?.(currentProgress);

          if (inView && !isInView) {
            if (delay > 0) {
              timeoutId = setTimeout(() => {
                setIsInView(true);
                setHasTriggered(true);
                onEnter?.();
              }, delay);
            } else {
              setIsInView(true);
              setHasTriggered(true);
              onEnter?.();
            }
          } else if (!inView && isInView && !triggerOnce) {
            if (timeoutId) clearTimeout(timeoutId);
            setIsInView(false);
            onLeave?.();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.unobserve(element);
    };
  }, [isDisabled, threshold, rootMargin, triggerOnce, delay, isInView, onEnter, onLeave, onProgress]);

  return {
    ref,
    isInView: isDisabled ? true : isInView,
    hasTriggered: isDisabled ? true : hasTriggered,
    progress: isDisabled ? 1 : progress,
    isDisabled,
  };
};

// Hook for multiple scroll triggers
export const useMultiScrollTrigger = (
  elements: Array<{ id: string; config?: ScrollTriggerConfig }>,
  globalConfig: ScrollTriggerConfig = {}
) => {
  const [triggers, setTriggers] = useState<Record<string, ScrollTriggerReturn>>({});
  
  useEffect(() => {
    const newTriggers: Record<string, ScrollTriggerReturn> = {};
    
    elements.forEach((element) => {
      const mergedConfig = { ...globalConfig, ...element.config };
      // Note: This is a simplified version. In practice, you'd need to manage refs differently
      newTriggers[element.id] = useScrollTrigger(mergedConfig);
    });
    
    setTriggers(newTriggers);
  }, [elements, globalConfig]);

  return triggers;
};

// Hook for scroll-based progress tracking
export const useScrollProgress = (
  ref: RefObject<HTMLElement>,
  config: {
    axis?: 'x' | 'y';
    offset?: [string, string];
    disabled?: boolean;
  } = {}
) => {
  const { axis = 'y', offset = ['start end', 'end start'], disabled = false } = config;
  const [progress, setProgress] = useState(0);
  const performanceMetrics = usePerformanceMetrics();
  
  const isDisabled = disabled || 
    performanceMetrics.isLowEndDevice || 
    performanceMetrics.fps < 30;

  useEffect(() => {
    if (isDisabled || !ref.current) return;

    const element = ref.current;
    
    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      
      let scrollProgress = 0;
      
      if (axis === 'y') {
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const startOffset = windowHeight;
        const endOffset = -elementHeight;
        
        scrollProgress = Math.max(0, Math.min(1, 
          (startOffset - elementTop) / (startOffset - endOffset)
        ));
      } else {
        const elementLeft = rect.left;
        const elementWidth = rect.width;
        const startOffset = windowWidth;
        const endOffset = -elementWidth;
        
        scrollProgress = Math.max(0, Math.min(1, 
          (startOffset - elementLeft) / (startOffset - endOffset)
        ));
      }
      
      setProgress(scrollProgress);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', throttledScroll, { passive: true });
    
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', throttledScroll);
    };
  }, [isDisabled, axis, ref]);

  return {
    progress: isDisabled ? 1 : progress,
    isDisabled,
  };
};

// Utility function to create staggered scroll triggers
export const createStaggeredTriggers = (
  count: number,
  baseDelay: number = 100,
  staggerDelay: number = 50
): ScrollTriggerConfig[] => {
  return Array.from({ length: count }, (_, index) => ({
    delay: baseDelay + (index * staggerDelay),
    threshold: 0.1,
    triggerOnce: true,
  }));
};

// Performance-aware scroll trigger presets
export const scrollTriggerPresets: Record<string, ScrollTriggerConfig> = {
  // Fast, minimal animations for low-end devices
  minimal: {
    threshold: 0.3,
    rootMargin: '0px',
    triggerOnce: true,
    delay: 0,
  },
  
  // Standard animations for most devices
  standard: {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px',
    triggerOnce: true,
    delay: 100,
  },
  
  // Rich animations for high-end devices
  enhanced: {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    rootMargin: '0px 0px -5% 0px',
    triggerOnce: false,
    delay: 150,
  },
  
  // Staggered animations for lists
  staggered: {
    threshold: 0.2,
    rootMargin: '0px 0px -15% 0px',
    triggerOnce: true,
    delay: 0, // Will be overridden by stagger
  },
} as const;

// Hook to get appropriate preset based on device performance
export const useAdaptiveScrollTrigger = (
  baseConfig: ScrollTriggerConfig = {}
): ScrollTriggerReturn => {
  const performanceMetrics = usePerformanceMetrics();
  
  // Choose preset based on performance
  let preset = scrollTriggerPresets.standard;
  
  if (performanceMetrics.isLowEndDevice || performanceMetrics.fps < 30) {
    preset = scrollTriggerPresets.minimal;
  } else if (performanceMetrics.fps > 55 && !performanceMetrics.isLowEndDevice) {
    preset = scrollTriggerPresets.enhanced;
  }
  
  const adaptedConfig = { ...preset, ...baseConfig };
  
  return useScrollTrigger(adaptedConfig);
};