'use client';

import React, { Suspense, useEffect } from 'react';
import { SuccessStoriesSection, StakesSection, ProblemSection, GuideSection, PlanSection } from '@/components/content';
import CallToActionSection from '@/components/content/CallToActionSection';
import BrandStoryHeroSection from '@/components/content/BrandStoryHeroSection';
import MobileBrandStoryNavigation from '@/components/mobile/MobileBrandStoryNavigation';
import { LazySection, PreloadSection } from '@/components/animations/LazySection';
import { 
  HeroSectionSkeleton, 
  ProblemSectionSkeleton,
  GuideSectionSkeleton,
  PlanSectionSkeleton,
  SuccessStoriesSectionSkeleton, 
  StakesSectionSkeleton, 
  CallToActionSectionSkeleton 
} from '@/components/animations/BrandStorySkeletons';
import BrandStoryPerformanceMonitor, {
  HeroSectionMonitor,
  SuccessStoriesMonitor,
  StakesSectionMonitor,
  CTASectionMonitor,
} from '@/components/performance/BrandStoryPerformanceMonitor';
import { 
  StoryAnalyticsProvider, 
  AnalyticsCTA,
  useContentVariants,
  withStoryAnalytics 
} from '@/components/analytics/StoryAnalyticsProvider';
import { useStoryAnalytics } from '@/hooks/useStoryAnalytics';
import { useBrandStoryHeroData } from '@/hooks/useBrandStoryData';
import { registerServiceWorker, cacheResources } from '@/lib/service-worker';
import { CaseStudy, BrandStoryTestimonial, BrandStoryMetric, BrandStoryFailureScenario, TeamMember } from '@/types';
import { AuthorityElement, Testimonial } from '@/types/brand-story';
import { 
  useBrandStoryKeyboardNavigation, 
  useBrandStoryAnnouncements,
  useReducedMotionHandling 
} from '@/lib/brand-story-accessibility';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { 
  BrandStoryLayout, 
  SectionContainer, 
  ContentContainer 
} from '@/components/layout/BrandStoryLayout';

// Note: Metadata moved to separate metadata.ts file for client components

// Mock data for demonstration
const mockCaseStudies: CaseStudy[] = [
  {
    id: 1,
    title: 'Luxury Watch Brand Transformation',
    slug: 'luxury-watch-transformation',
    client: 'Prestigious Timepieces',
    challenge: 'The brand struggled with declining market share in the competitive luxury watch segment, facing challenges in communicating their heritage and craftsmanship to younger affluent consumers.',
    strategy: 'Developed a comprehensive brand narrative focusing on artisanal excellence and timeless design philosophy.',
    execution: 'Implemented multi-channel storytelling campaign including digital content, experiential events, and strategic partnerships.',
    results: 'Achieved 45% increase in brand awareness among target demographic and 32% growth in sales within 12 months.',
    gallery: [],
    featuredImage: {
      id: 1,
      name: 'luxury-watch.jpg',
      url: '/api/placeholder/600/400',
      mime: 'image/jpeg',
      size: 150000,
      width: 600,
      height: 400,
      alternativeText: 'Luxury watch collection showcase'
    },
    publishedAt: '2024-01-15T00:00:00.000Z',
    seoTitle: 'Luxury Watch Brand Transformation Case Study',
    metaDescription: 'How we transformed a luxury watch brand\'s market position',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: 2,
    title: 'High-End Fashion House Revival',
    slug: 'fashion-house-revival',
    client: 'Maison Élégance',
    challenge: 'Historic fashion house needed to modernize brand perception while maintaining luxury positioning and heritage authenticity.',
    strategy: 'Created brand evolution strategy balancing tradition with contemporary relevance.',
    execution: 'Launched integrated campaign featuring heritage storytelling and modern design philosophy.',
    results: 'Increased social media engagement by 180% and secured partnerships with top-tier retailers globally.',
    gallery: [],
    featuredImage: {
      id: 2,
      name: 'fashion-house.jpg',
      url: '/api/placeholder/600/400',
      mime: 'image/jpeg',
      size: 160000,
      width: 600,
      height: 400,
      alternativeText: 'Fashion house runway show'
    },
    publishedAt: '2024-02-20T00:00:00.000Z',
    seoTitle: 'Fashion House Revival Case Study',
    metaDescription: 'Revitalizing a historic fashion house for modern luxury market',
    createdAt: '2024-02-20T00:00:00.000Z',
    updatedAt: '2024-02-20T00:00:00.000Z'
  },
  {
    id: 3,
    title: 'Luxury Real Estate Portfolio Launch',
    slug: 'luxury-real-estate-launch',
    client: 'Premier Properties Group',
    challenge: 'New luxury real estate development needed to establish market presence and attract high-net-worth investors.',
    strategy: 'Developed exclusive positioning strategy emphasizing architectural excellence and lifestyle benefits.',
    execution: 'Created immersive brand experience through virtual tours, exclusive events, and targeted communications.',
    results: 'Achieved 95% pre-sales rate and established waiting list for future developments.',
    gallery: [],
    featuredImage: {
      id: 3,
      name: 'luxury-real-estate.jpg',
      url: '/api/placeholder/600/400',
      mime: 'image/jpeg',
      size: 180000,
      width: 600,
      height: 400,
      alternativeText: 'Luxury real estate development'
    },
    publishedAt: '2024-03-10T00:00:00.000Z',
    seoTitle: 'Luxury Real Estate Launch Case Study',
    metaDescription: 'Successful launch of luxury real estate portfolio',
    createdAt: '2024-03-10T00:00:00.000Z',
    updatedAt: '2024-03-10T00:00:00.000Z'
  }
];

