'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getBrandStoryHeadlineVariant, 
  getBrandStoryCTAVariant,
  trackABTestView,
  analyticsDashboard 
} from '@/lib/analytics';
import { useStoryAnalytics } from '@/hooks/useStoryAnalytics';

interface StoryAnalyticsContextType {
  headlineVariant: string;
  ctaVariant: string;
  trackSectionView: (sectionName: string) => void;
  trackSectionConversion: (sectionName: string, conversionType: string, data?: any) => void;
  isAnalyticsEnabled: boolean;
}

const StoryAnalyticsContext = createContext<StoryAnalyticsContextType | null>(null);

interface StoryAnalyticsProviderProps {
  children: React.ReactNode;
  enableAnalytics?: boolean;
}

export const StoryAnalyticsProvider: React.FC<StoryAnalyticsProviderProps> = ({
  children,
  enableAnalytics = true,
}) => {
  const [headlineVariant, setHeadlineVariant] = useState<string>('');
  const [ctaVariant, setCTAVariant] = useState<string>('');
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(enableAnalytics);

  // Initialize A/B test variants
  useEffect(() => {
    if (!isAnalyticsEnabled) return;

    // Get A/B test variants for the user
    const headline = getBrandStoryHeadlineVariant();
    const cta = getBrandStoryCTAVariant();
    
    setHeadlineVariant(headline);
    setCTAVariant(cta);

    // Track initial page view
    trackABTestView('brand_story_headline');
    trackABTestView('brand_story_cta');
  }, [isAnalyticsEnabled]);

  // Track section views
  const trackSectionView = (sectionName: string) => {
    if (!isAnalyticsEnabled) return;
    
    analyticsDashboard.addMetric({
      action: 'section_view',
      category: 'brand_story',
      label: sectionName,
      customParameters: {
        headline_variant: headlineVariant,
        cta_variant: ctaVariant,
      },
    });
  };

  // Track section conversions
  const trackSectionConversion = (sectionName: string, conversionType: string, data?: any) => {
    if (!isAnalyticsEnabled) return;
    
    analyticsDashboard.addMetric({
      action: 'conversion',
      category: 'brand_story',
      label: `${sectionName}_${conversionType}`,
      value: 1,
      customParameters: {
        section: sectionName,
        conversion_type: conversionType,
        headline_variant: headlineVariant,
        cta_variant: ctaVariant,
        ...data,
      },
    });
  };

  const contextValue: StoryAnalyticsContextType = {
    headlineVariant,
    ctaVariant,
    trackSectionView,
    trackSectionConversion,
    isAnalyticsEnabled,
  };

  return (
    <StoryAnalyticsContext.Provider value={contextValue}>
      {children}
    </StoryAnalyticsContext.Provider>
  );
};

export const useStoryAnalyticsContext = () => {
  const context = useContext(StoryAnalyticsContext);
  if (!context) {
    throw new Error('useStoryAnalyticsContext must be used within StoryAnalyticsProvider');
  }
  return context;
};

/**
 * HOC for wrapping story sections with analytics
 */
