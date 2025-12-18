'use client';

import { JobListing } from '@/types';
import { useState } from 'react';
import JobListingCard from '@/components/cards/JobListingCard';
import JobListingModal from '@/components/modals/JobListingModal';

interface JobListingGridProps {
  jobs: JobListing[];
}

export default function JobListingGrid({ jobs }: JobListingGridProps) {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Get unique departments and types for filters
  const departments = Array.from(new Set(jobs.map(job => job.department)));
  const jobTypes = Array.from(new Set(jobs.map(job => job.type)));

  // Filter jobs based on selected filters
  const filteredJobs = jobs.filter(job => {
    const departmentMatch = filterDepartment === 'all' || job.department === filterDepartment;
    const typeMatch = filterType === 'all' || job.type === filterType;
    return departmentMatch && typeMatch;
  });

  const handleJobClick = (job: JobListing) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Filters */}
      {jobs.length > 3 && (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-center">
          {/* Department Filter */}
          <div className="w-full sm:w-auto">
            <label htmlFor="department-filter" className="block text-sm font-medium text-neutral-gray-dark mb-2">
              Department
            </label>
            <select
              id="department-filter"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 border border-neutral-gray-light rounded-xl bg-white text-neutral-gray-dark focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Job Type Filter */}
          <div className="w-full sm:w-auto">
            <label htmlFor="type-filter" className="block text-sm font-medium text-neutral-gray-dark mb-2">
              Job Type
            </label>
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 border border-neutral-gray-light rounded-xl bg-white text-neutral-gray-dark focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(filterDepartment !== 'all' || filterType !== 'all') && (
            <button
              onClick={() => {
                setFilterDepartment('all');
                setFilterType('all');
              }}
              className="text-sm text-primary-blue hover:text-primary-darker transition-colors duration-200 underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-center">
        <p className="text-sm text-neutral-gray">
          {filteredJobs.length === jobs.length 
            ? `${jobs.length} position${jobs.length !== 1 ? 's' : ''} available`
            : `${filteredJobs.length} of ${jobs.length} position${jobs.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      {/* Job Listings Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredJobs.map((job) => (
            <JobListingCard
              key={job.id}
              job={job}
              onClick={() => handleJobClick(job)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-mist mb-4">
            <svg
              className="w-8 h-8 text-neutral-gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-neutral-gray-dark mb-2">
            No positions match your filters
          </h3>
          <p className="text-neutral-gray mb-4">
            Try adjusting your filters to see more opportunities.
          </p>
          <button
            onClick={() => {
              setFilterDepartment('all');
              setFilterType('all');
            }}
            className="inline-block px-6 py-3 bg-primary-blue text-white font-semibold rounded-xl hover:bg-primary-darker transition-colors duration-200"
          >
            Show All Positions
          </button>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobListingModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}