const mockTestimonials: BrandStoryTestimonial[] = [
  {
    clientName: 'Alexandra Chen',
    clientTitle: 'Brand Director',
    companyName: 'Prestigious Timepieces',
    quote: 'The Bureau of Wonders transformed our brand narrative completely. Their strategic approach helped us connect with a new generation while honoring our heritage.',
    avatar: {
      id: 4,
      name: 'alexandra-chen.jpg',
      url: '/api/placeholder/64/64',
      mime: 'image/jpeg',
      size: 5000,
      width: 64,
      height: 64,
      alternativeText: 'Alexandra Chen headshot'
    },
    companyLogo: {
      id: 5,
      name: 'prestigious-timepieces-logo.png',
      url: '/api/placeholder/120/60',
      mime: 'image/png',
      size: 8000,
      width: 120,
      height: 60,
      alternativeText: 'Prestigious Timepieces logo'
    }
  },
  {
    clientName: 'Marcus Dubois',
    clientTitle: 'Creative Director',
    companyName: 'Maison Élégance',
    quote: 'Working with The Bureau was transformative. They understood our heritage and helped us speak to modern luxury consumers authentically.',
    avatar: {
      id: 6,
      name: 'marcus-dubois.jpg',
      url: '/api/placeholder/64/64',
      mime: 'image/jpeg',
      size: 5200,
      width: 64,
      height: 64,
      alternativeText: 'Marcus Dubois headshot'
    },
    companyLogo: {
      id: 7,
      name: 'maison-elegance-logo.png',
      url: '/api/placeholder/120/60',
      mime: 'image/png',
      size: 7500,
      width: 120,
      height: 60,
      alternativeText: 'Maison Élégance logo'
    }
  },
  {
    clientName: 'Victoria Sterling',
    clientTitle: 'CEO',
    companyName: 'Premier Properties Group',
    quote: 'The strategic positioning and brand narrative created by The Bureau exceeded our expectations. The results speak for themselves.',
    avatar: {
      id: 8,
      name: 'victoria-sterling.jpg',
      url: '/api/placeholder/64/64',
      mime: 'image/jpeg',
      size: 4800,
      width: 64,
      height: 64,
      alternativeText: 'Victoria Sterling headshot'
    },
    companyLogo: {
      id: 9,
      name: 'premier-properties-logo.png',
      url: '/api/placeholder/120/60',
      mime: 'image/png',
      size: 9000,
      width: 120,
      height: 60,
      alternativeText: 'Premier Properties Group logo'
    }
  }
];

const mockMetrics: BrandStoryMetric[] = [
  {
    label: 'Brand Awareness Increase',
    value: '45%',
    improvement: '+32% vs industry avg',
    timeframe: 'Within 12 months'
  },
  {
    label: 'Sales Growth',
    value: '32%',
    improvement: 'Above target',
    timeframe: 'Year over year'
  },
  {
    label: 'Social Engagement',
    value: '180%',
    improvement: 'Record high',
    timeframe: 'Campaign period'
  },
  {
    label: 'Pre-Sales Rate',
    value: '95%',
    improvement: 'Market leading',
    timeframe: 'Launch phase'
  },
  {
    label: 'Client Satisfaction',
    value: '98%',
    improvement: 'Exceptional',
    timeframe: 'Ongoing'
  },
  {
    label: 'Market Share Growth',
    value: '28%',
    improvement: 'Significant gain',
    timeframe: '18 months'
  }
];

