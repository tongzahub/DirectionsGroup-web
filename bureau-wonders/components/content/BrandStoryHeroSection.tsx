'use client';

import React, { useRef, useEffect } from 'react';
import { ParallaxHero } from '@/components/animations';
import { StaggerReveal } from '@/components/animations';
import { Button } from '@/components/ui';
import { useStoryAnalytics } from '@/hooks/useStoryAnalytics';
import { useConversionTracking } from '@/lib/conversion-tracking';
import { useResponsiveValue, useDeviceType } from '@/lib/responsive';
import { useTypographyPreset } from '@/lib/typography';
import { cn } from '@/lib/utils';

export interface BrandStoryHeroSectionProps {
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: {
    url: string;
    alternativeText?: string;
  };
  enableParallax?: boolean;
  className?: string;
  onCtaClick?: () => void;
}

const BrandStoryHeroSection: React.FC<BrandStoryHeroSectionProps> = ({
  headline,
  subheadline,
  ctaText = "Start Your Transformation",
  ctaLink = "#success-stories",
  backgroundImage,
  enableParallax = true,
  className = "",
  onCtaClick,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const deviceType = useDeviceType();
  
  // Analytics tracking
  const { trackSectionConversion } = useStoryAnalytics({
    sectionName: 'hero',
    abTestId: 'brand_story_hero_v1',
  });
  
  // Conversion tracking
  const { trackCTAClick } = useConversionTracking('hero');

  // Responsive typography using preset system
  const headlineTypography = useTypographyPreset('heroHeadline');
  const subheadlineTypography = useTypographyPreset('heroSubheadline');

  // Responsive spacing
  const sectionPadding = useResponsiveValue({
    xs: 'py-16',
    sm: 'py-20',
    md: 'py-24',
    lg: 'py-32',
  });

  const contentSpacing = useResponsiveValue({
    xs: 'space-y-6',
    sm: 'space-y-8',
    md: 'space-y-10',
    lg: 'space-y-12',
  });

  // Track section view on mount
  useEffect(() => {
    // Section view is automatically tracked by useStoryAnalytics
  }, []);

  // Handle CTA click with analytics and navigation
  const handleCtaClick = () => {
    // Track with story analytics
    trackSectionConversion({
      conversionType: 'hero_cta_click',
      additionalData: {
        ctaText,
        targetSection: ctaLink,
      },
    });

    // Track with conversion system
    trackCTAClick(ctaText, ctaLink, {
      backgroundImage: backgroundImage?.url,
      enableParallax,
      deviceType,
    });

    if (onCtaClick) {
      onCtaClick();
    } else if (ctaLink.startsWith('#')) {
      // Smooth scroll to target section
      const targetElement = document.querySelector(ctaLink);
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Focus management for accessibility
        setTimeout(() => {
          const focusableElement = targetElement.querySelector('[tabindex="-1"]') as HTMLElement;
          if (focusableElement) {
            focusableElement.focus();
          }
        }, 500);
      }
    } else {
      // External navigation
      window.location.href = ctaLink;
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCtaClick();
    }
  };

  // Hero content component
  const HeroContent = () => (
    <div className="relative z-50 flex items-center justify-center h-full">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
        <StaggerReveal 
          staggerDelay={0.15}
          delay={0.3}
          className={cn("max-w-5xl mx-auto", contentSpacing)}
        >
          {/* StoryBrand Character-focused Headline */}
          <h1 
            className={cn(
              headlineTypography.className,
              "text-white drop-shadow-lg"
            )}
            dangerouslySetInnerHTML={{ __html: headline }}
          />

          {/* Supporting Subheadline */}
          <div 
            className={cn(
              subheadlineTypography.className,
              "text-white/90 max-w-3xl mx-auto drop-shadow-md"
            )}
            dangerouslySetInnerHTML={{ __html: subheadline }}
          />

          {/* Call-to-Action Button */}
          {ctaText && (
            <div className="flex justify-center">
              <button
                onClick={handleCtaClick}
                onKeyDown={handleKeyDown}
                className={cn(
                  "inline-flex items-center justify-center",
                  "bg-accent-gold text-blue-900 font-semibold",
                  "hover:bg-accent-gold-light focus:bg-accent-gold-light",
                  "focus:outline-none focus:ring-4 focus:ring-accent-gold/30",
                  "transition-all duration-300 transform hover:scale-105 active:scale-95",
                  "shadow-luxury-lg hover:shadow-luxury-xl",
                  "min-h-[48px] px-8 py-4 rounded-xl",
                  "text-base sm:text-lg font-semibold",
                  deviceType === 'mobile' ? 'w-full max-w-sm' : 'w-auto'
                )}
                aria-describedby="hero-cta-description"
              >
                <span className="flex items-center justify-center">
                  {ctaText}
                  <svg 
                    className="ml-2 w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 8l4 4m0 0l-4 4m4-4H3" 
                    />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </StaggerReveal>

        {/* Screen reader description for CTA */}
        <div id="hero-cta-description" className="sr-only">
          Navigate to the next section to learn about our proven success stories and client transformations
        </div>

        {/* Mobile scroll indicator */}
        {deviceType === 'mobile' && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="animate-bounce">
              <svg 
                className="w-6 h-6 text-white/60" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </div>
            <span className="sr-only">Scroll down to continue reading our brand story</span>
          </div>
        )}
      </div>
    </div>
  );

  // Render with or without parallax based on device capabilities and preferences
  if (backgroundImage && enableParallax && deviceType !== 'mobile') {
    return (
      <section
        ref={heroRef}
        id="hero"
        role="banner"
        aria-labelledby="hero-heading"
        className={cn("relative overflow-hidden", className)}
        data-brand-story-element="hero"
      >
        <ParallaxHero
          backgroundImage={backgroundImage.url}
          backgroundImageAlt={backgroundImage.alternativeText || "Brand story hero background"}
          overlayGradient="from-primary-blue/80 via-primary-blue/70 to-primary-blue/60"
          height={cn("min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[750px]", sectionPadding)}
          intensity={0.3}
          enableMultiLayer={false}
          decorativeElements={true}
        >
          <HeroContent />
        </ParallaxHero>
      </section>
    );
  }

  // Fallback hero without parallax (mobile-optimized)
  return (
    <section
      ref={heroRef}
      id="hero"
      role="banner"
      aria-labelledby="hero-heading"
      className={cn(
        "relative overflow-hidden",
        "min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[750px]",
        sectionPadding,
        className
      )}
      data-brand-story-element="hero"
    >
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage.url}
            alt={backgroundImage.alternativeText || "Brand story hero background"}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary-blue/80 via-primary-blue/70 to-primary-blue/60" />

      {/* Decorative Elements for Visual Interest */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent-gold/10 rounded-full blur-2xl" />
      </div>

      {/* Fallback gradient if no background image */}
      {!backgroundImage && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-blue via-primary-600 to-primary-700" />
      )}

      <HeroContent />
    </section>
  );
};

export default BrandStoryHeroSection;