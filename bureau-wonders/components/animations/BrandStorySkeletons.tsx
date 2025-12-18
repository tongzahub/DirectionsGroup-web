'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMobileAnimationConfig } from '@/lib/mobile-animation-config';

// Base skeleton component with performance-aware animations
interface BaseSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
}

const BaseSkeleton: React.FC<BaseSkeletonProps> = ({
  className = '',
  width = '100%',
  height = '1rem',
  variant = 'rectangular',
}) => {
  const { complexity, shouldAnimate } = useMobileAnimationConfig();

  const baseClasses = cn(
    'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200',
    variant === 'circular' ? 'rounded-full' : 'rounded-md',
    shouldAnimate && complexity !== 'minimal' ? 'bg-[length:200%_100%]' : '',
    className
  );

  const animationVariants = {
    minimal: {
      animate: {
        opacity: [0.5, 0.8, 0.5],
      },
    },
    reduced: {
      animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
      },
    },
    standard: {
      animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
      },
    },
    enhanced: {
      animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        scale: [1, 1.01, 1],
      },
    },
  };

  const transitionConfig = {
    minimal: {
      duration: 2,
      repeat: Infinity,
      ease: "linear" as const,
    },
    reduced: {
      duration: 2,
      repeat: Infinity,
      ease: "linear" as const,
    },
    standard: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear" as const,
    },
    enhanced: {
      backgroundPosition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "linear" as const,
      },
      scale: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  if (!shouldAnimate) {
    return (
      <div
        className={cn('bg-neutral-200', variant === 'circular' ? 'rounded-full' : 'rounded-md', className)}
        style={{ width, height }}
      />
    );
  }

  return (
    <motion.div
      className={baseClasses}
      style={{ width, height }}
      variants={animationVariants[complexity]}
      animate="animate"
      transition={transitionConfig[complexity]}
    />
  );
};

// Hero section skeleton
export const HeroSectionSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={cn('bg-gradient-to-br from-primary-blue via-blue-600 to-blue-700 text-white', className)}>
      <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Title skeleton */}
          <div className="space-y-4">
            <BaseSkeleton height="3rem" width="60%" className="mx-auto bg-white/20" />
            <BaseSkeleton height="3rem" width="40%" className="mx-auto bg-white/20" />
          </div>
          
          {/* Subtitle skeleton */}
          <div className="space-y-3">
            <BaseSkeleton height="1.5rem" width="80%" className="mx-auto bg-white/15" />
            <BaseSkeleton height="1.5rem" width="60%" className="mx-auto bg-white/15 hidden sm:block" />
          </div>
          
          {/* CTA button skeleton */}
          <BaseSkeleton height="3rem" width="12rem" className="mx-auto bg-white/20 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

// Success story card skeleton
export const SuccessStoryCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={cn('bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-neutral-200 mx-4 sm:mx-0', className)}>
      {/* Featured image skeleton */}
      <BaseSkeleton height="12rem" className="w-full rounded-none" />
      
      <div className="p-4 sm:p-6 space-y-4">
        {/* Client badge and title */}
        <div className="space-y-3">
          <BaseSkeleton height="1.5rem" width="6rem" className="rounded-full" />
          <BaseSkeleton height="1.5rem" width="85%" />
        </div>
        
        {/* Challenge and results */}
        <div className="space-y-4">
          <div className="space-y-2">
            <BaseSkeleton height="1rem" width="4rem" />
            <BaseSkeleton height="1rem" width="100%" />
            <BaseSkeleton height="1rem" width="90%" />
            <BaseSkeleton height="1rem" width="75%" />
          </div>
          
          <div className="space-y-2">
            <BaseSkeleton height="1rem" width="5rem" />
            <BaseSkeleton height="1rem" width="100%" />
            <BaseSkeleton height="1rem" width="85%" />
          </div>
        </div>
        
        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 p-3 sm:p-4 bg-neutral-soft-gray rounded-lg">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="text-center space-y-1">
              <BaseSkeleton height="1.5rem" width="3rem" className="mx-auto" />
              <BaseSkeleton height="0.75rem" width="4rem" className="mx-auto" />
              <BaseSkeleton height="0.75rem" width="3.5rem" className="mx-auto" />
            </div>
          ))}
        </div>
        
        {/* Testimonial */}
        <div className="border-t border-neutral-200 pt-3 sm:pt-4 space-y-3">
          <BaseSkeleton height="1rem" width="100%" />
          <BaseSkeleton height="1rem" width="80%" />
          
          <div className="flex items-center space-x-3">
            <BaseSkeleton variant="circular" width="2rem" height="2rem" />
            <div className="flex-1 space-y-1">
              <BaseSkeleton height="0.875rem" width="8rem" />
              <BaseSkeleton height="0.75rem" width="10rem" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success stories section skeleton
