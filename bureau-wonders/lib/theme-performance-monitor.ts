/**
 * Theme Performance Monitoring System
 * Tracks theme switching performance and animation frame rates
 */

export interface ThemePerformanceMetrics {
  themeTransitionDuration: number;
  frameRateBeforeTransition: number;
  frameRateDuringTransition: number;
  frameRateAfterTransition: number;
  memoryUsageChange: number;
  elementsTransitioned: number;
  transitionStartTime: number;
  transitionEndTime: number;
}

export interface AnimationFrameMetrics {
  currentFPS: number;
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  frameDrops: number;
  totalFrames: number;
  monitoringDuration: number;
}

export class ThemePerformanceMonitor {
  private metrics: ThemePerformanceMetrics[] = [];
  private frameMetrics: AnimationFrameMetrics = {
    currentFPS: 60,
    averageFPS: 60,
    minFPS: 60,
    maxFPS: 60,
    frameDrops: 0,
    totalFrames: 0,
    monitoringDuration: 0,
  };
  
  private isMonitoring = false;
  private frameCount = 0;
  private lastFrameTime = 0;
  private frameRates: number[] = [];
  private animationFrameId?: number;
  private monitoringStartTime = 0;
  
  // Start performance monitoring
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monitoringStartTime = performance.now();
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    this.frameRates = [];
    