const mockProblems = [
  {
    headline: 'Inconsistent Brand Messaging',
    description: '<p>Your brand speaks with multiple voices across different channels, creating confusion among your target audience. Without a unified narrative, luxury consumers struggle to understand your unique value proposition and positioning in the market.</p>',
    icon: '/api/placeholder/24/24',
    impact: 'Leads to decreased brand recognition, weakened market position, and lost opportunities to premium competitors with clearer messaging.'
  },
  {
    headline: 'Outdated Communication Strategy',
    description: '<p>Traditional marketing approaches fail to resonate with evolving luxury consumer preferences. Your brand risks appearing irrelevant to younger affluent demographics who expect sophisticated digital experiences and authentic storytelling.</p>',
    icon: '/api/placeholder/24/24',
    impact: 'Results in declining engagement rates, reduced market share among high-value demographics, and missed digital transformation opportunities.'
  },
  {
    headline: 'Lack of Emotional Connection',
    description: '<p>Your communications focus on features and benefits rather than creating meaningful emotional bonds with your audience. Luxury consumers seek brands that understand their aspirations and reflect their values and lifestyle choices.</p>',
    icon: '/api/placeholder/24/24',
    impact: 'Causes reduced customer loyalty, lower lifetime value, and vulnerability to competitors who create stronger emotional connections.'
  },
  {
    headline: 'Poor Crisis Communication',
    description: '<p>Without proper crisis communication protocols, negative events can quickly escalate and damage your brand reputation. In the luxury market, reputation is everything, and recovery from reputational damage takes significantly longer.</p>',
    icon: '/api/placeholder/24/24',
    impact: 'Amplifies negative publicity, erodes stakeholder confidence, and creates long-term recovery costs that exceed initial investment in proper communication strategies.'
  },
  {
    headline: 'Ineffective Stakeholder Engagement',
    description: '<p>Key stakeholders including investors, partners, and media receive inconsistent or inadequate communication. This leads to misaligned expectations and missed opportunities for strategic partnerships and positive coverage.</p>',
    icon: '/api/placeholder/24/24',
    impact: 'Creates missed partnership opportunities, reduced media coverage, and potential investor relations challenges that affect business growth.'
  }
];

// Mock Guide Section Data
const mockAuthorityElements: AuthorityElement[] = [
  {
    type: 'credential',
    title: 'Certified Brand Strategists',
    description: 'Our team holds advanced certifications in brand strategy and luxury marketing from leading institutions. We combine academic rigor with real-world experience to deliver exceptional results.',
    visual: {
      id: 10,
      name: 'certification-badge.png',
      url: '/api/placeholder/80/60',
      mime: 'image/png',
      size: 5000,
      width: 80,
      height: 60,
      alternativeText: 'Brand strategy certification badge'
    }
  },
  {
    type: 'experience',
    title: '15+ Years in Luxury Communications',
    description: 'Extensive experience working with prestigious luxury brands across jewelry, fashion, hospitality, and finance. We understand the nuances of luxury market positioning and consumer psychology.',
    visual: {
      id: 11,
      name: 'experience-timeline.png',
      url: '/api/placeholder/80/60',
      mime: 'image/png',
      size: 6000,
      width: 80,
      height: 60,
      alternativeText: 'Experience timeline graphic'
    }
  },
  {
    type: 'recognition',
    title: 'Industry Awards & Recognition',
    description: 'Recipients of multiple industry awards for excellence in brand communications and strategic marketing. Recognized by leading marketing associations and luxury industry publications.',
    visual: {
      id: 12,
      name: 'awards-collection.png',
      url: '/api/placeholder/80/60',
      mime: 'image/png',
      size: 7000,
      width: 80,
      height: 60,
      alternativeText: 'Industry awards collection'
    }
  }
];

