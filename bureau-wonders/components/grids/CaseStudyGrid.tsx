'use client';

import { CaseStudy } from '@/types';
import CaseStudyCard from '@/components/cards/CaseStudyCard';
import { StaggerContainer, StaggerItem } from '@/components/animations';

interface CaseStudyGridProps {
  caseStudies: CaseStudy[];
}

export default function CaseStudyGrid({ caseStudies }: CaseStudyGridProps) {
  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {caseStudies.map((caseStudy) => (
        <StaggerItem key={caseStudy.id}>
          <CaseStudyCard caseStudy={caseStudy} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
