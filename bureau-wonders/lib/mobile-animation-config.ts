/**
 * Mobile Animation Configuration
 * Optimized animation settings for mobile devices and battery conservation
 */

import { useEffect, useState, useCallback } from 'react';
import { useDeviceType } from '@/lib/responsive';

// Battery status interface
interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: 'chargingchange' | 'chargingtimechange' | 'dischargingtimechange' | 'levelchange', listener: EventListener): void;
}

declare global {
  interface Navigator {
    getBattery?(): Promise<BatteryManager>;
  }
}

// Performance metrics interface
export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  batteryLevel: number;
  isCharging: boolean;
  isLowPowerMode: boolean;
  connectionType: string;
  devicePixelRatio: number;
}

// Animation complexity levels
export type AnimationComplexity = 'minimal' | 'reduced' | 'standard' | 'enhanced';

// Mobile-specific animation configurations
export const mobileAnimationConfigs = {
  minimal: {
    duration: 0.15,
    easing: 'linear',
    stagger: 0.05,
    parallax: false,
    blur: false,
    shadows: false,
    transforms: ['translateY', 'opacity'],
    maxConcurrent: 1,
  },
  reduced: {
    duration: 0.2,
    easing: 'ease-out',
    stagger: 0.08,
    parallax: false,
    blur: false,
    shadows: true,
    transforms: ['translateY', 'translateX', 'opacity', 'scale'],
    maxConcurrent: 2,
  },
  standard: {
    duration: 0.3,
    easing: 'ease-out',
    stagger: 0.1,
    parallax: true,
    blur: false,
    shadows: true,
    transforms: ['translateY', 'translateX', 'opacity', 'scale', 'rotate'],
    maxConcurrent: 3,
  },
  enhanced: {
    duration: 0.4,
    easing: [0.25, 0.46, 0.45, 0.94],
    stagger: 0.12,
    parallax: true,
    blur: true,
    shadows: true,
    transforms: ['translateY', 'translateX', 'opacity', 'scale', 'rotate', 'skew'],
    maxConcurrent: 5,
  },
} as const;

// Battery-conscious animation settings
export const batteryOptimizedConfigs = {
  critical: mobileAnimationConfigs.minimal, // < 10%
  low: mobileAnimationConfigs.reduced,      // 10-25%
  medium: mobileAnimationConfigs.standard,  // 25-50%
  high: mobileAnimationConfigs.enhanced,    // > 50%
} as const;

// Connection-aware animation settings
export const connectionOptimizedConfigs = {
  'slow-2g': mobileAnimationConfigs.minimal,
  '2g': mobileAnimationConfigs.minimal,
  '3g': mobileAnimationConfigs.reduced,
  '4g': mobileAnimationConfigs.standard,
  '5g': mobileAnimationConfigs.enhanced,
  wifi: mobileAnimationConfigs.enhanced,
  ethernet: mobileAnimationConfigs.enhanced,
  unknown: mobileAnimationConfigs.reduced,
} as const;

// Hook for performance monitoring
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    batteryLevel: 1,
    isCharging: true,
    isLowPowerMode: false,
    connectionType: 'unknown',
    devicePixelRatio: 1,
  });

  const deviceType = useDeviceType();

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    // FPS monitoring
    const measureFPS = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = now;
      }

      animationFrame = requestAnimationFrame(measureFPS);
    };

    // Memory monitoring
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        setMetrics(prev => ({ ...prev, memoryUsage: usage }));
      }
    };

    // Battery monitoring
    const updateBatteryStatus = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery!();
          
          const updateBattery = () => {
            setMetrics(prev => ({
              ...prev,
              batteryLevel: battery.level,
              isCharging: battery.charging,
              isLowPowerMode: battery.level < 0.2 && !battery.charging,
            }));
          };

          updateBattery();
          battery.addEventListener('levelchange', updateBattery);
          battery.addEventListener('chargingchange', updateBattery);

          return () => {
            battery.removeEventListener('levelchange', updateBattery);
            battery.removeEventListener('chargingchange', updateBattery);
          };
        } catch (error) {
          // Battery API not available
        }
      }
    };

    // Connection monitoring
    const updateConnection = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        setMetrics(prev => ({
          ...prev,
          connectionType: connection.effectiveType || connection.type || 'unknown',
        }));
      }
    };

    // Device pixel ratio
    setMetrics(prev => ({
      ...prev,
      devicePixelRatio: window.devicePixelRatio || 1,
    }));

    // Start monitoring
    if (deviceType === 'mobile') {
      animationFrame = requestAnimationFrame(measureFPS);
      updateMemoryUsage();
      updateBatteryStatus();
      updateConnection();

      const memoryInterval = setInterval(updateMemoryUsage, 5000);
      const connectionHandler = () => updateConnection();
      
      if ((navigator as any).connection) {
        (navigator as any).connection.addEventListener('change', connectionHandler);
      }

      return () => {
        cancelAnimationFrame(animationFrame);
        clearInterval(memoryInterval);
        if ((navigator as any).connection) {
          (navigator as any).connection.removeEventListener('change', connectionHandler);
        }
      };
    }
  }, [deviceType]);

  return metrics;
};

