'use client';

import { ScrollProgressIndicator } from '@/components/animations';

interface ClientScrollProgressProps {
  estimatedReadingTime: number;
}

export default function ClientScrollProgress({ estimatedReadingTime }: ClientScrollProgressProps) {
  return (
    <ScrollProgressIndicator
      position="top"
      thickness={3}
      showPercentage={true}
      showReadingTime={true}
      estimatedReadingTime={estimatedReadingTime}
    />
  );
}