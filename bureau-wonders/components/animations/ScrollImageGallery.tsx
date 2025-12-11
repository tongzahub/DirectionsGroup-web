'use client';

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ReactNode, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';
import { usePerformanceMetrics } from '@/lib/performance-monitor';
import { cn } from '@/lib/utils';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'wide';
}

interface ScrollImageGalleryProps {
  images: GalleryImage[];
  layout?: 'grid' | 'masonry' | 'carousel' | 'stacked';
  columns?: number;
  gap?: number;
  className?: string;
  enableZoom?: boolean;
  enableParallax?: boolean;
  staggerDelay?: number;
  disabled?: boolean;
  onImageClick?: (image: GalleryImage, index: number) => void;
}

const aspectRatioClasses = {
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[16/9]',
};

export default function ScrollImageGallery({
  images,
  layout = 'grid',
  columns = 3,
  gap = 4,
  className = '',
  enableZoom = true,
  enableParallax = false,
  staggerDelay = 0.1,
  disabled = false,
  onImageClick,
}: ScrollImageGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const performanceMetrics = usePerformanceMetrics();

  const { ref: triggerRef, isInView, isDisabled } = useScrollTrigger({
    threshold: 0.1,
    triggerOnce: true,
    disabled: disabled || performanceMetrics.isLowEndDevice,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Container variants for staggered animations
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  };

  // Image variants for reveal animations
  const imageVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  // Parallax transform for individual images
  const createParallaxTransform = (index: number) => {
    if (!enableParallax || isDisabled) return {};
    
    const speed = 0.1 + (index % 3) * 0.05; // Vary speed based on position
    const y = useTransform(
      scrollYProgress,
      [0, 1],
      [20 * speed, -20 * speed]
    );
    
    return { y };
  };

  // Grid layout classes
  const getGridClasses = () => {
    const baseClasses = `grid gap-${gap}`;
    
    switch (columns) {
      case 2:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`;
      case 3:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
      case 4:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
    }
  };

  // Masonry layout (simplified version)
  const getMasonryClasses = () => {
    return `columns-1 sm:columns-2 lg:columns-3 gap-${gap} space-y-${gap}`;
  };

  const layoutClasses = layout === 'masonry' ? getMasonryClasses() : getGridClasses();

  // Static version for performance or SSR
  if (!isClient || isDisabled) {
    return (
      <div 
        ref={triggerRef}
        className={cn('w-full', layoutClasses, className)}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              'relative overflow-hidden rounded-lg cursor-pointer',
              layout === 'masonry' ? 'break-inside-avoid mb-4' : aspectRatioClasses[image.aspectRatio || 'landscape']
            )}
            onClick={() => onImageClick?.(image, index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-sm">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={(node) => {
        if (node) {
          triggerRef.current = node;
          containerRef.current = node;
        }
      }}
      className={cn('w-full', layoutClasses, className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {images.map((image, index) => {
        const parallaxStyle = createParallaxTransform(index);
        
        return (
          <motion.div
            key={image.id}
            className={cn(
              'relative overflow-hidden rounded-lg cursor-pointer group',
              layout === 'masonry' ? 'break-inside-avoid mb-4' : aspectRatioClasses[image.aspectRatio || 'landscape']
            )}
            variants={imageVariants}
            style={parallaxStyle}
            onHoverStart={() => setHoveredImage(image.id)}
            onHoverEnd={() => setHoveredImage(null)}
            onClick={() => onImageClick?.(image, index)}
            whileHover={enableZoom ? {
              scale: 1.02,
              transition: { duration: 0.3, ease: 'easeOut' }
            } : {}}
          >
            {/* Image container with zoom effect */}
            <motion.div
              className="relative w-full h-full"
              whileHover={enableZoom ? {
                scale: 1.1,
                transition: { duration: 0.4, ease: 'easeOut' }
              } : {}}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Hover overlay */}
              <motion.div
                className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>

            {/* Caption */}
            {image.caption && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-3 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {image.caption}
              </motion.div>
            )}

            {/* Zoom indicator */}
            {enableZoom && hoveredImage === image.id && (
              <motion.div
                className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Preset configurations for different gallery types
export const galleryPresets = {
  caseStudy: {
    layout: 'grid' as const,
    columns: 2,
    enableZoom: true,
    enableParallax: true,
    staggerDelay: 0.15,
  },
  
  portfolio: {
    layout: 'masonry' as const,
    columns: 3,
    enableZoom: true,
    enableParallax: false,
    staggerDelay: 0.1,
  },
  
  showcase: {
    layout: 'grid' as const,
    columns: 4,
    enableZoom: false,
    enableParallax: true,
    staggerDelay: 0.05,
  },
  
  minimal: {
    layout: 'grid' as const,
    columns: 1,
    enableZoom: false,
    enableParallax: false,
    staggerDelay: 0.2,
  },
} as const;