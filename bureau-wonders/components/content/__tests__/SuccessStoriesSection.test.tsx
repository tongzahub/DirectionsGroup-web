import React from 'react';
import { render, screen } from '@testing-library/react';
import SuccessStoriesSection from '../SuccessStoriesSection';
import { CaseStudy, BrandStoryTestimonial, BrandStoryMetric } from '@/types';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  ChevronLeftIcon: () => <div data-testid="chevron-left" />,
  ChevronRightIcon: () => <div data-testid="chevron-right" />,
}));

// Mock animation components
jest.mock('../../animations', () => ({
  ScrollReveal: ({ children }: any) => <div data-testid="scroll-reveal">{children}</div>,
  StaggerContainer: ({ children }: any) => <div data-testid="stagger-container">{children}</div>,
  StaggerItem: ({ children }: any) => <div data-testid="stagger-item">{children}</div>,
}));

// Mock StrapiImage component
jest.mock('../../ui/StrapiImage', () => {
  return function MockStrapiImage({ alt, ...props }: any) {
    return <img alt={alt} {...props} data-testid="strapi-image" />;
  };
});

const mockCaseStudies: CaseStudy[] = [
  {
    id: 1,
    title: 'Test Case Study',
    slug: 'test-case-study',
    client: 'Test Client',
    challenge: 'Test challenge description',
    strategy: 'Test strategy description',
    execution: 'Test execution description',
    results: 'Test results description',
    gallery: [],
    featuredImage: {
      id: 1,
      name: 'test.jpg',
      url: '/test.jpg',
      mime: 'image/jpeg',
      size: 100000,
      width: 600,
      height: 400,
      alternativeText: 'Test image'
    },
    publishedAt: '2024-01-01T00:00:00.000Z',
    seoTitle: 'Test SEO Title',
    metaDescription: 'Test meta description',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

const mockTestimonials: BrandStoryTestimonial[] = [
  {
    clientName: 'John Doe',
    clientTitle: 'CEO',
    companyName: 'Test Company',
    quote: 'Great work by The Bureau!',
    avatar: {
      id: 2,
      name: 'avatar.jpg',
      url: '/avatar.jpg',
      mime: 'image/jpeg',
      size: 5000,
      width: 64,
      height: 64,
      alternativeText: 'John Doe avatar'
    },
    companyLogo: {
      id: 3,
      name: 'logo.png',
      url: '/logo.png',
      mime: 'image/png',
      size: 8000,
      width: 120,
      height: 60,
      alternativeText: 'Test Company logo'
    }
  }
];

const mockMetrics: BrandStoryMetric[] = [
  {
    label: 'Growth',
    value: '50%',
    improvement: '+20% vs target',
    timeframe: '6 months'
  }
];

describe('SuccessStoriesSection', () => {
  it('renders the section title', () => {
    render(
      <SuccessStoriesSection
        title="Success Stories"
        caseStudies={mockCaseStudies}
      />
    );

    expect(screen.getByText('Success Stories')).toBeInTheDocument();
  });

  it('renders case study information', () => {
    render(
      <SuccessStoriesSection
        title="Success Stories"
        caseStudies={mockCaseStudies}
        testimonials={mockTestimonials}
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText('Test Client')).toBeInTheDocument();
    expect(screen.getByText('Test Case Study')).toBeInTheDocument();
  });

  it('renders testimonials when provided', () => {
    render(
      <SuccessStoriesSection
        title="Success Stories"
        caseStudies={mockCaseStudies}
        testimonials={mockTestimonials}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Great work by The Bureau!')).toBeInTheDocument();
  });

  it('renders metrics when provided', () => {
    render(
      <SuccessStoriesSection
        title="Success Stories"
        caseStudies={mockCaseStudies}
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
  });

  it('renders view mode toggle buttons', () => {
    render(
      <SuccessStoriesSection
        title="Success Stories"
        caseStudies={mockCaseStudies}
      />
    );

    expect(screen.getByText('Carousel View')).toBeInTheDocument();
    expect(screen.getByText('Grid View')).toBeInTheDocument();
  });

  it('renders navigation buttons for carousel when multiple case studies', () => {
    const multipleCaseStudies = [
      ...mockCaseStudies,
      {
        ...mockCaseStudies[0],
        id: 2,
        title: 'Second Case Study',
        slug: 'second-case-study'
      }
    ];

    render(
      <SuccessStoriesSection
        title="Success Stories"
        caseStudies={multipleCaseStudies}
      />
    );

    expect(screen.getByLabelText('Previous case study')).toBeInTheDocument();
    expect(screen.getByLabelText('Next case study')).toBeInTheDocument();
  });

  it('renders before/after narrative structure', () => {
    render(
      <SuccessStoriesSection
        title="Success Stories"
        caseStudies={mockCaseStudies}
      />
    );

    expect(screen.getByText('Challenge')).toBeInTheDocument();
    expect(screen.getByText('Transformation')).toBeInTheDocument();
  });

  it('handles empty case studies array', () => {
    render(
      <SuccessStoriesSection
        title="Success Stories"
        caseStudies={[]}
      />
    );

    // Component should not render anything when no case studies
    expect(screen.queryByText('Success Stories')).not.toBeInTheDocument();
  });
});