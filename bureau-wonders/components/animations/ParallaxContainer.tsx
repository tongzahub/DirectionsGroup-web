'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ReactNode, useRef, useEffect, useState } from 'react';
import { usePerformanceMetrics } from '@/lib/performance-monitor';
import { cn } from '@/lib/utils';

export interface ParallaxLayer {
  id: string;
  content: ReactNode;
  speed: number; // Multiplier for scroll speed (0.5 = half speed, 2 = double speed)
  zIndex?: number;
  className?: string;
  offset?: [number, number]; // Custom offset range [start, end]
}

interface ParallaxContainerProps {
  layers: ParallaxLayer[];
  height?: string;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  intensity?: number; // Global intensity multiplier (0-1)
}

// Individual layer component to handle hooks properly
function ParallaxLayer({ 
  layer, 
  scrollYProgress, 
  intensity 
}: { 
  layer: ParallaxLayer; 
  scrollYProgress: MotionValue<number>; 
  intensity: number;
}) {
  const offset = layer.offset || [0, 1];
  const speed = layer.speed * intensity;
  
  // Calculate transform range based on speed
  const range = speed > 0 
    ? [100 * speed, -100 * speed] 
    : [-100 * Math.abs(speed), 100 * Math.abs(speed)];
  
  const y = useTransform(scrollYProgress, offset, range);
  
  return (
    <motion.div
      className={cn(
        'absolute inset-0',
        layer.className
      )}
      style={{ 
        y,
        zIndex: layer.zIndex || 0,
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
        backfaceVisibility: 'hidden', // Prevent flickering
        perspective: 1000, // Improve 3D rendering
      }}
    >
      {layer.content}
    </motion.div>
  );
}

export default function ParallaxContainer({
  layers,
  height = 'min-h-screen',
  className = '',
  children,
  disabled = false,
  intensity = 1,
}: ParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const performanceMetrics = usePerformanceMetrics();
  
  // Check if parallax should be disabled based on performance
  const shouldDisableParallax = disabled || 
    performanceMetrics.isLowEndDevice || 
    performanceMetrics.fps < 45 ||
    performanceMetrics.batteryLevel < 0.2;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // If parallax is disabled, render static version
  if (!isClient || shouldDisableParallax) {
    return (
      <div 
        ref={containerRef}
        className={cn('relative overflow-hidden', height, className)}
      >
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={cn(
              'absolute inset-0',
              layer.className
            )}
            style={{ zIndex: layer.zIndex || 0 }}
          >
            {layer.content}
          </div>
        ))}
        {children && (
          <div className="relative z-50">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn('relative overflow-hidden', height, className)}
    >
      {layers.map((layer) => (
        <ParallaxLayer
          key={layer.id}
          layer={layer}
          scrollYProgress={scrollYProgress}
          intensity={intensity}
        />
      ))}
      
      {children && (
        <div className="relative z-50">
          {children}
        </div>
      )}
    </div>
  );
}