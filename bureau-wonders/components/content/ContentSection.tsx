'use client';

import React from 'react';
import { marked } from 'marked';
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
      // Configure marked options for better rendering
      marked.setOptions({
        breaks: true,
        gfm: true,
      });
      
      // Convert markdown to HTML
      const htmlContent = marked(text);
      
      return (
        <div
          className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none text-neutral-gray-dark leading-relaxed 
                     prose-headings:text-neutral-gray-dark prose-headings:font-bold
                     prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0
                     prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:first:mt-0
                     prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8
                     prose-p:mb-6 prose-p:leading-relaxed prose-p:text-neutral-gray-dark
                     prose-ul:mb-6 prose-ul:space-y-2
                     prose-li:text-neutral-gray-dark prose-li:leading-relaxed
                     prose-strong:text-neutral-gray-dark prose-strong:font-semibold
                     prose-a:text-primary-blue prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
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
