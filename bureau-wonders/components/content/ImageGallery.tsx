'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Media } from '@/types';

export interface ImageGalleryProps {
  images: Media[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  enableLazyLoading?: boolean;
  showCaptions?: boolean;
  enableZoom?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  className = '',
  enableLazyLoading = true,
  showCaptions = true,
  enableZoom = true,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});
  const [isZoomed, setIsZoomed] = useState(false);

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    setIsZoomed(false);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setIsZoomed(false);
    document.body.style.overflow = 'unset';
  }, []);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  }, [images.length]);

  const toggleZoom = useCallback(() => {
    if (enableZoom) {
      setIsZoomed(prev => !prev);
    }
  }, [enableZoom]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case ' ':
          e.preventDefault();
          toggleZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, goToNext, goToPrevious, toggleZoom]);

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Enhanced Gallery Grid */}
      <div className={`grid ${gridColsClass[columns]} gap-4 sm:gap-6 md:gap-8 ${className}`}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group touch-manipulation shadow-lg hover:shadow-2xl transition-all duration-500"
            onClick={() => openLightbox(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
              }
            }}
            aria-label={`View ${image.alternativeText || image.name}`}
          >
            {/* Loading skeleton */}
            {!imageLoaded[index] && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            )}
            
            <Image
              src={image.url}
              alt={image.alternativeText || image.name}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded[index] ? 'opacity-100' : 'opacity-0'
              }`}
              sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${100 / columns}vw`}
              loading={enableLazyLoading ? "lazy" : "eager"}
              onLoad={() => handleImageLoad(index)}
            />
            
            {/* Enhanced overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Zoom icon */}
            <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
            
            {/* Image caption overlay */}
            {showCaptions && image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <p className="text-white text-sm font-medium line-clamp-2">
                  {image.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Enhanced Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          {/* Enhanced Close Button */}
          <button
            className="absolute top-4 right-4 text-white w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all duration-300 z-20 group"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Enhanced Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all duration-300 z-20 group"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all duration-300 z-20 group"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next image"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Enhanced Image Container with Zoom */}
          <div
            className={`relative max-w-7xl max-h-[90vh] w-full h-full mx-4 cursor-${enableZoom ? (isZoomed ? 'zoom-out' : 'zoom-in') : 'default'} transition-all duration-500 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (enableZoom) toggleZoom();
            }}
            style={{
              animation: 'scaleIn 0.4s ease-out'
            }}
          >
            <Image
              src={images[currentImageIndex].url}
              alt={images[currentImageIndex].alternativeText || images[currentImageIndex].name}
              fill
              className="object-contain transition-all duration-500"
              sizes="100vw"
              priority
            />
          </div>

          {/* Enhanced Controls Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
            {/* Image Counter */}
            {images.length > 1 && (
              <div className="text-white text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
            
            {/* Zoom Toggle */}
            {enableZoom && (
              <button
                className="text-white hover:text-blue-300 transition-colors p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
                aria-label={isZoomed ? "Zoom out" : "Zoom in"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isZoomed ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10h-3m-3 0h3m0 0V7m0 3v3" : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"} />
                </svg>
              </button>
            )}
          </div>

          {/* Enhanced Caption */}
          {showCaptions && images[currentImageIndex].caption && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-center max-w-2xl px-6 py-3 bg-black/50 backdrop-blur-sm rounded-xl">
              <p className="text-sm sm:text-base font-medium">
                {images[currentImageIndex].caption}
              </p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
      `}</style>
    </>
  );
};

export default ImageGallery;