export const SuccessStoriesSectionSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <section className={cn('py-12 sm:py-16 md:py-20 lg:py-24', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 space-y-4">
          <BaseSkeleton height="3rem" width="60%" className="mx-auto" />
          <div className="space-y-2 max-w-2xl mx-auto">
            <BaseSkeleton height="1.25rem" width="100%" />
            <BaseSkeleton height="1.25rem" width="85%" />
            <BaseSkeleton height="1.25rem" width="70%" />
          </div>
        </div>
        
        {/* Metrics overview */}
        <div className="bg-gradient-to-r from-primary-blue to-blue-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white mx-4 sm:mx-0 mb-8 sm:mb-10 md:mb-12">
          <BaseSkeleton height="2rem" width="12rem" className="mx-auto mb-6 sm:mb-8 bg-white/20" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="text-center space-y-2">
                <BaseSkeleton height="2.5rem" width="4rem" className="mx-auto bg-white/20" />
                <BaseSkeleton height="1rem" width="5rem" className="mx-auto bg-white/15" />
                <BaseSkeleton height="0.75rem" width="4rem" className="mx-auto bg-white/15" />
                <BaseSkeleton height="0.75rem" width="3rem" className="mx-auto bg-white/10" />
              </div>
            ))}
          </div>
        </div>
        
        {/* View mode toggle */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-neutral-soft-gray rounded-lg p-1 flex w-full max-w-xs sm:w-auto">
            <BaseSkeleton height="2.5rem" width="8rem" className="rounded-md" />
            <div className="w-1" />
            <BaseSkeleton height="2.5rem" width="6rem" className="rounded-md" />
          </div>
        </div>
        
        {/* Story card */}
        <div className="max-w-2xl mx-auto">
          <SuccessStoryCardSkeleton />
        </div>
        
        {/* Navigation indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <BaseSkeleton key={index} variant="circular" width="0.75rem" height="0.75rem" />
          ))}
        </div>
      </div>
    </section>
  );
};

// Problem section skeleton
export const ProblemSectionSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <section className={cn('py-12 sm:py-16 md:py-20 lg:py-32', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-4">
          <BaseSkeleton height="3rem" width="60%" className="mx-auto" />
          <BaseSkeleton height="0.25rem" width="6rem" className="mx-auto rounded-full" />
        </div>
        
        {/* Problems grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 md:mb-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-neutral-200 mx-4 sm:mx-0">
              <div className="space-y-4">
                {/* Icon and expand button */}
                <div className="flex items-start justify-between">
                  <BaseSkeleton variant="circular" width="3rem" height="3rem" />
                  <BaseSkeleton variant="circular" width="1.25rem" height="1.25rem" />
                </div>
                
                {/* Title */}
                <BaseSkeleton height="1.5rem" width="85%" />
                
                {/* Description preview */}
                <div className="space-y-2">
                  <BaseSkeleton height="1rem" width="100%" />
                  <BaseSkeleton height="1rem" width="90%" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Show more button */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <BaseSkeleton height="3rem" width="12rem" className="mx-auto rounded-lg" />
        </div>
        
        {/* Transition statement */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="space-y-3">
            <BaseSkeleton height="1.25rem" width="100%" />
            <BaseSkeleton height="1.25rem" width="85%" />
            <BaseSkeleton height="1.25rem" width="70%" />
          </div>
        </div>
      </div>
    </section>
  );
};

