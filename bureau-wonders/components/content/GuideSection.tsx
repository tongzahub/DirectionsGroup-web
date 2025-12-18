'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import { GuideSection as GuideSectionType, AuthorityElement, Testimonial } from '@/types/brand-story';
import { TeamMember } from '@/types';
import { ContentContainer, ResponsiveGrid } from '@/components/layout/BrandStoryLayout';
import { ScrollReveal, StaggerReveal } from '@/components/animations';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';
import { useReducedMotion } from 'framer-motion';

interface GuideSectionProps {
  title: string;
  empathyStatement: string;
  authorityElements: AuthorityElement[];
  teamHighlight: TeamMember[];
  testimonials?: Testimonial[];
  className?: string;
}

interface AuthorityElementCardProps {
  element: AuthorityElement;
  index: number;
}

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

/**
 * Authority Element Card Component
 * Displays credentials, experience, or recognition items
 */
function AuthorityElementCard({ element, index }: AuthorityElementCardProps) {
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

  const getIconForType = (type: AuthorityElement['type']) => {
    switch (type) {
      case 'credential':
        return (
          <CheckCircleIcon className="w-6 h-6 text-primary-600" />
        );
      case 'experience':
        return (
          <StarIcon className="w-6 h-6 text-primary-600" />
        );
      case 'recognition':
        return (
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return <CheckCircleIcon className="w-6 h-6 text-primary-600" />;
    }
  };

  const getBackgroundForType = (type: AuthorityElement['type']) => {
    switch (type) {
      case 'credential':
        return 'from-blue-50 to-blue-100';
      case 'experience':
        return 'from-green-50 to-green-100';
      case 'recognition':
        return 'from-purple-50 to-purple-100';
      default:
        return 'from-primary-50 to-primary-100';
    }
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
        'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2'
      )}
    >
      {/* Authority Icon */}
      <div className="p-6 pb-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className={cn(
              'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center',
              getBackgroundForType(element.type)
            )}>
              {getIconForType(element.type)}
            </div>
          </div>
          
          {element.visual && (
            <div className="ml-4 flex-shrink-0">
              <OptimizedImage
                src={element.visual.url}
                alt={element.visual.alternativeText || element.title}
                width={80}
                height={60}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Authority Content */}
      <div className="px-6 pb-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-primary-600-700 transition-colors">
          {element.title}
        </h3>
        
        <p className="text-neutral-600 leading-relaxed">
          {element.description}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Team Member Card Component
 * Displays team member with image optimization
 */
function TeamMemberCard({ member, index }: TeamMemberCardProps) {
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
        delay: shouldReduceMotion ? 0 : index * 0.15
      }
    }
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
        'overflow-hidden'
      )}
    >
      {/* Team Member Image */}
      {member.image && (
        <div className="aspect-[4/3] overflow-hidden">
          <OptimizedImage
            src={member.image.url}
            alt={member.image.alternativeText || `${member.name} - ${member.title}`}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Team Member Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-1">
          {member.name}
        </h3>
        
        <p className="text-primary-600 font-medium mb-3">
          {member.title}
        </p>

        {member.expertise && member.expertise.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {member.expertise.slice(0, 3).map((skill: string, skillIndex: number) => (
                <span
                  key={skillIndex}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200"
                >
                  {skill}
                </span>
              ))}
              {member.expertise.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                  +{member.expertise.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {member.bio && (
          <div 
            dangerouslySetInnerHTML={{ __html: member.bio }}
            className="prose prose-sm prose-neutral max-w-none text-neutral-600 line-clamp-3"
          />
        )}
      </div>
    </motion.div>
  );
}

/**
 * Testimonial Card Component
 * Displays client testimonials with attribution
 */
function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={cn(
        'relative bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6',
        'border border-primary-200 shadow-sm',
        'hover:shadow-lg transition-all duration-300'
      )}
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 opacity-20">
        <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
        </svg>
      </div>

      {/* Testimonial Content */}
      <div className="mb-6">
        <p className="text-neutral-700 leading-relaxed">
          "{testimonial.quote}"
        </p>
      </div>

      {/* Client Attribution */}
      <div className="flex items-center">
        {testimonial.avatar && (
          <div className="flex-shrink-0 mr-4">
            <OptimizedImage
              src={testimonial.avatar.url}
              alt={testimonial.avatar.alternativeText || `${testimonial.clientName} avatar`}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          </div>
        )}
        
        <div className="flex-grow">
          <p className="font-semibold text-neutral-900">
            {testimonial.clientName}
          </p>
          {testimonial.clientTitle && (
            <p className="text-sm text-neutral-600">
              {testimonial.clientTitle}
            </p>
          )}
          <p className="text-sm font-medium text-primary-700">
            {testimonial.companyName}
          </p>
        </div>

        {testimonial.companyLogo && (
          <div className="flex-shrink-0 ml-4">
            <OptimizedImage
              src={testimonial.companyLogo.url}
              alt={testimonial.companyLogo.alternativeText || `${testimonial.companyName} logo`}
              width={60}
              height={30}
              className="h-8 w-auto object-contain opacity-70"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Guide Section Component
 * Positions The Bureau as the empathetic, experienced guide
 */
export default function GuideSection({
  title,
  empathyStatement,
  authorityElements,
  teamHighlight,
  testimonials = [],
  className
}: GuideSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <section 
      className={cn(
        'relative py-20 sm:py-24 md:py-28 lg:py-32 bg-gradient-to-br from-neutral-50 to-white',
        className
      )}
      aria-labelledby="guide-section-title"
    >
      <ContentContainer>
        {/* Section Header */}
        <ScrollReveal className="text-center mb-16 lg:mb-20">
          <h2 
            id="guide-section-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6"
          >
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full mb-8" />
          
          {/* Empathy Statement */}
          <div className="max-w-4xl mx-auto">
            <div 
              dangerouslySetInnerHTML={{ __html: empathyStatement }}
              className="prose prose-lg prose-neutral mx-auto text-neutral-600 leading-relaxed"
            />
          </div>
        </ScrollReveal>

        {/* Authority Elements */}
        {authorityElements.length > 0 && (
          <div className="mb-16 lg:mb-20">
            <ScrollReveal delay={0.2} className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
                Our Expertise & Credentials
              </h3>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Proven experience and recognized expertise in luxury brand communications
              </p>
            </ScrollReveal>

            <ResponsiveGrid
              columns={{ sm: 1, md: 2, lg: 3 }}
              gap="lg"
            >
              {authorityElements.map((element, index) => (
                <AuthorityElementCard
                  key={index}
                  element={element}
                  index={index}
                />
              ))}
            </ResponsiveGrid>
          </div>
        )}

        {/* Team Highlight */}
        {teamHighlight.length > 0 && (
          <div className="mb-16 lg:mb-20">
            <ScrollReveal delay={0.3} className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
                Meet Your Strategic Partners
              </h3>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Experienced professionals dedicated to your brand's success
              </p>
            </ScrollReveal>

            <ResponsiveGrid
              columns={{ sm: 1, md: 2, lg: teamHighlight.length >= 3 ? 3 : teamHighlight.length }}
              gap="lg"
            >
              {teamHighlight.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  index={index}
                />
              ))}
            </ResponsiveGrid>
          </div>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div>
            <ScrollReveal delay={0.4} className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
                What Our Clients Say
              </h3>
              <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                Trusted by luxury brands worldwide
              </p>
            </ScrollReveal>

            <ResponsiveGrid
              columns={{ sm: 1, md: 2, lg: testimonials.length >= 3 ? 3 : testimonials.length }}
              gap="lg"
            >
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </ResponsiveGrid>
          </div>
        )}
      </ContentContainer>
    </section>
  );
}