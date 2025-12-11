/**
 * Progressive Enhancement System
 * Handles progressive loading, critical CSS, and graceful degradation
 */

export interface AssetLoadingStrategy {
  critical: boolean;
  preload: boolean;
  lazy: boolean;
  priority: 'high' | 'medium' | 'low';
  fallback?: string;
}

export interface ProgressiveEnhancementConfig {
  enableProgressiveLoading: boolean;
  criticalCSSInlined: boolean;
  lazyLoadImages: boolean;
  preloadCriticalAssets: boolean;
  enableServiceWorker: boolean;
  compressionEnabled: boolean;
}

class ProgressiveEnhancementManager {
  private config: ProgressiveEnhancementConfig = {
    enableProgressiveLoading: true,
    criticalCSSInlined: false,
    lazyLoadImages: true,
    preloadCriticalAssets: true,
    enableServiceWorker: false,
    compressionEnabled: false,
  };

  private loadedAssets = new Set<string>();
  private criticalAssets = new Set<string>();
  private loadingQueue: Array<{ url: string; strategy: AssetLoadingStrategy; callback?: () => void }> = [];
  private isProcessingQueue = false;

  constructor() {
    this.detectCapabilities();
    this.setupIntersectionObserver();
    this.inlineCriticalCSS();
  }

  // Detect browser and network capabilities
  private detectCapabilities(): void {
    if (typeof window === 'undefined') return;

    // Check for modern browser features
    const hasIntersectionObserver = 'IntersectionObserver' in window;
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasWebP = this.checkWebPSupport();
    
    // Update config based on capabilities
    this.config.lazyLoadImages = hasIntersectionObserver;
    this.config.enableServiceWorker = hasServiceWorker;

    // Check network conditions
    const connection = (navigator as any).connection;
    if (connection) {
      const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
      this.config.compressionEnabled = isSlowConnection;
      this.config.preloadCriticalAssets = !isSlowConnection;
    }
  }

