import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BrandStoryHeroSection from '../BrandStoryHeroSection';

// Mock the hooks and utilities
jest.mock('@/hooks/useStoryAnalytics', () => ({
  useStoryAnalytics: () => ({
    trackSectionConversion: jest.fn(),
  }),
}));

jest.mock('@/lib/conversion-tracking', () => ({
  useConversionTracking: () => ({
    trackCTAClick: jest.fn(),
  }),
}));

jest.mock('@/lib/responsive', () => ({
  useDeviceType: () => 'desktop',
  useResponsiveValue: (value: any) => {
    if (typeof value === 'object' && value.lg) {
      return value.lg;
    }
    return value;
  },
}));

jest.mock('@/lib/typography', () => ({
  useTypographyPreset: (preset: string) => ({
    className: `typography-${preset}`,
  }),
}));

jest.mock('@/components/animations', () => ({
  ParallaxHero: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="parallax-hero">{children}</div>
  ),
  StaggerReveal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="stagger-reveal">{children}</div>
  ),
}));

describe('BrandStoryHeroSection', () => {
  const defaultProps = {
    headline: 'Test Headline',
    subheadline: 'Test Subheadline',
    ctaText: 'Get Started',
    ctaLink: '#next-section',
  };

  it('renders headline and subheadline correctly', () => {
    render(<BrandStoryHeroSection {...defaultProps} />);
    
    expect(screen.getByText('Test Headline')).toBeInTheDocument();
    expect(screen.getByText('Test Subheadline')).toBeInTheDocument();
  });

  it('renders CTA button when ctaText is provided', () => {
    render(<BrandStoryHeroSection {...defaultProps} />);
    
    const ctaButton = screen.getByRole('button', { name: /get started/i });
    expect(ctaButton).toBeInTheDocument();
  });

  it('calls onCtaClick when CTA button is clicked', () => {
    const mockOnCtaClick = jest.fn();
    render(
      <BrandStoryHeroSection 
        {...defaultProps} 
        onCtaClick={mockOnCtaClick} 
      />
    );
    
    const ctaButton = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(ctaButton);
    
    expect(mockOnCtaClick).toHaveBeenCalledTimes(1);
  });

  it('renders with parallax when background image is provided', () => {
    const propsWithImage = {
      ...defaultProps,
      backgroundImage: {
        url: '/test-image.jpg',
        alternativeText: 'Test background',
      },
      enableParallax: true,
    };

    render(<BrandStoryHeroSection {...propsWithImage} />);
    
    expect(screen.getByTestId('parallax-hero')).toBeInTheDocument();
  });

  it('renders without parallax when enableParallax is false', () => {
    const propsWithImage = {
      ...defaultProps,
      backgroundImage: {
        url: '/test-image.jpg',
        alternativeText: 'Test background',
      },
      enableParallax: false,
    };

    render(<BrandStoryHeroSection {...propsWithImage} />);
    
    expect(screen.queryByTestId('parallax-hero')).not.toBeInTheDocument();
  });

  it('handles keyboard navigation on CTA button', () => {
    const mockOnCtaClick = jest.fn();
    render(
      <BrandStoryHeroSection 
        {...defaultProps} 
        onCtaClick={mockOnCtaClick} 
      />
    );
    
    const ctaButton = screen.getByRole('button', { name: /get started/i });
    
    // Test Enter key
    fireEvent.keyDown(ctaButton, { key: 'Enter' });
    expect(mockOnCtaClick).toHaveBeenCalledTimes(1);
    
    // Test Space key
    fireEvent.keyDown(ctaButton, { key: ' ' });
    expect(mockOnCtaClick).toHaveBeenCalledTimes(2);
  });

  it('applies correct accessibility attributes', () => {
    render(<BrandStoryHeroSection {...defaultProps} />);
    
    const section = screen.getByRole('banner');
    expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
    expect(section).toHaveAttribute('data-brand-story-element', 'hero');
    
    const ctaButton = screen.getByRole('button', { name: /get started/i });
    expect(ctaButton).toHaveAttribute('aria-describedby', 'hero-cta-description');
  });

  it('renders without CTA when ctaText is not provided', () => {
    const propsWithoutCta = {
      headline: 'Test Headline',
      subheadline: 'Test Subheadline',
    };

    render(<BrandStoryHeroSection {...propsWithoutCta} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});