'use client';

import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card' | 'image';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4 rounded-md',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    card: 'rounded-2xl',
    image: 'aspect-square rounded-xl',
  };

  const style = {
    width: width || (variant === 'circular' ? height : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

export interface BlogPostSkeletonProps {
  count?: number;
  className?: string;
}

export const BlogPostSkeleton: React.FC<BlogPostSkeletonProps> = ({
  count = 3,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
          <Skeleton variant="image" className="mb-4" />
          <div className="space-y-3">
            <Skeleton variant="rectangular" height="1.5rem" className="w-20" />
            <Skeleton variant="text" lines={2} />
            <div className="flex items-center space-x-3 pt-2">
              <Skeleton variant="circular" width="2rem" height="2rem" />
              <div className="flex-1">
                <Skeleton variant="text" className="w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export interface CaseStudySkeletonProps {
  count?: number;
  className?: string;
}

export const CaseStudySkeleton: React.FC<CaseStudySkeletonProps> = ({
  count = 3,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
          <Skeleton variant="rectangular" height="12rem" />
          <div className="p-6 space-y-3">
            <Skeleton variant="rectangular" height="1.25rem" className="w-16" />
            <Skeleton variant="text" lines={2} />
            <Skeleton variant="text" className="w-32" />
          </div>
        </div>
      ))}
    </div>
  );
};

export interface ServiceSkeletonProps {
  count?: number;
  className?: string;
}

export const ServiceSkeleton: React.FC<ServiceSkeletonProps> = ({
  count = 3,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl p-8 shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
          <Skeleton variant="circular" width="4rem" height="4rem" className="mb-6" />
          <Skeleton variant="text" height="1.5rem" className="mb-4 w-3/4" />
          <Skeleton variant="text" lines={3} />
          <div className="mt-6">
            <Skeleton variant="rectangular" height="2.5rem" className="w-32" />
          </div>
        </div>
      ))}
    </div>
  );
};

export interface ContentSkeletonProps {
  type?: 'article' | 'page' | 'list';
  className?: string;
}

export const ContentSkeleton: React.FC<ContentSkeletonProps> = ({
  type = 'article',
  className = '',
}) => {
  if (type === 'article') {
    return (
      <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
        <div className="space-y-4">
          <Skeleton variant="rectangular" height="1rem" className="w-24" />
          <Skeleton variant="text" height="3rem" lines={2} />
          <div className="flex items-center space-x-4">
            <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
            <div className="space-y-2">
              <Skeleton variant="text" className="w-32" />
              <Skeleton variant="text" className="w-24" />
            </div>
          </div>
        </div>
        
        <Skeleton variant="rectangular" height="20rem" className="w-full" />
        
        <div className="space-y-4">
          <Skeleton variant="text" lines={4} />
          <Skeleton variant="text" lines={3} />
          <Skeleton variant="text" lines={5} />
        </div>
      </div>
    );
  }

  if (type === 'page') {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="text-center space-y-4">
          <Skeleton variant="text" height="4rem" className="w-3/4 mx-auto" />
          <Skeleton variant="text" lines={2} className="max-w-2xl mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="card" height="16rem" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
          <Skeleton variant="circular" width="3rem" height="3rem" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-primary-blue',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  className = '',
  spinnerSize = 'lg',
  message = 'Loading...',
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 animate-fade-in">
          <div className="text-center">
            <LoadingSpinner size={spinnerSize} className="mx-auto mb-4" />
            <p className="text-neutral-gray font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default {
  Skeleton,
  BlogPostSkeleton,
  CaseStudySkeleton,
  ServiceSkeleton,
  ContentSkeleton,
  LoadingSpinner,
  LoadingOverlay,
};