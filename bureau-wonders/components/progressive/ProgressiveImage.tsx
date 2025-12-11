/**
 * Progressive Image Component
 * Handles lazy loading, WebP support, and graceful fallbacks
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useProgressiveEnhancement, useLazyLoading } from '../../lib/progressive-enhancement';
import { useNetworkAwareLoading } from '../../hooks/usePerformanceAwareAnimations';

export interface ProgressiveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'onError' | 'onLoad'> {
  src: string;
  fallbackSrc?: string;
  webpSrc?: string;
  srcSet?: string;
  webpSrcSet?: string;
  
  // Progressive loading options
  lazy?: boolean;
  priority?: 'high' | 'medium' | 'low';
  placeholder?: string;
  blurDataURL?: string;
  
  // Optimization options
  width?: number;
  height?: number;
  quality?: number;
  
  // Accessibility
  alt: string;
  
  // Callbacks
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onLoadStart?: () => void;
}

export const ProgressiveImage = forwardRef<HTMLImageElement, ProgressiveImageProps>(
  ({
    src,
    fallbackSrc,
    webpSrc,
    srcSet,
    webpSrcSet,
    lazy = true,
    priority = 'medium',
    placeholder,
    blurDataURL,
    width,
    height,
    quality,
    alt,
    className = '',
    onLoad,
    onError,
    onLoadStart,
    ...props
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(placeholder || blurDataURL || '');
    
    const imageRef = useRef<HTMLImageElement>(null);
    const { getOptimizedImageUrl, isFeatureSupported } = useProgressiveEnhancement();
    const { observeElement } = useLazyLoading();
    const { getImageSrc, shouldLazyLoad } = useNetworkAwareLoading();
    
    // Determine the best image source
    const getBestImageSrc = (): { src: string; srcSet?: string } => {
      const supportsWebP = isFeatureSupported('webp');
      
      // Get network-aware source
      const networkAwareSrc = getImageSrc(src, fallbackSrc);
      
      // Optimize image URL if dimensions are provided
      let optimizedSrc = networkAwareSrc;
      if (width || height) {
        optimizedSrc = getOptimizedImageUrl(networkAwareSrc, {
          width,
          height,
          quality,
          format: supportsWebP && webpSrc ? 'webp' : undefined,
        });
      }
      
      // Use WebP if supported and available
      if (supportsWebP && webpSrc) {
        return {
          src: webpSrc,
          srcSet: webpSrcSet,
        };
      }
      
      return {
        src: optimizedSrc,
        srcSet,
      };
    };

    // Load image
    const loadImage = async () => {
      if (!imageRef.current) return;
      
      setIsLoading(true);
      setHasError(false);
      onLoadStart?.();
      
      const { src: bestSrc, srcSet: bestSrcSet } = getBestImageSrc();
      
      try {
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          
          img.onload = () => {
            setCurrentSrc(bestSrc);
            setIsLoaded(true);
            setIsLoading(false);
            onLoad?.();
            resolve();
          };
          
          img.onerror = () => {
            reject(new Error(`Failed to load image: ${bestSrc}`));
          };
          
          if (bestSrcSet) {
            img.srcset = bestSrcSet;
          }
          img.src = bestSrc;
        });
      } catch (error) {
        // Try fallback if available
        if (fallbackSrc && fallbackSrc !== bestSrc) {
          try {
            await new Promise<void>((resolve, reject) => {
              const img = new Image();
              
              img.onload = () => {
                setCurrentSrc(fallbackSrc);
                setIsLoaded(true);
                setIsLoading(false);
                onLoad?.();
                resolve();
              };
              
              img.onerror = () => {
                reject(new Error(`Failed to load fallback image: ${fallbackSrc}`));
              };
              
              img.src = fallbackSrc;
            });
          } catch (fallbackError) {
            setHasError(true);
            setIsLoading(false);
            onError?.(fallbackError as Error);
          }
        } else {
          setHasError(true);
          setIsLoading(false);
          onError?.(error as Error);
        }
      }
    };

    // Setup lazy loading or immediate loading
    useEffect(() => {
      const element = imageRef.current;
      if (!element) return;
      
      const shouldUseLazyLoading = lazy && shouldLazyLoad() && priority !== 'high';
      
      if (shouldUseLazyLoading) {
        // Add data attributes for intersection observer
        element.setAttribute('data-lazy', 'true');
        element.setAttribute('data-src', src);
        element.setAttribute('data-type', 'image');
        if (fallbackSrc) {
          element.setAttribute('data-fallback', fallbackSrc);
        }
        
        observeElement(element);
        
        // Custom intersection observer for this specific image
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              loadImage();
              observer.disconnect();
            }
          },
          {
            rootMargin: '50px 0px',
            threshold: 0.1,
          }
        );
        
        observer.observe(element);
        
        return () => observer.disconnect();
      } else {
        // Load immediately for high priority or non-lazy images
        loadImage();
      }
    }, [src, fallbackSrc, lazy, priority]);

    // Combine refs
    const combinedRef = (node: HTMLImageElement) => {
      imageRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const imageClasses = [
      'progressive-image',
      isLoading && 'progressive-image--loading',
      isLoaded && 'progressive-image--loaded',
      hasError && 'progressive-image--error',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className="progressive-image-container">
        <img
          ref={combinedRef}
          src={currentSrc}
          alt={alt}
          className={imageClasses}
          width={width}
          height={height}
          loading={lazy ? 'lazy' : 'eager'}
          {...props}
        />
        
        {isLoading && !hasError && (
          <div className="progressive-image__placeholder">
            {blurDataURL ? (
              <img
                src={blurDataURL}
                alt=""
                className="progressive-image__blur"
                aria-hidden="true"
              />
            ) : (
              <div className="progressive-image__skeleton" />
            )}
          </div>
        )}
        
        {hasError && (
          <div className="progressive-image__error">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="progressive-image__error-icon"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <span className="sr-only">Failed to load image: {alt}</span>
          </div>
        )}
      </div>
    );
  }
);

ProgressiveImage.displayName = 'ProgressiveImage';

// Progressive background image component
export interface ProgressiveBackgroundProps {
  src: string;
  fallbackSrc?: string;
  webpSrc?: string;
  children?: React.ReactNode;
  className?: string;
  lazy?: boolean;
  priority?: 'high' | 'medium' | 'low';
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const ProgressiveBackground: React.FC<ProgressiveBackgroundProps> = ({
  src,
  fallbackSrc,
  webpSrc,
  children,
  className = '',
  lazy = true,
  priority = 'medium',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFeatureSupported } = useProgressiveEnhancement();
  const { getImageSrc } = useNetworkAwareLoading();

  const loadBackgroundImage = async () => {
    const supportsWebP = isFeatureSupported('webp');
    const networkAwareSrc = getImageSrc(src, fallbackSrc);
    const bestSrc = supportsWebP && webpSrc ? webpSrc : networkAwareSrc;
    
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load background image: ${bestSrc}`));
        img.src = bestSrc;
      });
      
      setBackgroundImage(`url(${bestSrc})`);
      setIsLoaded(true);
      onLoad?.();
    } catch (error) {
      if (fallbackSrc && fallbackSrc !== bestSrc) {
        try {
          await new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load fallback background: ${fallbackSrc}`));
            img.src = fallbackSrc;
          });
          
          setBackgroundImage(`url(${fallbackSrc})`);
          setIsLoaded(true);
          onLoad?.();
        } catch (fallbackError) {
          setHasError(true);
          onError?.(fallbackError as Error);
        }
      } else {
        setHasError(true);
        onError?.(error as Error);
      }
    }
  };

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    if (lazy && priority !== 'high') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            loadBackgroundImage();
            observer.disconnect();
          }
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.1,
        }
      );
      
      observer.observe(element);
      return () => observer.disconnect();
    } else {
      loadBackgroundImage();
    }
  }, [src, fallbackSrc, webpSrc, lazy, priority]);

  const containerClasses = [
    'progressive-background',
    isLoaded && 'progressive-background--loaded',
    hasError && 'progressive-background--error',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {!isLoaded && !hasError && (
        <div className="progressive-background__placeholder" />
      )}
      {children}
    </div>
  );
};

// Progressive asset loader component
export interface ProgressiveAssetLoaderProps {
  assets: Array<{
    url: string;
    type: 'script' | 'style' | 'image';
    priority?: 'high' | 'medium' | 'low';
    critical?: boolean;
  }>;
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
  onError?: (error: Error, asset: string) => void;
}

export const ProgressiveAssetLoader: React.FC<ProgressiveAssetLoaderProps> = ({
  assets,
  onProgress,
  onComplete,
  onError,
}) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount] = useState(assets.length);
  
  useEffect(() => {
    let mounted = true;
    
    const loadAssets = async () => {
      // Sort assets by priority
      const sortedAssets = [...assets].sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium'];
      });
      
      let loaded = 0;
      
      for (const asset of sortedAssets) {
        if (!mounted) break;
        
        try {
          // Load asset based on type
          if (asset.type === 'script') {
            await loadScript(asset.url);
          } else if (asset.type === 'style') {
            await loadStylesheet(asset.url);
          } else if (asset.type === 'image') {
            await loadImage(asset.url);
          }
          
          loaded++;
          setLoadedCount(loaded);
          onProgress?.(loaded, totalCount);
        } catch (error) {
          onError?.(error as Error, asset.url);
        }
      }
      
      if (mounted) {
        onComplete?.();
      }
    };
    
    loadAssets();
    
    return () => {
      mounted = false;
    };
  }, [assets, totalCount, onProgress, onComplete, onError]);

  return null; // This component doesn't render anything
};

// Helper functions
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

const loadStylesheet = (href: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
    document.head.appendChild(link);
  });
};

const loadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};