const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    title: 'Strategic Director',
    expertise: ['Brand Strategy', 'Luxury Marketing', 'Crisis Communications'],
    image: {
      id: 13,
      name: 'sarah-mitchell.jpg',
      url: '/api/placeholder/400/300',
      mime: 'image/jpeg',
      size: 45000,
      width: 400,
      height: 300,
      alternativeText: 'Sarah Mitchell professional headshot'
    },
    bio: '<p>Sarah brings over 12 years of experience in luxury brand communications, having worked with prestigious clients in jewelry, fashion, and hospitality sectors.</p>',
    publishedAt: '2024-01-01T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Marcus Chen',
    title: 'Creative Lead',
    expertise: ['Visual Storytelling', 'Digital Strategy', 'Content Creation'],
    image: {
      id: 14,
      name: 'marcus-chen.jpg',
      url: '/api/placeholder/400/300',
      mime: 'image/jpeg',
      size: 42000,
      width: 400,
      height: 300,
      alternativeText: 'Marcus Chen professional headshot'
    },
    bio: '<p>Marcus specializes in translating brand strategies into compelling visual narratives that resonate with luxury audiences across digital and traditional channels.</p>',
    publishedAt: '2024-01-01T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    title: 'Client Relations Director',
    expertise: ['Stakeholder Management', 'Project Strategy', 'Luxury Markets'],
    image: {
      id: 15,
      name: 'elena-rodriguez.jpg',
      url: '/api/placeholder/400/300',
      mime: 'image/jpeg',
      size: 48000,
      width: 400,
      height: 300,
      alternativeText: 'Elena Rodriguez professional headshot'
    },
    bio: '<p>Elena ensures seamless project execution and maintains strong relationships with our luxury brand clients, delivering exceptional service and results.</p>',
    publishedAt: '2024-01-01T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

const mockGuideTestimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    clientName: 'Alexandra Chen',
    clientTitle: 'Brand Director',
    companyName: 'Prestigious Timepieces',
    quote: 'The Bureau of Wonders transformed our brand narrative completely. Their strategic approach helped us connect with a new generation while honoring our heritage.',
    avatar: {
      id: 4,
      name: 'alexandra-chen.jpg',
      url: '/api/placeholder/64/64',
      mime: 'image/jpeg',
      size: 5000,
      width: 64,
      height: 64,
      alternativeText: 'Alexandra Chen headshot'
    },
    companyLogo: {
      id: 5,
      name: 'prestigious-timepieces-logo.png',
      url: '/api/placeholder/120/60',
      mime: 'image/png',
      size: 8000,
      width: 120,
      height: 60,
      alternativeText: 'Prestigious Timepieces logo'
    }
  },
  {
    id: 'testimonial-2',
    clientName: 'Marcus Dubois',
    clientTitle: 'Creative Director',
    companyName: 'Maison Élégance',
    quote: 'Working with The Bureau was transformative. They understood our heritage and helped us speak to modern luxury consumers authentically.',
    avatar: {
      id: 6,
      name: 'marcus-dubois.jpg',
      url: '/api/placeholder/64/64',
      mime: 'image/jpeg',
      size: 5200,
      width: 64,
      height: 64,
      alternativeText: 'Marcus Dubois headshot'
    },
    companyLogo: {
      id: 7,
      name: 'maison-elegance-logo.png',
      url: '/api/placeholder/120/60',
      mime: 'image/png',
      size: 7500,
      width: 120,
      height: 60,
      alternativeText: 'Maison Élégance logo'
    }
  },
  {
    id: 'testimonial-3',
    clientName: 'Victoria Sterling',
    clientTitle: 'CEO',
    companyName: 'Premier Properties Group',
    quote: 'The strategic positioning and brand narrative created by The Bureau exceeded our expectations. The results speak for themselves.',
    avatar: {
      id: 8,
      name: 'victoria-sterling.jpg',
      url: '/api/placeholder/64/64',
      mime: 'image/jpeg',
      size: 4800,
      width: 64,
      height: 64,
      alternativeText: 'Victoria Sterling headshot'
    },
    companyLogo: {
      id: 9,
      name: 'premier-properties-logo.png',
      url: '/api/placeholder/120/60',
      mime: 'image/png',
      size: 9000,
      width: 120,
      height: 60,
      alternativeText: 'Premier Properties Group logo'
    }
  }
];

