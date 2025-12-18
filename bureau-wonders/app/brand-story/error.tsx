'use client';

import React from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BrandStoryError({ error, reset }: ErrorPageProps) {
  React.useEffect(() => {
    // Log error to monitoring service
    console.error('Brand Story page error:', error);
    
    // Track error in analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        page_title: 'Brand Story',
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Something went wrong
          </h1>
          
          <p className="text-gray-600 leading-relaxed">
            We encountered an unexpected error while loading our brand story. 
            This is temporary and we're working to resolve it.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-xs text-gray-600 overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-describedby="retry-description"
          >
            Try Again
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Go Home
            </button>
            
            <button
              onClick={() => window.location.href = '/contact'}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Hidden description for screen readers */}
        <div id="retry-description" className="sr-only">
          Attempt to reload the brand story page and recover from the error
        </div>

        {/* Alternative Content Access */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            While we fix this issue, you can still:
          </p>
          <div className="space-y-2 text-sm">
            <a 
              href="/about" 
              className="block text-blue-600 hover:text-blue-700 underline"
            >
              Learn about our company
            </a>
            <a 
              href="/services" 
              className="block text-blue-600 hover:text-blue-700 underline"
            >
              Explore our services
            </a>
            <a 
              href="/case-studies" 
              className="block text-blue-600 hover:text-blue-700 underline"
            >
              View our case studies
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}