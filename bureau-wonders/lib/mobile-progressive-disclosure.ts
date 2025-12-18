/**
 * Mobile Progressive Disclosure Utilities
 * Optimized content presentation for mobile devices
 */

import { useEffect, useState } from 'react';
import { useDeviceType } from '@/lib/responsive';

// Progressive disclosure configuration
export interface ProgressiveDisclosureConfig {
  mobileMaxLength: number;
  tabletMaxLength: number;
  desktopMaxLength: number;
  showMoreText: string;
  showLessText: string;
  animationDuration: number;
}

const defaultConfig: ProgressiveDisclosureConfig = {
  mobileMaxLength: 150,
  tabletMaxLength: 250,
  desktopMaxLength: 400,
  showMoreText: 'Read more',
  showLessText: 'Show less',
  animationDuration: 300,
};

// Hook for progressive text disclosure
export const useProgressiveText = (
  text: string,
  config: Partial<ProgressiveDisclosureConfig> = {}
) => {
  const deviceType = useDeviceType();
  const [isExpanded, setIsExpanded] = useState(false);
  const fullConfig = { ...defaultConfig, ...config };

  const getMaxLength = () => {
    switch (deviceType) {
      case 'mobile':
        return fullConfig.mobileMaxLength;
      case 'tablet':
        return fullConfig.tabletMaxLength;
      default:
        return fullConfig.desktopMaxLength;
    }
  };

  const maxLength = getMaxLength();
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate 
    ? text 
    : text.substring(0, maxLength) + '...';

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return {
    displayText,
    isExpanded,
    shouldTruncate,
    toggleExpanded,
    buttonText: isExpanded ? fullConfig.showLessText : fullConfig.showMoreText,
  };
};

// Hook for progressive list disclosure
export const useProgressiveList = <T>(
  items: T[],
  config: {
    mobileInitialCount: number;
    tabletInitialCount: number;
    desktopInitialCount: number;
    showMoreText: string;
    showLessText: string;
  }
) => {
  const deviceType = useDeviceType();
  const [isExpanded, setIsExpanded] = useState(false);

  const getInitialCount = () => {
    switch (deviceType) {
      case 'mobile':
        return config.mobileInitialCount;
      case 'tablet':
        return config.tabletInitialCount;
      default:
        return config.desktopInitialCount;
    }
  };

  const initialCount = getInitialCount();
  const shouldTruncate = items.length > initialCount;
  const displayItems = isExpanded || !shouldTruncate 
    ? items 
    : items.slice(0, initialCount);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return {
    displayItems,
    isExpanded,
    shouldTruncate,
    toggleExpanded,
    buttonText: isExpanded ? config.showLessText : config.showMoreText,
    hiddenCount: items.length - initialCount,
  };
};

// Hook for mobile-first content sections
export const useMobileContentSections = (sections: string[]) => {
  const deviceType = useDeviceType();
  const [activeSection, setActiveSection] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  // Auto-expand all sections on desktop
  useEffect(() => {
    if (deviceType === 'desktop') {
      setExpandedSections(new Set(sections.map((_, index) => index)));
    } else {
      // On mobile/tablet, only show first section initially
      setExpandedSections(new Set([0]));
    }
  }, [deviceType, sections.length]);

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const expandAllSections = () => {
    setExpandedSections(new Set(sections.map((_, index) => index)));
  };

  const collapseAllSections = () => {
    setExpandedSections(new Set([0])); // Keep first section open
  };

  return {
    activeSection,
    setActiveSection,
    expandedSections,
    toggleSection,
    expandAllSections,
    collapseAllSections,
    isSectionExpanded: (index: number) => expandedSections.has(index),
  };
};

// Mobile-optimized content chunking
export const chunkContentForMobile = (
  content: string,
  config: {
    chunkSize: number;
    overlap: number;
  } = { chunkSize: 300, overlap: 50 }
) => {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < content.length) {
    const endIndex = Math.min(startIndex + config.chunkSize, content.length);
    let chunk = content.substring(startIndex, endIndex);

    // Try to break at word boundaries
    if (endIndex < content.length) {
      const lastSpaceIndex = chunk.lastIndexOf(' ');
      if (lastSpaceIndex > config.chunkSize * 0.7) {
        chunk = chunk.substring(0, lastSpaceIndex);
      }
    }

    chunks.push(chunk);
    startIndex += chunk.length - config.overlap;
  }

  return chunks;
};

// Mobile reading time estimation
export const estimateReadingTime = (text: string, wordsPerMinute: number = 200) => {
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  if (minutes < 1) {
    return 'Less than 1 min read';
  } else if (minutes === 1) {
    return '1 min read';
  } else {
    return `${minutes} min read`;
  }
};

// Mobile-friendly content formatting
export const formatContentForMobile = (content: string) => {
  return content
    // Break long sentences
    .replace(/([.!?])\s+/g, '$1\n\n')
    // Add spacing around lists
    .replace(/(\n|^)(\d+\.|[-*])\s/g, '\n\n$2 ')
    // Ensure proper paragraph spacing
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Touch-friendly interaction zones
export const getTouchZoneSize = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  switch (deviceType) {
    case 'mobile':
      return {
        minHeight: 44, // iOS HIG minimum
        minWidth: 44,
        padding: 12,
      };
    case 'tablet':
      return {
        minHeight: 48,
        minWidth: 48,
        padding: 16,
      };
    default:
      return {
        minHeight: 40,
        minWidth: 40,
        padding: 8,
      };
  }
};

// Mobile typography scaling
export const getMobileTypographyScale = (deviceType: 'mobile' | 'tablet' | 'desktop') => {
  switch (deviceType) {
    case 'mobile':
      return {
        h1: 'text-2xl sm:text-3xl',
        h2: 'text-xl sm:text-2xl',
        h3: 'text-lg sm:text-xl',
        h4: 'text-base sm:text-lg',
        body: 'text-sm sm:text-base',
        caption: 'text-xs sm:text-sm',
        lineHeight: 'leading-relaxed',
      };
    case 'tablet':
      return {
        h1: 'text-3xl md:text-4xl',
        h2: 'text-2xl md:text-3xl',
        h3: 'text-xl md:text-2xl',
        h4: 'text-lg md:text-xl',
        body: 'text-base md:text-lg',
        caption: 'text-sm md:text-base',
        lineHeight: 'leading-relaxed',
      };
    default:
      return {
        h1: 'text-4xl lg:text-5xl',
        h2: 'text-3xl lg:text-4xl',
        h3: 'text-2xl lg:text-3xl',
        h4: 'text-xl lg:text-2xl',
        body: 'text-lg',
        caption: 'text-base',
        lineHeight: 'leading-normal',
      };
  }
};