// Mock Plan Section Data
const mockProcessSteps = [
  {
    number: 1,
    title: 'Discovery & Strategic Assessment',
    description: '<p>We begin with a comprehensive analysis of your brand\'s current position, target audience, and competitive landscape. This deep-dive assessment reveals opportunities and establishes the foundation for your transformation.</p>',
    details: [
      'Brand audit and competitive analysis',
      'Stakeholder interviews and audience research',
      'Communication gap identification',
      'Strategic positioning framework development',
      'Success metrics and KPI establishment'
    ],
    icon: '/api/placeholder/48/48'
  },
  {
    number: 2,
    title: 'Narrative Development & Content Strategy',
    description: '<p>Using insights from our discovery phase, we craft your compelling brand narrative and develop a comprehensive content strategy that resonates with your luxury audience across all touchpoints.</p>',
    details: [
      'StoryBrand framework implementation',
      'Brand voice and messaging guidelines',
      'Content pillar development',
      'Channel-specific content adaptation',
      'Crisis communication protocols'
    ],
    icon: '/api/placeholder/48/48'
  },
  {
    number: 3,
    title: 'Implementation & Optimization',
    description: '<p>We execute your brand story across all channels while continuously monitoring performance and optimizing for maximum impact. Our ongoing support ensures sustained success and growth.</p>',
    details: [
      'Multi-channel campaign execution',
      'Performance monitoring and analytics',
      'Continuous optimization and refinement',
      'Team training and knowledge transfer',
      'Long-term strategic partnership'
    ],
    icon: '/api/placeholder/48/48'
  }
];

const mockFailureScenarios = [
  {
    scenario: 'Inconsistent Brand Messaging',
    consequences: [
      'Confused target audience unable to understand value proposition',
      'Weakened brand recognition and recall in competitive markets',
      'Lost opportunities to premium-priced competitors with clearer positioning',
      'Decreased customer loyalty and brand advocacy'
    ],
    realWorldExample: 'A luxury watch brand lost 30% market share when inconsistent messaging across channels confused their heritage positioning.'
  },
  {
    scenario: 'Outdated Communication Strategy',
    consequences: [
      'Failure to connect with evolving luxury consumer preferences',
      'Declining relevance among younger affluent demographics',
      'Missed digital transformation opportunities',
      'Reduced media coverage and industry recognition'
    ],
    realWorldExample: 'Traditional luxury brands that ignored digital storytelling saw 40% decline in engagement with high-net-worth millennials.'
  },
  {
    scenario: 'Poor Crisis Communication',
    consequences: [
      'Amplified negative publicity and reputational damage',
      'Loss of stakeholder confidence and investor trust',
      'Long-term brand recovery costs exceeding initial investment',
      'Competitive disadvantage during market recovery'
    ],
    realWorldExample: 'Luxury brands with inadequate crisis response protocols experienced 60% longer reputation recovery periods.'
  }
];

// Mock CTA data
const mockCtaOptions = [
  {
    type: 'consultation' as const,
    title: 'Strategic Brand Consultation',
    description: '<p>Schedule a confidential 60-minute consultation to explore your brand\'s narrative potential and identify strategic opportunities.</p>',
    link: '/contact?type=consultation',
    buttonText: 'Book Consultation'
  },
  {
    type: 'resource' as const,
    title: 'Brand Story Framework Guide',
    description: '<p>Download our comprehensive guide to building compelling brand narratives that resonate with luxury audiences.</p>',
    link: '/resources/brand-story-framework',
    buttonText: 'Download Guide'
  },
  {
    type: 'case-study' as const,
    title: 'Success Story Portfolio',
    description: '<p>Explore detailed case studies showcasing how we\'ve transformed luxury brands across diverse industries.</p>',
    link: '/case-studies',
    buttonText: 'View Portfolio'
  }
];

// Navigation sections for mobile
const navigationSections = [
  {
    id: 'hero',
    title: 'Our Brand Story',
    shortTitle: 'Introduction',
    description: 'Transforming luxury brands'
  },
  {
    id: 'problems',
    title: 'The Challenges You Face',
    shortTitle: 'Challenges',
    description: 'Common luxury brand communication problems'
  },
  {
    id: 'guide',
    title: 'Your Trusted Guide',
    shortTitle: 'Our Expertise',
    description: 'Experience and authority you can trust'
  },
  {
    id: 'plan',
    title: 'Our Proven Methodology',
    shortTitle: 'Our Process',
    description: 'Clear steps to transformation'
  },
  {
    id: 'success-stories',
    title: 'Client Success Stories',
    shortTitle: 'Success Stories',
    description: 'Proven results and transformations'
  },
  {
    id: 'stakes',
    title: 'The Stakes Are Higher Than Ever',
    shortTitle: 'The Stakes',
    description: 'Why strategic communication matters'
  },
  {
    id: 'call-to-action',
    title: 'Ready to Transform Your Brand?',
    shortTitle: 'Get Started',
    description: 'Begin your transformation journey'
  }
];

