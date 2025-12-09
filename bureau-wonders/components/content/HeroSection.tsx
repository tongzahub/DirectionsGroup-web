'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  useGradient?: boolean;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
  useGradient = true,
  className = '',
}) => {
  const gradientStyles = useGradient
    ? 'bg-gradient-to-br from-primary via-primary-light to-neutral-mist'
    : '';

  return (
    <section
      className={`relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[650px] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background Image or Gradient */}
      {backgroundImage ? (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-light/70 to-neutral-mist/60 z-10" />
        </>
      ) : (
        <div className={`absolute inset-0 z-0 ${gradientStyles}`} />
      )}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 lg:py-32 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-gray-dark mb-4 sm:mb-6 md:mb-8 leading-tight"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-gray max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-12 leading-relaxed px-4"
          >
            {subtitle}
          </motion.p>
        )}

        {ctaText && ctaLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          >
            <Button
              variant="primary"
              size="large"
              onClick={() => {
                if (ctaLink.startsWith('#')) {
                  const element = document.querySelector(ctaLink);
                  element?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.location.href = ctaLink;
                }
              }}
              className="w-full sm:w-auto"
            >
              {ctaText}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
