'use client';

import React from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  React.useEffect(() => {
    // Log critical error to monitoring service
    console.error('Global application error:', error);
    
    // Track critical error in analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: true,
        page_title: 'Global Error',
      });
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-lg w-full text-center">
            {/* Critical Error Icon */}
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-10 h-10 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            </div>

            {/* Error Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Application Error
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  We're experiencing technical difficulties. Our team has been notified 
                  and is working to resolve this issue as quickly as possible.
                </p>
              </div>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <details className="p-4 bg-gray-100 rounded-lg text-left">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Technical Details (Development)
                  </summary>
                  <pre className="text-sm text-gray-600 overflow-auto whitespace-pre-wrap">
                    {error.message}
                    {error.stack && `\n\nStack trace:\n${error.stack}`}
                    {error.digest && `\n\nError ID: ${error.digest}`}
                  </pre>
                </details>
              )}
            </div>

            {/* Recovery Actions */}
            <div className="mt-8 space-y-4">
              <button
                onClick={reset}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Try to Recover
              </button>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Go to Homepage
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>

            {/* Support Information */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                If this problem persists, please contact our support team:
              </p>
              <div className="space-y-2 text-sm">
                <a 
                  href="mailto:support@bureauofwonders.com" 
                  className="block text-blue-600 hover:text-blue-700 underline"
                >
                  support@bureauofwonders.com
                </a>
                <a 
                  href="/contact" 
                  className="block text-blue-600 hover:text-blue-700 underline"
                >
                  Contact Form
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}