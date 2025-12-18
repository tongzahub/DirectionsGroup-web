'use client';

import { JobListing } from '@/types';

interface JobListingCardProps {
  job: JobListing;
  onClick: () => void;
}

export default function JobListingCard({ job, onClick }: JobListingCardProps) {
  // Get department icon
  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case 'client services':
        return '👥';
      case 'creative':
        return '🎨';
      case 'digital':
        return '💻';
      case 'public relations':
        return '📢';
      case 'events & experiences':
        return '✨';
      case 'content & strategy':
        return '📝';
      case 'business development':
        return '📈';
      default:
        return '💼';
    }
  };

  // Get job type color
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-green-100 text-green-800';
      case 'Part-time':
        return 'bg-blue-100 text-blue-800';
      case 'Contract':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer group border border-transparent hover:border-primary-blue/20"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl" role="img" aria-label={`${job.department} department`}>
            {getDepartmentIcon(job.department)}
          </div>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.type)}`}>
              {job.type}
            </span>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <svg
            className="w-5 h-5 text-primary-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>
      </div>

      {/* Job Title */}
      <h3 className="text-xl font-bold text-neutral-gray-dark mb-2 group-hover:text-primary-blue transition-colors duration-200">
        {job.title}
      </h3>

      {/* Department */}
      <p className="text-sm font-medium text-primary-blue mb-3">
        {job.department}
      </p>

      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-4 h-4 text-neutral-gray flex-shrink-0"
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
        <span className="text-sm text-neutral-gray">
          {job.location}
        </span>
      </div>

      {/* Description Preview */}
      <div className="mb-4">
        <p className="text-sm text-neutral-gray line-clamp-3">
          {String(job.description).replace(/[#*]/g, '').substring(0, 150)}...
        </p>
      </div>

      {/* Action */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-primary-blue group-hover:text-primary-darker transition-colors duration-200">
          View Details
        </span>
        <svg
          className="w-4 h-4 text-primary-blue group-hover:text-primary-darker group-hover:translate-x-1 transition-all duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}