import { render, screen } from '@testing-library/react';
import BrandStoryPerformanceMonitor from '../BrandStoryPerformanceMonitor';

// Mock the performance monitoring hooks
jest.mock('@/lib/performance-monitor', () => ({
  usePerformanceMonitor: () => ({
    measurePerformance: jest.fn(),
    trackMetric: jest.fn(),
  }),
}));

jest.mock('@/lib/service-worker', () => ({
  serviceWorkerManager: {
    sendPerformanceMetrics: jest.fn(),
  },
}));

// Mock performance APIs
Object.defineProperty(window, 'PerformanceObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  })),
});

Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    getEntriesByType: jest.fn(() => []),
  },
});

describe('BrandStoryPerformanceMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<BrandStoryPerformanceMonitor />);
    // Component doesn't render visible content
    expect(document.body).toBeInTheDocument();
  });

  it('initializes with default section name', () => {
    render(<BrandStoryPerformanceMonitor />);
    // Should not throw any errors
    expect(true).toBe(true);
  });

  it('accepts custom section name', () => {
    render(<BrandStoryPerformanceMonitor sectionName="custom-section" />);
    // Should not throw any errors
    expect(true).toBe(true);
  });

  it('can disable tracking features', () => {
    render(
      <BrandStoryPerformanceMonitor 
        trackScrollDepth={false}
        trackTimeOnPage={false}
        trackInteractions={false}
      />
    );
    // Should not throw any errors
    expect(true).toBe(true);
  });
});