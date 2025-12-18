'use client';

import { useEffect, useRef, useCallback } from 'react';
import { 
  trackScrollDepth, 
  trackStoryEngagement, 
  trackConversion,
  trackABTestView,
  useScrollDepthTracking 
} from '@/lib/analytics';
import { ConversionEvent } from '@/types/analytics';

interface UseStoryAnalyticsOptions {
  sectionName: string;
  trackScrollDepth?: boolean;
  trackTimeSpent?: boolean;
  trackInteractions?: boolean;
  abTestId?: string;
}

export const useStoryAnalytics = ({
  sectionName,
  trackScrollDepth: enableScrollTracking = true,
  trackTimeSpent = true,
  trackInteractions = true,
  abTestId,
}: UseStoryAnalyticsOptions) => {
  const sectionRef = useRef<HTMLElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollDepthRef = useRef<number>(0);
  const interactionCountRef = useRef<number>(0);
  const hasTrackedViewRef = useRef<boolean>(false);
  const isInViewRef = useRef<boolean>(false);

  // Track A/B test view when section comes into view
  useEffect(() => {
    if (!abTestId || hasTrackedViewRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedViewRef.current) {
            trackABTestView(abTestId);
            hasTrackedViewRef.current = true;
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [abTestId]);

  // Track section view and time spent
  useEffect(() => {
    if (!trackTimeSpent) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isInViewRef.current) {
              // Section entered view
              isInViewRef.current = true;
              startTimeRef.current = Date.now();
              trackStoryEngagement(sectionName, 'view');
            }
          } else {
            if (isInViewRef.current) {
              // Section left view
              isInViewRef.current = false;
              const timeSpent = Date.now() - startTimeRef.current;
              trackStoryEngagement(sectionName, 'completion', timeSpent, maxScrollDepthRef.current);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      // Track final time spent if still in view
      if (isInViewRef.current) {
        const timeSpent = Date.now() - startTimeRef.current;
        trackStoryEngagement(sectionName, 'completion', timeSpent, maxScrollDepthRef.current);
      }
    };
  }, [sectionName, trackTimeSpent]);

  // Track scroll depth within section
  useEffect(() => {
    if (!enableScrollTracking || !sectionRef.current) return;

    const handleScroll = () => {
      if (!sectionRef.current || !isInViewRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate how much of the section has been scrolled through
      const scrolledIntoView = Math.max(0, viewportHeight - rect.top);
      const scrollDepth = Math.min(100, Math.round((scrolledIntoView / sectionHeight) * 100));
      
      if (scrollDepth > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = scrollDepth;
        
        // Track milestone scroll depths for this section
        const milestones = [25, 50, 75, 100];
        const milestone = milestones.find(m => scrollDepth >= m && maxScrollDepthRef.current < m);
        
        if (milestone) {
          trackScrollDepth(milestone, sectionName, {
            section_scroll_depth: scrollDepth,
            time_in_section: Date.now() - startTimeRef.current,
          });
        }
      }
    };

    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [sectionName, enableScrollTracking]);

  // Track interactions within section
  useEffect(() => {
    if (!trackInteractions || !sectionRef.current) return;

    const handleInteraction = (event: Event) => {
      if (!isInViewRef.current) return;

      interactionCountRef.current++;
      const target = event.target as HTMLElement;
      
      trackStoryEngagement(sectionName, 'interaction', Date.now() - startTimeRef.current);
      
      // Track specific interaction types
      if (target.closest('[data-cta]')) {
        const ctaType = target.closest('[data-cta]')?.getAttribute('data-cta');
        trackConversion({
          conversionType: ctaType || 'unknown_cta',
          sourceSection: sectionName,
          abTestId: abTestId,
          userJourneyStage: sectionName,
          additionalData: {
            interaction_count: interactionCountRef.current,
            time_to_interaction: Date.now() - startTimeRef.current,
          },
        });
      }
    };

    const events = ['click', 'touchstart'];
    events.forEach(event => {
      sectionRef.current?.addEventListener(event, handleInteraction, { passive: true });
    });

    return () => {
      events.forEach(event => {
        sectionRef.current?.removeEventListener(event, handleInteraction);
      });
    };
  }, [sectionName, trackInteractions, abTestId]);

  // Utility function to track custom conversion
  const trackSectionConversion = useCallback((conversionData: Partial<ConversionEvent>) => {
    if (!conversionData.conversionType) {
      console.warn('trackSectionConversion called without conversionType');
      return;
    }
    
    trackConversion({
      conversionType: conversionData.conversionType,
      sourceSection: sectionName,
      abTestId: abTestId,
      userJourneyStage: sectionName,
      additionalData: {
        time_in_section: Date.now() - startTimeRef.current,
        scroll_depth: maxScrollDepthRef.current,
        interaction_count: interactionCountRef.current,
        ...conversionData.additionalData,
      },
      ...conversionData,
    });
  }, [sectionName, abTestId]);

  return {
    sectionRef,
    trackSectionConversion,
    metrics: {
      timeSpent: Date.now() - startTimeRef.current,
      scrollDepth: maxScrollDepthRef.current,
      interactions: interactionCountRef.current,
      isInView: isInViewRef.current,
    },
  };
};

/**
 * Hook specifically for CTA tracking with A/B testing
 */
export const useCTAAnalytics = (
  ctaId: string,
  sectionName: string,
  abTestId?: string
) => {
  const { trackSectionConversion } = useStoryAnalytics({ 
    sectionName, 
    abTestId,
    trackScrollDepth: false,
    trackTimeSpent: false,
    trackInteractions: false,
  });

  const trackCTAClick = useCallback((ctaVariant?: string, additionalData?: Record<string, any>) => {
    trackSectionConversion({
      conversionType: 'cta_click',
      ctaVariant: ctaVariant,
      additionalData: {
        cta_id: ctaId,
        ...additionalData,
      },
    });
  }, [ctaId, trackSectionConversion]);

  const trackCTAView = useCallback(() => {
    trackSectionConversion({
      conversionType: 'cta_view',
      additionalData: {
        cta_id: ctaId,
      },
    });
  }, [ctaId, trackSectionConversion]);

  return { trackCTAClick, trackCTAView };
};

/**
 * Hook for form submission tracking
 */
export const useFormAnalytics = (
  formId: string,
  sectionName: string,
  abTestId?: string
) => {
  const { trackSectionConversion } = useStoryAnalytics({ 
    sectionName, 
    abTestId,
    trackScrollDepth: false,
    trackTimeSpent: false,
    trackInteractions: false,
  });

  const trackFormStart = useCallback(() => {
    trackSectionConversion({
      conversionType: 'form_start',
      additionalData: {
        form_id: formId,
      },
    });
  }, [formId, trackSectionConversion]);

  const trackFormSubmit = useCallback((success: boolean, formData?: Record<string, any>) => {
    trackSectionConversion({
      conversionType: success ? 'form_submit_success' : 'form_submit_error',
      value: success ? 1 : 0,
      additionalData: {
        form_id: formId,
        form_data: formData,
      },
    });
  }, [formId, trackSectionConversion]);

  const trackFieldInteraction = useCallback((fieldName: string) => {
    trackSectionConversion({
      conversionType: 'form_field_interaction',
      additionalData: {
        form_id: formId,
        field_name: fieldName,
      },
    });
  }, [formId, trackSectionConversion]);

  return { trackFormStart, trackFormSubmit, trackFieldInteraction };
};

// Throttle utility function
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}