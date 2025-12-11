'use client';

import { ReactNode } from 'react';
import { ParallaxBackground } from '@/components/animations';
import { cn } from '@/lib/utils';

interface ParallaxImageHeaderProps {
  backgroundImage: string;
  backgroundImageAlt?: string;
  children: ReactNode;
  height?: string;
  overlayIntensity?: 'light' | 'medium' | 'dark';
  parallaxSpeed?: number;
  className?: string;
}

export default function ParallaxImageHeader({
  backgroundImage,
  backgroundImageAlt = '',
  children,
  height = 'h-64 md:h-96 lg:h-[500px]',
  overlayIntensity = 'medium',
  parallaxSpeed = 0.5,
  className = '',
}: ParallaxImageHeaderProps) {
  const overlayClasses = {
    light: 'bg-black/20',
    medium: 'bg-black/40',
    dark: 'bg-black/60',
  };

  return (
    <ParallaxBackground
      backgroundImage={backgroundImage}
      backgroundImageAlt={backgroundImageAlt}
      speed={parallaxSpeed}
      className={cn('relative flex items-center justify-center', height, className)}
      overlayClassName={overlayClasses[overlayIntensity]}
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 text-center text-white">
        {children}
      </div>
    </ParallaxBackground>
  );
}