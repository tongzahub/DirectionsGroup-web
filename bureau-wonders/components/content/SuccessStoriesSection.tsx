'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations';
import { CaseStudyImage, TestimonialAvatar, CompanyLogo } from '@/components/ui/OptimizedImage';
import { CaseStudy, BrandStoryTestimonial, BrandStoryMetric, RichText } from '@/types';
import { cn } from '@/lib/utils';
import { useSwipeGesture } from '@/hooks/useTouchInteractions';

interface SuccessStoriesSectionProps {
  title: string;
  caseStudies: CaseStudy[];
  testimonials?: BrandStoryTestimonial[];
  metrics?: BrandStoryMetric[];
  overallImpactStatement?: RichText;
  className?: string;
}

// Individual success story card component
const SuccessStoryCard: React.FC<{
  caseStudy: CaseStudy;
  testimonial?: BrandStoryTestimonial;
  metrics?: BrandStoryMetric[];
  isActive: boolean;
  index?: number;
}> = ({ caseStudy, testimonial, metrics, isActive, index = 0 }) => {
  // Extract text from rich text content
  const extractText = (richText: string | object): string => {
    if (typeof richText === 'string') {
      return richText.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
    }
    return '';
  };

  return (
    <motion.article
      className={cn(
        'bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden',
        'border border-neutral-200',
        'mx-4 sm:mx-0', // Mobile margins
        isActive ? 'ring-2 ring-primary-blue' : ''
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      role="article"
      aria-labelledby={`case-study-title-${index}`}
      aria-describedby={`case-study-summary-${index}`}
      tabIndex={isActive ? 0 : -1}
    >
      {/* Mobile-Optimized Featured Image */}
      {caseStudy.featuredImage && (
        <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
          <CaseStudyImage
            src={caseStudy.featuredImage.url}
            alt={caseStudy.featuredImage.alternativeText || caseStudy.title}
            fill
            className="object-cover"
            priority={isActive}
            lazyLoad={!isActive}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Client logo overlay - responsive sizing */}
          {testimonial?.companyLogo && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2">
              <CompanyLogo
                src={testimonial.companyLogo.url}
                alt={testimonial.companyLogo.alternativeText || testimonial.companyName}
                width={60}
                height={30}
                className="object-contain"
                lazyLoad={!isActive}
              />
            </div>
          )}
        </div>
      )}

      <div className="p-4 sm:p-6">
        {/* Client and Project Info - Mobile Optimized */}
        <div className="mb-4">
          <span className="inline-block px-2 py-1 sm:px-3 sm:py-1 text-xs font-semibold text-blue-900 bg-blue-50 rounded-full uppercase tracking-wide">
            {caseStudy.client}
          </span>
          <h3 
            id={`case-study-title-${index}`}
            className="text-lg sm:text-xl font-bold text-neutral-900 mt-2 mb-2 leading-tight"
          >
            {caseStudy.title}
          </h3>
        </div>

        {/* Progressive Disclosure - Before/After Narrative Structure */}
        <div 
          id={`case-study-summary-${index}`}
          className="space-y-3 sm:space-y-4 mb-4 sm:mb-6"
        >
          {/* Challenge (Before) */}
          <div className="border-l-3 sm:border-l-4 border-red-200 pl-3 sm:pl-4">
            <h4 className="text-xs sm:text-sm font-semibold text-red-600 uppercase tracking-wide mb-1">
              Challenge
            </h4>
            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {extractText(caseStudy.challenge)}
            </p>
          </div>

          {/* Results (After) */}
          <div className="border-l-3 sm:border-l-4 border-green-200 pl-3 sm:pl-4">
            <h4 className="text-xs sm:text-sm font-semibold text-green-600 uppercase tracking-wide mb-1">
              Transformation
            </h4>
            <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {extractText(caseStudy.results)}
            </p>
          </div>
        </div>

        {/* Mobile-Optimized Metrics Display */}
        {metrics && metrics.length > 0 && (
          <div 
            className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-neutral-soft-gray rounded-lg"
            role="region"
            aria-label="Case study metrics and results"
          >
            {metrics.slice(0, 4).map((metric, metricIndex) => (
              <div key={metricIndex} className="text-center">
                <div 
                  className="text-base sm:text-lg font-bold text-blue-900"
                  aria-label={`${metric.label}: ${metric.value}`}
                >
                  {metric.value}
                </div>
                <div className="text-xs text-neutral-600 leading-tight">
                  {metric.label}
                </div>
                {metric.improvement && (
                  <div className="text-xs text-green-600 font-medium mt-0.5">
                    {metric.improvement}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mobile-Optimized Testimonial */}
        {testimonial && (
          <div className="border-t border-neutral-200 pt-3 sm:pt-4">
            <blockquote 
              className="text-sm text-neutral-600 italic mb-3 line-clamp-2 sm:line-clamp-3"
              cite={testimonial.companyName}
            >
              "{extractText(testimonial.quote)}"
            </blockquote>
            <div className="flex items-center">
              {testimonial.avatar && (
                <TestimonialAvatar
                  src={testimonial.avatar.url}
                  alt={testimonial.avatar.alternativeText || `${testimonial.clientName} profile photo`}
                  className="mr-2 sm:mr-3 w-7 h-7 sm:w-8 sm:h-8"
                  lazyLoad={!isActive}
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-neutral-900 truncate">
                  {testimonial.clientName}
                </div>
                {testimonial.clientTitle && (
                  <div className="text-xs text-neutral-600 truncate">
                    {testimonial.clientTitle}, {testimonial.companyName}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
};

// Mobile-Optimized Metrics overview component
const MetricsOverview: React.FC<{ metrics: BrandStoryMetric[] }> = ({ metrics }) => (
  <ScrollReveal className="mb-8 sm:mb-10 md:mb-12">
    <div className="bg-gradient-to-r from-primary-blue to-blue-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white mx-4 sm:mx-0">
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
        Transformation Outcomes
      </h3>
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <StaggerItem key={index}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                {metric.value}
              </div>
              <div className="text-xs sm:text-sm opacity-90 mb-1 leading-tight">
                {metric.label}
              </div>
              {metric.improvement && (
                <div className="text-xs bg-white/20 rounded-full px-2 py-1 inline-block mb-1">
                  {metric.improvement}
                </div>
              )}
              {metric.timeframe && (
                <div className="text-xs opacity-75">
                  {metric.timeframe}
                </div>
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </ScrollReveal>
);

// Main success stories section component
const SuccessStoriesSection: React.FC<SuccessStoriesSectionProps> = ({
  title,
  caseStudies,
  testimonials = [],
  metrics = [],
  overallImpactStatement,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  // Navigation handlers with accessibility announcements
  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? caseStudies.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    
    // Announce to screen readers
    const announcement = `Showing case study ${newIndex + 1} of ${caseStudies.length}: ${caseStudies[newIndex].title}`;
    setTimeout(() => {
      const announcer = document.getElementById('carousel-announcer');
      if (announcer) {
        announcer.textContent = announcement;
      }
    }, 100);
  };

  const goToNext = () => {
    const newIndex = currentIndex === caseStudies.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    
    // Announce to screen readers
    const announcement = `Showing case study ${newIndex + 1} of ${caseStudies.length}: ${caseStudies[newIndex].title}`;
    setTimeout(() => {
      const announcer = document.getElementById('carousel-announcer');
      if (announcer) {
        announcer.textContent = announcement;
      }
    }, 100);
  };

  // Swipe gesture handling
  const handleSwipe = (gesture: any) => {
    if (viewMode !== 'carousel') return;
    
    if (gesture.direction === 'left') {
      goToNext();
    } else if (gesture.direction === 'right') {
      goToPrevious();
    }
  };

  const swipeProps = useSwipeGesture(handleSwipe, {
    threshold: 50,
    direction: 'horizontal',
    preventScroll: true,
  });

  // Get testimonial and metrics for current case study
  const getCurrentTestimonial = (index: number) => {
    return testimonials[index] || testimonials[0];
  };

  const getCurrentMetrics = (index: number) => {
    // For demo purposes, rotate through available metrics
    const startIndex = (index * 2) % metrics.length;
    return metrics.slice(startIndex, startIndex + 4);
  };

  if (!caseStudies || caseStudies.length === 0) {
    return null;
  }

  return (
    <section 
      className={cn('py-12 sm:py-16 md:py-20 lg:py-24', className)}
      aria-labelledby="success-stories-heading"
      role="region"
    >
      {/* Screen reader announcements for carousel navigation */}
      <div 
        id="carousel-announcer"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-First Section Header */}
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 
              id="success-stories-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-tight"
            >
              {title}
            </h2>
            {overallImpactStatement && (
              <div 
                className="text-base sm:text-lg text-neutral-600 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
                dangerouslySetInnerHTML={{ 
                  __html: typeof overallImpactStatement === 'string' 
                    ? overallImpactStatement 
                    : JSON.stringify(overallImpactStatement)
                }}
              />
            )}
          </div>
        </ScrollReveal>

        {/* Overall Metrics */}
        {metrics.length > 0 && <MetricsOverview metrics={metrics} />}

        {/* Mobile-Optimized View Mode Toggle */}
        <ScrollReveal>
          <div className="flex justify-center mb-6 sm:mb-8">
            <div 
              className="bg-neutral-soft-gray rounded-lg p-1 flex w-full max-w-xs sm:w-auto"
              role="tablist"
              aria-label="View mode selection"
            >
              <button
                onClick={() => setViewMode('carousel')}
                className={cn(
                  'flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center',
                  viewMode === 'carousel'
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 active:bg-white/50'
                )}
                role="tab"
                aria-selected={viewMode === 'carousel'}
                aria-controls="success-stories-content"
                id="carousel-tab"
              >
                <span className="hidden sm:inline">Carousel View</span>
                <span className="sm:hidden">Carousel</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center',
                  viewMode === 'grid'
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 active:bg-white/50'
                )}
                role="tab"
                aria-selected={viewMode === 'grid'}
                aria-controls="success-stories-content"
                id="grid-tab"
              >
                <span className="hidden sm:inline">Grid View</span>
                <span className="sm:hidden">Grid</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Mobile-Optimized Carousel View */}
        {viewMode === 'carousel' && (
          <ScrollReveal>
            <div 
              className="relative"
              id="success-stories-content"
              role="tabpanel"
              aria-labelledby="carousel-tab"
            >
              {/* Touch-Friendly Navigation Buttons - Hidden on mobile, shown on tablet+ */}
              {caseStudies.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-neutral-soft-gray focus:bg-neutral-soft-gray focus:outline-none focus:ring-4 focus:ring-primary-blue/30 transition-colors min-h-[48px] min-w-[48px]"
                    aria-label={`Previous case study. Currently showing ${currentIndex + 1} of ${caseStudies.length}`}
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-neutral-900" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-neutral-soft-gray focus:bg-neutral-soft-gray focus:outline-none focus:ring-4 focus:ring-primary-blue/30 transition-colors min-h-[48px] min-w-[48px]"
                    aria-label={`Next case study. Currently showing ${currentIndex + 1} of ${caseStudies.length}`}
                  >
                    <ChevronRightIcon className="w-6 h-6 text-neutral-900" />
                  </button>
                </>
              )}

              {/* Carousel Content with Swipe Support */}
              <div 
                className="overflow-hidden" 
                {...swipeProps}
                role="region"
                aria-label="Case study carousel"
                aria-live="polite"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    className="max-w-2xl mx-auto"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SuccessStoryCard
                      caseStudy={caseStudies[currentIndex]}
                      testimonial={getCurrentTestimonial(currentIndex)}
                      metrics={getCurrentMetrics(currentIndex)}
                      isActive={true}
                      index={currentIndex}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile Navigation Buttons */}
              {caseStudies.length > 1 && (
                <nav 
                  className="flex justify-between items-center mt-4 sm:hidden px-4"
                  aria-label="Case study navigation"
                >
                  <button
                    onClick={goToPrevious}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors min-h-[44px] text-blue-900 bg-primary-50 hover:bg-primary-100 focus:bg-primary-100 focus:outline-none focus:ring-4 focus:ring-primary-blue/30 active:bg-primary-200"
                    aria-label={`Previous case study. Go to ${currentIndex === 0 ? caseStudies.length : currentIndex} of ${caseStudies.length}`}
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Previous</span>
                  </button>
                  
                  <span 
                    className="text-sm text-neutral-500 px-4"
                    aria-label={`Currently viewing case study ${currentIndex + 1} of ${caseStudies.length}`}
                  >
                    {currentIndex + 1} of {caseStudies.length}
                  </span>
                  
                  <button
                    onClick={goToNext}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors min-h-[44px] text-blue-900 bg-primary-50 hover:bg-primary-100 focus:bg-primary-100 focus:outline-none focus:ring-4 focus:ring-primary-blue/30 active:bg-primary-200"
                    aria-label={`Next case study. Go to ${currentIndex === caseStudies.length - 1 ? 1 : currentIndex + 2} of ${caseStudies.length}`}
                  >
                    <span className="text-sm font-medium">Next</span>
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </nav>
              )}

              {/* Carousel Indicators */}
              {caseStudies.length > 1 && (
                <div 
                  className="flex justify-center mt-4 sm:mt-6 space-x-2"
                  role="tablist"
                  aria-label="Case study indicators"
                >
                  {caseStudies.map((caseStudy, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        'w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary-blue/30',
                        index === currentIndex
                          ? 'bg-blue-900'
                          : 'bg-neutral-200 hover:bg-neutral-gray active:bg-primary-200'
                      )}
                      role="tab"
                      aria-selected={index === currentIndex}
                      aria-label={`Go to case study ${index + 1}: ${caseStudy.title}`}
                      tabIndex={index === currentIndex ? 0 : -1}
                    >
                      <span className="sr-only">Case study {index + 1}: {caseStudy.title}</span>
                      <div className={cn(
                        'w-2 h-2 sm:w-3 sm:h-3 rounded-full',
                        index === currentIndex ? 'bg-blue-900' : 'bg-neutral-200'
                      )} />
                    </button>
                  ))}
                </div>
              )}

              {/* Swipe Hint for Mobile */}
              <div className="text-center mt-4 sm:hidden">
                <p className="text-xs text-neutral-400">
                  Swipe left or right to navigate
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Mobile-First Grid View */}
        {viewMode === 'grid' && (
          <ScrollReveal>
            <div
              id="success-stories-content"
              role="tabpanel"
              aria-labelledby="grid-tab"
            >
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {caseStudies.map((caseStudy, index) => (
                  <StaggerItem key={caseStudy.id}>
                    <SuccessStoryCard
                      caseStudy={caseStudy}
                      testimonial={getCurrentTestimonial(index)}
                      metrics={getCurrentMetrics(index)}
                      isActive={false}
                      index={index}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default SuccessStoriesSection;