// Stakes section skeleton
export const StakesSectionSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <section className={cn('py-12 sm:py-16 md:py-20 lg:py-32 bg-gradient-to-b from-neutral-50 to-white', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-4">
          <BaseSkeleton height="3rem" width="70%" className="mx-auto" />
          <BaseSkeleton height="0.25rem" width="6rem" className="mx-auto rounded-full" />
        </div>
        
        {/* Failure scenarios grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 md:mb-16">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-neutral-100 mx-4 sm:mx-0">
              <div className="space-y-4">
                {/* Icon and title */}
                <div className="space-y-3">
                  <BaseSkeleton variant="circular" width="3rem" height="3rem" />
                  <BaseSkeleton height="1.5rem" width="85%" />
                </div>
                
                {/* Consequences list */}
                <div className="space-y-3">
                  <BaseSkeleton height="1rem" width="6rem" />
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <BaseSkeleton variant="circular" width="0.375rem" height="0.375rem" className="mt-2" />
                      <BaseSkeleton height="1rem" width={`${85 - idx * 5}%`} />
                    </div>
                  ))}
                </div>
                
                {/* Real world example */}
                <div className="pt-3 border-t border-neutral-100 space-y-2">
                  <BaseSkeleton height="0.875rem" width="100%" />
                  <BaseSkeleton height="0.875rem" width="90%" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Opportunity cost statement */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-10 md:mb-12 border border-amber-100 mx-4 sm:mx-0">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <BaseSkeleton variant="circular" width="3rem" height="3rem" className="flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <BaseSkeleton height="1.5rem" width="10rem" />
              <BaseSkeleton height="1rem" width="100%" />
              <BaseSkeleton height="1rem" width="95%" />
              <BaseSkeleton height="1rem" width="85%" />
            </div>
          </div>
        </div>
        
        {/* Success vs failure contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 md:mb-16">
          {/* Failure path */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-red-200 mx-4 sm:mx-0">
            <div className="text-center space-y-4">
              <BaseSkeleton variant="circular" width="4rem" height="4rem" className="mx-auto" />
              <BaseSkeleton height="1.5rem" width="80%" className="mx-auto" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <BaseSkeleton variant="circular" width="0.5rem" height="0.5rem" />
                    <BaseSkeleton height="1rem" width="70%" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Success path */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-green-200 mx-4 sm:mx-0">
            <div className="text-center space-y-4">
              <BaseSkeleton variant="circular" width="4rem" height="4rem" className="mx-auto" />
              <BaseSkeleton height="1.5rem" width="75%" className="mx-auto" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <BaseSkeleton variant="circular" width="0.5rem" height="0.5rem" />
                    <BaseSkeleton height="1rem" width="75%" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Transition to action */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg border border-neutral-100 mx-4 sm:mx-0 space-y-3">
            <BaseSkeleton height="1.25rem" width="100%" />
            <BaseSkeleton height="1.25rem" width="90%" />
            <BaseSkeleton height="1.25rem" width="80%" />
          </div>
        </div>
      </div>
    </section>
  );
};

