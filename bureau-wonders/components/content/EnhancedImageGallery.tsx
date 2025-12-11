'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Media } from '@/types';
import { ScrollTriggeredReveal, StaggerContainer, StaggerItem } from '@/components/animations';

export interface EnhancedImageGalleryProps {
  images: Media[];
  layout?: 'masonry' | 'grid' | 'carousel';
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  enableParallax?: boolean;
  enableLightbox?: boolean;
  showCaptions?: boolean;
  animationDelay?: number;
}

const EnhancedImageGallery: React.FC<EnhancedImageGalleryProps> = ({
  images,
  layout = 'grid',
  columns = 3,
  className = '',
  enableParallax = false,
  enableLightbox = true,
  showCaptions = true,
  animationDelay = 0.1,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});
  const galleryRef = useRef<HTMLDivElement>(null);

  // Masonry layout heights for varied visual interest
  const masonryHeights = [
    'aspect-[4/3]', 'aspect-[3/4]', 'aspect-square', 'aspect-[16/9]', 'aspect-[9/16]'
  ];

  const openLightbox = (index: number) => {
    if (!enableLightbox) return;
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

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
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // Parallax effect
  useEffect(() => {
    if (!enableParallax || !galleryRef.current) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = galleryRef.current?.querySelectorAll('[data-parallax]');
      
      parallaxElements?.forEach((element, index) => {
        const speed = 0.5 + (index % 3) * 0.2; // Varied speeds
        const yPos = -(scrolled * speed);
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableParallax]);

  const handleImageLoad = (index: number) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  const getGridClass = () => {
    switch (layout) {
      case 'masonry':
        return `columns-1 sm:columns-2 lg:columns-${columns} gap-4 sm:gap-6 space-y-4 sm:space-y-6`;
      case 'carousel':
        return 'flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory';
      default:
        return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4 sm:gap-6`;
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-gray">No images to display</p>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Gallery */}
      <div ref={galleryRef} className={className}>
        <ScrollTriggeredReveal direction="up" delay={100}>
          <StaggerContainer className={getGridClass()}>
            {images.map((image, index) => {
              const aspectClass = layout === 'masonry' 
                ? masonryHeights[index % masonryHeights.length]
                : layout === 'carousel'
                ? 'aspect-[4/3] flex-shrink-0 w-80 snap-center'
                : 'aspect-square';

              return (
                <StaggerItem 
                  key={image.id} 
                  className={layout === 'masonry' ? 'break-inside-avoid mb-4 sm:mb-6' : ''}
                >
                  <div
                    className={`relative ${aspectClass} rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-700 ${
                      enableLightbox ? 'hover:scale-[1.02]' : ''
                    }`}
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
                    data-parallax={enableParallax ? 'true' : undefined}
                  >
                    {/* Loading skeleton with shimmer */}
                    {!imageLoaded[index] && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    )}
                    
                    <Image
                      src={image.url}
                      alt={image.alternativeText || image.name}
                      fill
                      className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                        imageLoaded[index] ? 'opacity-100' : 'opacity-0'
                      }`}
                      sizes={layout === 'carousel' 
                        ? '320px' 
                        : `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${100 / columns}vw`
                      }
                      loading="lazy"
                      onLoad={() => handleImageLoad(index)}
                    />
                    
                    {/* Enhanced overlay with multiple layers */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                    
                    {/* Interactive elements */}
                    {enableLightbox && (
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Enhanced caption with better typography */}
                    {showCaptions && image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <p className="text-white text-sm sm:text-base font-medium leading-relaxed line-clamp-3">
                          {image.caption}
                        </p>
                        {image.alternativeText && image.alternativeText !== image.caption && (
                          <p className="text-white/70 text-xs mt-1">
                            {image.alternativeText}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </ScrollTriggeredReveal>
      </div>

      {/* Enhanced Lightbox (reusing the enhanced version from ImageGallery) */}
      {lightboxOpen && enableLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all duration-300 z-20 group"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation */}
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

          {/* Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full mx-4 transition-all duration-500"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'scaleIn 0.4s ease-out' }}
          >
            <Image
              src={images[currentImageIndex].url}
              alt={images[currentImageIndex].alternativeText || images[currentImageIndex].name}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
            <div className="text-white text-sm font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Caption */}
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
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
};

export default EnhancedImageGallery;