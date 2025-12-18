import React from 'react';
import Link from 'next/link';
// Using simple button elements instead of complex Button component
import { ContentContainer, SectionContainer } from '@/components/layout/BrandStoryLayout';

export default function BrandStoryNotFound() {
  return (
    <SectionContainer variant="content" background="gray">
      <ContentContainer maxWidth="md" className="text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-primary-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" 
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Page Not Found
            </h1>
            
            <p className="text-xl text-neutral-600 leading-relaxed">
              The brand story content you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <p className="text-neutral-500">
            Our brand story is available at the main route. Let us guide you to the right place.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="mt-10 space-y-4">
          <Link href="/brand-story">
            <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              View Our Brand Story
            </button>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                Go Home
              </button>
            </Link>
            
            <Link href="/about">
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                About Us
              </button>
            </Link>
            
            <Link href="/contact">
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-500 mb-4">
            Explore other sections:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <Link 
              href="/services" 
              className="text-primary-600 hover:text-primary-600-700 underline"
            >
              Our Services
            </Link>
            <Link 
              href="/case-studies" 
              className="text-primary-600 hover:text-primary-600-700 underline"
            >
              Case Studies
            </Link>
            <Link 
              href="/blog" 
              className="text-primary-600 hover:text-primary-600-700 underline"
            >
              Insights & News
            </Link>
            <Link 
              href="/careers" 
              className="text-primary-600 hover:text-primary-600-700 underline"
            >
              Careers
            </Link>
          </div>
        </div>
      </ContentContainer>
    </SectionContainer>
  );
}