// Hook for adaptive animation configuration
export const useMobileAnimationConfig = () => {
  const metrics = usePerformanceMetrics();
  const deviceType = useDeviceType();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const getOptimalConfig = useCallback((): typeof mobileAnimationConfigs.minimal => {
    // Respect user preferences first
    if (prefersReducedMotion) {
      return {
        ...mobileAnimationConfigs.minimal,
        duration: 0.01,
        stagger: 0,
      };
    }

    // Desktop gets enhanced animations
    if (deviceType !== 'mobile') {
      return mobileAnimationConfigs.enhanced;
    }

    // Mobile optimization based on performance metrics
    let config = mobileAnimationConfigs.standard;

    // Battery-based optimization
    if (metrics.batteryLevel < 0.1) {
      config = batteryOptimizedConfigs.critical;
    } else if (metrics.batteryLevel < 0.25) {
      config = batteryOptimizedConfigs.low;
    } else if (metrics.batteryLevel < 0.5) {
      config = batteryOptimizedConfigs.medium;
    } else {
      config = batteryOptimizedConfigs.high;
    }

    // Connection-based optimization
    const connectionConfig = connectionOptimizedConfigs[metrics.connectionType as keyof typeof connectionOptimizedConfigs] || mobileAnimationConfigs.reduced;
    
    // Use the more conservative config
    if (connectionConfig.duration < config.duration) {
      config = connectionConfig;
    }

    // FPS-based optimization
    if (metrics.fps < 30) {
      config = mobileAnimationConfigs.minimal;
    } else if (metrics.fps < 45) {
      config = mobileAnimationConfigs.reduced;
    }

    // Memory-based optimization
    if (metrics.memoryUsage > 0.8) {
      config = mobileAnimationConfigs.minimal;
    } else if (metrics.memoryUsage > 0.6) {
      config = mobileAnimationConfigs.reduced;
    }

    // Low power mode override
    if (metrics.isLowPowerMode) {
      config = mobileAnimationConfigs.minimal;
    }

    return config;
  }, [metrics, deviceType, prefersReducedMotion]);

  return {
    config: getOptimalConfig(),
    metrics,
    shouldAnimate: !prefersReducedMotion && metrics.fps > 20,
    complexity: getComplexityLevel(getOptimalConfig()),
  };
};

// Helper function to determine complexity level
const getComplexityLevel = (config: typeof mobileAnimationConfigs.minimal): AnimationComplexity => {
  if (config.duration <= 0.15) return 'minimal';
  if (config.duration <= 0.2) return 'reduced';
  if (config.duration <= 0.3) return 'standard';
  return 'enhanced';
};

// Hook for battery-conscious animations
export const useBatteryConsciousAnimation = (baseConfig: any) => {
  const { config, shouldAnimate, complexity } = useMobileAnimationConfig();
  
  return {
    ...baseConfig,
    duration: shouldAnimate ? config.duration : 0.01,
    ease: config.easing,
    staggerChildren: config.stagger,
    disabled: !shouldAnimate,
    complexity,
    allowParallax: config.parallax,
    allowBlur: config.blur,
    allowShadows: config.shadows,
    maxConcurrent: config.maxConcurrent,
  };
};

// Mobile-specific loading states
export const mobileLoadingStates = {
  minimal: {
    skeleton: {
      animation: 'pulse',
      duration: 1.5,
      opacity: [0.5, 0.8, 0.5],
    },
    spinner: {
      size: 'sm',
      strokeWidth: 2,
      speed: 1,
    },
  },
  standard: {
    skeleton: {
      animation: 'shimmer',
      duration: 1.2,
      gradient: true,
    },
    spinner: {
      size: 'md',
      strokeWidth: 3,
      speed: 0.8,
    },
  },
  enhanced: {
    skeleton: {
      animation: 'wave',
      duration: 1,
      gradient: true,
      blur: true,
    },
    spinner: {
      size: 'lg',
      strokeWidth: 4,
      speed: 0.6,
      glow: true,
    },
  },
} as const;

// Mobile-specific transition presets
export const mobileTransitions = {
  minimal: {
    page: { duration: 0.2, ease: 'linear' },
    modal: { duration: 0.15, ease: 'ease-out' },
    drawer: { duration: 0.2, ease: 'ease-out' },
  },
  reduced: {
    page: { duration: 0.25, ease: 'ease-out' },
    modal: { duration: 0.2, ease: 'ease-out' },
    drawer: { duration: 0.25, ease: 'ease-out' },
  },
  standard: {
    page: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    modal: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
    drawer: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  enhanced: {
    page: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    modal: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
    drawer: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
} as const;