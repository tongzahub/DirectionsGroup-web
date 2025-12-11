'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSwipeGesture, useTouchFeedback, useTouchHover } from '@/hooks/useTouchInteractions';
import { useDeviceType } from '@/lib/responsive';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface TouchImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
  showThumbnails?: boolean;
  enableZoom?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const TouchImageGallery: React.FC<TouchImageGalleryProps> = ({
  images,
  className = '',
  showThumbnails = true,
  enableZoom = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  const deviceType = useDeviceType();
  const containerRef = useRef<HTMLDivElement>(null);
  const { triggerFeedback } = useTouchFeedback();
  
  // Auto-play functionality
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  React.useEffect(() => {
    if (autoPlay && !isLightboxOpen) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isLightboxOpen, images.length]);

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    triggerFeedback('light');
  }, [images.length, triggerFeedback]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    triggerFeedback('light');
  }, [images.length, triggerFeedback]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    triggerFeedback('light');
  }, [triggerFeedback]);

  // Swipe gesture handling
  const handleSwipe = useCallback((gesture: any) => {
    if (gesture.direction === 'left') {
      goToNext();
    } else if (gesture.direction === 'right') {
      goToPrevious();
    }
  }, [goToNext, goToPrevious]);

  const swipeProps = useSwipeGesture(handleSwipe, {
    threshold: 50,
    direction: 'horizontal',
    preventScroll: true,
  });

  // Touch hover for thumbnails
  const thumbnailHover = useTouchHover({
    touchDelay: 100,
    hoverTimeout: 200,
  });

  // Lightbox functionality
  const openLightbox = useCallback((index?: number) => {
    if (index !== undefined) {
      setCurrentIndex(index);
    }
    setIsLightboxOpen(true);
    setZoomLevel(1);
    setZoomPosition({ x: 0, y: 0 });
    triggerFeedback('medium');
  }, [triggerFeedback]);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setZoomLevel(1);
    setZoomPosition({ x: 0, y: 0 });
  }, []);

  // Zoom functionality for lightbox
  const handleZoom = useCallback((e: React.TouchEvent) => {
    if (!enableZoom || e.touches.length !== 2) return;

    e.preventDefault();
    
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    // Store initial distance for pinch calculation
    const initialDistance = useRef(distance);
    const newZoom = Math.max(1, Math.min(3, zoomLevel * (distance / initialDistance.current)));
    
    setZoomLevel(newZoom);
  }, [enableZoom, zoomLevel]);

  // Pan handling for zoomed images
  const handlePan = useCallback((event: any, info: PanInfo) => {
    if (zoomLevel > 1) {
      setZoomPosition({
        x: zoomPosition.x + info.delta.x,
        y: zoomPosition.y + info.delta.y,
      });
    }
  }, [zoomLevel, zoomPosition]);

  return (
    <>
      {/* Main Gallery */}
      <div className={cn('relative w-full', className)}>
        {/* Main Image Container */}
        <div
          ref={containerRef}
          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100"
          {...swipeProps}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <img
                src={images[currentIndex]?.src}
                alt={images[currentIndex]?.alt}
                className="h-full w-full object-cover cursor-pointer"
                onClick={() => openLightbox()}
                onTouchStart={(e) => {
                  // Double tap to zoom
                  if (deviceType === 'mobile') {
                    const now = Date.now();
                    const lastTap = useRef(0);
                    
                    if (now - lastTap.current < 300) {
                      openLightbox();
                    }
                    lastTap.current = now;
                  }
                }}
              />
              
              {/* Image Caption */}
              {images[currentIndex]?.caption && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-white text-sm font-medium">
                    {images[currentIndex].caption}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - Hidden on mobile, shown on hover for desktop */}
          {deviceType !== 'mobile' && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Progress Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-200',
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                )}
              />
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => goToIndex(index)}
                className={cn(
                  'flex-shrink-0 relative aspect-square w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200',
                  index === currentIndex
                    ? 'border-primary-500 ring-2 ring-primary-200'
                    : 'border-transparent hover:border-primary-300'
                )}
                whileTap={{ scale: 0.95 }}
                {...thumbnailHover.touchProps}
                {...thumbnailHover.mouseProps}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
                
                {/* Touch feedback overlay */}
                <motion.div
                  className="absolute inset-0 bg-primary-500/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: thumbnailHover.isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>

            {/* Main Lightbox Image */}
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
              drag={zoomLevel > 1}
              onPan={handlePan}
              dragConstraints={{
                left: -100,
                right: 100,
                top: -100,
                bottom: 100,
              }}
            >
              <motion.img
                src={images[currentIndex]?.src}
                alt={images[currentIndex]?.alt}
                className="max-w-full max-h-full object-contain"
                style={{
                  scale: zoomLevel,
                  x: zoomPosition.x,
                  y: zoomPosition.y,
                }}
                onTouchMove={handleZoom}
                onDoubleClick={() => {
                  setZoomLevel(zoomLevel === 1 ? 2 : 1);
                  setZoomPosition({ x: 0, y: 0 });
                }}
              />
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TouchImageGallery;