export const withStoryAnalytics = <P extends object>(
  Component: React.ComponentType<P>,
  sectionName: string,
  options?: {
    trackScrollDepth?: boolean;
    trackTimeSpent?: boolean;
    trackInteractions?: boolean;
  }
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const { isAnalyticsEnabled, headlineVariant, ctaVariant } = useStoryAnalyticsContext();
    
    const { sectionRef, trackSectionConversion, metrics } = useStoryAnalytics({
      sectionName,
      abTestId: sectionName === 'hero' ? 'brand_story_headline' : 'brand_story_cta',
      ...options,
    });

    // Add analytics data attributes to the component
    const analyticsProps = isAnalyticsEnabled ? {
      'data-analytics-section': sectionName,
      'data-headline-variant': headlineVariant,
      'data-cta-variant': ctaVariant,
      ref: sectionRef as React.RefObject<HTMLDivElement>,
    } : {};

    return (
      <div {...analyticsProps}>
        <Component {...props} />
      </div>
    );
  };

  WrappedComponent.displayName = `withStoryAnalytics(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

/**
 * Component for tracking CTA interactions
 */
interface AnalyticsCTAProps {
  children: React.ReactNode;
  ctaId: string;
  ctaType: 'primary' | 'secondary';
  sectionName: string;
  onClick?: () => void;
  className?: string;
}

export const AnalyticsCTA: React.FC<AnalyticsCTAProps> = ({
  children,
  ctaId,
  ctaType,
  sectionName,
  onClick,
  className = '',
}) => {
  const { trackSectionConversion, ctaVariant, isAnalyticsEnabled } = useStoryAnalyticsContext();

  const handleClick = () => {
    if (isAnalyticsEnabled) {
      trackSectionConversion(sectionName, 'cta_click', {
        cta_id: ctaId,
        cta_type: ctaType,
        cta_variant: ctaVariant,
      });
    }
    
    if (onClick) {
      onClick();
    }
  };

  const analyticsProps = isAnalyticsEnabled ? {
    'data-cta': ctaId,
    'data-cta-type': ctaType,
    'data-cta-variant': ctaVariant,
  } : {};

  return (
    <div 
      className={className}
      onClick={handleClick}
      {...analyticsProps}
    >
      {children}
    </div>
  );
};

/**
 * Component for tracking form interactions
 */
interface AnalyticsFormProps {
  children: React.ReactNode;
  formId: string;
  sectionName: string;
  onSubmit?: (data: any) => void;
  className?: string;
}

export const AnalyticsForm: React.FC<AnalyticsFormProps> = ({
  children,
  formId,
  sectionName,
  onSubmit,
  className = '',
}) => {
  const { trackSectionConversion, isAnalyticsEnabled } = useStoryAnalyticsContext();
  const [hasStarted, setHasStarted] = useState(false);

  const handleFormStart = () => {
    if (!hasStarted && isAnalyticsEnabled) {
      setHasStarted(true);
      trackSectionConversion(sectionName, 'form_start', {
        form_id: formId,
      });
    }
  };

  const handleSubmit = (data: any) => {
    if (isAnalyticsEnabled) {
      trackSectionConversion(sectionName, 'form_submit', {
        form_id: formId,
        form_data: data,
      });
    }
    
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const analyticsProps = isAnalyticsEnabled ? {
    'data-form': formId,
    onFocus: handleFormStart,
    onChange: handleFormStart,
  } : {};

  return (
    <div 
      className={className}
      {...analyticsProps}
    >
      {React.cloneElement(children as React.ReactElement<any>, {
        onSubmit: handleSubmit,
      })}
    </div>
  );
};

/**
 * Hook for getting A/B test content variants
 */
export const useContentVariants = () => {
  const { headlineVariant, ctaVariant } = useStoryAnalyticsContext();

  const getHeadlineContent = () => {
    switch (headlineVariant) {
      case 'luxury_brands_deserve':
        return {
          headline: 'Luxury Brands Deserve Extraordinary Stories',
          subheadline: 'Transform your brand narrative into market leadership with strategic communications that resonate with discerning audiences.',
        };
      case 'transform_your_brand':
        return {
          headline: 'Transform Your Brand Into a Market Leader',
          subheadline: 'Elevate your luxury brand with compelling storytelling and strategic communications that drive meaningful connections.',
        };
      case 'extraordinary_stories_await':
        return {
          headline: 'Extraordinary Stories Await Your Brand',
          subheadline: 'Discover how strategic narrative design can position your luxury brand as the definitive choice for discerning customers.',
        };
      default:
        return {
          headline: 'Luxury Brands Deserve Extraordinary Stories',
          subheadline: 'Transform your brand narrative into market leadership with strategic communications that resonate with discerning audiences.',
        };
    }
  };

  const getCTAContent = () => {
    switch (ctaVariant) {
      case 'start_your_transformation':
        return {
          primary: 'Start Your Transformation',
          secondary: 'Discover Our Process',
        };
      case 'discover_your_story':
        return {
          primary: 'Discover Your Story',
          secondary: 'Explore Our Approach',
        };
      case 'elevate_your_brand':
        return {
          primary: 'Elevate Your Brand',
          secondary: 'Learn Our Method',
        };
      default:
        return {
          primary: 'Start Your Transformation',
          secondary: 'Discover Our Process',
        };
    }
  };

  return {
    headline: getHeadlineContent(),
    cta: getCTAContent(),
    variants: {
      headlineVariant,
      ctaVariant,
    },
  };
};

export default StoryAnalyticsProvider;