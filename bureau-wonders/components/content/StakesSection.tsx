'use client';

import React from 'react';
import { BrandStoryFailureScenario } from '@/types';
import { FadeInUp, ScaleIn } from '@/components/animations';
import { cn } from '@/lib/utils';

interface StakesSectionProps {
  title: string;
  failureScenarios: BrandStoryFailureScenario[];
  opportunityCostStatement?: string;
  transitionToActionStatement?: string;
  className?: string;
}

export function StakesSection({
  title,
  failureScenarios,
  opportunityCostStatement,
  transitionToActionStatement,
  className
}: StakesSectionProps) {
  return (
    <section 
      className={cn(
        'py-12 sm:py-16 md:py-20 lg:py-32 bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden',
        className
      )}
      aria-labelledby="stakes-heading"
      role="region"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-blue/10 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeInUp>
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 
              id="stakes-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-tight px-4 sm:px-0"
            >
              {title}
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-primary-gold to-primary-blue mx-auto" />
          </div>
        </FadeInUp>

        {/* Mobile-First Failure Scenarios Grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 md:mb-16"
          role="list"
          aria-label="Potential failure scenarios"
        >
          {failureScenarios.map((scenario, index) => (
            <ScaleIn key={index} delay={index * 0.1}>
              <article 
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 group mx-4 sm:mx-0"
                role="listitem"
                aria-labelledby={`scenario-title-${index}`}
                tabIndex={0}
              >
                {/* Mobile-Optimized Scenario Header */}
                <div className="mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:from-red-100 group-hover:to-red-200 transition-colors duration-300">
                    <svg 
                      className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                      />
                    </svg>
                  </div>
                  <h3 
                    id={`scenario-title-${index}`}
                    className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2 sm:mb-3 leading-tight"
                  >
                    {scenario.scenario}
                  </h3>
                </div>

                {/* Mobile-Optimized Consequences */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm font-medium text-neutral-600 uppercase tracking-wide mb-2 sm:mb-3">
                    Potential Consequences
                  </h4>
                  <ul className="space-y-2" role="list">
                    {scenario.consequences.map((consequence, idx) => (
                      <li key={idx} className="flex items-start text-neutral-700" role="listitem">
                        <div 
                          className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 sm:mr-3 flex-shrink-0" 
                          aria-hidden="true"
                        />
                        <span className="text-sm leading-relaxed">{consequence}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Real World Example */}
                {scenario.realWorldExample && (
                  <div className="pt-3 sm:pt-4 border-t border-neutral-100">
                    <p className="text-sm text-neutral-600 italic leading-relaxed">
                      {scenario.realWorldExample}
                    </p>
                  </div>
                )}
              </article>
            </ScaleIn>
          ))}
        </div>

        {/* Mobile-Optimized Opportunity Cost Statement */}
        {opportunityCostStatement && (
          <FadeInUp delay={0.3}>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-10 md:mb-12 border border-amber-100 mx-4 sm:mx-0">
              <div className="flex flex-col sm:flex-row items-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-3 sm:mb-4">
                    The Cost of Inaction
                  </h3>
                  <div 
                    className="text-neutral-700 leading-relaxed prose prose-neutral prose-sm sm:prose-base max-w-none"
                    dangerouslySetInnerHTML={{ __html: opportunityCostStatement }}
                  />
                </div>
              </div>
            </div>
          </FadeInUp>
        )}

        {/* Mobile-Optimized Success vs Failure Contrast */}
        <FadeInUp delay={0.4}>
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-12 md:mb-16"
            role="region"
            aria-label="Comparison between failure and success outcomes"
          >
            {/* Failure Path */}
            <div 
              className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-red-200 mx-4 sm:mx-0"
              role="article"
              aria-labelledby="failure-path-heading"
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg 
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </div>
                <h3 
                  id="failure-path-heading"
                  className="text-lg sm:text-xl font-semibold text-red-800 mb-3 sm:mb-4 leading-tight"
                >
                  Without Strategic Communication
                </h3>
                <ul className="text-red-700 space-y-2 text-left" role="list">
                  <li className="flex items-center text-sm sm:text-base" role="listitem">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true" />
                    Declining market relevance
                  </li>
                  <li className="flex items-center text-sm sm:text-base" role="listitem">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true" />
                    Lost competitive advantage
                  </li>
                  <li className="flex items-center text-sm sm:text-base" role="listitem">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true" />
                    Missed growth opportunities
                  </li>
                  <li className="flex items-center text-sm sm:text-base" role="listitem">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true" />
                    Weakened brand perception
                  </li>
                </ul>
              </div>
            </div>

            {/* Success Path */}
            <div 
              className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-green-200 mx-4 sm:mx-0"
              role="article"
              aria-labelledby="success-path-heading"
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg 
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <h3 
                  id="success-path-heading"
                  className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4 leading-tight"
                >
                  With The Bureau of Wonders
                </h3>
                <ul className="text-green-700 space-y-2 text-left" role="list">
                  <li className="flex items-center text-sm sm:text-base" role="listitem">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true" />
                    Enhanced market leadership
                  </li>
                  <li className="flex items-center text-sm sm:text-base" role="listitem">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true" />
                    Sustainable competitive edge
                  </li>
                  <li className="flex items-center text-sm sm:text-base" role="listitem">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true" />
                    Accelerated growth trajectory
                  </li>
                  <li className="flex items-center text-sm sm:text-base" role="listitem">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 flex-shrink-0" aria-hidden="true" />
                    Strengthened brand equity
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Mobile-Optimized Transition to Action */}
        {transitionToActionStatement && (
          <FadeInUp delay={0.5}>
            <div className="text-center max-w-4xl mx-auto">
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg border border-neutral-100 mx-4 sm:mx-0">
                <div 
                  className="text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed prose prose-neutral prose-sm sm:prose-base md:prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: transitionToActionStatement }}
                />
              </div>
            </div>
          </FadeInUp>
        )}
      </div>
    </section>
  );
}