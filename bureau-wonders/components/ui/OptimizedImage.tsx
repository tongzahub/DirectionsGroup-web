'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ProgressiveImage } from '@/components/progressive/ProgressiveImage';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { useNetworkAwareLoading } from '@/hooks/usePerformanceAwareAnimations';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: (error: Error) => void;
  fallbackSrc?: string;
  webpSrc?: string;
  avifSrc?: string;
  responsive?: boolean;
  lazyLoad?: boolean;
  preload?: boolean;
}

// Generate optimized image URLs for different formats and sizes
const generateImageSources = (
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png';
  } = {}
) => {
  const { width, height, quality = 80, format } = options;
  
  // If it's already an optimized URL or external URL, return as-is
  if (src.includes('?') || src.startsWith('http') || src.startsWith('//')) {
    return src;
  }
  
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality !== 80) params.set('q', quality.toString());
  if (format) params.set('f', format);
  
  return `${src}${params.toString() ? `?${params.toString()}` : ''}`;
};

// Generate responsive image sizes
const generateResponsiveSizes = (breakpoints: Record<string, number>) => {
  return Object.entries(breakpoints)
    .map(([breakpoint, width]) => {
      if (breakpoint === 'default') {
        return `${width}px`;
      }
      return `(max-width: ${breakpoint}) ${width}px`;
    })
    .join(', ');
};

// Default responsive breakpoints for brand story images
const defaultBreakpoints = {
  '640px': 640,   // Mobile
  '768px': 768,   // Tablet
  '1024px': 1024, // Desktop
  '1280px': 1280, // Large desktop
  'default': 1920, // Default
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 80,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  loading,
  onLoad,
  onError,
  fallbackSrc,
  webpSrc,
  avifSrc,
  responsive = true,
  lazyLoad = true,
  preload = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  
  const { shouldLazyLoad, getImageSrc } = useNetworkAwareLoading();
  const { isInView: isIntersecting, ref: imageRef } = useScrollTrigger({
    rootMargin: '50px 0px',
    threshold: 0.1,
    triggerOnce: true,
  });

  // Determine if image should be lazy loaded
  const shouldUseLazyLoading = lazyLoad && shouldLazyLoad() && !priority && !preload;
  const shouldLoad = !shouldUseLazyLoading || isIntersecting || priority || preload;

  // Generate optimized sources
  const optimizedSrc = generateImageSources(currentSrc, { width, height, quality });
  const webpOptimized = webpSrc || generateImageSources(currentSrc, { width, height, quality, format: 'webp' });
  const avifOptimized = avifSrc || generateImageSources(currentSrc, { width, height, quality, format: 'avif' });

  // Generate responsive sizes
  const responsiveSizes = sizes || (responsive ? generateResponsiveSizes(defaultBreakpoints) : undefined);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error with fallback
  const handleError = (error?: Error) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    
    setImageError(true);
    onError?.(error || new Error('Image failed to load'));
  };

  // Generate blur data URL if not provided
  const generateBlurDataURL = (imageSrc: string) => {
    // Simple base64 encoded 1x1 pixel image
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rq5TaUVZLDe9VvNvuF1e4zUNQ2+4Q5Zb1Qy2qLLcXBhkuLaGVJYpBuV1YBlYcEEAgg+lBBX/Z';
  };

  // Create blur data URL
  const blurData = blurDataURL || (placeholder === 'blur' ? generateBlurDataURL(src) : undefined);

  // Loading state component
  const LoadingPlaceholder = () => (
    <div className={cn('bg-neutral-200 animate-pulse', className)} style={{ width, height }}>
      {blurData && (
        <img
          src={blurData}
          alt=""
          className="w-full h-full object-cover opacity-50"
          aria-hidden="true"
        />
      )}
    </div>
  );

  // Error state component
  const ErrorPlaceholder = () => (
    <div className={cn('bg-neutral-100 flex items-center justify-center', className)} style={{ width, height }}>
      <div className="text-center text-neutral-400">
        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-xs">Image unavailable</span>
      </div>
    </div>
  );

  // If image shouldn't load yet, show placeholder
  if (!shouldLoad) {
    return (
      <div ref={imageRef} className={className}>
        <LoadingPlaceholder />
      </div>
    );
  }

  // If image failed to load, show error placeholder
  if (imageError) {
    return <ErrorPlaceholder />;
  }

  // Use Next.js Image component for optimal performance
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    return (
      <div ref={imageRef} className={cn('relative overflow-hidden', className)}>
        {/* Modern browsers with WebP/AVIF support */}
        <picture>
          {/* AVIF source for maximum compression */}
          <source
            srcSet={avifOptimized}
            sizes={responsiveSizes}
            type="image/avif"
          />
          
          {/* WebP source for good compression and wide support */}
          <source
            srcSet={webpOptimized}
            sizes={responsiveSizes}
            type="image/webp"
          />
          
          {/* Fallback to original format */}
          <Image
            src={optimizedSrc}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            sizes={responsiveSizes}
            quality={quality}
            priority={priority}
            loading={loading || (priority ? 'eager' : 'lazy')}
            placeholder={placeholder}
            blurDataURL={blurData}
            className={cn(
              'transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              fill ? `object-${objectFit}` : ''
            )}
            style={fill ? { objectPosition } : undefined}
            onLoad={handleLoad}
            onError={() => handleError()}
          />
        </picture>
        
        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-neutral-200 animate-pulse flex items-center justify-center">
            {blurData && (
              <img
                src={blurData}
                alt=""
                className="w-full h-full object-cover opacity-50"
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback for older browsers or SSR
  return (
    <div ref={imageRef} className={className}>
      <ProgressiveImage
        src={optimizedSrc}
        fallbackSrc={fallbackSrc}
        webpSrc={webpOptimized}
        alt={alt}
        width={width}
        height={height}
        lazy={shouldUseLazyLoading}
        priority={priority ? 'high' : 'medium'}
        placeholder={blurData}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
};

// Specialized component for brand story hero images
export const BrandStoryHeroImage: React.FC<Omit<OptimizedImageProps, 'responsive' | 'sizes'>> = (props) => {
  return (
    <OptimizedImage
      {...props}
      priority={true}
      quality={90}
      sizes="100vw"
      responsive={true}
      lazyLoad={false}
      preload={true}
    />
  );
};

// Specialized component for case study images
export const CaseStudyImage: React.FC<Omit<OptimizedImageProps, 'responsive' | 'sizes'>> = (props) => {
  return (
    <OptimizedImage
      {...props}
      quality={85}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
      responsive={true}
      lazyLoad={true}
    />
  );
};

// Specialized component for testimonial avatars
export const TestimonialAvatar: React.FC<Omit<OptimizedImageProps, 'responsive' | 'sizes' | 'width' | 'height'>> = (props) => {
  return (
    <OptimizedImage
      {...props}
      width={64}
      height={64}
      quality={90}
      sizes="64px"
      responsive={false}
      lazyLoad={true}
      className={cn('rounded-full', props.className)}
    />
  );
};

// Specialized component for company logos
export const CompanyLogo: React.FC<Omit<OptimizedImageProps, 'responsive' | 'sizes'>> = (props) => {
  return (
    <OptimizedImage
      {...props}
      quality={95}
      sizes="(max-width: 640px) 120px, 150px"
      responsive={true}
      lazyLoad={true}
      objectFit="contain"
    />
  );
};

export default OptimizedImage;