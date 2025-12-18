'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';
import { PlanSection as PlanSectionType, ProcessStep } from '@/types/brand-story';
import { ContentContainer, ResponsiveGrid } from '@/components/layout/BrandStoryLayout';
import { ScrollReveal, StaggerReveal } from '@/components/animations';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';

interface PlanSectionProps {
  title: string;
  introduction: string;
  steps: ProcessStep[];
  reassurance?: string;
  className?: string;
}

interface ProcessStepCardProps {
  step: ProcessStep;
  index: number;
  isActive: boolean;
  onToggle: () => void;
}

/**
 * Process Step Card Component
 * Interactive card with hover/tap interactions for detailed information reveal
 */
function ProcessStepCard({ step, index, isActive, onToggle }: ProcessStepCardProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.6,
        delay: shouldReduceMotion ? 0 : index * 0.2
      }
    }
  };

  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0
    },
    expanded: {
      height: 'auto',
      opacity: 1
    }
  };

  const contentTransition = {
    duration: shouldReduceMotion ? 0.1 : 0.4,
    ease: "easeInOut" as any
  };

  const iconVariants = {
    rest: { rotate: 0 },
    hover: { rotate: shouldReduceMotion ? 0 : 5, scale: shouldReduceMotion ? 1 : 1.1 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover="hover"
      className={cn(
        'group relative bg-white rounded-2xl shadow-sm border border-neutral-200',
        'hover:shadow-xl hover:border-primary-300 transition-all duration-300',
        'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
        isActive && 'ring-2 ring-primary-500 ring-offset-2 shadow-lg'
      )}
    >
      {/* Step Number Badge */}
      <div className="absolute -top-4 -left-4 z-10">
        <motion.div
          variants={iconVariants}
          className={cn(
            'w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600',
            'flex items-center justify-center text-white font-bold text-lg shadow-lg',
            'group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300'
          )}
        >
          {step.number}
        </motion.div>
      </div>

      {/* Interactive Header */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full text-left p-6 pb-4 focus:outline-none',
          'focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded-t-2xl'
        )}
        aria-expanded={isActive}
        aria-controls={`step-${step.number}-details`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            {/* Step Icon */}
            {step.icon && (
              <div className="mb-4">
                <OptimizedImage
                  src={step.icon}
                  alt={`${step.title} icon`}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
            )}

            {/* Step Title */}
            <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-primary-600-700 transition-colors">
              {step.title}
            </h3>
            
            {/* Step Description */}
            <div 
              dangerouslySetInnerHTML={{ __html: step.description }}
              className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed"
            />
          </div>

          {/* Expand/Collapse Icon */}
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.3 }}
            className="flex-shrink-0 mt-1"
          >
            <ChevronDownIcon className="w-6 h-6 text-neutral-400 group-hover:text-primary-600-500 transition-colors" />
          </motion.div>
        </div>
      </button>

      {/* Expandable Details */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            id={`step-${step.number}-details`}
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            transition={contentTransition}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-neutral-100">
              {step.details && step.details.length > 0 && (
                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wide">
                    What's Included:
                  </h4>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <motion.li
                        key={detailIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: shouldReduceMotion ? 0 : detailIndex * 0.1,
                          duration: shouldReduceMotion ? 0.1 : 0.3
                        }}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircleIcon className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-600 leading-relaxed">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Connector (for non-last items) */}
      {index < 2 && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-0">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ 
              delay: shouldReduceMotion ? 0 : (index + 1) * 0.2,
              duration: shouldReduceMotion ? 0.1 : 0.5
            }}
            className="w-1 h-12 bg-gradient-to-b from-primary-300 to-primary-500 rounded-full origin-top"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              delay: shouldReduceMotion ? 0 : (index + 1) * 0.2 + 0.3,
              duration: shouldReduceMotion ? 0.1 : 0.3
            }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1"
          >
            <ArrowRightIcon className="w-4 h-4 text-primary-500 rotate-90" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Progress Indicator Component
 * Shows visual progress through the methodology steps
 */
function ProgressIndicator({ steps, activeStep }: { steps: ProcessStep[]; activeStep: number }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex items-center justify-center space-x-4 mb-12">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ 
              delay: shouldReduceMotion ? 0 : index * 0.1,
              duration: shouldReduceMotion ? 0.1 : 0.3
            }}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
              index <= activeStep 
                ? 'bg-primary-500 text-white shadow-lg' 
                : 'bg-neutral-200 text-neutral-500'
            )}
          >
            {step.number}
          </motion.div>
          
          {index < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: index < activeStep ? 1 : 0.3 }}
              viewport={{ once: true }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : index * 0.1 + 0.2,
                duration: shouldReduceMotion ? 0.1 : 0.5
              }}
              className={cn(
                'h-1 w-16 rounded-full origin-left transition-all duration-500',
                index < activeStep ? 'bg-primary-500' : 'bg-neutral-200'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Plan Section Component
 * Presents clear methodology with interactive elements and progress indicators
 */
export default function PlanSection({
  title,
  introduction,
  steps,
  reassurance,
  className
}: PlanSectionProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  const handleStepToggle = (stepIndex: number) => {
    setActiveStep(activeStep === stepIndex ? -1 : stepIndex);
  };

  return (
    <section 
      className={cn(
        'relative py-20 sm:py-24 md:py-28 lg:py-32 bg-gradient-to-br from-white to-neutral-50',
        className
      )}
      aria-labelledby="plan-section-title"
    >
      <ContentContainer>
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16 lg:mb-20">
          <h2 
            id="plan-section-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6"
          >
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full mb-8" />
          
          {/* Introduction */}
          <div className="max-w-4xl mx-auto">
            <div 
              dangerouslySetInnerHTML={{ __html: introduction }}
              className="prose prose-lg prose-neutral mx-auto text-neutral-600 leading-relaxed"
            />
          </div>
        </ScrollReveal>

        {/* Progress Indicator */}
        <ProgressIndicator steps={steps} activeStep={activeStep} />

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <ProcessStepCard
                key={step.number}
                step={step}
                index={index}
                isActive={activeStep === index}
                onToggle={() => handleStepToggle(index)}
              />
            ))}
          </div>
        </div>

        {/* Reassurance Statement */}
        {reassurance && (
          <ScrollReveal delay={0.6} className="mt-16 lg:mt-20">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-primary-100 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                    Your Success is Our Priority
                  </h3>
                  <div 
                    dangerouslySetInnerHTML={{ __html: reassurance }}
                    className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Call-to-Action Hint */}
        <ScrollReveal delay={0.8} className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-primary-600 font-medium">
            <PlayCircleIcon className="w-5 h-5" />
            <span>Ready to see this methodology in action?</span>
            <ArrowRightIcon className="w-4 h-4" />
          </div>
        </ScrollReveal>
      </ContentContainer>
    </section>
  );
}