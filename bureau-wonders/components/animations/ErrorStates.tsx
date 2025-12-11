'use client';

import React, { useState } from 'react';
import { FadeInUp } from '@/components/animations';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  type?: 'network' | 'notFound' | 'server' | 'generic';
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  showIcon?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  type = 'generic',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
  showIcon = true,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const errorConfig = {
    network: {
      title: title || 'Connection Error',
      message: message || 'Unable to connect to the server. Please check your internet connection.',
      icon: (
        <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
    },
    notFound: {
      title: title || 'Content Not Found',
      message: message || 'The content you\'re looking for doesn\'t exist or has been moved.',
      icon: (
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    server: {
      title: title || 'Server Error',
      message: message || 'Something went wrong on our end. Please try again in a moment.',
      icon: (
        <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
    },
    generic: {
      title: title || 'Something went wrong',
      message: message || 'An unexpected error occurred. Please try again.',
      icon: (
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const config = errorConfig[type];

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <FadeInUp delay={0}>
        <div className="max-w-md mx-auto">
          {showIcon && (
            <div className="mb-6 flex justify-center animate-bounce">
              {config.icon}
            </div>
          )}
          
          <h3 className="text-xl md:text-2xl font-bold text-neutral-gray-dark mb-4">
            {config.title}
          </h3>
          
          <p className="text-neutral-gray mb-8 leading-relaxed">
            {config.message}
          </p>
          
          {onRetry && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="inline-flex items-center px-6 py-3 bg-primary-blue text-white font-semibold rounded-xl hover:bg-primary-darker transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {isRetrying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Retrying...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {retryLabel}
                </>
              )}
            </button>
          )}
        </div>
      </FadeInUp>
    </div>
  );
};

export interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No content available',
  message = 'There\'s nothing to show here yet. Check back later!',
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  const defaultIcon = (
    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className={`text-center py-16 px-4 ${className}`}>
      <FadeInUp delay={0}>
        <div className="max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            {icon || defaultIcon}
          </div>
          
          <h3 className="text-xl md:text-2xl font-bold text-neutral-gray-dark mb-4">
            {title}
          </h3>
          
          <p className="text-neutral-gray mb-8 leading-relaxed">
            {message}
          </p>
          
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="inline-flex items-center px-6 py-3 bg-primary-blue text-white font-semibold rounded-xl hover:bg-primary-darker transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </FadeInUp>
    </div>
  );
};

export interface NetworkStatusProps {
  isOnline: boolean;
  className?: string;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  isOnline,
  className = '',
}) => {
  if (isOnline) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 px-4 animate-slide-down ${className}`}>
      <div className="flex items-center justify-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span className="text-sm font-medium">No internet connection</span>
      </div>
    </div>
  );
};

export interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  showPercentage = false,
  color = 'primary',
}) => {
  const colorClasses = {
    primary: 'bg-primary-blue',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        {showPercentage && (
          <span className="text-sm font-medium text-neutral-gray-dark">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default {
  ErrorState,
  EmptyState,
  NetworkStatus,
  ProgressBar,
};