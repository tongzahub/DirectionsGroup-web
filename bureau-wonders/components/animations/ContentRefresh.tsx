'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FadeInUp } from '@/components/animations';

export interface ContentRefreshProps {
  onRefresh: () => Promise<void>;
  autoRefreshInterval?: number;
  showRefreshButton?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const ContentRefresh: React.FC<ContentRefreshProps> = ({
  onRefresh,
  autoRefreshInterval,
  showRefreshButton = true,
  className = '',
  children,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showRefreshNotification, setShowRefreshNotification] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setShowRefreshNotification(false);
    
    try {
      await onRefresh();
      setLastRefresh(new Date());
      
      // Show success notification briefly
      setShowRefreshNotification(true);
      setTimeout(() => setShowRefreshNotification(false), 3000);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefreshInterval) return;

    const interval = setInterval(() => {
      if (!isRefreshing) {
        handleRefresh();
      }
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshInterval, isRefreshing, handleRefresh]);

  return (
    <div className={`relative ${className}`}>
      {/* Refresh notification */}
      {showRefreshNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Content updated
          </div>
        </div>
      )}

      {/* Refresh button */}
      {showRefreshButton && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 disabled:opacity-50 group"
            aria-label="Refresh content"
          >
            <svg
              className={`w-5 h-5 text-neutral-gray-dark transition-transform duration-300 ${
                isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Content with refresh overlay */}
      <div className={`transition-all duration-500 ${isRefreshing ? 'opacity-75' : 'opacity-100'}`}>
        {children}
      </div>

      {/* Refreshing overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex items-center justify-center z-20 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin w-5 h-5 text-primary-blue" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-medium text-neutral-gray-dark">Updating content...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  threshold = 80,
  className = '',
  children,
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0) {
      setIsPulling(true);
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
    setStartY(0);
  };

  const pullProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {(isPulling || isRefreshing) && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-primary-blue/10 transition-all duration-300 z-10"
          style={{
            height: `${Math.max(pullDistance * 0.5, 0)}px`,
            transform: `translateY(-${Math.max(pullDistance * 0.5 - pullDistance, 0)}px)`,
          }}
        >
          <div className="flex items-center space-x-2 text-primary-blue">
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isRefreshing ? 'animate-spin' : ''
              } ${pullProgress >= 1 ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <span className="text-sm font-medium">
              {isRefreshing ? 'Refreshing...' : pullProgress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        className="transition-transform duration-300"
        style={{
          transform: `translateY(${isPulling ? pullDistance * 0.5 : 0}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export interface LazyContentProps {
  loader: () => Promise<any>;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  className?: string;
  children: (data: any) => React.ReactNode;
}

export const LazyContent: React.FC<LazyContentProps> = ({
  loader,
  fallback,
  errorFallback,
  className = '',
  children,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await loader();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [loader]);

  if (loading) {
    return (
      <div className={className}>
        {fallback || (
          <FadeInUp>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg className="animate-spin w-8 h-8 text-primary-blue mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-neutral-gray">Loading content...</p>
              </div>
            </div>
          </FadeInUp>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        {errorFallback || (
          <FadeInUp>
            <div className="text-center py-12">
              <p className="text-red-500">Failed to load content</p>
            </div>
          </FadeInUp>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <FadeInUp>
        {children(data)}
      </FadeInUp>
    </div>
  );
};

export default {
  ContentRefresh,
  PullToRefresh,
  LazyContent,
};