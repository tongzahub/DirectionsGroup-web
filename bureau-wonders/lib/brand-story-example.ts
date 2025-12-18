/**
 * Example usage of Brand Story data models and validation
 * This file demonstrates how to use the brand story types and utilities
 */

import { 
  BrandStoryContent,
  HeroSection,
  ProblemSection,
  GuideSection,
  PlanSection,
  SuccessSection,
  StakesSection,
  CTASection
} from '../types/brand-story';

import { 
  createEmptyBrandStory,
  createStoryBrandTemplate,
  transformCMSDataToBrandStory,
  validateBrandStory
} from './brand-story-utils';

// Example: Creating a new brand story from template
export const createNewBrandStory = (): BrandStoryContent => {
  const template = createStoryBrandTemplate();
  
  // Customize the template with specific content
  template.title = 'The Bureau of Wonders Brand Story';
  template.slug = 'bureau-wonders-brand-story';
  
  // Customize hero section
  template.sections.hero.headline = 'Luxury Brands Deserve Extraordinary Stories';
  template.sections.hero.subheadline = 'We transform premium brands into market leaders through strategic storytelling that resonates with discerning audiences.';
  
  // Add specific problems for luxury brands
  template.sections.problem.problems = [
    {
      headline: 'Your premium positioning gets diluted',
      description: 'In a crowded marketplace, even luxury brands struggle to maintain their exclusive appeal and premium pricing power.',
      impact: 'Commoditization threatens your brand\'s perceived value and profit margins'
    },
    {
      headline: 'Inconsistent brand narrative across touchpoints',
      description: 'Without cohesive storytelling, your brand message fragments across digital, print, and experiential channels.',
      impact: 'Confused prospects don\'t become loyal, high-value customers'
    },
    {
      headline: 'Generic marketing approaches fall flat',
      description: 'Mass-market strategies don\'t resonate with sophisticated luxury consumers who expect personalized, meaningful experiences.',
      impact: 'Low engagement rates and poor conversion from your target demographic'
    }
  ];
  
  // Customize guide section with authority
  template.sections.guide.empathyStatement = 'We understand the unique challenges of luxury brand communication. Having worked with premium brands across industries, we know that excellence in storytelling requires both creative vision and strategic precision.';
  
  template.sections.guide.authorityElements = [
    {
      type: 'experience',
      title: '15+ Years in Luxury Brand Communications',
      description: 'Deep expertise across jewelry, fashion, hospitality, and high-end services with proven results for discerning clientele.'
    },
    {
      type: 'recognition',
      title: 'Award-Winning Creative Excellence',
      description: 'Recognized by industry leaders for innovative campaigns that elevate luxury brands and drive measurable business results.'
    },
    {
      type: 'credential',
      title: 'Strategic Partnership Approach',
      description: 'We don\'t just execute campaigns—we become an extension of your team, understanding your brand\'s heritage and vision.'
    }
  ];
  
  // Enhance the plan section
  template.sections.plan.steps = [
    {
      number: 1,
      title: 'Brand Story Discovery',
      description: 'We uncover the authentic narrative that differentiates your luxury brand in the marketplace.',
      details: [
        'Comprehensive brand audit and competitive analysis',
        'Stakeholder interviews and brand heritage exploration',
        'Target audience insights and persona development',
        'Brand positioning and messaging framework'
      ]
    },
    {
      number: 2,
      title: 'Strategic Content Creation',
      description: 'We craft compelling content that speaks to your audience\'s aspirations and values.',
      details: [
        'Premium content strategy and editorial calendar',
        'Luxury-focused copywriting and visual storytelling',
        'Multi-channel content adaptation and optimization',
        'Brand voice guidelines and style standards'
      ]
    },
    {
      number: 3,
      title: 'Amplification & Optimization',
      description: 'We ensure your story reaches and resonates with the right luxury consumers.',
      details: [
        'Strategic channel selection and media planning',
        'Performance tracking and analytics setup',
        'Continuous optimization based on engagement data',
        'Long-term brand narrative evolution'
      ]
    }
  ];
  
  // Add stakes section
  template.sections.stakes.failureScenarios = [
    {
      scenario: 'Brand commoditization in competitive markets',
      consequences: [
        'Loss of premium pricing power',
        'Decreased customer loyalty and lifetime value',
        'Difficulty attracting high-net-worth clientele'
      ],
      realWorldExample: 'Luxury brands that fail to differentiate often see 20-30% erosion in profit margins as they compete on features rather than brand value.'
    },
    {
      scenario: 'Inconsistent brand experience across touchpoints',
      consequences: [
        'Confused brand perception among target audience',
        'Reduced conversion rates from qualified prospects',
        'Weakened brand equity and market position'
      ]
    }
  ];
  
  template.sections.stakes.opportunityCost = 'Every day without a cohesive brand story is a missed opportunity to build deeper connections with your ideal customers and command premium pricing in your market.';
  
  // Enhance CTA section
  template.sections.cta.primaryCTA = {
    headline: 'Ready to Elevate Your Brand Story?',
    description: 'Let\'s discuss how we can transform your luxury brand\'s narrative into a powerful driver of business growth and market leadership.',
    buttonText: 'Schedule Your Strategy Session',
    formFields: [
      {
        name: 'name',
        type: 'text',
        label: 'Full Name',
        required: true,
        validation: [
          { type: 'required', message: 'Name is required' }
        ]
      },
      {
        name: 'company',
        type: 'text',
        label: 'Company Name',
        required: true,
        validation: [
          { type: 'required', message: 'Company name is required' }
        ]
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
        validation: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email address' }
        ]
      },
      {
        name: 'industry',
        type: 'select',
        label: 'Industry',
        options: ['Jewelry & Watches', 'Fashion & Luxury Goods', 'Hospitality', 'Real Estate', 'Financial Services', 'Other'],
        required: true
      },
      {
        name: 'challenge',
        type: 'textarea',
        label: 'Primary Brand Challenge',
        placeholder: 'Briefly describe your main brand communication challenge...',
        required: false
      }
    ]
  };
  
  template.sections.cta.secondaryCTA = {
    title: 'Explore Our Expertise',
    options: [
      {
        type: 'resource',
        title: 'Luxury Brand Strategy Guide',
        description: 'Download our comprehensive guide to luxury brand positioning and storytelling.',
        link: '/resources/luxury-brand-strategy-guide'
      },
      {
        type: 'case-study',
        title: 'Success Stories',
        description: 'See how we\'ve helped luxury brands achieve remarkable growth and market leadership.',
        link: '/case-studies'
      },
      {
        type: 'consultation',
        title: 'Brand Assessment',
        description: 'Get a complimentary analysis of your current brand positioning and communication strategy.',
        link: '/brand-assessment'
      }
    ]
  };
  
  return template;
};

