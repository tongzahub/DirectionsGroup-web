/**
 * Parallax Hook
 * Performance-optimized parallax scrolling with adaptive settings
 */

import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { RefObject, useEffect, useState } from 'react';
import { usePerformanceMetrics } from '@/lib/performance-monitor';

export interface ParallaxConfig {
  speed: number;
  offset?: [string, string];
  range?: [number, number];
  disabled?: boolean;
  intensity?: number;
}

export interface ParallaxReturn {
  y: MotionValue<number>;
  isDisabled: boolean;
  shouldAnimate: boolean;
}

export const useParallax = (
  ref: RefObject<HTMLElement>,
  config: ParallaxConfig
): ParallaxReturn => {
  const [isClient, setIsClient] = useState(false);
  const performanceMetrics = usePerformanceMetrics();
  
  const {
    speed = 0.5,
    offset = ["start end", "end start"],
    range,
    disabled = false,
    intensity = 1,
  } = config;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if parallax should be disabled based on performance
  const isDisabled = disabled || 
    performanceMetrics.isLowEndDevice || 
    performanceMetrics.fps < 45 ||
    performanceMetrics.batteryLevel < 0.2 ||
    !isClient;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  // Calculate transform range
  const adjustedSpeed = speed * intensity;
  const transformRange = range || [100 * adjustedSpeed, -100 * adjustedSpeed];
  
  const y = useTransform(scrollYProgress, [0, 1], transformRange);

  return {
    y: isDisabled ? useTransform(() => 0) : y,
    isDisabled,
    shouldAnimate: !isDisabled,
  };
};

// Hook for multiple parallax elements
export const useMultiParallax = (
  ref: RefObject<HTMLElement>,
  elements: Array<{ id: string; speed: number; range?: [number, number] }>,
  globalConfig: Omit<ParallaxConfig, 'speed' | 'range'> = {}
) => {
  const [isClient, setIsClient] = useState(false);
  const performanceMetrics = usePerformanceMetrics();
  
  const {
    offset = ["start end", "end start"],
    disabled = false,
    intensity = 1,
  } = globalConfig;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if parallax should be disabled
  const isDisabled = disabled || 
    performanceMetrics.isLowEndDevice || 
    performanceMetrics.fps < 45 ||
    performanceMetrics.batteryLevel < 0.2 ||
    !isClient;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  const transforms = elements.reduce((acc, element) => {
    const adjustedSpeed = element.speed * intensity;
    const transformRange = element.range || [50 * adjustedSpeed, -50 * adjustedSpeed];
    
    acc[element.id] = isDisabled 
      ? useTransform(() => 0)
      : useTransform(scrollYProgress, [0, 1], transformRange);
    
    return acc;
  }, {} as Record<string, MotionValue<number>>);

  return {
    transforms,
    isDisabled,
    shouldAnimate: !isDisabled,
  };
};

// Hook for adaptive parallax based on device performance
export const useAdaptiveParallax = (
  ref: RefObject<HTMLElement>,
  baseConfig: ParallaxConfig
) => {
  const performanceMetrics = usePerformanceMetrics();
  
  // Adapt config based on performance
  const adaptedConfig: ParallaxConfig = {
    ...baseConfig,
    intensity: performanceMetrics.isLowEndDevice 
      ? (baseConfig.intensity || 1) * 0.3 
      : baseConfig.intensity,
    disabled: baseConfig.disabled || 
      performanceMetrics.fps < 30 ||
      performanceMetrics.batteryLevel < 0.15,
  };

  return useParallax(ref, adaptedConfig);
};

// Utility function to create parallax variants for Framer Motion
export const createParallaxVariants = (
  speed: number,
  intensity: number = 1
) => {
  const adjustedSpeed = speed * intensity;
  
  return {
    initial: { y: 0 },
    animate: { y: 0 },
    // These will be overridden by the motion value from useParallax
  };
};

// Performance monitoring for parallax animations
export const useParallaxPerformance = () => {
  const performanceMetrics = usePerformanceMetrics();
  
  const getRecommendedSettings = () => {
    const { fps, isLowEndDevice, batteryLevel, memoryUsage } = performanceMetrics;
    
    if (isLowEndDevice || fps < 30 || batteryLevel < 0.2) {
      return {
        maxParallaxElements: 2,
        intensity: 0.3,
        disableParallax: true,
        useSimpleTransforms: true,
      };
    }
    
    if (fps < 45 || memoryUsage > 0.8) {
      return {
        maxParallaxElements: 4,
        intensity: 0.6,
        disableParallax: false,
        useSimpleTransforms: true,
      };
    }
    
    return {
      maxParallaxElements: 8,
      intensity: 1,
      disableParallax: false,
      useSimpleTransforms: false,
    };
  };

  return {
    metrics: performanceMetrics,
    recommendations: getRecommendedSettings(),
  };
};