  // Check WebP support
  private checkWebPSupport(): Promise<boolean> {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // Inline critical CSS
  private inlineCriticalCSS(): void {
    if (typeof document === 'undefined' || this.config.criticalCSSInlined) return;

    const criticalCSS = this.getCriticalCSS();
    if (criticalCSS) {
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      style.setAttribute('data-critical', 'true');
      document.head.insertBefore(style, document.head.firstChild);
      this.config.criticalCSSInlined = true;
    }
  }

  // Get critical CSS content
  private getCriticalCSS(): string {
    return `
      /* Critical CSS for above-the-fold content */
      :root {
        --color-primary-50: #faf9f7;
        --color-primary-100: #f0ede6;
        --color-primary-500: #8b7355;
        --color-primary-900: #2d251a;
        --color-accent-gold: #d4af37;
        --font-size-body: 1rem;
        --line-height-normal: 1.5;
        --duration-fast: 200ms;
        --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: var(--font-size-body);
        line-height: var(--line-height-normal);
        color: var(--color-primary-900);
        background-color: var(--color-primary-50);
      }

      .header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: rgba(250, 249, 247, 0.95);
        backdrop-filter: blur(10px);
      }

      .hero {
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.375rem;
        background: var(--color-accent-gold);
        color: var(--color-primary-900);
        text-decoration: none;
        font-weight: 600;
        transition: transform var(--duration-fast) var(--ease-out-quart);
        cursor: pointer;
      }

      .button:hover {
        transform: translateY(-2px);
      }

      @media (prefers-reduced-motion: reduce) {
        .button:hover {
          transform: none;
        }
      }

      /* Loading states */
      .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading-shimmer 2s infinite;
      }

      @keyframes loading-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .loading-skeleton {
          background: #f0f0f0;
          animation: none;
        }
      }
    `;
  }

  // Setup intersection observer for lazy loading
  private setupIntersectionObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            this.loadAsset(element);
            observer.unobserve(element);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1,
      }
    );

    // Observe elements with data-lazy attribute
    document.querySelectorAll('[data-lazy]').forEach((element) => {
      observer.observe(element);
    });
  }

  // Load asset with progressive enhancement
  async loadAsset(element: HTMLElement): Promise<void> {
    const src = element.dataset.src;
    const fallback = element.dataset.fallback;
    const type = element.dataset.type || 'image';

    if (!src) return;

    try {
      if (type === 'image') {
        await this.loadImage(element as HTMLImageElement, src, fallback);
      } else if (type === 'script') {
        await this.loadScript(src);
      } else if (type === 'style') {
        await this.loadStylesheet(src);
      }

      this.loadedAssets.add(src);
      element.classList.add('loaded');
      element.classList.remove('loading');
    } catch (error) {
      console.warn(`Failed to load asset: ${src}`, error);
      if (fallback) {
        await this.loadAsset({ ...element, dataset: { ...element.dataset, src: fallback } } as HTMLElement);
      }
    }
  }

  // Load image with WebP support and fallbacks
  private async loadImage(img: HTMLImageElement, src: string, fallback?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      
      image.onload = () => {
        img.src = src;
        img.classList.add('fade-in');
        resolve();
      };
      
      image.onerror = () => {
        if (fallback) {
          const fallbackImage = new Image();
          fallbackImage.onload = () => {
            img.src = fallback;
            img.classList.add('fade-in');
            resolve();
          };
          fallbackImage.onerror = reject;
          fallbackImage.src = fallback;
        } else {
          reject(new Error(`Failed to load image: ${src}`));
        }
      };
      
      image.src = src;
    });
  }

  // Load script dynamically
  private async loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedAssets.has(src)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      
      document.head.appendChild(script);
    });
  }

  // Load stylesheet dynamically
  private async loadStylesheet(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedAssets.has(href)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
      
      document.head.appendChild(link);
    });
  }

  // Preload critical assets
  preloadCriticalAssets(assets: Array<{ url: string; type: 'image' | 'script' | 'style' | 'font' }>): void {
    if (!this.config.preloadCriticalAssets) return;

    assets.forEach(({ url, type }) => {
      if (this.criticalAssets.has(url)) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      
      switch (type) {
        case 'image':
          link.as = 'image';
          break;
        case 'script':
          link.as = 'script';
          break;
        case 'style':
          link.as = 'style';
          break;
        case 'font':
          link.as = 'font';
          link.crossOrigin = 'anonymous';
          break;
      }
      
      document.head.appendChild(link);
      this.criticalAssets.add(url);
    });
  }

  // Queue asset for loading
  queueAsset(url: string, strategy: AssetLoadingStrategy, callback?: () => void): void {
    this.loadingQueue.push({ url, strategy, callback });
    
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  // Process loading queue
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.loadingQueue.length === 0) return;

    this.isProcessingQueue = true;

    // Sort by priority
    this.loadingQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.strategy.priority] - priorityOrder[a.strategy.priority];
    });

    // Process high priority assets first
    const highPriorityAssets = this.loadingQueue.filter(item => item.strategy.priority === 'high');
    
    for (const item of highPriorityAssets) {
      try {
        if (item.strategy.preload) {
          await this.loadScript(item.url);
        }
        item.callback?.();
      } catch (error) {
        console.warn(`Failed to load high priority asset: ${item.url}`, error);
      }
    }

    // Process remaining assets with delay
    const remainingAssets = this.loadingQueue.filter(item => item.strategy.priority !== 'high');
    
    for (const item of remainingAssets) {
      try {
        // Add delay for non-critical assets
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (item.strategy.lazy) {
          // Add to lazy loading queue
          continue;
        }
        
        await this.loadScript(item.url);
        item.callback?.();
      } catch (error) {
        console.warn(`Failed to load asset: ${item.url}`, error);
      }
    }

    this.loadingQueue = [];
    this.isProcessingQueue = false;
  }

  // Get optimized image URL
  getOptimizedImageUrl(
    originalUrl: string, 
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpeg' | 'png';
    } = {}
  ): string {
    const { width, height, quality = 80, format = 'webp' } = options;
    
    // In a real implementation, this would integrate with an image optimization service
    // For now, we'll return the original URL with query parameters
    const url = new URL(originalUrl, window.location.origin);
    
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    if (quality !== 80) url.searchParams.set('q', quality.toString());
    if (format !== 'webp') url.searchParams.set('f', format);
    
    return url.toString();
  }

  // Check if feature is supported
  isFeatureSupported(feature: string): boolean {
    switch (feature) {
      case 'webp':
        return this.checkWebPSupport() as any; // Simplified for this example
      case 'intersection-observer':
        return 'IntersectionObserver' in window;
      case 'service-worker':
        return 'serviceWorker' in navigator;
      case 'css-grid':
        return CSS.supports('display', 'grid');
      case 'css-custom-properties':
        return CSS.supports('--test', 'value');
      default:
        return false;
    }
  }

  // Get configuration
  getConfig(): ProgressiveEnhancementConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(updates: Partial<ProgressiveEnhancementConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}

