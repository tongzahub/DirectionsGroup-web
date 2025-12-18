'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import ContactForm from '@/components/forms/ContactForm';
import { BrandStoryCTAOption } from '@/types';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations';
import { trackCTAInteraction } from '@/lib/analytics';

// Icons for different CTA types
const ResourceIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const CaseStudyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ConsultationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

interface CallToActionSectionProps {
  primaryCtaHeadline: string;
  primaryCtaDescription: string;
  primaryCtaButtonText: string;
  secondaryCtaTitle?: string;
  secondaryCtaOptions: BrandStoryCTAOption[];
  className?: string;
  contextData?: {
    source?: string;
    section?: string;
    campaign?: string;
  };
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({
  primaryCtaHeadline,
  primaryCtaDescription,
  primaryCtaButtonText,
  secondaryCtaTitle,
  secondaryCtaOptions,
  className = '',
  contextData,
}) => {
  // const [activeTab, setActiveTab] = useState<'contact' | 'options'>('contact');
  const [selectedOption, setSelectedOption] = useState<BrandStoryCTAOption | null>(null);

  // Handle keyboard navigation for option cards
  const handleOptionKeyDown = (e: React.KeyboardEvent, option: BrandStoryCTAOption) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionClick(option);
    }
  };

  // Trust signals and guarantees
  const trustSignals = [
    'Confidential consultation',
    'No obligation assessment',
    'Strategic insights included',
    'Response within 24 hours'
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'resource':
        return <ResourceIcon />;
      case 'case-study':
        return <CaseStudyIcon />;
      case 'consultation':
        return <ConsultationIcon />;
      default:
        return <ConsultationIcon />;
    }
  };

  const handleOptionClick = (option: BrandStoryCTAOption) => {
    // Track analytics event
    trackCTAInteraction('secondary', {
      source: contextData?.source || 'brand-story',
      section: contextData?.section || 'cta',
      campaign: contextData?.campaign,
      optionType: option.type,
    }, {
      option_title: option.title,
    });

    // Handle different option types
    if (option.link.startsWith('http') || option.link.startsWith('/')) {
      window.open(option.link, '_blank', 'noopener,noreferrer');
    } else {
      // Handle internal actions like modal opening
      setSelectedOption(option);
    }
  };

  const handlePrimaryCtaClick = () => {
    // Track analytics event
    trackCTAInteraction('primary', {
      source: contextData?.source || 'brand-story',
      section: contextData?.section || 'cta',
      campaign: contextData?.campaign,
    }, {
      headline: primaryCtaHeadline,
    });

    // Focus on contact form section
  };

  return (
    <section 
      className={cn('py-12 sm:py-16 md:py-20 bg-gradient-to-br from-neutral-50 to-white relative overflow-hidden', className)}
      aria-labelledby="cta-heading"
      role="region"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary-600 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-accent-gold rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StaggerContainer className="max-w-6xl mx-auto">
          {/* Mobile-First Section Header */}
          <StaggerItem>
            <FadeInUp className="text-center mb-10 sm:mb-12 md:mb-16">
              <motion.h2 
                id="cta-heading"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-tight px-4 sm:px-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {primaryCtaHeadline}
              </motion.h2>
              <motion.div 
                className="text-lg sm:text-xl text-neutral-600 max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                dangerouslySetInnerHTML={{ __html: primaryCtaDescription }}
              />
            </FadeInUp>
          </StaggerItem>

          {/* Mobile-First Main CTA Content */}
          <StaggerItem>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
              {/* Primary CTA - Contact Form */}
              <motion.section
                className="bg-white rounded-xl sm:rounded-2xl shadow-luxury-lg p-6 sm:p-8 border border-neutral-100 mx-4 sm:mx-0"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                aria-labelledby="primary-cta-heading"
              >
                <div className="mb-6 sm:mb-8">
                  <h3 
                    id="primary-cta-heading"
                    className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 sm:mb-4 leading-tight"
                  >
                    Ready to Transform Your Brand?
                  </h3>
                  <p className="text-neutral-600 mb-4 sm:mb-6 text-sm sm:text-base">
                    Start with a confidential consultation to explore how we can elevate your brand narrative.
                  </p>

                  {/* Mobile-Optimized Trust Signals */}
                  <div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6"
                    role="list"
                    aria-label="Trust signals and guarantees"
                  >
                    {trustSignals.map((signal, index) => (
                      <motion.div
                        key={signal}
                        className="flex items-center text-sm text-neutral-600"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                        role="listitem"
                      >
                        <CheckIcon className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" aria-hidden="true" />
                        <span className="leading-tight">{signal}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mobile-Optimized Guarantee */}
                  <motion.div
                    className="flex flex-col sm:flex-row items-start p-4 bg-green-50 rounded-xl border border-green-200"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2 sm:mb-0 sm:mr-3 flex-shrink-0 sm:mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-800 text-sm mb-1">Our Commitment</p>
                      <p className="text-green-700 text-sm leading-relaxed">
                        If we can&apos;t identify at least three strategic opportunities for your brand within our consultation, we&apos;ll provide a complimentary brand audit.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced Contact Form with Context */}
                <ContactForm 
                  contextData={{
                    source: 'brand-story-cta',
                    section: 'primary-cta',
                    ...contextData
                  }}
                />
              </motion.section>

              {/* Mobile-Optimized Secondary CTAs */}
              <motion.section
                className="space-y-4 sm:space-y-6 mx-4 sm:mx-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                aria-labelledby="secondary-cta-heading"
              >
                {secondaryCtaTitle && (
                  <h3 
                    id="secondary-cta-heading"
                    className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-tight"
                  >
                    {secondaryCtaTitle}
                  </h3>
                )}

                <div 
                  className="space-y-3 sm:space-y-4"
                  role="list"
                  aria-label="Secondary call-to-action options"
                >
                  {secondaryCtaOptions.map((option, index) => (
                    <motion.div
                      key={`${option.type}-${index}`}
                      className="group bg-white rounded-xl shadow-md hover:shadow-luxury-md border border-neutral-100 hover:border-primary-200 focus-within:border-primary-200 focus-within:ring-4 focus-within:ring-primary-blue/30 transition-all duration-300 cursor-pointer active:scale-98"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      onClick={() => handleOptionClick(option)}
                      onKeyDown={(e) => handleOptionKeyDown(e, option)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      role="listitem"
                      tabIndex={0}
                      aria-label={`${option.title}. ${typeof option.description === 'string' ? option.description.replace(/<[^>]*>/g, '') : 'Description available'}`}
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div 
                            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300"
                            aria-hidden="true"
                          >
                            {getIconForType(option.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600-600 transition-colors duration-300 leading-tight">
                              {option.title}
                            </h4>
                            <div 
                              className="text-neutral-600 text-sm mb-3 sm:mb-4 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: option.description }}
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-primary-600 group-hover:text-primary-600-700">
                                {option.buttonText || 'Learn More'}
                              </span>
                              <motion.svg
                                className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 group-hover:text-primary-600-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                initial={{ x: 0 }}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                                aria-hidden="true"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </motion.svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile-Optimized Additional CTA Button */}
                <motion.div
                  className="pt-4 sm:pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <Button
                    variant="luxury"
                    size="lg"
                    className="w-full min-h-[48px] text-base sm:text-lg"
                    onClick={handlePrimaryCtaClick}
                    luxury={true}
                  >
                    {primaryCtaButtonText}
                  </Button>
                </motion.div>
              </motion.section>
            </div>
          </StaggerItem>

          {/* Mobile-Optimized Bottom Trust Bar */}
          <StaggerItem>
            <motion.div
              className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-neutral-200"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <div className="text-center">
                <p className="text-sm text-neutral-500 mb-3 sm:mb-4">
                  Trusted by luxury brands worldwide
                </p>
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 opacity-60">
                  {/* Placeholder for client logos - responsive sizing */}
                  <div className="w-16 h-6 sm:w-20 sm:h-7 md:w-24 md:h-8 bg-neutral-200 rounded"></div>
                  <div className="w-16 h-6 sm:w-20 sm:h-7 md:w-24 md:h-8 bg-neutral-200 rounded"></div>
                  <div className="w-16 h-6 sm:w-20 sm:h-7 md:w-24 md:h-8 bg-neutral-200 rounded"></div>
                  <div className="w-16 h-6 sm:w-20 sm:h-7 md:w-24 md:h-8 bg-neutral-200 rounded"></div>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Modal for selected option (if needed) */}
      <AnimatePresence>
        {selectedOption && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOption(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-neutral-900">
                  {selectedOption.title}
                </h3>
                <button
                  onClick={() => setSelectedOption(null)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div 
                className="text-neutral-600 mb-6"
                dangerouslySetInnerHTML={{ __html: selectedOption.description }}
              />
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  window.open(selectedOption.link, '_blank', 'noopener,noreferrer');
                  setSelectedOption(null);
                }}
              >
                {selectedOption.buttonText || 'Continue'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CallToActionSection;