// Guide section skeleton
export const GuideSectionSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <section className={cn('py-12 sm:py-16 md:py-20 lg:py-32 bg-gradient-to-br from-neutral-50 to-white', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-4">
          <BaseSkeleton height="3rem" width="60%" className="mx-auto" />
          <BaseSkeleton height="0.25rem" width="6rem" className="mx-auto rounded-full" />
          <div className="space-y-2 max-w-4xl mx-auto">
            <BaseSkeleton height="1.5rem" width="100%" />
            <BaseSkeleton height="1.5rem" width="85%" />
            <BaseSkeleton height="1.5rem" width="90%" />
          </div>
        </div>

        {/* Authority Elements */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 space-y-2">
            <BaseSkeleton height="2rem" width="50%" className="mx-auto" />
            <BaseSkeleton height="1.25rem" width="70%" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-neutral-200 p-6">
                <div className="flex items-start mb-4">
                  <BaseSkeleton variant="rectangular" width="3rem" height="3rem" className="rounded-xl mr-4" />
                  <BaseSkeleton variant="rectangular" width="5rem" height="3.75rem" className="rounded-lg" />
                </div>
                <div className="space-y-3">
                  <BaseSkeleton height="1.5rem" width="80%" />
                  <BaseSkeleton height="1rem" width="100%" />
                  <BaseSkeleton height="1rem" width="90%" />
                  <BaseSkeleton height="1rem" width="75%" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 space-y-2">
            <BaseSkeleton height="2rem" width="45%" className="mx-auto" />
            <BaseSkeleton height="1.25rem" width="65%" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                <BaseSkeleton variant="rectangular" width="100%" height="12rem" />
                <div className="p-6 space-y-3">
                  <BaseSkeleton height="1.5rem" width="70%" />
                  <BaseSkeleton height="1rem" width="60%" />
                  <div className="flex flex-wrap gap-2">
                    <BaseSkeleton height="1.5rem" width="4rem" className="rounded-full" />
                    <BaseSkeleton height="1.5rem" width="5rem" className="rounded-full" />
                    <BaseSkeleton height="1.5rem" width="3.5rem" className="rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <BaseSkeleton height="1rem" width="100%" />
                    <BaseSkeleton height="1rem" width="85%" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <div className="text-center mb-8 space-y-2">
            <BaseSkeleton height="2rem" width="40%" className="mx-auto" />
            <BaseSkeleton height="1.25rem" width="55%" className="mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl p-6 border border-primary-200">
                <div className="space-y-4 mb-6">
                  <BaseSkeleton height="1rem" width="100%" />
                  <BaseSkeleton height="1rem" width="90%" />
                  <BaseSkeleton height="1rem" width="80%" />
                </div>
                <div className="flex items-center">
                  <BaseSkeleton variant="circular" width="3rem" height="3rem" className="mr-4" />
                  <div className="flex-grow space-y-2">
                    <BaseSkeleton height="1rem" width="70%" />
                    <BaseSkeleton height="0.875rem" width="50%" />
                    <BaseSkeleton height="0.875rem" width="60%" />
                  </div>
                  <BaseSkeleton variant="rectangular" width="3.75rem" height="2rem" className="rounded ml-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Plan section skeleton
export const PlanSectionSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <section className={cn('py-12 sm:py-16 md:py-20 lg:py-32 bg-gradient-to-br from-white to-neutral-50', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-4">
          <BaseSkeleton height="3rem" width="50%" className="mx-auto" />
          <BaseSkeleton height="0.25rem" width="6rem" className="mx-auto rounded-full" />
          <div className="space-y-2 max-w-4xl mx-auto">
            <BaseSkeleton height="1.5rem" width="100%" />
            <BaseSkeleton height="1.5rem" width="85%" />
            <BaseSkeleton height="1.5rem" width="90%" />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <React.Fragment key={index}>
              <BaseSkeleton variant="circular" width="2.5rem" height="2.5rem" />
              {index < 2 && <BaseSkeleton height="0.25rem" width="4rem" className="rounded-full" />}
            </React.Fragment>
          ))}
        </div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto space-y-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
              {/* Step number badge */}
              <div className="absolute -top-4 -left-4">
                <BaseSkeleton variant="circular" width="3rem" height="3rem" />
              </div>
              
              <div className="space-y-4">
                {/* Step icon and title */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <BaseSkeleton variant="rectangular" width="3rem" height="3rem" className="rounded-lg" />
                    <BaseSkeleton height="1.5rem" width="75%" />
                    <div className="space-y-2">
                      <BaseSkeleton height="1rem" width="100%" />
                      <BaseSkeleton height="1rem" width="90%" />
                      <BaseSkeleton height="1rem" width="80%" />
                    </div>
                  </div>
                  <BaseSkeleton variant="circular" width="1.5rem" height="1.5rem" />
                </div>
                
                {/* Expandable details */}
                <div className="pt-4 border-t border-neutral-100 space-y-3">
                  <BaseSkeleton height="1rem" width="8rem" />
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <BaseSkeleton variant="circular" width="1.25rem" height="1.25rem" />
                      <BaseSkeleton height="1rem" width={`${90 - idx * 5}%`} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Progress connector */}
              {index < 2 && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <BaseSkeleton height="3rem" width="0.25rem" className="rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reassurance statement */}
        <div className="mt-16 lg:mt-20">
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-primary-100 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <BaseSkeleton variant="circular" width="3rem" height="3rem" />
              <div className="flex-1 space-y-3">
                <BaseSkeleton height="1.5rem" width="60%" />
                <BaseSkeleton height="1rem" width="100%" />
                <BaseSkeleton height="1rem" width="90%" />
                <BaseSkeleton height="1rem" width="85%" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA hint */}
        <div className="text-center mt-16">
          <BaseSkeleton height="1.25rem" width="20rem" className="mx-auto" />
        </div>
      </div>
    </section>
  );
};

