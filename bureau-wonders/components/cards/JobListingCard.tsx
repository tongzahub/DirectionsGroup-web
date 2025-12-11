'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { JobListing } from '@/types';
import Button from '@/components/ui/Button';

export interface JobListingCardProps {
  job: JobListing;
}

const JOB_TYPE_COLORS = {
  'Full-time': 'bg-primary-blue text-white',
  'Part-time': 'bg-accent-mist text-primary-darker',
  'Contract': 'bg-neutral-gray-border text-neutral-gray-dark',
};

const JobListingCard: React.FC<JobListingCardProps> = ({ job }) => {
  return (
    <motion.div
      className="rounded-2xl p-4 sm:p-5 md:p-6 shadow-card bg-white"
      whileHover={{ 
        y: -4, 
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' 
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Job Type Badge */}
      <div className="mb-2 sm:mb-3">
        <span
          className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
            JOB_TYPE_COLORS[job.type]
          }`}
        >
          {job.type}
        </span>
      </div>

      {/* Position Title */}
      <h3 className="text-lg sm:text-xl font-semibold text-neutral-gray-dark mb-2">
        {job.title}
      </h3>

      {/* Department and Location */}
      <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 text-xs sm:text-sm text-neutral-gray">
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span className="break-words">{job.department}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="break-words">{job.location}</span>
        </div>
      </div>

      {/* Apply Button */}
      <Button
        variant="primary"
        size="md"
        onClick={() => {
          // This will be handled by the parent component or page
          // For now, we can use a simple scroll to contact form or open email
          window.location.href = `/contact?job=${encodeURIComponent(job.title)}`;
        }}
        className="w-full sm:w-auto touch-manipulation"
      >
        Learn More
      </Button>
    </motion.div>
  );
};

export default JobListingCard;
