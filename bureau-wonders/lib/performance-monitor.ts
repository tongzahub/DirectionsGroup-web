/**
 * Performance Monitoring Utilities
 * Track animation frame rates, memory usage, and loading times
 */

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadingTime: number;
  animationCount: number;
  isLowEndDevice: boolean;
  batteryLevel: number;
  networkSpeed: 'slow' | 'fast' | 'unknown';
}

export interface PerformanceThresholds {
  minFPS: number;
  maxMemoryUsage: number;
  maxLoadingTime: number;
  maxConcurrentAnimations: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fps: 60,
    memoryUsage: 0,
    loadingTime: 0,
    animationCount: 0,
    isLowEndDevice: false,
    batteryLevel: 1,
    networkSpeed: 'unknown',
  };

  private thresholds: PerformanceThresholds = {
    minFPS: 45,
    maxMemoryUsage: 0.8,
    maxLoadingTime: 3000,
    maxConcurrentAnimations: 6,
  };

  private frameCount = 0;
  private lastFrameTime = typeof performance !== 'undefined' ? performance.now() : 0;
  private animationFrameId: number | null = null;
  private observers: Array<(metrics: PerformanceMetrics) => void> = [];
  private isMonitoring = false;

  constructor() {
    // Only initialize browser-specific features in browser environment
    if (typeof window !== 'undefined') {
      this.detectDeviceCapabilities();
      this.monitorNetworkSpeed();
      this.monitorBattery();
    }
  }

  // Start performance monitoring
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.measureFPS();
    this.monitorMemoryUsage();
  }

  // Stop performance monitoring
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Subscribe to performance updates
  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Update thresholds
  setThresholds(newThresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  // Measure FPS
  private measureFPS(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined') {
      return;
    }

    const measure = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime - this.lastFrameTime >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFrameTime));
        
        this.updateMetrics({
          fps,
          isLowEndDevice: fps < this.thresholds.minFPS,
        });
        
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }
      
      if (this.isMonitoring) {
        this.animationFrameId = requestAnimationFrame(measure);
      }
    };
    
    this.animationFrameId = requestAnimationFrame(measure);
  }

  // Monitor memory usage
  private monitorMemoryUsage(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof performance === 'undefined' || !('memory' in performance)) {
      return;
    }
    
    const checkMemory = () => {
      const memory = (performance as any).memory;
      const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      this.updateMetrics({ memoryUsage: usage });
      
      if (this.isMonitoring) {
        setTimeout(checkMemory, 5000); // Check every 5 seconds
      }
    };
    
    checkMemory();
  }

  // Detect device capabilities
  private detectDeviceCapabilities(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    // Check for hardware concurrency
    const cores = navigator.hardwareConcurrency || 4;
    
    // Check for device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory || 4;
    
    // Estimate device performance based on available metrics
    const isLowEnd = cores <= 2 || deviceMemory <= 2;
    
    this.updateMetrics({ isLowEndDevice: isLowEnd });
    
    // Adjust thresholds based on device capabilities
    if (isLowEnd) {
      this.thresholds.maxConcurrentAnimations = 3;
      this.thresholds.minFPS = 30;
    }
  }

  // Monitor network speed
  private monitorNetworkSpeed(): void {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || !('connection' in navigator)) {
      return;
    }
    
    const connection = (navigator as any).connection;
    
    const updateNetworkSpeed = () => {
      const effectiveType = connection.effectiveType;
      let speed: 'slow' | 'fast' | 'unknown' = 'unknown';
      
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        speed = 'slow';
      } else if (effectiveType === '3g' || effectiveType === '4g') {
        speed = 'fast';
      }
      
      this.updateMetrics({ networkSpeed: speed });
    };
    
    connection.addEventListener('change', updateNetworkSpeed);
    updateNetworkSpeed();
  }

  // Monitor battery level
  private async monitorBattery(): Promise<void> {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || !('getBattery' in navigator)) {
      return;
    }
    
    try {
      const battery = await (navigator as any).getBattery();
      
      const updateBattery = () => {
        this.updateMetrics({ batteryLevel: battery.level });
      };
      
      battery.addEventListener('levelchange', updateBattery);
      updateBattery();
    } catch (error) {
      console.warn('Battery API not available:', error);
    }
  }

  // Update metrics and notify observers
  private updateMetrics(updates: Partial<PerformanceMetrics>): void {
    this.metrics = { ...this.metrics, ...updates };
    this.notifyObservers();
  }

  // Notify all observers
  private notifyObservers(): void {
    this.observers.forEach(callback => {
      try {
        callback(this.metrics);
      } catch (error) {
        console.error('Error in performance observer:', error);
      }
    });
  }

  // Track animation start
  trackAnimationStart(): void {
    this.updateMetrics({
      animationCount: this.metrics.animationCount + 1,
    });
  }

  // Track animation end
  trackAnimationEnd(): void {
    this.updateMetrics({
      animationCount: Math.max(0, this.metrics.animationCount - 1),
    });
  }

  // Measure loading time
  measureLoadingTime(startTime: number): void {
    // Only run in browser environment
    if (typeof performance === 'undefined') {
      return;
    }
    
    const loadingTime = performance.now() - startTime;
    this.updateMetrics({ loadingTime });
  }

  // Check if animations should be reduced
  shouldReduceAnimations(): boolean {
    return (
      this.metrics.fps < this.thresholds.minFPS ||
      this.metrics.memoryUsage > this.thresholds.maxMemoryUsage ||
      this.metrics.isLowEndDevice ||
      this.metrics.batteryLevel < 0.2 ||
      this.metrics.networkSpeed === 'slow'
    );
  }

  // Get recommended animation settings
  getRecommendedSettings(): {
    maxConcurrentAnimations: number;
    reducedComplexity: boolean;
    disableParallax: boolean;
    shortenDurations: boolean;
  } {
    const shouldReduce = this.shouldReduceAnimations();
    
    return {
      maxConcurrentAnimations: shouldReduce ? 2 : this.thresholds.maxConcurrentAnimations,
      reducedComplexity: shouldReduce,
      disableParallax: shouldReduce || this.metrics.isLowEndDevice,
      shortenDurations: this.metrics.fps < 45 || this.metrics.batteryLevel < 0.3,
    };
  }

  // Performance report for debugging
  generateReport(): string {
    const metrics = this.getMetrics();
    const settings = this.getRecommendedSettings();
    
    return `
Performance Report:
- FPS: ${metrics.fps}
- Memory Usage: ${(metrics.memoryUsage * 100).toFixed(1)}%
- Active Animations: ${metrics.animationCount}
- Battery Level: ${(metrics.batteryLevel * 100).toFixed(1)}%
- Network Speed: ${metrics.networkSpeed}
- Low-end Device: ${metrics.isLowEndDevice}
- Should Reduce Animations: ${this.shouldReduceAnimations()}

Recommended Settings:
- Max Concurrent Animations: ${settings.maxConcurrentAnimations}
- Reduced Complexity: ${settings.reducedComplexity}
- Disable Parallax: ${settings.disableParallax}
- Shorten Durations: ${settings.shortenDurations}
    `.trim();
  }
}

