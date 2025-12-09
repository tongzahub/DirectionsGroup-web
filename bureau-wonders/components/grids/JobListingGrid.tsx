'use client';

import { JobListing } from '@/types';
import JobListingCard from '@/components/cards/JobListingCard';
import { StaggerContainer, StaggerItem } from '@/components/animations';

interface JobListingGridProps {
  jobs: JobListing[];
}

export default function JobListingGrid({ jobs }: JobListingGridProps) {
  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {jobs.map((job) => (
        <StaggerItem key={job.id}>
          <JobListingCard job={job} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
