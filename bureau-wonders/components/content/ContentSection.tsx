'use client';

import React from 'react';
import { RichText } from '@/types';
import { ScrollReveal } from '@/components/animations';

export type ContentLayout = 'single' | 'two-column' | 'grid';

export interface ContentSectionProps {
  content: RichText;
  layout?: ContentLayout;
  title?: string;
  className?: string;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  content,
  layout = 'single',
  title,
  className = '',
}) => {
  // Render rich text content
  const renderContent = (text: RichText) => {
    if (typeof text === 'string') {
      return (
        <div
          className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-neutral-gray-dark leading-relaxed"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }
    // Handle structured rich text (if needed in the future)
    return <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none text-neutral-gray-dark">{JSON.stringify(text)}</div>;
  };

  const layoutStyles = {
    single: 'max-w-4xl mx-auto',
    'two-column': 'grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12',
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8',
  };

  return (
    <section className={`py-8 sm:py-12 md:py-16 lg:py-20 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {title && (
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-gray-dark mb-6 sm:mb-8 md:mb-12 text-center">
              {title}
            </h2>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.1}>
          <div className={layoutStyles[layout]}>
            {renderContent(content)}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ContentSection;
