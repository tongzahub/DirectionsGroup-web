'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/strapi-client';

interface StrapiImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onError?: () => void;
}

export default function StrapiImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  loading = 'lazy',
  onError,
}: StrapiImageProps) {
  const [imageError, setImageError] = useState(false);
  const [useNativeImg, setUseNativeImg] = useState(false);
  
  const imageUrl = getStrapiMediaUrl(src);
  
  if (!imageUrl || imageError) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 ${className}`}>
        <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const handleError = () => {
    if (!useNativeImg) {
      // Try with native img tag first
      setUseNativeImg(true);
    } else {
      // If native img also fails, show placeholder
      setImageError(true);
      onError?.();
    }
  };

  // Use native img tag for Strapi images to avoid Next.js optimization issues
  if (useNativeImg || imageUrl.includes('localhost:1337')) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`object-cover ${className}`}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : { width, height }}
        loading={loading}
        onError={handleError}
      />
    );
  }

  // Try Next.js Image first
  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      loading={loading}
      onError={handleError}
    />
  );
}