// Call to action section skeleton
export const CallToActionSectionSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <section className={cn('py-12 sm:py-16 md:py-20 bg-gradient-to-br from-neutral-50 to-white', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-4">
          <BaseSkeleton height="3rem" width="80%" className="mx-auto" />
          <div className="space-y-2 max-w-2xl mx-auto">
            <BaseSkeleton height="1.25rem" width="100%" />
            <BaseSkeleton height="1.25rem" width="85%" />
          </div>
        </div>
        
        {/* Main CTA content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Primary CTA - Contact Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-neutral-100 mx-4 sm:mx-0">
            <div className="space-y-6">
              {/* Form header */}
              <div className="space-y-3">
                <BaseSkeleton height="2rem" width="75%" />
                <BaseSkeleton height="1rem" width="100%" />
                <BaseSkeleton height="1rem" width="85%" />
              </div>
              
              {/* Trust signals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <BaseSkeleton variant="circular" width="1rem" height="1rem" />
                    <BaseSkeleton height="0.875rem" width="8rem" />
                  </div>
                ))}
              </div>
              
              {/* Guarantee box */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start space-x-3">
                  <BaseSkeleton variant="circular" width="1.5rem" height="1.5rem" />
                  <div className="flex-1 space-y-2">
                    <BaseSkeleton height="1rem" width="6rem" />
                    <BaseSkeleton height="0.875rem" width="100%" />
                    <BaseSkeleton height="0.875rem" width="90%" />
                  </div>
                </div>
              </div>
              
              {/* Form fields */}
              <div className="space-y-4">
                <BaseSkeleton height="3rem" width="100%" className="rounded-lg" />
                <BaseSkeleton height="3rem" width="100%" className="rounded-lg" />
                <BaseSkeleton height="6rem" width="100%" className="rounded-lg" />
                <BaseSkeleton height="3rem" width="100%" className="rounded-lg" />
              </div>
            </div>
          </div>
          
          {/* Secondary CTAs */}
          <div className="space-y-4 sm:space-y-6 mx-4 sm:mx-0">
            <BaseSkeleton height="2rem" width="60%" />
            
            <div className="space-y-3 sm:space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md border border-neutral-100 p-4 sm:p-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <BaseSkeleton variant="circular" width="3rem" height="3rem" />
                    <div className="flex-1 space-y-3">
                      <BaseSkeleton height="1.25rem" width="75%" />
                      <div className="space-y-1">
                        <BaseSkeleton height="0.875rem" width="100%" />
                        <BaseSkeleton height="0.875rem" width="85%" />
                      </div>
                      <div className="flex items-center justify-between">
                        <BaseSkeleton height="1rem" width="6rem" />
                        <BaseSkeleton width="1.25rem" height="1.25rem" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <BaseSkeleton height="3rem" width="100%" className="rounded-lg" />
          </div>
        </div>
        
        {/* Bottom trust bar */}
        <div className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-neutral-200">
          <div className="text-center space-y-4">
            <BaseSkeleton height="1rem" width="12rem" className="mx-auto" />
            <div className="flex justify-center items-center gap-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <BaseSkeleton key={index} height="2rem" width="5rem" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Complete brand story page skeleton
export const BrandStoryPageSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <main className={cn('min-h-screen bg-white', className)}>
      <HeroSectionSkeleton />
      <SuccessStoriesSectionSkeleton className="bg-neutral-soft-gray" />
      <StakesSectionSkeleton />
      <CallToActionSectionSkeleton />
    </main>
  );
};

export default {
  BaseSkeleton,
  HeroSectionSkeleton,
  SuccessStoryCardSkeleton,
  SuccessStoriesSectionSkeleton,
  ProblemSectionSkeleton,
  PlanSectionSkeleton,
  StakesSectionSkeleton,
  CallToActionSectionSkeleton,
  BrandStoryPageSkeleton,
};