// Enhanced Hero Section with Analytics and CMS Integration
const HeroSectionWithAnalytics = () => {
  const { heroData, loading, error } = useBrandStoryHeroData();
  const { trackSectionConversion } = useStoryAnalytics({
    sectionName: 'hero',
    abTestId: 'brand_story_headline_cms',
  });

  const handleCTAClick = () => {
    trackSectionConversion({
      conversionType: 'hero_cta_click',
      additionalData: {
        ctaText: heroData?.ctaButton?.text || 'Start Your Transformation',
      },
    });
  };

  // Loading state
  if (loading) {
    return <HeroSectionSkeleton />;
  }

  // Error state - fallback to default content
  if (error || !heroData) {
    console.warn('Failed to load hero data from CMS, using fallback content:', error);
    return (
      <BrandStoryHeroSection
        headline="Luxury Brands Deserve Extraordinary Stories"
        subheadline="Transform your brand narrative into market leadership with strategic communications that resonate with discerning audiences and drive meaningful business outcomes."
        ctaText="Start Your Transformation"
        ctaLink="#success-stories"
        onCtaClick={handleCTAClick}
        className="bg-gradient-to-br from-primary-blue via-primary-600 to-primary-700"
      />
    );
  }

  // Render with CMS data
  return (
    <BrandStoryHeroSection
      headline={heroData.headline}
      subheadline={heroData.subheadline}
      ctaText={heroData.ctaButton?.text}
      ctaLink={heroData.ctaButton?.link}
      backgroundImage={heroData.backgroundImage}
      onCtaClick={handleCTAClick}
      enableParallax={true}
    />
  );
};

