'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { StaggerReveal, ParallaxHero } from '@/components/animations';

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  useGradient?: boolean;
  useParallax?: boolean;
  parallaxIntensity?: number;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
  backgroundImageAlt = '',
  useGradient = true,
  useParallax = true,
  parallaxIntensity = 0.5,
  className = '',
}) => {
  const gradientOverlay = useGradient
    ? 'from-primary/80 via-primary-light/70 to-neutral-mist/60'
    : 'from-black/40 via-black/20 to-black/40';

  const fallbackGradient = useGradient
    ? 'bg-gradient-to-br from-primary via-primary-light to-neutral-mist'
    : 'bg-gradient-to-br from-gray-900 to-gray-700';

  // Content component
  const heroContent = (
    <StaggerReveal 
      staggerDelay={0.15}
      delay={0.2}
      className="space-y-6 sm:space-y-8 md:space-y-12"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight drop-shadow-lg">
        {title}
      </h1>

      {subtitle && (
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-md">
          {subtitle}
        </p>
      )}

      {ctaText && ctaLink && (
        <div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              if (ctaLink.startsWith('#')) {
                const element = document.querySelector(ctaLink);
                element?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = ctaLink;
              }
            }}
            className="w-full sm:w-auto shadow-lg"
          >
            {ctaText}
          </Button>
        </div>
      )}
    </StaggerReveal>
  );

  // Use parallax hero if background image and parallax enabled
  if (backgroundImage && useParallax) {
    return (
      <ParallaxHero
        backgroundImage={backgroundImage}
        backgroundImageAlt={backgroundImageAlt}
        overlayGradient={gradientOverlay}
        height="min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[650px]"
        className={className}
        intensity={parallaxIntensity}
      >
        {heroContent}
      </ParallaxHero>
    );
  }

  // Fallback to regular hero section
  return (
    <section
      className={`relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[650px] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background */}
      <div className={`absolute inset-0 z-0 ${fallbackGradient}`} />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 lg:py-32 text-center">
        {heroContent}
      </div>
    </section>
  );
};

export default HeroSection;
