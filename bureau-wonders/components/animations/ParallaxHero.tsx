'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import ParallaxContainer, { ParallaxLayer } from './ParallaxContainer';
import { cn } from '@/lib/utils';

interface ParallaxHeroProps {
  backgroundImage?: string;
  backgroundImageAlt?: string;
  overlayGradient?: string;
  children: ReactNode;
  height?: string;
  className?: string;
  intensity?: number;
  layers?: ParallaxLayer[];
  enableMultiLayer?: boolean;
  decorativeElements?: boolean;
}

export default function ParallaxHero({
  backgroundImage,
  backgroundImageAlt = '',
  overlayGradient = 'from-black/40 via-black/20 to-black/40',
  children,
  height = 'min-h-screen',
  className = '',
  intensity = 0.5,
  layers = [],
  enableMultiLayer = true,
  decorativeElements = true,
}: ParallaxHeroProps) {
  // Create multi-layer parallax system with different speeds
  const createMultiLayerBackground = (): ParallaxLayer[] => {
    if (!backgroundImage || !enableMultiLayer) {
      return backgroundImage ? [{
        id: 'background',
        speed: 0.3,
        zIndex: 1,
        content: (
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt={backgroundImageAlt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        ),
      }] : [];
    }

    // Multi-layer background with different movement speeds
    return [
      // Far background layer (slowest)
      {
        id: 'background-far',
        speed: 0.2,
        zIndex: 1,
        content: (
          <div className="absolute inset-0 scale-110">
            <Image
              src={backgroundImage}
              alt={backgroundImageAlt}
              fill
              className="object-cover opacity-60"
              priority
              sizes="100vw"
            />
          </div>
        ),
      },
      // Mid background layer (medium speed)
      {
        id: 'background-mid',
        speed: 0.4,
        zIndex: 2,
        content: (
          <div className="absolute inset-0 scale-105">
            <Image
              src={backgroundImage}
              alt={backgroundImageAlt}
              fill
              className="object-cover opacity-40"
              sizes="100vw"
            />
          </div>
        ),
      },
      // Near background layer (faster)
      {
        id: 'background-near',
        speed: 0.6,
        zIndex: 3,
        content: (
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt={backgroundImageAlt}
              fill
              className="object-cover opacity-80"
              sizes="100vw"
            />
          </div>
        ),
      },
    ];
  };

  // Create decorative elements with staggered movement
  const createDecorativeElements = (): ParallaxLayer[] => {
    if (!decorativeElements) return [];

    return [
      {
        id: 'decoration-1',
        speed: 0.3,
        zIndex: 4,
        className: 'opacity-5',
        content: (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
        ),
      },
      {
        id: 'decoration-2',
        speed: 0.5,
        zIndex: 5,
        className: 'opacity-10',
        content: (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-blue-200 rounded-full blur-2xl" />
          </div>
        ),
      },
      {
        id: 'decoration-3',
        speed: 0.7,
        zIndex: 6,
        className: 'opacity-15',
        content: (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2/3 left-1/2 w-48 h-48 bg-purple-200 rounded-full blur-xl" />
          </div>
        ),
      },
    ];
  };

  // Combine all layers
  const defaultLayers: ParallaxLayer[] = [
    ...createMultiLayerBackground(),
    
    // Gradient overlay layer
    {
      id: 'overlay',
      speed: 0.8,
      zIndex: 10,
      content: (
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br',
          overlayGradient
        )} />
      ),
    },
    
    ...createDecorativeElements(),
    
    // Custom layers
    ...layers,
  ];

  return (
    <ParallaxContainer
      layers={defaultLayers}
      height={height}
      className={className}
      intensity={intensity}
    >
      {/* Content layer (no parallax) */}
      <div className="relative z-50 flex items-center justify-center h-full">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          {children}
        </div>
      </div>
    </ParallaxContainer>
  );
}