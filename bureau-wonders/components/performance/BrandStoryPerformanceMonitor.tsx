'use client';

import React, { useEffect, useRef } from 'react';
import { usePerformanceMetrics } from '@/lib/performance-monitor';
import { getServiceWorkerManager } from '@/lib/service-worker';

interface BrandStoryPerformanceMonitorProps {
  sectionName?: string;
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
  trackInteractions?: boolean;
}

export const BrandStoryPerformanceMonitor: React.FC<BrandStoryPerformanceMonitorProps> = ({
  sectionName = 'brand-story',
  trackScrollDepth = true,
  trackTimeOnPage = true,
  trackInteractions = true,
}) => {
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollDepthRef = useRef<number>(0);
  const interactionsRef = useRef<number>(0);
  const performanceMetrics = usePerformanceMetrics();

  // Simple tracking function for development
  const trackMetric = (name: string, value: number, metadata?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric: ${name}`, { value, metadata });
    }
    // In production, this could send to analytics service
  };

  // Track Core Web Vitals and custom metrics
  useEffect(() => {
    const trackCoreWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            trackMetric('lcp', lastEntry.startTime, {
              section: sectionName,
              element: (lastEntry as any).element?.tagName || 'unknown',
            });
            
            // Send to service worker for analytics
            getServiceWorkerManager().sendPerformanceMetrics({
              type: 'lcp',
              value: lastEntry.startTime,
              section: sectionName,
              timestamp: Date.now(),
            });
          });
          
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
          console.warn('LCP observer failed:', error);
        }

        // First Input Delay (FID)
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              trackMetric('fid', (entry as any).processingStart - entry.startTime, {
                section: sectionName,
                eventType: entry.name,
              });
              
              getServiceWorkerManager().sendPerformanceMetrics({
                type: 'fid',
                value: (entry as any).processingStart - entry.startTime,
                section: sectionName,
                timestamp: Date.now(),
              });
            });
          });
          
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (error) {
          console.warn('FID observer failed:', error);
        }

        // Cumulative Layout Shift (CLS)
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            });
            
            trackMetric('cls', clsValue, {
              section: sectionName,
            });
            
            getServiceWorkerManager().sendPerformanceMetrics({
              type: 'cls',
              value: clsValue,
              section: sectionName,
              timestamp: Date.now(),
            });
          });
          
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('CLS observer failed:', error);
        }
      }
    };

    // Track resource loading performance
    const trackResourcePerformance = () => {
      if ('PerformanceObserver' in window) {
        try {
          const resourceObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name.includes('brand-story') || 
                  entry.name.includes('case-studies') ||
                  entry.name.includes('testimonials')) {
                
                const resourceType = (entry as any).initiatorType || 'unknown';
                const loadTime = (entry as any).responseEnd - entry.startTime;
                
                trackMetric(`resource_${resourceType}`, loadTime, {
                  section: sectionName,
                  resource: entry.name,
                  size: (entry as any).transferSize || 0,
                });
                
                getServiceWorkerManager().sendPerformanceMetrics({
                  type: 'resource',
                  resourceType,
                  value: loadTime,
                  section: sectionName,
                  resource: entry.name,
                  size: (entry as any).transferSize || 0,
                  timestamp: Date.now(),
                });
              }
            });
          });
          
          resourceObserver.observe({ entryTypes: ['resource'] });
        } catch (error) {
          console.warn('Resource observer failed:', error);
        }
      }
    };

    trackCoreWebVitals();
    trackResourcePerformance();

    // Track initial page load performance
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const metrics = {
        dns: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
        tcp: navigationEntry.connectEnd - navigationEntry.connectStart,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
        domLoad: navigationEntry.domContentLoadedEventEnd - (navigationEntry as any).navigationStart,
        windowLoad: navigationEntry.loadEventEnd - (navigationEntry as any).navigationStart,
      };

      Object.entries(metrics).forEach(([metric, value]) => {
        trackMetric(`navigation_${metric}`, value, { section: sectionName });
      });

      getServiceWorkerManager().sendPerformanceMetrics({
        type: 'navigation',
        metrics,
        section: sectionName,
        timestamp: Date.now(),
      });
    }
  }, [sectionName, trackMetric]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((scrollTop / documentHeight) * 100);
      
      if (scrollDepth > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = scrollDepth;
        
        // Track milestone scroll depths
        const milestones = [25, 50, 75, 90, 100];
        const milestone = milestones.find(m => scrollDepth >= m && maxScrollDepthRef.current < m);
        
        if (milestone) {
          trackMetric('scroll_depth', milestone, {
            section: sectionName,
            timestamp: Date.now() - startTimeRef.current,
          });
          
          getServiceWorkerManager().sendPerformanceMetrics({
            type: 'scroll_depth',
            value: milestone,
            section: sectionName,
            timeOnPage: Date.now() - startTimeRef.current,
            timestamp: Date.now(),
          });
        }
      }
    };

    const throttledScroll = throttle(handleScroll, 250);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [trackScrollDepth, sectionName, trackMetric]);

  // Track user interactions
  useEffect(() => {
    if (!trackInteractions) return;

    const handleInteraction = (event: Event) => {
      interactionsRef.current++;
      
      const target = event.target as HTMLElement;
      const interactionType = event.type;
      const elementType = target.tagName.toLowerCase();
      const elementClass = target.className;
      
      trackMetric('user_interaction', 1, {
        section: sectionName,
        type: interactionType,
        element: elementType,
        className: elementClass,
        totalInteractions: interactionsRef.current,
      });
      
      // Track specific brand story interactions
      if (target.closest('[data-brand-story-element]')) {
        const elementName = target.closest('[data-brand-story-element]')?.getAttribute('data-brand-story-element');
        
        getServiceWorkerManager().sendPerformanceMetrics({
          type: 'brand_story_interaction',
          element: elementName,
          interactionType,
          section: sectionName,
          timestamp: Date.now(),
          timeOnPage: Date.now() - startTimeRef.current,
        });
      }
    };

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [trackInteractions, sectionName, trackMetric]);

  // Track time on page
  useEffect(() => {
    if (!trackTimeOnPage) return;

    const trackTimeInterval = setInterval(() => {
      const timeOnPage = Date.now() - startTimeRef.current;
      
      // Track time milestones (30s, 1m, 2m, 5m)
      const milestones = [30000, 60000, 120000, 300000];
      const milestone = milestones.find(m => 
        timeOnPage >= m && 
        timeOnPage < m + 5000 // 5 second window to catch the milestone
      );
      
      if (milestone) {
        trackMetric('time_on_page', milestone / 1000, {
          section: sectionName,
          scrollDepth: maxScrollDepthRef.current,
          interactions: interactionsRef.current,
        });
        
        getServiceWorkerManager().sendPerformanceMetrics({
          type: 'time_milestone',
          value: milestone / 1000,
          section: sectionName,
          scrollDepth: maxScrollDepthRef.current,
          interactions: interactionsRef.current,
          timestamp: Date.now(),
        });
      }
    }, 5000);

    return () => clearInterval(trackTimeInterval);
  }, [trackTimeOnPage, sectionName, trackMetric]);

  // Track page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const timeOnPage = Date.now() - startTimeRef.current;
      
      if (document.hidden) {
        // Page became hidden
        trackMetric('page_hidden', timeOnPage / 1000, {
          section: sectionName,
          scrollDepth: maxScrollDepthRef.current,
          interactions: interactionsRef.current,
        });
      } else {
        // Page became visible
        startTimeRef.current = Date.now(); // Reset timer
        trackMetric('page_visible', 1, {
          section: sectionName,
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [sectionName, trackMetric]);

  // Track page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - startTimeRef.current;
      
      // Send final metrics
      const finalMetrics = {
        totalTimeOnPage: timeOnPage / 1000,
        maxScrollDepth: maxScrollDepthRef.current,
        totalInteractions: interactionsRef.current,
        section: sectionName,
        timestamp: Date.now(),
      };
      
      // Use sendBeacon for reliable delivery
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon('/api/analytics/performance', JSON.stringify(finalMetrics));
      }
      
      getServiceWorkerManager().sendPerformanceMetrics({
        type: 'page_unload',
        ...finalMetrics,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sectionName]);

  return null; // This component doesn't render anything
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

// Section-specific performance monitors
export const HeroSectionMonitor: React.FC = () => (
  <BrandStoryPerformanceMonitor 
    sectionName="hero" 
    trackScrollDepth={false}
    trackTimeOnPage={true}
    trackInteractions={true}
  />
);

export const SuccessStoriesMonitor: React.FC = () => (
  <BrandStoryPerformanceMonitor 
    sectionName="success-stories" 
    trackScrollDepth={true}
    trackTimeOnPage={true}
    trackInteractions={true}
  />
);

export const StakesSectionMonitor: React.FC = () => (
  <BrandStoryPerformanceMonitor 
    sectionName="stakes" 
    trackScrollDepth={true}
    trackTimeOnPage={true}
    trackInteractions={true}
  />
);

export const CTASectionMonitor: React.FC = () => (
  <BrandStoryPerformanceMonitor 
    sectionName="cta" 
    trackScrollDepth={true}
    trackTimeOnPage={true}
    trackInteractions={true}
  />
);

export default BrandStoryPerformanceMonitor;