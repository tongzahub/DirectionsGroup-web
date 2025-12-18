// Analytics types for Google Analytics gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        event_category?: string;
        event_label?: string;
        value?: string | number;
        custom_parameters?: Record<string, any>;
        [key: string]: any;
      }
    ) => void;
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: string | number;
  customParameters?: Record<string, any>;
  timestamp?: number;
}

export interface CTAAnalyticsData {
  source: string;
  section: string;
  campaign?: string;
  ctaType?: 'primary' | 'secondary';
  optionType?: string;
}

export interface ScrollDepthEvent extends AnalyticsEvent {
  action: 'scroll_depth' | 'scroll_milestone';
  category: 'engagement';
}

export interface ConversionEvent {
  conversionType: string;
  sourceSection?: string;
  ctaVariant?: string;
  abTestId?: string;
  userJourneyStage?: string;
  value?: number;
  additionalData?: Record<string, any>;
}

export interface ABTestVariant {
  testId: string;
  variant: string;
  weight?: number;
}

export interface StoryEngagementMetrics {
  sectionName: string;
  timeSpent: number;
  scrollDepth: number;
  interactions: number;
  completionRate: number;
}

export interface AnalyticsMetrics {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number }>;
  topSources: Array<{ source: string; visitors: number }>;
}

export interface ConversionFunnelStep {
  step: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
}

export {};