// Singleton instance
export const progressiveEnhancement = new ProgressiveEnhancementManager();

// Utility functions
export const preloadCriticalAssets = (assets: Array<{ url: string; type: 'image' | 'script' | 'style' | 'font' }>) => {
  progressiveEnhancement.preloadCriticalAssets(assets);
};

export const getOptimizedImageUrl = (url: string, options?: Parameters<typeof progressiveEnhancement.getOptimizedImageUrl>[1]) => {
  return progressiveEnhancement.getOptimizedImageUrl(url, options);
};

export const isFeatureSupported = (feature: string) => {
  return progressiveEnhancement.isFeatureSupported(feature);
};

// React hooks
import { useState, useEffect } from 'react';

export const useProgressiveEnhancement = () => {
  const [config, setConfig] = useState(progressiveEnhancement.getConfig());
  
  const updateConfig = (updates: Partial<ProgressiveEnhancementConfig>) => {
    progressiveEnhancement.updateConfig(updates);
    setConfig(progressiveEnhancement.getConfig());
  };
  
  return {
    config,
    updateConfig,
    preloadAssets: preloadCriticalAssets,
    getOptimizedImageUrl,
    isFeatureSupported,
  };
};

export const useLazyLoading = () => {
  const [isSupported] = useState(() => 'IntersectionObserver' in window);
  
  const observeElement = (element: HTMLElement) => {
    if (!isSupported) {
      // Fallback: load immediately
      progressiveEnhancement.loadAsset(element);
      return;
    }
    
    // Will be handled by the intersection observer
  };
  
  return {
    isSupported,
    observeElement,
  };
};

export const useAssetLoading = () => {
  const [loadingAssets, setLoadingAssets] = useState<Set<string>>(new Set());
  const [loadedAssets, setLoadedAssets] = useState<Set<string>>(new Set());
  
  const loadAsset = async (url: string, strategy: AssetLoadingStrategy) => {
    setLoadingAssets(prev => new Set(prev).add(url));
    
    try {
      progressiveEnhancement.queueAsset(url, strategy, () => {
        setLoadedAssets(prev => new Set(prev).add(url));
        setLoadingAssets(prev => {
          const newSet = new Set(prev);
          newSet.delete(url);
          return newSet;
        });
      });
    } catch (error) {
      setLoadingAssets(prev => {
        const newSet = new Set(prev);
        newSet.delete(url);
        return newSet;
      });
      throw error;
    }
  };
  
  return {
    loadingAssets,
    loadedAssets,
    loadAsset,
    isLoading: (url: string) => loadingAssets.has(url),
    isLoaded: (url: string) => loadedAssets.has(url),
  };
};