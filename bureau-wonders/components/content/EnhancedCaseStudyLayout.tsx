'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { ParallaxBackground, ParallaxSection } from '@/components/animations';
import { RichText, Media } from '@/types';
import ImageGallery from './ImageGallery';
import { cn } from '@/lib/utils';
import { getStrapiMediaUrl } from '@/lib/strapi-client';

interface CaseStudySection {
  title: string;
  content: RichText;
}

interface EnhancedCaseStudyLayoutProps {
  title: string;
  client: string;
  publishedAt: string;
  featuredImage?: {
    url: string;
    alternativeText?: string;
  };
  challenge: RichText;
  strategy: RichText;
  execution: RichText;
  results: RichText;
  gallery?: Media[];
  useParallax?: boolean;
}

export default function EnhancedCaseStudyLayout({
  title,
  client,
  publishedAt,
  featuredImage,
  challenge,
  strategy,
  execution,
  results,
  gallery,
  useParallax = true,
}: EnhancedCaseStudyLayoutProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Render rich text content
  const renderContent = (content: RichText) => {
    if (typeof content === 'string') {
      return (
        <div
          className="prose prose-lg max-w-none text-neutral-gray-dark leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return (
      <div className="prose prose-lg max-w-none text-neutral-gray-dark">
        {JSON.stringify(content)}
      </div>
    );
  };

  // Section component with optional parallax
  const CaseStudySection = ({ 
    title: sectionTitle, 
    content, 
    index 
  }: { 
    title: string; 
    content: RichText; 
    index: number;
  }) => {
    const parallaxElements = useParallax ? [
      {
        id: `decoration-${index}`,
        speed: 0.2 + (index * 0.1),
        className: `${index % 2 === 0 ? 'top-10 right-10' : 'bottom-10 left-10'} opacity-5`,
        zIndex: 1,
        content: (
          <div className={cn(
            'w-64 h-64 rounded-full blur-3xl',
            index % 3 === 0 ? 'bg-blue-200' : 
            index % 3 === 1 ? 'bg-purple-200' : 'bg-green-200'
          )} />
        ),
      },
    ] : [];

    return (
      <ParallaxSection
        elements={parallaxElements}
        className="mb-12 py-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-gray-dark mb-6 flex items-center">
          <span className="w-12 h-1 bg-primary-blue mr-4"></span>
          {sectionTitle}
        </h2>
        <div className="pl-16">
          {renderContent(content)}
        </div>
      </ParallaxSection>
    );
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Featured Image with Parallax */}
      {featuredImage && getStrapiMediaUrl(featuredImage.url) && (
        <ParallaxBackground
          backgroundImage={getStrapiMediaUrl(featuredImage.url)!}
          backgroundImageAlt={featuredImage.alternativeText || title}
          speed={0.5}
          className="relative w-full h-64 md:h-96 lg:h-[500px] flex items-end"
          overlayClassName="bg-gradient-to-t from-black/60 via-black/20 to-transparent"
        >
          <div className="container mx-auto px-4 pb-8 text-white">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary-blue text-white uppercase tracking-wide">
                {client}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-lg">
              {title}
            </h1>
            <time dateTime={publishedAt} className="text-sm md:text-base opacity-90">
              {formattedDate}
            </time>
          </div>
        </ParallaxBackground>
      )}

      {/* Case Study Content */}
      <article className="container mx-auto px-4 max-w-5xl py-12 md:py-16 lg:py-20">
        {/* If no featured image, show header here */}
        {!featuredImage && (
          <header className="mb-12 pb-8 border-b border-neutral-soft-gray">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary-blue text-white uppercase tracking-wide">
                {client}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-gray-dark mb-4">
              {title}
            </h1>
            <time dateTime={publishedAt} className="text-neutral-gray text-sm md:text-base">
              {formattedDate}
            </time>
          </header>
        )}

        {/* Challenge Section */}
        <CaseStudySection title="Challenge" content={challenge} index={0} />

        {/* Strategy Section */}
        <CaseStudySection title="Strategy" content={strategy} index={1} />

        {/* Execution Section */}
        <CaseStudySection title="Execution" content={execution} index={2} />

        {/* Results Section */}
        <CaseStudySection title="Results" content={results} index={3} />

        {/* Visual Gallery Section with Parallax */}
        {gallery && gallery.length > 0 && (
          <ParallaxSection
            elements={useParallax ? [
              {
                id: 'gallery-decoration',
                speed: 0.3,
                className: 'top-0 right-0 opacity-5',
                zIndex: 1,
                content: (
                  <div className="w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl" />
                ),
              },
            ] : []}
            className="mb-12 pt-12 border-t border-neutral-soft-gray"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-gray-dark mb-8 flex items-center">
              <span className="w-12 h-1 bg-primary-blue mr-4"></span>
              Visual Gallery
            </h2>
            <ImageGallery images={gallery} columns={3} />
          </ParallaxSection>
        )}
      </article>
    </main>
  );
}