    this.measureFrameRate();
  }
  
  // Stop performance monitoring
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
  
  // Measure frame rate continuously
  private measureFrameRate(): void {
    if (!this.isMonitoring) return;
    
    const currentTime = performance.now();
    this.frameCount++;
    
    // Calculate FPS every second
    if (currentTime - this.lastFrameTime >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFrameTime));
      this.frameRates.push(fps);
      
      // Keep only last 60 measurements (1 minute of data)
      if (this.frameRates.length > 60) {
        this.frameRates.shift();
      }
      
      // Update frame metrics
      this.updateFrameMetrics(fps);
      
      this.frameCount = 0;
      this.lastFrameTime = currentTime;
    }
    
    this.animationFrameId = requestAnimationFrame(() => this.measureFrameRate());
  }
  
  // Update frame metrics
  private updateFrameMetrics(currentFPS: number): void {
    this.frameMetrics.currentFPS = currentFPS;
    this.frameMetrics.totalFrames += this.frameCount;
    this.frameMetrics.monitoringDuration = performance.now() - this.monitoringStartTime;
    
    if (this.frameRates.length > 0) {
      this.frameMetrics.averageFPS = Math.round(
        this.frameRates.reduce((sum, fps) => sum + fps, 0) / this.frameRates.length
      );
      this.frameMetrics.minFPS = Math.min(...this.frameRates);
      this.frameMetrics.maxFPS = Math.max(...this.frameRates);
      
      // Count frame drops (FPS below 50)
      this.frameMetrics.frameDrops = this.frameRates.filter(fps => fps < 50).length;
    }
  }
  
  // Start theme transition monitoring
  startThemeTransition(elementsCount: number = 1): string {
    const transitionId = `theme-transition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const metrics: ThemePerformanceMetrics = {
      themeTransitionDuration: 0,
      frameRateBeforeTransition: this.frameMetrics.currentFPS,
      frameRateDuringTransition: 0,
      frameRateAfterTransition: 0,
      memoryUsageChange: 0,
      elementsTransitioned: elementsCount,
      transitionStartTime: performance.now(),
      transitionEndTime: 0,
    };
    
    // Store initial memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      (metrics as any).initialMemoryUsage = memory.usedJSHeapSize;
    }
    
    this.metrics.push(metrics);
    
    return transitionId;
  }
  
  // End theme transition monitoring
  endThemeTransition(transitionId?: string): ThemePerformanceMetrics | null {
    if (this.metrics.length === 0) return null;
    
    const metrics = this.metrics[this.metrics.length - 1];
    metrics.transitionEndTime = performance.now();
    metrics.themeTransitionDuration = metrics.transitionEndTime - metrics.transitionStartTime;
    metrics.frameRateAfterTransition = this.frameMetrics.currentFPS;
    
    // Calculate average FPS during transition (simplified)
    metrics.frameRateDuringTransition = Math.round(
      (metrics.frameRateBeforeTransition + metrics.frameRateAfterTransition) / 2
    );
    
    // Calculate memory usage change if available
    if ('memory' in performance && (metrics as any).initialMemoryUsage) {
      const memory = (performance as any).memory;
      metrics.memoryUsageChange = memory.usedJSHeapSize - (metrics as any).initialMemoryUsage;
    }
    
    return metrics;
  }
  
  // Get current frame metrics
  getFrameMetrics(): AnimationFrameMetrics {
    return { ...this.frameMetrics };
  }
  
  // Get theme transition metrics
  getThemeMetrics(): ThemePerformanceMetrics[] {
    return [...this.metrics];
  }
  
  // Get latest theme transition metrics
  getLatestThemeMetrics(): ThemePerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }
  
  // Get performance summary
  getPerformanceSummary(): {
    averageTransitionDuration: number;
    averageFrameRate: number;
    performanceLevel: 'excellent' | 'good' | 'fair' | 'poor';
    recommendations: string[];
  } {
    const avgTransitionDuration = this.metrics.length > 0
      ? this.metrics.reduce((sum, m) => sum + m.themeTransitionDuration, 0) / this.metrics.length
      : 0;
    
    const avgFrameRate = this.frameMetrics.averageFPS;
    
    let performanceLevel: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
    const recommendations: string[] = [];
    
    // Determine performance level and recommendations
    if (avgFrameRate < 30) {
      performanceLevel = 'poor';
      recommendations.push('Consider reducing animation complexity');
      recommendations.push('Enable performance mode to simplify transitions');
    } else if (avgFrameRate < 45) {
      performanceLevel = 'fair';
      recommendations.push('Some animations may be simplified for better performance');
    } else if (avgFrameRate < 55) {
      performanceLevel = 'good';
    }
    
    if (avgTransitionDuration > 500) {
      recommendations.push('Theme transitions are taking longer than expected');
      recommendations.push('Consider reducing the number of elements transitioning simultaneously');
    }
    
    if (this.frameMetrics.frameDrops > 10) {
      recommendations.push('Frequent frame drops detected during animations');
      recommendations.push('Consider enabling reduced motion mode');
    }
    
    return {
      averageTransitionDuration: avgTransitionDuration,
      averageFrameRate: avgFrameRate,
      performanceLevel,
      recommendations,
    };
  }
  
  // Check if performance is acceptable
  isPerformanceAcceptable(): boolean {
    const summary = this.getPerformanceSummary();
    return summary.performanceLevel === 'excellent' || summary.performanceLevel === 'good';
  }
  
  // Get adaptive configuration based on performance
  getAdaptiveConfiguration(): {
    shouldReduceAnimations: boolean;
    shouldDisableParallax: boolean;
    shouldShortenDurations: boolean;
    shouldSimplifyTransitions: boolean;
    maxConcurrentAnimations: number;
  } {
    const frameRate = this.frameMetrics.averageFPS;
    const frameDrops = this.frameMetrics.frameDrops;
    
    return {
      shouldReduceAnimations: frameRate < 45 || frameDrops > 5,
      shouldDisableParallax: frameRate < 40,
      shouldShortenDurations: frameRate < 35,
      shouldSimplifyTransitions: frameRate < 30,
      maxConcurrentAnimations: frameRate > 50 ? 12 : frameRate > 40 ? 8 : 4,
    };
  }
  
  // Clear all metrics (for cleanup or reset)
  clearMetrics(): void {
    this.metrics = [];
    this.frameRates = [];
    this.frameMetrics = {
      currentFPS: 60,
      averageFPS: 60,
      minFPS: 60,
      maxFPS: 60,
      frameDrops: 0,
      totalFrames: 0,
      monitoringDuration: 0,
    };
  }
  
  // Export metrics for analysis
  exportMetrics(): {
    frameMetrics: AnimationFrameMetrics;
    themeMetrics: ThemePerformanceMetrics[];
    summary: ReturnType<ThemePerformanceMonitor['getPerformanceSummary']>;
    timestamp: number;
  } {
    return {
      frameMetrics: this.getFrameMetrics(),
      themeMetrics: this.getThemeMetrics(),
      summary: this.getPerformanceSummary(),
      timestamp: Date.now(),
    };
  }
}

// Global theme performance monitor instance
export const themePerformanceMonitor = new ThemePerformanceMonitor();

// React hook for theme performance monitoring
import { useState, useEffect, useCallback } from 'react';

export const useThemePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<AnimationFrameMetrics>(
    themePerformanceMonitor.getFrameMetrics()
  );
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  // Start monitoring
  const startMonitoring = useCallback(() => {
    themePerformanceMonitor.startMonitoring();
    setIsMonitoring(true);
  }, []);
  
  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    themePerformanceMonitor.stopMonitoring();
    setIsMonitoring(false);
  }, []);
  
  // Start theme transition
  const startThemeTransition = useCallback((elementsCount?: number) => {
    return themePerformanceMonitor.startThemeTransition(elementsCount);
  }, []);
  
  // End theme transition
  const endThemeTransition = useCallback((transitionId?: string) => {
    return themePerformanceMonitor.endThemeTransition(transitionId);
  }, []);
  
  // Update metrics periodically
  useEffect(() => {
    if (!isMonitoring) return;
    
    const interval = setInterval(() => {
      setMetrics(themePerformanceMonitor.getFrameMetrics());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isMonitoring]);
  
  // Auto-start monitoring on mount
  useEffect(() => {
    startMonitoring();
    
    return () => {
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring]);
  
  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    startThemeTransition,
    endThemeTransition,
    getPerformanceSummary: () => themePerformanceMonitor.getPerformanceSummary(),
    getAdaptiveConfiguration: () => themePerformanceMonitor.getAdaptiveConfiguration(),
    isPerformanceAcceptable: () => themePerformanceMonitor.isPerformanceAcceptable(),
  };
};