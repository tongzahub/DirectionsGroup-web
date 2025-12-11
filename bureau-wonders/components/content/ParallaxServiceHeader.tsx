'use client';

import { ParallaxSection } from '@/components/animations';
import { cn } from '@/lib/utils';

interface ParallaxServiceHeaderProps {
  title: string;
  icon?: string;
  backgroundPattern?: boolean;
  className?: string;
}

export default function ParallaxServiceHeader({
  title,
  icon,
  backgroundPattern = true,
  className = '',
}: ParallaxServiceHeaderProps) {
  const parallaxElements = backgroundPattern ? [
    {
      id: 'pattern-1',
      speed: 0.3,
      className: 'top-10 left-10 opacity-10',
      zIndex: 1,
      content: (
        <div className="w-32 h-32 bg-white rounded-full blur-xl" />
      ),
    },
    {
      id: 'pattern-2',
      speed: 0.6,
      className: 'top-20 right-20 opacity-20',
      zIndex: 2,
      content: (
        <div className="w-24 h-24 bg-blue-200 rounded-full blur-lg" />
      ),
    },
    {
      id: 'pattern-3',
      speed: 0.4,
      className: 'bottom-10 left-1/4 opacity-15',
      zIndex: 1,
      content: (
        <div className="w-40 h-40 bg-white rounded-full blur-2xl" />
      ),
    },
  ] : [];

  return (
    <ParallaxSection
      elements={parallaxElements}
      className={cn(
        'bg-gradient-to-br from-primary-blue to-accent-light-blue py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10">
        {icon && (
          <div className="text-6xl mb-6 animate-pulse">
            {icon}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
          {title}
        </h1>
      </div>
    </ParallaxSection>
  );
}