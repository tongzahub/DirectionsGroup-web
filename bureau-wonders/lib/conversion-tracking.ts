/**
 * Conversion Tracking System
 * Handles analytics events and conversion tracking for brand story elements
 */

// Conversion event types
export interface ConversionEvent {
  eventName: string;
  sectionName: string;
  elementType: 'cta' | 'form' | 'link' | 'button';
  elementId?: string;
  ctaText?: string;
  targetUrl?: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// Analytics providers interface
interface AnalyticsProvider {
  track: (event: ConversionEvent) => void;
  identify?: (userId: string, traits?: Record<string, any>) => void;
  page?: (name: string, properties?: Record<string, any>) => void;
}

// Built-in analytics providers
class GoogleAnalyticsProvider implements AnalyticsProvider {
  track(event: ConversionEvent) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.eventName, {
        event_category: 'Brand Story',
        event_label: event.sectionName,
        custom_parameter_element_type: event.elementType,
        custom_parameter_cta_text: event.ctaText,
        custom_parameter_target_url: event.targetUrl,
        custom_parameter_session_id: event.sessionId,
      });
    }
  }

  page(name: string, properties?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
        page_title: name,
        page_location: window.location.href,
        ...properties,
      });
    }
  }
}

class FacebookPixelProvider implements AnalyticsProvider {
  track(event: ConversionEvent) {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: event.sectionName,
        content_category: 'Brand Story',
        value: 1,
        currency: 'USD',
      });
    }
  }
}

class ConsoleProvider implements AnalyticsProvider {
  track(event: ConversionEvent) {
    console.log('Conversion Event:', event);
  }

  identify(userId: string, traits?: Record<string, any>) {
    console.log('User Identified:', { userId, traits });
  }

  page(name: string, properties?: Record<string, any>) {
    console.log('Page View:', { name, properties });
  }
}

// Conversion tracking manager
class ConversionTracker {
  private providers: AnalyticsProvider[] = [];
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeProviders();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeProviders() {
    // Add console provider for development
    if (process.env.NODE_ENV === 'development') {
      this.providers.push(new ConsoleProvider());
    }

    // Add Google Analytics if configured
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      this.providers.push(new GoogleAnalyticsProvider());
    }

    // Add Facebook Pixel if configured
    if (process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) {
      this.providers.push(new FacebookPixelProvider());
    }
  }

  setUserId(userId: string) {
    this.userId = userId;
    this.providers.forEach(provider => {
      if (provider.identify) {
        provider.identify(userId);
      }
    });
  }

  trackConversion(params: {
    eventName: string;
    sectionName: string;
    elementType: 'cta' | 'form' | 'link' | 'button';
    elementId?: string;
    ctaText?: string;
    targetUrl?: string;
    metadata?: Record<string, any>;
  }) {
    const event: ConversionEvent = {
      ...params,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.providers.forEach(provider => {
      try {
        provider.track(event);
      } catch (error) {
        console.warn('Analytics provider error:', error);
      }
    });

    // Store event locally for debugging and analytics
    this.storeEventLocally(event);
  }

  trackPageView(pageName: string, properties?: Record<string, any>) {
    this.providers.forEach(provider => {
      if (provider.page) {
        try {
          provider.page(pageName, properties);
        } catch (error) {
          console.warn('Page tracking error:', error);
        }
      }
    });
  }

  private storeEventLocally(event: ConversionEvent) {
    try {
      const events = this.getStoredEvents();
      events.push(event);
      
      // Keep only last 100 events
      const recentEvents = events.slice(-100);
      
      localStorage.setItem('brand_story_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to store event locally:', error);
    }
  }

  getStoredEvents(): ConversionEvent[] {
    try {
      const stored = localStorage.getItem('brand_story_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to retrieve stored events:', error);
      return [];
    }
  }

  // Get conversion metrics for analytics dashboard
  getConversionMetrics(timeframe: 'hour' | 'day' | 'week' = 'day') {
    const events = this.getStoredEvents();
    const now = Date.now();
    const timeframeMs = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
    }[timeframe];

    const recentEvents = events.filter(event => 
      now - event.timestamp < timeframeMs
    );

    const metrics = {
      totalConversions: recentEvents.length,
      conversionsBySection: {} as Record<string, number>,
      conversionsByType: {} as Record<string, number>,
      topCtaTexts: {} as Record<string, number>,
    };

    recentEvents.forEach(event => {
      // Count by section
      metrics.conversionsBySection[event.sectionName] = 
        (metrics.conversionsBySection[event.sectionName] || 0) + 1;

      // Count by element type
      metrics.conversionsByType[event.elementType] = 
        (metrics.conversionsByType[event.elementType] || 0) + 1;

      // Count by CTA text
      if (event.ctaText) {
        metrics.topCtaTexts[event.ctaText] = 
          (metrics.topCtaTexts[event.ctaText] || 0) + 1;
      }
    });

    return metrics;
  }
}

// Global instance
let conversionTracker: ConversionTracker | null = null;

export const getConversionTracker = (): ConversionTracker => {
  if (!conversionTracker) {
    conversionTracker = new ConversionTracker();
  }
  return conversionTracker;
};

// Convenience functions
export const trackConversion = (params: {
  eventName: string;
  sectionName: string;
  elementType: 'cta' | 'form' | 'link' | 'button';
  elementId?: string;
  ctaText?: string;
  targetUrl?: string;
  metadata?: Record<string, any>;
}) => {
  const tracker = getConversionTracker();
  tracker.trackConversion(params);
};

export const trackPageView = (pageName: string, properties?: Record<string, any>) => {
  const tracker = getConversionTracker();
  tracker.trackPageView(pageName, properties);
};

export const setUserId = (userId: string) => {
  const tracker = getConversionTracker();
  tracker.setUserId(userId);
};

export const getConversionMetrics = (timeframe: 'hour' | 'day' | 'week' = 'day') => {
  const tracker = getConversionTracker();
  return tracker.getConversionMetrics(timeframe);
};

// React hook for conversion tracking
export const useConversionTracking = (sectionName: string) => {
  const tracker = getConversionTracker();

  const trackCTAClick = (ctaText: string, targetUrl?: string, metadata?: Record<string, any>) => {
    tracker.trackConversion({
      eventName: 'cta_click',
      sectionName,
      elementType: 'cta',
      ctaText,
      targetUrl,
      metadata,
    });
  };

  const trackFormSubmission = (formId: string, metadata?: Record<string, any>) => {
    tracker.trackConversion({
      eventName: 'form_submission',
      sectionName,
      elementType: 'form',
      elementId: formId,
      metadata,
    });
  };

  const trackLinkClick = (linkText: string, targetUrl: string, metadata?: Record<string, any>) => {
    tracker.trackConversion({
      eventName: 'link_click',
      sectionName,
      elementType: 'link',
      ctaText: linkText,
      targetUrl,
      metadata,
    });
  };

  return {
    trackCTAClick,
    trackFormSubmission,
    trackLinkClick,
  };
};

// Type declarations for global analytics
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}