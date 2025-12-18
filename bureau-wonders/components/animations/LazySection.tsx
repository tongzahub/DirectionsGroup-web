'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useNetworkAwareLoading } from '@/hooks/usePerformanceAwareAnimations';
import { LoadingSpinner } from './LoadingStates';
import { cn } from '@/lib/utils';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  priority?: 'high' | 'medium' | 'low';
  className?: string;
  id?: string;
  preload?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

// Lazy loading wrapper for sections
export const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback,
  rootMargin = '100px 0px',
  threshold = 0.1,
  priority = 'medium',
  className = '',
  id,
  preload = false,
  onLoad,
  onError,
}) => {
  const [isVisible, setIsVisible] = useState(preload || priority === 'high');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { shouldLazyLoad } = useNetworkAwareLoading();

  // Use intersection observer to detect when section comes into view
  const { isInView: isIntersecting, ref: sectionRef } = useScrollTrigger({
    rootMargin,
    threshold,
    triggerOnce: true,
  });

  // Load section when it becomes visible
  useEffect(() => {
    if (!shouldLazyLoad || preload || priority === 'high') {
      setIsVisible(true);
      return;
    }

    if (isIntersecting && !isVisible) {
      setIsVisible(true);
    }
  }, [isIntersecting, isVisible, shouldLazyLoad, preload, priority]);

  // Handle loading completion
  useEffect(() => {
    if (isVisible && !isLoaded) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
        onLoad?.();
      }, 100); // Small delay to ensure smooth transition

      return () => clearTimeout(timer);
    }
  }, [isVisible, isLoaded, onLoad]);

  // Error boundary for lazy loaded content
  const handleError = (error: Error) => {
    setHasError(true);
    onError?.(error);
  };

  if (hasError) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)} id={id}>
        <div className="text-center">
          <div className="text-neutral-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-neutral-600">Failed to load content</p>
          <button
            onClick={() => {
              setHasError(false);
              setIsVisible(false);
              setTimeout(() => setIsVisible(true), 100);
            }}
            className="mt-2 text-primary-600 hover:text-primary-600-700 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className={className} id={id}>
      {isVisible ? (
        <Suspense
          fallback={
            fallback || (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )
          }
        >
          <ErrorBoundary onError={handleError}>
            {children}
          </ErrorBoundary>
        </Suspense>
      ) : (
        fallback || (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse mx-auto mb-2" />
              <p className="text-neutral-400 text-sm">Loading section...</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-400 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-neutral-600 text-sm">Something went wrong</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Preloader component for critical sections
export const PreloadSection: React.FC<{
  children: React.ReactNode;
  assets?: string[];
  onPreloadComplete?: () => void;
}> = ({ children, assets = [], onPreloadComplete }) => {
  const [isPreloaded, setIsPreloaded] = useState(false);

  useEffect(() => {
    if (assets.length === 0) {
      setIsPreloaded(true);
      onPreloadComplete?.();
      return;
    }

    const preloadAssets = async () => {
      try {
        await Promise.all(
          assets.map(async (asset) => {
            if (asset.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
              // Preload image
              return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = asset;
              });
            } else if (asset.match(/\.(css)$/i)) {
              // Preload stylesheet
              return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = asset;
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
              });
            } else if (asset.match(/\.(js)$/i)) {
              // Preload script
              return new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'script';
                link.href = asset;
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
              });
            }
            return Promise.resolve();
          })
        );

        setIsPreloaded(true);
        onPreloadComplete?.();
      } catch (error) {
        console.warn('Failed to preload some assets:', error);
        setIsPreloaded(true);
        onPreloadComplete?.();
      }
    };

    preloadAssets();
  }, [assets, onPreloadComplete]);

  if (!isPreloaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-neutral-400 text-sm mt-2">Preparing content...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Progressive image loading component
export const ProgressiveSection: React.FC<{
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
}> = ({ children, backgroundImage, className = '', priority = 'medium' }) => {
  const [imageLoaded, setImageLoaded] = useState(!backgroundImage);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!backgroundImage) return;

    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(true); // Still show content even if background fails
    };
    
    // Add priority loading for high priority sections
    if (priority === 'high') {
      img.loading = 'eager';
    }
    
    img.src = backgroundImage;
  }, [backgroundImage, priority]);

  return (
    <div
      className={cn(
        'relative',
        imageLoaded && backgroundImage && !imageError ? 'bg-cover bg-center bg-no-repeat' : '',
        className
      )}
      style={{
        backgroundImage: imageLoaded && backgroundImage && !imageError ? `url(${backgroundImage})` : undefined,
      }}
    >
      {!imageLoaded && backgroundImage && (
        <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
      )}
      {children}
    </div>
  );
};

// Viewport-based loading component
export const ViewportSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  loadingThreshold?: number;
  unloadThreshold?: number;
}> = ({ 
  children, 
  className = '', 
  loadingThreshold = 0.1, 
  unloadThreshold = -0.5 
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  const { isInView: isIntersecting, progress, ref: sectionRef } = useScrollTrigger({
    threshold: [loadingThreshold, Math.abs(unloadThreshold)],
    triggerOnce: false,
  });

  useEffect(() => {
    if (progress >= loadingThreshold) {
      setShouldRender(true);
    } else if (progress <= Math.abs(unloadThreshold)) {
      // Optionally unload content that's far from viewport to save memory
      // setShouldRender(false);
    }
  }, [progress, loadingThreshold, unloadThreshold]);

  return (
    <div ref={sectionRef} className={className}>
      {shouldRender ? children : (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 bg-neutral-200 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default LazySection;