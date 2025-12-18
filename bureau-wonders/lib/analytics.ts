import { AnalyticsEvent, CTAAnalyticsData, ScrollDepthEvent, ABTestVariant, ConversionEvent } from '@/types/analytics';

/**
 * Track analytics events with Google Analytics
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      custom_parameters: event.customParameters,
    });
  }

  // Also send to custom analytics endpoint for dashboard
  if (typeof window !== 'undefined') {
    sendToAnalyticsDashboard(event);
  }
};

/**
 * Send analytics data to custom dashboard endpoint
 */
const sendToAnalyticsDashboard = async (event: AnalyticsEvent): Promise<void> => {
  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        timestamp: Date.now(),
        sessionId: getSessionId(),
        userId: getUserId(),
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    });
  } catch (error) {
    console.warn('Failed to send analytics to dashboard:', error);
  }
};

/**
 * Get or create session ID
 */
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Get or create user ID
 */
const getUserId = (): string => {
  let userId = localStorage.getItem('analytics_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_user_id', userId);
  }
  return userId;
};

/**
 * Track CTA interactions with enhanced context
 */
export const trackCTAInteraction = (
  type: 'primary' | 'secondary',
  data: CTAAnalyticsData,
  additionalData?: Record<string, any>
): void => {
  const eventAction = type === 'primary' ? 'cta_primary_click' : 'cta_secondary_click';
  const eventCategory = type === 'primary' ? 'conversion' : 'engagement';

  trackEvent({
    action: eventAction,
    category: eventCategory,
    label: data.optionType || 'contact_form',
    customParameters: {
      source: data.source,
      section: data.section,
      campaign: data.campaign || 'organic',
      cta_type: type,
      ...additionalData,
    },
  });
};

/**
 * Track form submissions with context
 */
export const trackFormSubmission = (
  formType: string,
  data: CTAAnalyticsData,
  success: boolean = true
): void => {
  trackEvent({
    action: success ? 'form_submit_success' : 'form_submit_error',
    category: 'engagement',
    label: formType,
    customParameters: {
      source: data.source,
      section: data.section,
      campaign: data.campaign || 'organic',
      form_type: formType,
    },
  });
};

/**
 * Enhanced scroll depth tracking for story engagement measurement
 */
export const trackScrollDepth = (depth: number, section?: string, additionalData?: Record<string, any>): void => {
  const scrollEvent: ScrollDepthEvent = {
    action: 'scroll_depth',
    category: 'engagement',
    label: section || 'page',
    value: depth,
    customParameters: {
      scroll_depth: depth,
      section: section,
      timestamp: Date.now(),
      ...additionalData,
    },
  };

  trackEvent(scrollEvent);

  // Track milestone achievements
  const milestones = [25, 50, 75, 90, 100];
  const milestone = milestones.find(m => depth >= m);
  
  if (milestone && (!section || !hasReachedMilestone(section, milestone))) {
    trackEvent({
      action: 'scroll_milestone',
      category: 'engagement',
      label: `${section || 'page'}_${milestone}%`,
      value: milestone,
      customParameters: {
        milestone_depth: milestone,
        section: section,
        time_to_milestone: Date.now() - getPageStartTime(),
      },
    });

    if (section) {
      markMilestoneReached(section, milestone);
    }
  }
};

/**
 * Track story section engagement with detailed metrics
 */
export const trackStoryEngagement = (
  sectionName: string,
  engagementType: 'view' | 'interaction' | 'completion',
  timeSpent?: number,
  scrollDepth?: number
): void => {
  trackEvent({
    action: 'story_engagement',
    category: 'brand_story',
    label: `${sectionName}_${engagementType}`,
    value: timeSpent || 0,
    customParameters: {
      section: sectionName,
      engagement_type: engagementType,
      time_spent: timeSpent,
      scroll_depth: scrollDepth,
      story_progress: calculateStoryProgress(sectionName),
    },
  });
};

/**
 * Track conversion events with enhanced context
 */
export const trackConversion = (event: ConversionEvent): void => {
  trackEvent({
    action: 'conversion',
    category: 'conversion',
    label: event.conversionType,
    value: event.value || 1,
    customParameters: {
      conversion_type: event.conversionType,
      source_section: event.sourceSection,
      cta_variant: event.ctaVariant,
      ab_test_id: event.abTestId,
      user_journey_stage: event.userJourneyStage,
      time_to_conversion: Date.now() - getPageStartTime(),
      ...event.additionalData,
    },
  });

  // Track conversion funnel step
  trackFunnelStep(event.conversionType, event.sourceSection);
};

// Helper functions for milestone tracking
const milestoneStorage = new Map<string, Set<number>>();

const hasReachedMilestone = (section: string, milestone: number): boolean => {
  const sectionMilestones = milestoneStorage.get(section);
  return sectionMilestones ? sectionMilestones.has(milestone) : false;
};