export default function BrandStoryPage() {
  // Initialize accessibility features
  useBrandStoryKeyboardNavigation();
  const { announceSection } = useBrandStoryAnnouncements();
  const { getAnimationProps } = useReducedMotionHandling();

  // Initialize service worker and cache critical resources
  useEffect(() => {
    const initializePerformanceOptimizations = async () => {
      try {
        // Register service worker
        await registerServiceWorker();
        
        // Cache critical brand story resources
        const criticalResources = [
          '/brand-story',
          '/api/placeholder/1920/1080', // Hero background
          '/api/placeholder/600/400', // Case study images
          '/api/placeholder/64/64', // Avatar images
          '/api/placeholder/120/60', // Company logos
        ];
        
        await cacheResources(criticalResources);
        
        console.log('Brand story performance optimizations initialized');
      } catch (error) {
        console.warn('Failed to initialize performance optimizations:', error);
      }
    };
    
    initializePerformanceOptimizations();
    
    // Announce page load to screen readers
    setTimeout(() => {
      announceSection('Brand Story page', 'Learn about our approach to luxury brand communications');
    }, 1000);
  }, [announceSection]);

  return (
    <AccessibilityProvider>
      <StoryAnalyticsProvider enableAnalytics={true}>
        {/* Skip to main content link for keyboard users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-900 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-blue/30"
        >
          Skip to main content
        </a>
        
        {/* Keyboard navigation instructions */}
        <div className="sr-only">
          <p>Keyboard navigation: Use numbers 1-4 to jump to sections, or use Tab to navigate through interactive elements.</p>
        </div>
        
        <BrandStoryLayout>
          <main 
            id="main-content"
            role="main"
            aria-label="Brand Story"
          >
            {/* Performance Monitoring */}
            <BrandStoryPerformanceMonitor />
        
            {/* Mobile Navigation */}
            <MobileBrandStoryNavigation
              sections={navigationSections}
              currentSection="hero"
              onSectionChange={(sectionId) => {
                // Handle section change - could be enhanced with state management
                console.log('Navigate to section:', sectionId);
              }}
            />

            {/* Mobile-Optimized Hero Section with Analytics - High Priority, No Lazy Loading */}
            <PreloadSection
              assets={[
                // Preload critical hero assets
                '/api/placeholder/1920/1080', // Hero background image
              ]}
            >
              <HeroSectionWithAnalytics />
            </PreloadSection>

            {/* Problem Section with Analytics - Lazy Loaded */}
            <LazySection
              id="problems"
              priority="high"
              rootMargin="150px 0px"
              fallback={<ProblemSectionSkeleton />}
              onLoad={() => console.log('Problem section loaded')}
            >
              <Suspense fallback={<ProblemSectionSkeleton />}>
                <SectionContainer
                  id="problems-section"
                  variant="content"
                  background="white"
                >
                  {React.createElement(
                    withStoryAnalytics(
                      ({ children, ...props }: any) => (
                        <div 
                          data-brand-story-element="problems" 
                          tabIndex={-1}
                          {...props}
                        >
                          <ProblemSection
                            title="The Challenges You Face"
                            problems={mockProblems}
                            transitionStatement="<p>These challenges are more common than you might think. Luxury brands across industries struggle with the same fundamental communication issues that prevent them from reaching their full potential.</p><p>The good news? There's a proven path forward.</p>"
                            enableProgressiveDisclosure={true}
                            maxVisibleProblems={3}
                          />
                        </div>
                      ),
                      'problems',
                      { trackScrollDepth: true, trackTimeSpent: true, trackInteractions: true }
                    )
                  )}
                </SectionContainer>
              </Suspense>
            </LazySection>

            {/* Guide Section with Analytics - Lazy Loaded */}
            <LazySection
              id="guide"
              priority="high"
              rootMargin="150px 0px"
              fallback={<GuideSectionSkeleton />}
              onLoad={() => console.log('Guide section loaded')}
            >
              <Suspense fallback={<GuideSectionSkeleton />}>
                <SectionContainer
                  id="guide-section"
                  variant="content"
                  background="gray"
                >
                  {React.createElement(
                    withStoryAnalytics(
                      ({ children, ...props }: any) => (
                        <div 
                          data-brand-story-element="guide" 
                          tabIndex={-1}
                          {...props}
                        >
                          <GuideSection
                            title="Your Trusted Guide"
                            empathyStatement="<p>We understand the unique challenges luxury brands face because we've been there. For over 15 years, we've helped prestigious brands navigate complex communication landscapes, build authentic connections with discerning audiences, and achieve remarkable growth.</p><p>We're not just consultants—we're strategic partners who genuinely care about your brand's success. Our empathetic approach combined with proven expertise makes us the guide you can trust to transform your brand story.</p>"
                            authorityElements={mockAuthorityElements}
                            teamHighlight={mockTeamMembers}
                            testimonials={mockGuideTestimonials}
                          />
                        </div>
                      ),
                      'guide',
                      { trackScrollDepth: true, trackTimeSpent: true, trackInteractions: true }
                    )
                  )}
                </SectionContainer>
              </Suspense>
            </LazySection>

            {/* Plan Section with Analytics - Lazy Loaded */}
            <LazySection
              id="plan"
              priority="high"
              rootMargin="150px 0px"
              fallback={<PlanSectionSkeleton />}
              onLoad={() => console.log('Plan section loaded')}
            >
              <Suspense fallback={<PlanSectionSkeleton />}>
                <SectionContainer
                  id="plan-section"
                  variant="content"
                  background="white"
                >
                  {React.createElement(
                    withStoryAnalytics(
                      ({ children, ...props }: any) => (
                        <div 
                          data-brand-story-element="plan" 
                          tabIndex={-1}
                          {...props}
                        >
                          <PlanSection
                            title="Our Proven Methodology"
                            introduction="<p>We follow a systematic, proven approach that transforms luxury brands from confusion to clarity, from obscurity to market leadership. Our three-step methodology has consistently delivered exceptional results for prestigious brands across diverse industries.</p><p>Each step builds upon the previous one, creating momentum toward your brand's transformation while reducing anxiety through clear expectations and transparent communication.</p>"
                            steps={mockProcessSteps}
                            reassurance="<p>Throughout this process, you'll have complete visibility into our progress and direct access to our senior strategists. We believe in collaborative partnerships, not black-box consulting. Your success is our success, and we're committed to delivering results that exceed your expectations.</p><p>Every step is backed by our satisfaction guarantee and supported by over 15 years of luxury brand expertise.</p>"
                          />
                        </div>
                      ),
                      'plan',
                      { trackScrollDepth: true, trackTimeSpent: true, trackInteractions: true }
                    )
                  )}
                </SectionContainer>
              </Suspense>
            </LazySection>

            {/* Success Stories Section with Analytics - Lazy Loaded */}
            <LazySection
              id="success-stories"
              priority="medium"
              rootMargin="200px 0px"
              fallback={<SuccessStoriesSectionSkeleton className="bg-neutral-soft-gray" />}
              onLoad={() => console.log('Success Stories section loaded')}
            >
              <Suspense fallback={<SuccessStoriesSectionSkeleton className="bg-neutral-soft-gray" />}>
                <SectionContainer
                  id="success-stories-section"
                  variant="content"
                  background="gray"
                >
                  {React.createElement(
                    withStoryAnalytics(
                      ({ children, ...props }: any) => (
                        <div 
                          data-brand-story-element="success-stories" 
                          tabIndex={-1}
                          {...props}
                        >
                          <SuccessStoriesMonitor />
                          <SuccessStoriesSection
                            title="Client Success Stories"
                            caseStudies={mockCaseStudies}
                            testimonials={mockTestimonials}
                            metrics={mockMetrics}
                            overallImpactStatement="<p>Our strategic approach to luxury brand communications has consistently delivered exceptional results across diverse industries. From heritage timepiece manufacturers to cutting-edge fashion houses, we help brands tell their stories in ways that resonate with discerning audiences and drive meaningful business outcomes.</p>"
                          />
                        </div>
                      ),
                      'success-stories',
                      { trackScrollDepth: true, trackTimeSpent: true, trackInteractions: true }
                    )
                  )}
                </SectionContainer>
              </Suspense>
            </LazySection>

            {/* Stakes Section with Analytics - Lazy Loaded */}
            <LazySection
              id="stakes"
              priority="medium"
              rootMargin="150px 0px"
              fallback={<StakesSectionSkeleton />}
              onLoad={() => console.log('Stakes section loaded')}
            >
              <Suspense fallback={<StakesSectionSkeleton />}>
                <SectionContainer
                  id="stakes-section"
                  variant="content"
                  background="white"
                >
                  {React.createElement(
                    withStoryAnalytics(
                      ({ children, ...props }: any) => (
                        <div 
                          data-brand-story-element="stakes" 
                          tabIndex={-1}
                          {...props}
                        >
                          <StakesSectionMonitor />
                          <StakesSection
                            title="The Stakes Are Higher Than Ever"
                            failureScenarios={mockFailureScenarios}
                            opportunityCostStatement="<p>In today's rapidly evolving luxury market, the cost of ineffective communication extends far beyond immediate revenue loss. Every day without a strategic narrative is a day your competitors gain ground, your brand equity diminishes, and valuable market opportunities slip away.</p><p>The luxury consumer's attention is finite and their expectations are extraordinary. Brands that fail to communicate with clarity, authenticity, and strategic precision don't just lose sales—they lose their position in the market hierarchy that took decades to build.</p>"
                            transitionToActionStatement="<p>The choice is clear: continue with uncertain communication strategies and risk your brand's future, or partner with experts who understand the stakes and have the proven methodology to secure your success.</p><p>Your brand's story is too important to leave to chance.</p>"
                          />
                        </div>
                      ),
                      'stakes',
                      { trackScrollDepth: true, trackTimeSpent: true, trackInteractions: true }
                    )
                  )}
                </SectionContainer>
              </Suspense>
            </LazySection>

            {/* Call-to-Action Section with Analytics - Lazy Loaded */}
            <LazySection
              id="call-to-action"
              priority="high"
              rootMargin="100px 0px"
              fallback={<CallToActionSectionSkeleton />}
              onLoad={() => console.log('CTA section loaded')}
            >
              <Suspense fallback={<CallToActionSectionSkeleton />}>
                <SectionContainer
                  id="cta-section"
                  variant="cta"
                  background="gradient"
                >
                  {React.createElement(
                    withStoryAnalytics(
                      ({ children, ...props }: any) => (
                        <div 
                          data-brand-story-element="cta" 
                          tabIndex={-1}
                          {...props}
                        >
                          <CTASectionMonitor />
                          <CallToActionSection
                            primaryCtaHeadline="Ready to Transform Your Brand Story?"
                            primaryCtaDescription="<p>Your brand deserves a narrative that commands attention and drives results. Let's create a story that positions you as the obvious choice in your market.</p><p>Start with a confidential consultation where we'll identify strategic opportunities and provide actionable insights for your brand's growth.</p>"
                            primaryCtaButtonText="Start Your Transformation"
                            secondaryCtaTitle="Explore Your Options"
                            secondaryCtaOptions={mockCtaOptions}
                            contextData={{
                              source: 'brand-story',
                              section: 'final-cta',
                              campaign: 'story-transformation'
                            }}
                          />
                        </div>
                      ),
                      'cta',
                      { trackScrollDepth: true, trackTimeSpent: true, trackInteractions: true }
                    )
                  )}
                </SectionContainer>
              </Suspense>
            </LazySection>
          </main>
        </BrandStoryLayout>
    </StoryAnalyticsProvider>
    </AccessibilityProvider>
  );
}