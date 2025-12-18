'use client';

import { useEffect, useState } from 'react';

interface TableOfContentsProps {
  estimatedReadingTime: number;
}

export default function TableOfContents({ estimatedReadingTime }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    // Generate table of contents from article headings
    const articleContent = document.getElementById('article-content');
    if (articleContent) {
      const headingElements = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingData = Array.from(headingElements).map((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
        return {
          id: heading.id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1))
        };
      });
      setHeadings(headingData);
    }

    // Update reading progress
    const updateProgress = () => {
      const article = document.getElementById('article-content');
      if (article) {
        const rect = article.getBoundingClientRect();
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrolled = Math.max(0, -rect.top);
        const progress = Math.min(100, (scrolled / (articleHeight - windowHeight)) * 100);
        setReadingProgress(Math.max(0, progress));
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-24 space-y-6">
      {/* Reading Progress */}
      <div className="bg-gradient-to-br from-accent-mist-blue/20 to-primary-blue/10 rounded-2xl p-6 border border-accent-mist-blue/20">
        <h3 className="text-base font-bold text-neutral-gray-dark mb-3 flex items-center">
          <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
          Reading Progress
        </h3>
        <div className="text-sm text-neutral-gray mb-2">
          Estimated {estimatedReadingTime} min read
        </div>
        <div className="w-full bg-neutral-gray-light/30 rounded-full h-2">
          <div 
            className="bg-primary-blue h-2 rounded-full transition-all duration-300" 
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>
      
      {/* Table of Contents */}
      {headings.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-gray-light/20 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-neutral-gray-dark mb-3">
            Table of Contents
          </h3>
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id} style={{ marginLeft: `${(heading.level - 1) * 12}px` }}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className="text-sm text-neutral-gray hover:text-primary-blue transition-colors duration-200 block py-1 px-2 rounded hover:bg-accent-mist-blue/20 text-left w-full"
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}