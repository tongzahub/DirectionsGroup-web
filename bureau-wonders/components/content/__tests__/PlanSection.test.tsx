import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlanSection from '../PlanSection';
import { ProcessStep } from '@/types/brand-story';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}));

// Mock the layout components
jest.mock('@/components/layout/BrandStoryLayout', () => ({
  ContentContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="content-container">{children}</div>
  ),
  ResponsiveGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-grid">{children}</div>
  ),
}));

// Mock the animations
jest.mock('@/components/animations', () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scroll-reveal">{children}</div>
  ),
  StaggerReveal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="stagger-reveal">{children}</div>
  ),
}));

// Mock OptimizedImage
jest.mock('@/components/ui/OptimizedImage', () => {
  return function OptimizedImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} data-testid="optimized-image" />;
  };
});

// Mock utils
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('PlanSection', () => {
  const mockSteps: ProcessStep[] = [
    {
      number: 1,
      title: 'Discovery & Assessment',
      description: '<p>We analyze your current brand position and identify opportunities.</p>',
      details: [
        'Brand audit and competitive analysis',
        'Stakeholder interviews',
        'Strategic positioning framework'
      ],
      icon: '/test-icon-1.png'
    },
    {
      number: 2,
      title: 'Strategy Development',
      description: '<p>We craft your compelling brand narrative and content strategy.</p>',
      details: [
        'StoryBrand framework implementation',
        'Brand voice guidelines',
        'Content pillar development'
      ],
      icon: '/test-icon-2.png'
    },
    {
      number: 3,
      title: 'Implementation',
      description: '<p>We execute your brand story across all channels.</p>',
      details: [
        'Multi-channel campaign execution',
        'Performance monitoring',
        'Continuous optimization'
      ],
      icon: '/test-icon-3.png'
    }
  ];

  const defaultProps = {
    title: 'Our Proven Methodology',
    introduction: '<p>We follow a systematic approach that transforms luxury brands.</p>',
    steps: mockSteps,
    reassurance: '<p>Your success is our priority with complete transparency.</p>',
  };

  it('renders title and introduction correctly', () => {
    render(<PlanSection {...defaultProps} />);
    
    expect(screen.getByText('Our Proven Methodology')).toBeInTheDocument();
    expect(screen.getByText(/We follow a systematic approach/)).toBeInTheDocument();
  });

  it('renders all process steps', () => {
    render(<PlanSection {...defaultProps} />);
    
    expect(screen.getByText('Discovery & Assessment')).toBeInTheDocument();
    expect(screen.getByText('Strategy Development')).toBeInTheDocument();
    expect(screen.getByText('Implementation')).toBeInTheDocument();
  });

  it('renders step numbers correctly', () => {
    render(<PlanSection {...defaultProps} />);
    
    // Check for step numbers in badges
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders step icons when provided', () => {
    render(<PlanSection {...defaultProps} />);
    
    const images = screen.getAllByTestId('optimized-image');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('src', '/test-icon-1.png');
    expect(images[1]).toHaveAttribute('src', '/test-icon-2.png');
    expect(images[2]).toHaveAttribute('src', '/test-icon-3.png');
  });

  it('handles step expansion and collapse', () => {
    render(<PlanSection {...defaultProps} />);
    
    // Find the first step button
    const firstStepButton = screen.getByRole('button', { name: /discovery & assessment/i });
    expect(firstStepButton).toBeInTheDocument();
    
    // Check initial state - details should not be visible
    expect(screen.queryByText('Brand audit and competitive analysis')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(firstStepButton);
    
    // Details should now be visible
    expect(screen.getByText('Brand audit and competitive analysis')).toBeInTheDocument();
    expect(screen.getByText('Stakeholder interviews')).toBeInTheDocument();
    expect(screen.getByText('Strategic positioning framework')).toBeInTheDocument();
  });

  it('shows correct aria-expanded state', () => {
    render(<PlanSection {...defaultProps} />);
    
    const firstStepButton = screen.getByRole('button', { name: /discovery & assessment/i });
    
    // Initially collapsed
    expect(firstStepButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to expand
    fireEvent.click(firstStepButton);
    
    // Should be expanded
    expect(firstStepButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders reassurance statement when provided', () => {
    render(<PlanSection {...defaultProps} />);
    
    expect(screen.getByText('Your Success is Our Priority')).toBeInTheDocument();
    expect(screen.getByText(/Your success is our priority with complete transparency/)).toBeInTheDocument();
  });

  it('renders without reassurance when not provided', () => {
    const propsWithoutReassurance = {
      ...defaultProps,
      reassurance: undefined,
    };

    render(<PlanSection {...propsWithoutReassurance} />);
    
    expect(screen.queryByText('Your Success is Our Priority')).not.toBeInTheDocument();
  });

  it('renders progress indicator with correct number of steps', () => {
    render(<PlanSection {...defaultProps} />);
    
    // Progress indicator should show all step numbers
    const progressNumbers = screen.getAllByText(/^[1-3]$/);
    // We expect 6 instances: 3 in progress indicator + 3 in step badges
    expect(progressNumbers).toHaveLength(6);
  });

  it('applies correct accessibility attributes', () => {
    render(<PlanSection {...defaultProps} />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'plan-section-title');
    
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveAttribute('id', 'plan-section-title');
  });

  it('handles keyboard navigation on step buttons', () => {
    render(<PlanSection {...defaultProps} />);
    
    const firstStepButton = screen.getByRole('button', { name: /discovery & assessment/i });
    
    // Test Enter key
    fireEvent.keyDown(firstStepButton, { key: 'Enter' });
    expect(screen.getByText('Brand audit and competitive analysis')).toBeInTheDocument();
  });

  it('renders call-to-action hint', () => {
    render(<PlanSection {...defaultProps} />);
    
    expect(screen.getByText('Ready to see this methodology in action?')).toBeInTheDocument();
  });

  it('handles empty steps array gracefully', () => {
    const propsWithEmptySteps = {
      ...defaultProps,
      steps: [],
    };

    render(<PlanSection {...propsWithEmptySteps} />);
    
    expect(screen.getByText('Our Proven Methodology')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('toggles step correctly when clicking same step twice', () => {
    render(<PlanSection {...defaultProps} />);
    
    const firstStepButton = screen.getByRole('button', { name: /discovery & assessment/i });
    
    // Click to expand
    fireEvent.click(firstStepButton);
    expect(screen.getByText('Brand audit and competitive analysis')).toBeInTheDocument();
    
    // Click again to collapse
    fireEvent.click(firstStepButton);
    expect(screen.queryByText('Brand audit and competitive analysis')).not.toBeInTheDocument();
  });
});