// Animation degradation system
export interface AnimationDegradationSettings {
  disableParallax: boolean;
  reduceComplexity: boolean;
  limitConcurrentAnimations: number;
  shortenDurations: boolean;
  disableHoverEffects: boolean;
  useSimpleFallbacks: boolean;
}

class AnimationDegradationManager {
  private currentSettings: AnimationDegradationSettings = {
    disableParallax: false,
    reduceComplexity: false,
    limitConcurrentAnimations: 12,
    shortenDurations: false,
    disableHoverEffects: false,
    useSimpleFallbacks: false,
  };

  private performanceHistory: number[] = [];
  private degradationLevel = 0; // 0 = no degradation, 3 = maximum degradation

  updateSettings(metrics: PerformanceMetrics): AnimationDegradationSettings {
    // Track performance history
    this.performanceHistory.push(metrics.fps);
    if (this.performanceHistory.length > 10) {
      this.performanceHistory.shift();
    }

    // Calculate average FPS over recent frames
    const avgFPS = this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length;
    
    // Determine degradation level based on multiple factors
    let newDegradationLevel = 0;
    
    if (metrics.isLowEndDevice || avgFPS < 30 || metrics.memoryUsage > 0.9) {
      newDegradationLevel = 3; // Maximum degradation
    } else if (avgFPS < 45 || metrics.memoryUsage > 0.7 || metrics.batteryLevel < 0.2) {
      newDegradationLevel = 2; // High degradation
    } else if (avgFPS < 55 || metrics.memoryUsage > 0.5 || metrics.networkSpeed === 'slow') {
      newDegradationLevel = 1; // Moderate degradation
    }

    // Apply gradual degradation to avoid jarring changes
    if (newDegradationLevel > this.degradationLevel) {
      this.degradationLevel = Math.min(this.degradationLevel + 1, newDegradationLevel);
    } else if (newDegradationLevel < this.degradationLevel) {
      this.degradationLevel = Math.max(this.degradationLevel - 1, newDegradationLevel);
    }

    // Update settings based on degradation level
    this.currentSettings = this.calculateSettings(this.degradationLevel, metrics);
    
    return this.currentSettings;
  }

