'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ProblemSection as ProblemSectionType, ProblemItem } from '@/types/brand-story';
import { ContentContainer, ResponsiveGrid } from '@/components/layout/BrandStoryLayout';
import { ScrollReveal } from '@/components/animations';
import { StaggerReveal } from '@/components/animations';
// import { OptimizedImage } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useReducedMotion } from 'framer-motion';

interface ProblemSectionProps {
  title: string;
  problems: ProblemItem[];
  transitionStatement?: string;
  className?: string;
  enableProgressiveDisclosure?: boolean;
  maxVisibleProblems?: number;
}

interface ProblemItemCardProps {
  problem: ProblemItem;
  index: number;
  isExpanded?: boolean;
  onToggle?: () => void;
  enableProgressiveDisclosure?: boolean;
}

/**
 * Individual problem item card with optional expansion
 */
function ProblemItemCard({ 
  problem, 
  index, 
  isExpanded = false, 
  onToggle,
  enableProgressiveDisclosure = true 
}: ProblemItemCardProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.6,
        delay: shouldReduceMotion ? 0 : index * 0.1
      }
    }
  };

  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.3
      }
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.3
      }
    }
  };

  const iconVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={cn(
        'group relative bg-white rounded-2xl shadow-sm border border-neutral-200',
        'hover:shadow-lg hover:border-neutral-300 transition-all duration-300',
        'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
        enableProgressiveDisclosure && 'cursor-pointer'
      )}
      onClick={enableProgressiveDisclosure ? onToggle : undefined}
      role={enableProgressiveDisclosure ? 'button' : undefined}
      tabIndex={enableProgressiveDisclosure ? 0 : undefined}
      onKeyDown={enableProgressiveDisclosure ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle?.();
        }
      } : undefined}
      aria-expanded={enableProgressiveDisclosure ? isExpanded : undefined}
      aria-label={enableProgressiveDisclosure ? `${problem.headline} - Click to ${isExpanded ? 'collapse' : 'expand'} details` : problem.headline}
    >
      {/* Problem Icon */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-shrink-0">
            {problem.icon ? (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <img
                  src={problem.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6 text-red-600"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-red-600" 
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
            )}
          </div>
          
          {enableProgressiveDisclosure && (
            <motion.div
              variants={iconVariants}
              animate={isExpanded ? 'expanded' : 'collapsed'}
              className="flex-shrink-0 ml-4"
            >
              <ChevronDownIcon className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Problem Content */}
      <div className="px-6 pb-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-primary-600-700 transition-colors">
          {problem.headline}
        </h3>
        
        {/* Always visible description preview */}
        <div className="text-neutral-600 leading-relaxed">
          {enableProgressiveDisclosure ? (
            // Show truncated version when progressive disclosure is enabled
            <p className="line-clamp-2">
              {problem.description.replace(/<[^>]*>/g, '')} {/* Strip HTML for preview */}
            </p>
          ) : (
            // Show full description when progressive disclosure is disabled
            <div 
              dangerouslySetInnerHTML={{ __html: problem.description }}
              className="prose prose-neutral max-w-none"
            />
          )}
        </div>

        {/* Expandable content */}
        {enableProgressiveDisclosure && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-neutral-100 mt-4">
                  {/* Full description */}
                  <div 
                    dangerouslySetInnerHTML={{ __html: problem.description }}
                    className="prose prose-neutral max-w-none text-neutral-600 mb-4"
                  />
                  
                  {/* Impact statement */}
                  {problem.impact && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-red-800 mb-2">Impact on Your Business</h4>
                      <p className="text-sm text-red-700">{problem.impact}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Impact statement for non-progressive disclosure */}
        {!enableProgressiveDisclosure && problem.impact && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">Impact on Your Business</h4>
            <p className="text-sm text-red-700">{problem.impact}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Problem Section Component with Progressive Disclosure
 * Implements scroll-triggered animations and responsive grid layout
 */
export default function ProblemSection({
  title,
  problems,
  transitionStatement,
  className,
  enableProgressiveDisclosure = true,
  maxVisibleProblems = 3
}: ProblemSectionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [showAllProblems, setShowAllProblems] = useState(false);
  
  const shouldReduceMotion = useReducedMotion();
  
  // Determine which problems to show
  const visibleProblems = showAllProblems || !enableProgressiveDisclosure 
    ? problems 
    : problems.slice(0, maxVisibleProblems);
  
  const hasMoreProblems = problems.length > maxVisibleProblems;

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const showMoreVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.4
      }
    }
  };

  return (
    <section 
      className={cn(
        'relative py-20 sm:py-24 md:py-28 lg:py-32',
        className
      )}
      aria-labelledby="problem-section-title"
    >
      <ContentContainer>
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16 lg:mb-20">
          <h2 
            id="problem-section-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6"
          >
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full" />
        </ScrollReveal>

        {/* Problems Grid */}
        <div className="mb-12">
          <ResponsiveGrid
            columns={{ sm: 1, md: 2, lg: 3 }}
            gap="lg"
            className="mb-8"
          >
            {visibleProblems.map((problem, index) => (
              <ProblemItemCard
                key={index}
                problem={problem}
                index={index}
                isExpanded={expandedItems.has(index)}
                onToggle={() => toggleExpanded(index)}
                enableProgressiveDisclosure={enableProgressiveDisclosure}
              />
            ))}
          </ResponsiveGrid>

          {/* Show More Button */}
          {enableProgressiveDisclosure && hasMoreProblems && !showAllProblems && (
            <motion.div
              variants={showMoreVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center"
            >
              <button
                onClick={() => setShowAllProblems(true)}
                className={cn(
                  'inline-flex items-center px-6 py-3 rounded-lg',
                  'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900',
                  'border border-neutral-200 hover:border-neutral-300',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                )}
                aria-label={`Show ${problems.length - maxVisibleProblems} more problems`}
              >
                <span className="mr-2">Show {problems.length - maxVisibleProblems} More Problems</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Transition Statement */}
        {transitionStatement && (
          <ScrollReveal delay={0.2} className="text-center">
            <div className="max-w-3xl mx-auto">
              <div 
                dangerouslySetInnerHTML={{ __html: transitionStatement }}
                className="prose prose-lg prose-neutral mx-auto text-neutral-600"
              />
            </div>
          </ScrollReveal>
        )}
      </ContentContainer>
    </section>
  );
}

// Export for use in other components
export { ProblemItemCard };