const markMilestoneReached = (section: string, milestone: number): void => {
  if (!milestoneStorage.has(section)) {
    milestoneStorage.set(section, new Set());
  }
  milestoneStorage.get(section)!.add(milestone);
};

const getPageStartTime = (): number => {
  const startTime = sessionStorage.getItem('page_start_time');
  if (!startTime) {
    const now = Date.now();
    sessionStorage.setItem('page_start_time', now.toString());
    return now;
  }
  return parseInt(startTime, 10);
};

const calculateStoryProgress = (currentSection: string): number => {
  const storyOrder = ['hero', 'problem', 'guide', 'plan', 'success', 'stakes', 'cta'];
  const currentIndex = storyOrder.indexOf(currentSection);
  return currentIndex >= 0 ? Math.round(((currentIndex + 1) / storyOrder.length) * 100) : 0;
};

const trackFunnelStep = (conversionType: string, sourceSection?: string): void => {
  const funnelSteps = JSON.parse(sessionStorage.getItem('conversion_funnel') || '[]');
  funnelSteps.push({
    step: conversionType,
    section: sourceSection,
    timestamp: Date.now(),
  });
  sessionStorage.setItem('conversion_funnel', JSON.stringify(funnelSteps));
};

/**
 * Track page section views
 */
export const trackSectionView = (sectionName: string, source?: string): void => {
  trackEvent({
    action: 'section_view',
    category: 'engagement',
    label: sectionName,
    customParameters: {
      section: sectionName,
      source: source || 'organic',
    },
  });
};
/**

 * A/B Testing Framework
 */
class ABTestManager {
  private activeTests = new Map<string, ABTestVariant>();
  private testResults = new Map<string, { variant: string; conversions: number; views: number }>();

  /**
   * Initialize A/B test and return variant for user
   */
  getVariant(testId: string, variants: string[], weights?: number[]): string {
    // Check if user already has a variant assigned
    const existingVariant = this.getUserVariant(testId);
    if (existingVariant && variants.includes(existingVariant)) {
      return existingVariant;
    }

    // Assign new variant based on weights or equal distribution
    const variant = this.assignVariant(variants, weights);
    this.setUserVariant(testId, variant);
    
    // Track test participation
    this.trackTestParticipation(testId, variant);
    
    return variant;
  }

  /**
   * Track A/B test conversion
   */
  trackTestConversion(testId: string, conversionType: string, value?: number): void {
    const variant = this.getUserVariant(testId);
    if (!variant) return;

    trackEvent({
      action: 'ab_test_conversion',
      category: 'ab_testing',
      label: `${testId}_${variant}`,
      value: value || 1,
      customParameters: {
        test_id: testId,
        variant: variant,
        conversion_type: conversionType,
      },
    });

    // Update local results
    const key = `${testId}_${variant}`;
    const current = this.testResults.get(key) || { variant, conversions: 0, views: 0 };
    current.conversions += 1;
    this.testResults.set(key, current);
  }

  /**
   * Track A/B test view/impression
   */
  trackTestView(testId: string): void {
    const variant = this.getUserVariant(testId);
    if (!variant) return;

    trackEvent({
      action: 'ab_test_view',
      category: 'ab_testing',
      label: `${testId}_${variant}`,
      customParameters: {
        test_id: testId,
        variant: variant,
      },
    });

    // Update local results
    const key = `${testId}_${variant}`;
    const current = this.testResults.get(key) || { variant, conversions: 0, views: 0 };
    current.views += 1;
    this.testResults.set(key, current);
  }

  /**
   * Get test results for analytics dashboard
   */
  getTestResults(testId: string): Array<{ variant: string; conversions: number; views: number; conversionRate: number }> {
    const results: Array<{ variant: string; conversions: number; views: number; conversionRate: number }> = [];
    
    this.testResults.forEach((data, key) => {
      if (key.startsWith(testId)) {
        results.push({
          ...data,
          conversionRate: data.views > 0 ? (data.conversions / data.views) * 100 : 0,
        });
      }
    });
    
    return results;
  }

  private getUserVariant(testId: string): string | null {
    return localStorage.getItem(`ab_test_${testId}`);
  }

  private setUserVariant(testId: string, variant: string): void {
    localStorage.setItem(`ab_test_${testId}`, variant);
  }

  private assignVariant(variants: string[], weights?: number[]): string {
    if (!weights || weights.length !== variants.length) {
      // Equal distribution
      const randomIndex = Math.floor(Math.random() * variants.length);
      return variants[randomIndex];
    }

    // Weighted distribution
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < variants.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return variants[i];
      }
    }
    
    return variants[variants.length - 1];
  }

  private trackTestParticipation(testId: string, variant: string): void {
    trackEvent({
      action: 'ab_test_participation',
      category: 'ab_testing',
      label: `${testId}_${variant}`,
      customParameters: {
        test_id: testId,
        variant: variant,
      },
    });
  }
}

