'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Media } from '@/types';

export interface ImageGalleryProps {
  images: Media[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  className = '',
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    // Prevent body scroll when lightbox is open
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
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
      {/* Gallery Grid */}
      <div className={`grid ${gridColsClass[columns]} gap-3 sm:gap-4 md:gap-6 ${className}`}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group touch-manipulation"
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
            <Image
              src={image.url}
              alt={image.alternativeText || image.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${100 / columns}vw`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
        >
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-3xl sm:text-4xl w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors z-10 touch-manipulation"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ×
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              className="absolute left-2 sm:left-4 text-white text-3xl sm:text-4xl w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors z-10 touch-manipulation"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full mx-2 sm:mx-4"
            onClick={(e) => e.stopPropagation()}
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

          {/* Next Button */}
          {images.length > 1 && (
            <button
              className="absolute right-2 sm:right-4 text-white text-3xl sm:text-4xl w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors z-10 touch-manipulation"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next image"
            >
              ›
            </button>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs sm:text-sm bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Caption */}
          {images[currentImageIndex].caption && (
            <div className="absolute bottom-12 sm:bottom-16 left-1/2 transform -translate-x-1/2 text-white text-center max-w-2xl px-4 text-sm sm:text-base">
              {images[currentImageIndex].caption}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ImageGallery;