  private calculateSettings(level: number, metrics: PerformanceMetrics): AnimationDegradationSettings {
    switch (level) {
      case 3: // Maximum degradation
        return {
          disableParallax: true,
          reduceComplexity: true,
          limitConcurrentAnimations: 1,
          shortenDurations: true,
          disableHoverEffects: true,
          useSimpleFallbacks: true,
        };
      
      case 2: // High degradation
        return {
          disableParallax: true,
          reduceComplexity: true,
          limitConcurrentAnimations: 2,
          shortenDurations: true,
          disableHoverEffects: false,
          useSimpleFallbacks: true,
        };
      
      case 1: // Moderate degradation
        return {
          disableParallax: metrics.networkSpeed === 'slow',
          reduceComplexity: true,
          limitConcurrentAnimations: 4,
          shortenDurations: false,
          disableHoverEffects: false,
          useSimpleFallbacks: false,
        };
      
      default: // No degradation
        return {
          disableParallax: false,
          reduceComplexity: false,
          limitConcurrentAnimations: 12,
          shortenDurations: false,
          disableHoverEffects: false,
          useSimpleFallbacks: false,
        };
    }
  }

  getCurrentSettings(): AnimationDegradationSettings {
    return { ...this.currentSettings };
  }

  getDegradationLevel(): number {
    return this.degradationLevel;
  }
}

// Network-aware loading system
export interface NetworkAwareSettings {
  loadHighQualityImages: boolean;
  enableVideoBackgrounds: boolean;
  preloadAnimations: boolean;
  useCompressedAssets: boolean;
  enableLazyLoading: boolean;
}

class NetworkAwareLoader {
  private settings: NetworkAwareSettings = {
    loadHighQualityImages: true,
    enableVideoBackgrounds: true,
    preloadAnimations: true,
    useCompressedAssets: false,
    enableLazyLoading: true,
  };

  updateSettings(networkSpeed: 'slow' | 'fast' | 'unknown', metrics: PerformanceMetrics): NetworkAwareSettings {
    if (networkSpeed === 'slow' || metrics.isLowEndDevice) {
      this.settings = {
        loadHighQualityImages: false,
        enableVideoBackgrounds: false,
        preloadAnimations: false,
        useCompressedAssets: true,
        enableLazyLoading: true,
      };
    } else if (networkSpeed === 'fast') {
      this.settings = {
        loadHighQualityImages: true,
        enableVideoBackgrounds: true,
        preloadAnimations: true,
        useCompressedAssets: false,
        enableLazyLoading: false,
      };
    } else {
      // Unknown network - use conservative settings
      this.settings = {
        loadHighQualityImages: true,
        enableVideoBackgrounds: false,
        preloadAnimations: false,
        useCompressedAssets: false,
        enableLazyLoading: true,
      };
    }

    return this.settings;
  }

  getCurrentSettings(): NetworkAwareSettings {
    return { ...this.settings };
  }
}

export interface PerformanceAlert {
  type: 'fps' | 'memory' | 'battery' | 'network';
  severity: 'low' | 'medium' | 'high';
  message: string;
  recommendation: string;
  metrics: PerformanceMetrics;
}

// Enhanced performance monitor with degradation
class EnhancedPerformanceMonitor extends PerformanceMonitor {
  private degradationManager = new AnimationDegradationManager();
  private networkLoader = new NetworkAwareLoader();
  private alertCallbacks: Array<(alert: PerformanceAlert) => void> = [];

  constructor() {
    super();
    this.setupPerformanceAlerts();
  }

