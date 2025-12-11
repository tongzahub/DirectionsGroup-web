'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { usePerformanceMetrics } from '@/lib/performance-monitor';
import { cn } from '@/lib/utils';

interface ParallaxBackgroundProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  speed?: number; // Parallax speed multiplier (0.1 = very slow, 1 = normal speed)
  offset?: [string, string]; // Scroll offset range
  className?: string;
  overlayClassName?: string;
  disabled?: boolean;
  intensity?: number;
}

export default function ParallaxBackground({
  children,
  backgroundImage,
  backgroundImageAlt = '',
  speed = 0.5,
  offset = ["start end", "end start"],
  className = '',
  overlayClassName = '',
  disabled = false,
  intensity = 1,
}: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const performanceMetrics = usePerformanceMetrics();
  
  // Check if parallax should be disabled
  const shouldDisableParallax = disabled || 
    performanceMetrics.isLowEndDevice || 
    performanceMetrics.fps < 45 ||
    performanceMetrics.batteryLevel < 0.2;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: offset as any,
  });

  // Calculate parallax transform
  const adjustedSpeed = speed * intensity;
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    [100 * adjustedSpeed, -100 * adjustedSpeed]
  );

  // Static version for performance or SSR
  if (!isClient || shouldDisableParallax || !backgroundImage) {
    return (
      <div 
        ref={containerRef}
        className={cn('relative', className)}
      >
        {backgroundImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt={backgroundImageAlt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            {overlayClassName && (
              <div className={cn('absolute inset-0', overlayClassName)} />
            )}
          </div>
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ 
          y,
          transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
        }}
      >
        <div className="absolute inset-0 scale-110"> {/* Scale up to prevent gaps */}
          <Image
            src={backgroundImage}
            alt={backgroundImageAlt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        {overlayClassName && (
          <div className={cn('absolute inset-0', overlayClassName)} />
        )}
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}