'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { usePerformanceMetrics } from '@/lib/performance-monitor';
import { cn } from '@/lib/utils';

interface ParallaxImage {
  id: string;
  src: string;
  alt: string;
  speed: number;
  className?: string;
  zIndex?: number;
  overlay?: ReactNode;
}

interface ParallaxImageGalleryProps {
  images: ParallaxImage[];
  children?: ReactNode;
  height?: string;
  className?: string;
  disabled?: boolean;
  intensity?: number;
  enableZoom?: boolean;
}

export default function ParallaxImageGallery({
  images,
  children,
  height = 'h-96 md:h-[500px] lg:h-[600px]',
  className = '',
  disabled = false,
  intensity = 1,
  enableZoom = true,
}: ParallaxImageGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
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
    offset: ["start end", "end start"]
  });

  // Static version for performance or SSR
  if (!isClient || shouldDisableParallax) {
    return (
      <div 
        ref={containerRef}
        className={cn('relative overflow-hidden', height, className)}
      >
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              'absolute inset-0',
              image.className
            )}
            style={{ zIndex: image.zIndex || 0 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            {image.overlay && (
              <div className="absolute inset-0">
                {image.overlay}
              </div>
            )}
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
      {images.map((image) => {
        const adjustedSpeed = image.speed * intensity;
        const y = useTransform(
          scrollYProgress, 
          [0, 1], 
          [100 * adjustedSpeed, -100 * adjustedSpeed]
        );

        const scale = enableZoom && hoveredImage === image.id 
          ? useTransform(() => 1.05) 
          : useTransform(() => 1);

        return (
          <motion.div
            key={image.id}
            className={cn(
              'absolute inset-0 cursor-pointer',
              image.className
            )}
            style={{ 
              y,
              scale,
              zIndex: image.zIndex || 0,
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
            }}
            onHoverStart={() => setHoveredImage(image.id)}
            onHoverEnd={() => setHoveredImage(null)}
            whileHover={enableZoom ? { scale: 1.05 } : {}}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            {image.overlay && (
              <motion.div 
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {image.overlay}
              </motion.div>
            )}
          </motion.div>
        );
      })}
      
      {children && (
        <div className="relative z-50">
          {children}
        </div>
      )}
    </div>
  );
}