  // Subscribe to performance alerts
  subscribeToAlerts(callback: (alert: PerformanceAlert) => void): () => void {
    this.alertCallbacks.push(callback);
    
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  // Get current animation settings based on performance
  getAnimationSettings(): AnimationDegradationSettings {
    const metrics = this.getMetrics();
    return this.degradationManager.updateSettings(metrics);
  }

  // Get network-aware loading settings
  getNetworkSettings(): NetworkAwareSettings {
    const metrics = this.getMetrics();
    return this.networkLoader.updateSettings(metrics.networkSpeed, metrics);
  }

  // Setup performance alerts
  private setupPerformanceAlerts(): void {
    this.subscribe((metrics) => {
      // FPS alert
      if (metrics.fps < 30) {
        this.triggerAlert({
          type: 'fps',
          severity: 'high',
          message: `Low FPS detected: ${metrics.fps}`,
          recommendation: 'Reducing animation complexity',
          metrics,
        });
      } else if (metrics.fps < 45) {
        this.triggerAlert({
          type: 'fps',
          severity: 'medium',
          message: `Moderate FPS drop: ${metrics.fps}`,
          recommendation: 'Consider reducing concurrent animations',
          metrics,
        });
      }

      // Memory alert
      if (metrics.memoryUsage > 0.8) {
        this.triggerAlert({
          type: 'memory',
          severity: 'high',
          message: `High memory usage: ${(metrics.memoryUsage * 100).toFixed(1)}%`,
          recommendation: 'Disabling complex animations',
          metrics,
        });
      }

      // Battery alert
      if (metrics.batteryLevel < 0.15) {
        this.triggerAlert({
          type: 'battery',
          severity: 'high',
          message: `Low battery: ${(metrics.batteryLevel * 100).toFixed(1)}%`,
          recommendation: 'Enabling battery saver mode',
          metrics,
        });
      }

      // Network alert
      if (metrics.networkSpeed === 'slow') {
        this.triggerAlert({
          type: 'network',
          severity: 'medium',
          message: 'Slow network detected',
          recommendation: 'Using compressed assets and reduced animations',
          metrics,
        });
      }
    });
  }

  private triggerAlert(alert: PerformanceAlert): void {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in performance alert callback:', error);
      }
    });
  }
}

// Singleton instance - using enhanced version
export const performanceMonitor = new EnhancedPerformanceMonitor();

// Utility functions
export const startPerformanceMonitoring = () => {
  performanceMonitor.startMonitoring();
};

export const stopPerformanceMonitoring = () => {
  performanceMonitor.stopMonitoring();
};

export const getPerformanceMetrics = () => {
  return performanceMonitor.getMetrics();
};

export const shouldReduceAnimations = () => {
  return performanceMonitor.shouldReduceAnimations();
};

export const getRecommendedAnimationSettings = () => {
  return performanceMonitor.getRecommendedSettings();
};



// Enhanced utility functions
export const getAnimationDegradationSettings = (): AnimationDegradationSettings => {
  return (performanceMonitor as EnhancedPerformanceMonitor).getAnimationSettings();
};

export const getNetworkAwareSettings = (): NetworkAwareSettings => {
  return (performanceMonitor as EnhancedPerformanceMonitor).getNetworkSettings();
};

export const subscribeToPerformanceAlerts = (callback: (alert: PerformanceAlert) => void) => {
  return (performanceMonitor as EnhancedPerformanceMonitor).subscribeToAlerts(callback);
};

// React hook for performance monitoring
import { useState, useEffect } from 'react';

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(
    performanceMonitor.getMetrics()
  );
  
  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe(setMetrics);
    performanceMonitor.startMonitoring();
    
    return () => {
      unsubscribe();
      performanceMonitor.stopMonitoring();
    };
  }, []);
  
  return metrics;
};

// React hook for animation degradation settings
export const useAnimationSettings = () => {
  const [settings, setSettings] = useState<AnimationDegradationSettings>(
    getAnimationDegradationSettings()
  );
  
  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe(() => {
      setSettings(getAnimationDegradationSettings());
    });
    
    return unsubscribe;
  }, []);
  
  return settings;
};

// React hook for network-aware settings
export const useNetworkSettings = () => {
  const [settings, setSettings] = useState<NetworkAwareSettings>(
    getNetworkAwareSettings()
  );
  
  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe(() => {
      setSettings(getNetworkAwareSettings());
    });
    
    return unsubscribe;
  }, []);
  
  return settings;
};

// React hook for performance alerts
export const usePerformanceAlerts = () => {
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  
  useEffect(() => {
    const unsubscribe = subscribeToPerformanceAlerts((alert) => {
      setAlerts(prev => [...prev.slice(-4), alert]); // Keep last 5 alerts
    });
    
    return unsubscribe;
  }, []);
  
  return alerts;
};