'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CaseStudy } from '@/types';
import StrapiImage from '@/components/ui/StrapiImage';

export interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

// Helper function to extract text from rich text content
const extractTextFromRichText = (richText: string | object): string => {
  if (typeof richText === 'string') {
    return richText;
  }
  // For more complex rich text objects, you might need to parse them
  return '';
};

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy }) => {
  // Extract a brief summary from results for quick stats
  const resultsSummary = extractTextFromRichText(caseStudy.results);
  const truncatedResults = resultsSummary.length > 120 
    ? resultsSummary.substring(0, 120) + '...' 
    : resultsSummary;

  return (
    <Link href={`/case-studies/${caseStudy.slug}`} className="block">
      <motion.div
        className="rounded-2xl p-0 shadow-card bg-white overflow-hidden touch-manipulation"
        whileHover={{ 
          y: -4, 
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' 
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Featured Image */}
        <div className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden">
          <StrapiImage
            src={caseStudy.featuredImage?.url}
            alt={caseStudy.featuredImage?.alternativeText || caseStudy.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          {/* Client Name */}
          <p className="text-xs sm:text-sm font-medium text-primary-blue mb-2 uppercase tracking-wide">
            {caseStudy.client}
          </p>

          {/* Project Title */}
          <h3 className="text-lg sm:text-xl font-semibold text-neutral-gray-dark mb-3 line-clamp-2">
            {caseStudy.title}
          </h3>

          {/* Quick Stats / Results Summary */}
          {truncatedResults && (
            <div className="border-t border-neutral-gray-border pt-3">
              <p className="text-xs sm:text-sm font-medium text-neutral-gray-dark mb-1">
                Results
              </p>
              <p className="text-xs sm:text-sm text-neutral-gray line-clamp-2">
                {truncatedResults}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default CaseStudyCard;
