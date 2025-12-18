/**
 * Performance Monitoring Hook
 * Tracks animation performance and provides adaptive configuration
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  batteryLevel?: number;
  connectionSpeed: 'slow' | 'medium' | 'fast';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isLowEndDevice: boolean;
}

export interface PerformanceSettings {
  maxAnimations: number;
  reducedComplexity: boolean;
  disableParallax: boolean;
  shortenDurations: boolean;
  simplifyTransitions: boolean;
}

export type PerformanceLevel = 'high' | 'medium' | 'low';

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    connectionSpeed: 'fast',
    deviceType: 'desktop',
    isLowEndDevice: false,
  });
  
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>('high');
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [settings, setSettings] = useState<PerformanceSettings>({
    maxAnimations: 12,
    reducedComplexity: false,
    disableParallax: false,
    shortenDurations: false,
    simplifyTransitions: false,
  });
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>();
  
  // Detect device type
  const detectDeviceType = useCallback((): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }, []);
  
  // Detect connection speed
  const detectConnectionSpeed = useCallback((): 'slow' | 'medium' | 'fast' => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
        if (effectiveType === '3g') return 'medium';
        return 'fast';
      }
    }
    return 'fast'; // Default assumption
  }, []);
  
  // Detect low-end device
  const detectLowEndDevice = useCallback((): boolean => {
    // Check for various indicators of low-end devices
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const isLowConcurrency = hardwareConcurrency <= 2;
    const isLowMemory = deviceMemory <= 2;
    
    return isLowConcurrency || isLowMemory;
  }, []);
  
  // Get battery information
  const getBatteryInfo = useCallback(async (): Promise<number | undefined> => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return battery.level;
      } catch (error) {
        console.debug('Battery API not available');
      }
    }
    return undefined;
  }, []);
  
  // Measure FPS
  const measureFPS = useCallback(() => {
    frameCountRef.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
      
      setMetrics(prev => ({
        ...prev,
        fps,
      }));
      
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }
    
    animationFrameRef.current = requestAnimationFrame(measureFPS);
  }, []);
  
  // Get memory usage
  const getMemoryUsage = useCallback((): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
    return 0;
  }, []);
  
  // Update performance level based on metrics
  const updatePerformanceLevel = useCallback((currentMetrics: PerformanceMetrics) => {
    let level: PerformanceLevel = 'high';
    
    // Determine performance level based on multiple factors
    if (currentMetrics.fps < 30 || 
        currentMetrics.memoryUsage > 0.8 || 
        currentMetrics.isLowEndDevice ||
        currentMetrics.connectionSpeed === 'slow') {
      level = 'low';
    } else if (currentMetrics.fps < 50 || 
               currentMetrics.memoryUsage > 0.6 ||
               currentMetrics.connectionSpeed === 'medium') {
      level = 'medium';
    }
    
    setPerformanceLevel(level);
    setIsLowPerformance(level === 'low');
    
    // Update settings based on performance level
    const newSettings: PerformanceSettings = {
      maxAnimations: level === 'low' ? 3 : level === 'medium' ? 6 : 12,
      reducedComplexity: level === 'low',
      disableParallax: level === 'low' || currentMetrics.deviceType === 'mobile',
      shortenDurations: level === 'low',
      simplifyTransitions: level === 'low',
    };
    
    setSettings(newSettings);
  }, []);
  
  // Initialize performance monitoring
  useEffect(() => {
    const initializeMetrics = async () => {
      const deviceType = detectDeviceType();
      const connectionSpeed = detectConnectionSpeed();
      const isLowEndDevice = detectLowEndDevice();
      const batteryLevel = await getBatteryInfo();
      
      const initialMetrics: PerformanceMetrics = {
        fps: 60,
        memoryUsage: getMemoryUsage(),
        batteryLevel,
        connectionSpeed,
        deviceType,
        isLowEndDevice,
      };
      
      setMetrics(initialMetrics);
      updatePerformanceLevel(initialMetrics);
    };
    
    initializeMetrics();
    
    // Start FPS monitoring
    animationFrameRef.current = requestAnimationFrame(measureFPS);
    
    // Monitor memory usage periodically
    const memoryInterval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        memoryUsage: getMemoryUsage(),
      }));
    }, 5000);
    
    // Monitor battery level changes
    const batteryInterval = setInterval(async () => {
      const batteryLevel = await getBatteryInfo();
      if (batteryLevel !== undefined) {
        setMetrics(prev => ({
          ...prev,
          batteryLevel,
        }));
      }
    }, 30000);
    
    // Listen for resize events to update device type
    const handleResize = () => {
      setMetrics(prev => ({
        ...prev,
        deviceType: detectDeviceType(),
      }));
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(memoryInterval);
      clearInterval(batteryInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, [measureFPS, detectDeviceType, detectConnectionSpeed, detectLowEndDevice, getBatteryInfo, getMemoryUsage, updatePerformanceLevel]);
  
  // Update performance level when metrics change
  useEffect(() => {
    updatePerformanceLevel(metrics);
  }, [metrics, updatePerformanceLevel]);
  
  // Adaptive animation configuration
  const getAdaptiveConfig = useCallback((baseConfig: any) => {
    if (isLowPerformance) {
      return {
        ...baseConfig,
        duration: Math.max(0.1, baseConfig.duration * 0.5),
        complexity: 'simple',
        effects: 'minimal',
      };
    }
    
    if (performanceLevel === 'medium') {
      return {
        ...baseConfig,
        duration: baseConfig.duration * 0.8,
        complexity: 'reduced',
        effects: 'standard',
      };
    }
    
    return {
      ...baseConfig,
      complexity: 'full',
      effects: 'enhanced',
    };
  }, [isLowPerformance, performanceLevel]);
  
  // Performance-aware animation queue
  const shouldQueueAnimation = useCallback(() => {
    return metrics.fps < 45 || metrics.memoryUsage > 0.7;
  }, [metrics.fps, metrics.memoryUsage]);
  
  // Battery-conscious settings
  const getBatteryAwareSettings = useCallback(() => {
    if (metrics.batteryLevel !== undefined && metrics.batteryLevel < 0.2) {
      return {
        ...settings,
        maxAnimations: 1,
        reducedComplexity: true,
        disableParallax: true,
        shortenDurations: true,
        simplifyTransitions: true,
      };
    }
    return settings;
  }, [metrics.batteryLevel, settings]);
  
  return {
    metrics,
    performanceLevel,
    isLowPerformance,
    settings: getBatteryAwareSettings(),
    getAdaptiveConfig,
    shouldQueueAnimation,
  };
};