// Example: Validating brand story content
const validateExampleBrandStory = () => {
  const brandStory = createNewBrandStory();
  const validation = validateBrandStory(brandStory);
  
  console.log('Brand Story Validation Result:', {
    isValid: validation.isValid,
    errorCount: validation.errors.length,
    warningCount: validation.warnings.length,
    errors: validation.errors,
    warnings: validation.warnings
  });
  
  return validation;
};

// Example: Transforming CMS data
const transformExampleCMSData = () => {
  const mockCMSData = {
    id: 1,
    title: 'Example Brand Story',
    slug: 'example-brand-story',
    hero: {
      headline: 'Transform Your Luxury Brand',
      subheadline: 'Strategic storytelling for premium brands'
    },
    problem: {
      title: 'The Challenge',
      problems: [
        {
          headline: 'Market Saturation',
          description: 'Standing out in crowded luxury markets'
        }
      ]
    },
    guide: {
      title: 'Our Expertise',
      empathyStatement: 'We understand luxury brand challenges',
      authorityElements: []
    },
    plan: {
      title: 'Our Process',
      introduction: 'Systematic approach to brand storytelling',
      steps: []
    },
    success: {
      title: 'Success Stories',
      caseStudies: []
    },
    stakes: {
      title: 'What\'s at Stake',
      failureScenarios: []
    },
    cta: {
      primaryCTA: {
        headline: 'Get Started',
        description: 'Transform your brand today',
        buttonText: 'Contact Us'
      }
    },
    publishedAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };
  
  const transformedData = transformCMSDataToBrandStory(mockCMSData);
  
  console.log('Transformed Brand Story:', {
    id: transformedData.id,
    title: transformedData.title,
    sectionsCount: Object.keys(transformedData.sections).length,
    heroHeadline: transformedData.sections.hero.headline
  });
  
  return transformedData;
};

// Export example functions for use in other parts of the application
export {
  createNewBrandStory as default,
  validateExampleBrandStory,
  transformExampleCMSData
};