// Singleton A/B test manager
export const abTestManager = new ABTestManager();

/**
 * Utility functions for A/B testing
 */
export const getABTestVariant = (testId: string, variants: string[], weights?: number[]): string => {
  return abTestManager.getVariant(testId, variants, weights);
};

export const trackABTestConversion = (testId: string, conversionType: string, value?: number): void => {
  abTestManager.trackTestConversion(testId, conversionType, value);
};

export const trackABTestView = (testId: string): void => {
  abTestManager.trackTestView(testId);
};

/**
 * Brand Story specific A/B tests
 */
export const getBrandStoryHeadlineVariant = (): string => {
  return getABTestVariant('brand_story_headline', [
    'luxury_brands_deserve',
    'transform_your_brand',
    'extraordinary_stories_await',
  ]);
};

export const getBrandStoryCTAVariant = (): string => {
  return getABTestVariant('brand_story_cta', [
    'start_your_transformation',
    'discover_your_story',
    'elevate_your_brand',
  ]);
};

/**
 * Analytics Dashboard Integration
 */
export class AnalyticsDashboard {
  private metricsBuffer: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startBufferFlush();
  }

  /**
   * Add metric to buffer for batch sending
   */
  addMetric(event: AnalyticsEvent): void {
    this.metricsBuffer.push({
      ...event,
      timestamp: Date.now(),
    });

    // Flush immediately for conversion events
    if (event.category === 'conversion') {
      this.flushMetrics();
    }
  }

  /**
   * Get real-time analytics data
   */
  async getRealTimeData(): Promise<{
    activeUsers: number;
    pageViews: number;
    conversions: number;
    topSections: Array<{ section: string; views: number; avgTimeSpent: number }>;
    conversionFunnel: Array<{ step: string; users: number; conversionRate: number }>;
  }> {
    try {
      const response = await fetch('/api/analytics/realtime');
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch real-time analytics:', error);
      return {
        activeUsers: 0,
        pageViews: 0,
        conversions: 0,
        topSections: [],
        conversionFunnel: [],
      };
    }
  }

  /**
   * Get story performance metrics
   */
  async getStoryPerformance(dateRange?: { start: Date; end: Date }): Promise<{
    totalViews: number;
    avgScrollDepth: number;
    avgTimeOnPage: number;
    conversionRate: number;
    sectionMetrics: Array<{
      section: string;
      views: number;
      avgTimeSpent: number;
      scrollDepth: number;
      exitRate: number;
    }>;
    abTestResults: Array<{
      testId: string;
      variants: Array<{ variant: string; conversions: number; views: number; conversionRate: number }>;
    }>;
  }> {
    try {
      const params = new URLSearchParams();
      if (dateRange) {
        params.append('start', dateRange.start.toISOString());
        params.append('end', dateRange.end.toISOString());
      }

      const response = await fetch(`/api/analytics/story-performance?${params}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch story performance:', error);
      return {
        totalViews: 0,
        avgScrollDepth: 0,
        avgTimeOnPage: 0,
        conversionRate: 0,
        sectionMetrics: [],
        abTestResults: [],
      };
    }
  }

  private startBufferFlush(): void {
    this.flushInterval = setInterval(() => {
      this.flushMetrics();
    }, 10000); // Flush every 10 seconds
  }

  private async flushMetrics(): Promise<void> {
    if (this.metricsBuffer.length === 0) return;

    const metrics = [...this.metricsBuffer];
    this.metricsBuffer = [];

    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metrics }),
      });
    } catch (error) {
      console.error('Failed to flush analytics metrics:', error);
      // Re-add metrics to buffer for retry
      this.metricsBuffer.unshift(...metrics);
    }
  }

  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flushMetrics(); // Final flush
  }
}

// Singleton analytics dashboard
export const analyticsDashboard = new AnalyticsDashboard();

/**
 * React hooks for analytics
 */
import { useState, useEffect } from 'react';

export const useAnalyticsDashboard = () => {
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [storyPerformance, setStoryPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [realTime, performance] = await Promise.all([
          analyticsDashboard.getRealTimeData(),
          analyticsDashboard.getStoryPerformance(),
        ]);
        setRealTimeData(realTime);
        setStoryPerformance(performance);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { realTimeData, storyPerformance, loading };
};

/**
 * Hook for scroll depth tracking
 */
export const useScrollDepthTracking = (sectionName: string) => {
  useEffect(() => {
    let maxScrollDepth = 0;
    let lastReportedDepth = 0;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((scrollTop / documentHeight) * 100);
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Report every 10% increment
        if (scrollDepth >= lastReportedDepth + 10) {
          trackScrollDepth(scrollDepth, sectionName);
          lastReportedDepth = Math.floor(scrollDepth / 10) * 10;
        }
      }
    };

    const throttledScroll = throttle(handleScroll, 250);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [sectionName]);
};

// Throttle utility
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