import { 
  BrandStoryContent, 
  BrandStoryDraft,
  HeroSection,
  ProblemSection,
  GuideSection,
  PlanSection,
  SuccessSection,
  StakesSection,
  CTASection,
  ContentValidationResult,
  BrandStoryFormSubmission,
  BrandStoryAnalytics
} from '../types/brand-story';
import { 
  validateBrandStoryContent,
  validateBrandStoryDraft,
  validateContentIntegrity
} from './brand-story-validation';

// Data transformation utilities

/**
 * Transform CMS data to BrandStoryContent format
 */
export const transformCMSDataToBrandStory = (cmsData: any): BrandStoryContent => {
  return {
    id: cmsData.id?.toString() || '',
    title: cmsData.title || '',
    slug: cmsData.slug || '',
    sections: {
      hero: transformHeroSection(cmsData.hero || {}),
      problem: transformProblemSection(cmsData.problem || {}),
      guide: transformGuideSection(cmsData.guide || {}),
      plan: transformPlanSection(cmsData.plan || {}),
      success: transformSuccessSection(cmsData.success || {}),
      stakes: transformStakesSection(cmsData.stakes || {}),
      cta: transformCTASection(cmsData.cta || {}),
    },
    seoMetadata: {
      title: cmsData.seoTitle,
      description: cmsData.metaDescription,
      keywords: cmsData.keywords ? cmsData.keywords.split(',').map((k: string) => k.trim()) : [],
      ogImage: cmsData.ogImage,
      ogTitle: cmsData.ogTitle,
      ogDescription: cmsData.ogDescription,
      twitterCard: cmsData.twitterCard || 'summary_large_image',
      canonicalUrl: cmsData.canonicalUrl,
    },
    publishedAt: new Date(cmsData.publishedAt || Date.now()),
    updatedAt: new Date(cmsData.updatedAt || Date.now()),
  };
};

/**
 * Transform BrandStoryContent to CMS format
 */
export const transformBrandStoryToCMS = (brandStory: BrandStoryContent): any => {
  return {
    id: parseInt(brandStory.id),
    title: brandStory.title,
    slug: brandStory.slug,
    heroHeadline: brandStory.sections.hero.headline,
    heroSubheadline: brandStory.sections.hero.subheadline,
    heroBackgroundImage: brandStory.sections.hero.backgroundImage,
    heroCtaText: brandStory.sections.hero.ctaButton?.text,
    heroCtaLink: brandStory.sections.hero.ctaButton?.link,
    problemTitle: brandStory.sections.problem.title,
    problems: brandStory.sections.problem.problems,
    problemTransitionStatement: brandStory.sections.problem.transitionStatement,
    guideTitle: brandStory.sections.guide.title,
    empathyStatement: brandStory.sections.guide.empathyStatement,
    authorityElements: brandStory.sections.guide.authorityElements,
    teamHighlights: brandStory.sections.guide.teamHighlight,
    planTitle: brandStory.sections.plan.title,
    planIntroduction: brandStory.sections.plan.introduction,
    processSteps: brandStory.sections.plan.steps,
    reassuranceStatement: brandStory.sections.plan.reassurance,
    successTitle: brandStory.sections.success.title,
    successCaseStudies: brandStory.sections.success.caseStudies,
    overallImpactStatement: brandStory.sections.success.overallImpact,
    stakesTitle: brandStory.sections.stakes.title,
    failureScenarios: brandStory.sections.stakes.failureScenarios,
    opportunityCostStatement: brandStory.sections.stakes.opportunityCost,
    transitionToActionStatement: brandStory.sections.stakes.transitionToAction,
    primaryCtaHeadline: brandStory.sections.cta.primaryCTA.headline,
    primaryCtaDescription: brandStory.sections.cta.primaryCTA.description,
    primaryCtaButtonText: brandStory.sections.cta.primaryCTA.buttonText,
    primaryCtaFormFields: brandStory.sections.cta.primaryCTA.formFields,
    secondaryCtaTitle: brandStory.sections.cta.secondaryCTA?.title,
    secondaryCtaOptions: brandStory.sections.cta.secondaryCTA?.options,
    seoTitle: brandStory.seoMetadata.title,
    metaDescription: brandStory.seoMetadata.description,
    keywords: brandStory.seoMetadata.keywords?.join(', '),
    ogImage: brandStory.seoMetadata.ogImage,
    ogTitle: brandStory.seoMetadata.ogTitle,
    ogDescription: brandStory.seoMetadata.ogDescription,
    twitterCard: brandStory.seoMetadata.twitterCard,
    canonicalUrl: brandStory.seoMetadata.canonicalUrl,
    publishedAt: brandStory.publishedAt.toISOString(),
    updatedAt: brandStory.updatedAt.toISOString(),
  };
};

// Section transformation helpers
const transformHeroSection = (data: any): HeroSection => ({
  headline: data.headline || '',
  subheadline: data.subheadline || '',
  backgroundImage: data.backgroundImage,
  ctaButton: data.ctaButton ? {
    text: data.ctaButton.text || '',
    link: data.ctaButton.link || '',
    style: data.ctaButton.style || 'primary',
    trackingId: data.ctaButton.trackingId,
  } : undefined,
});

const transformProblemSection = (data: any): ProblemSection => ({
  title: data.title || '',
  problems: data.problems || [],
  transitionStatement: data.transitionStatement,
});

const transformGuideSection = (data: any): GuideSection => ({
  title: data.title || '',
  empathyStatement: data.empathyStatement || '',
  authorityElements: data.authorityElements || [],
  teamHighlight: data.teamHighlight || [],
});

const transformPlanSection = (data: any): PlanSection => ({
  title: data.title || '',
  introduction: data.introduction || '',
  steps: data.steps || [],
  reassurance: data.reassurance,
});

const transformSuccessSection = (data: any): SuccessSection => ({
  title: data.title || '',
  caseStudies: data.caseStudies || [],
  overallImpact: data.overallImpact,
});

const transformStakesSection = (data: any): StakesSection => ({
  title: data.title || '',
  failureScenarios: data.failureScenarios || [],
  opportunityCost: data.opportunityCost,
  transitionToAction: data.transitionToAction,
});

const transformCTASection = (data: any): CTASection => ({
  primaryCTA: {
    headline: data.primaryCTA?.headline || '',
    description: data.primaryCTA?.description || '',
    buttonText: data.primaryCTA?.buttonText || '',
    formFields: data.primaryCTA?.formFields,
  },
  secondaryCTA: data.secondaryCTA ? {
    title: data.secondaryCTA.title,
    options: data.secondaryCTA.options || [],
  } : undefined,
});

// Validation utilities

/**
 * Validate brand story content with detailed error reporting
 */
export const validateBrandStory = (content: unknown): ContentValidationResult => {
  const schemaValidation = validateBrandStoryContent(content);
  
  if (!schemaValidation.success) {
    return {
      isValid: false,
      errors: schemaValidation.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        severity: 'error' as const,
      })),
      warnings: [],
    };
  }

  // Additional content integrity validation
  return validateContentIntegrity(schemaValidation.data);
};

/**
 * Validate brand story draft
 */
export const validateDraft = (draft: unknown): ContentValidationResult => {
  const schemaValidation = validateBrandStoryDraft(draft);
  
  if (!schemaValidation.success) {
    return {
      isValid: false,
      errors: schemaValidation.error.issues.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
        severity: 'error' as const,
      })),
      warnings: [],
    };
  }

  return {
    isValid: true,
    errors: [],
    warnings: [],
  };
};

// Content generation utilities

/**
 * Generate empty brand story template
 */
export const createEmptyBrandStory = (title: string = 'New Brand Story'): BrandStoryContent => {
  const now = new Date();
  
  return {
    id: `draft-${Date.now()}`,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    sections: {
      hero: {
        headline: '',
        subheadline: '',
      },
      problem: {
        title: '',
        problems: [],
      },
      guide: {
        title: '',
        empathyStatement: '',
        authorityElements: [],
        teamHighlight: [],
      },
      plan: {
        title: '',
        introduction: '',
        steps: [],
      },
      success: {
        title: '',
        caseStudies: [],
      },
      stakes: {
        title: '',
        failureScenarios: [],
      },
      cta: {
        primaryCTA: {
          headline: '',
          description: '',
          buttonText: '',
        },
      },
    },
    seoMetadata: {},
    publishedAt: now,
    updatedAt: now,
  };
};

/**
 * Generate brand story template with StoryBrand framework structure
 */
export const createStoryBrandTemplate = (): BrandStoryContent => {
  const template = createEmptyBrandStory('Brand Story');
  
  // Pre-populate with StoryBrand framework guidance
  template.sections.hero.headline = 'Your Luxury Brand Deserves Extraordinary Stories';
  template.sections.hero.subheadline = 'Transform your brand narrative into market leadership';
  
  template.sections.problem.title = 'The Communication Challenge';
  template.sections.problem.problems = [
    {
      headline: 'Your message gets lost in the noise',
      description: 'In a crowded luxury market, even exceptional brands struggle to communicate their unique value.',
      impact: 'Potential clients can\'t distinguish you from competitors',
    },
    {
      headline: 'Inconsistent brand storytelling',
      description: 'Without a cohesive narrative strategy, your brand story fragments across touchpoints.',
      impact: 'Confused audiences don\'t become loyal customers',
    },
  ];
  
  template.sections.guide.title = 'Your Trusted Guide';
  template.sections.guide.empathyStatement = 'We understand the pressure of representing luxury brands in an increasingly competitive market.';
  
  template.sections.plan.title = 'Our Proven Process';
  template.sections.plan.introduction = 'We\'ve developed a systematic approach to luxury brand storytelling that delivers results.';
  template.sections.plan.steps = [
    {
      number: 1,
      title: 'Discover Your Story',
      description: 'We uncover the authentic narrative that sets your brand apart.',
      details: ['Brand audit and positioning analysis', 'Stakeholder interviews', 'Competitive landscape review'],
    },
    {
      number: 2,
      title: 'Craft Your Message',
      description: 'We develop compelling content that resonates with your target audience.',
      details: ['Strategic messaging framework', 'Content creation and refinement', 'Visual storytelling elements'],
    },
    {
      number: 3,
      title: 'Amplify Your Impact',
      description: 'We ensure your story reaches and engages the right people.',
      details: ['Multi-channel distribution strategy', 'Performance monitoring', 'Continuous optimization'],
    },
  ];
  
  template.sections.success.title = 'Success Stories';
  template.sections.stakes.title = 'The Cost of Inaction';
  template.sections.cta.primaryCTA.headline = 'Ready to Transform Your Brand Story?';
  template.sections.cta.primaryCTA.description = 'Let\'s discuss how we can elevate your luxury brand\'s narrative and drive meaningful results.';
  template.sections.cta.primaryCTA.buttonText = 'Start Your Transformation';
  
  return template;
};

// Analytics utilities

/**
 * Calculate conversion rate from analytics data
 */
export const calculateConversionRate = (analytics: BrandStoryAnalytics): number => {
  if (analytics.uniqueVisitors === 0) return 0;
  return analytics.conversionMetrics.conversionRate;
};

/**
 * Get top performing sections from analytics
 */
export const getTopPerformingSections = (analytics: BrandStoryAnalytics, limit: number = 3) => {
  return Object.entries(analytics.sectionEngagement)
    .sort(([, a], [, b]) => b.interactions - a.interactions)
    .slice(0, limit)
    .map(([sectionName, metrics]) => ({
      section: sectionName,
      ...metrics,
    }));
};

/**
 * Generate analytics summary
 */
export const generateAnalyticsSummary = (analytics: BrandStoryAnalytics) => {
  const totalScrollDepth = Object.values(analytics.scrollDepth).reduce((sum, value) => sum + value, 0);
  const averageScrollDepth = totalScrollDepth / Object.keys(analytics.scrollDepth).length;
  
  return {
    overview: {
      pageViews: analytics.pageViews,
      uniqueVisitors: analytics.uniqueVisitors,
      averageTimeOnPage: Math.round(analytics.averageTimeOnPage),
      conversionRate: Math.round(analytics.conversionMetrics.conversionRate * 100),
    },
    engagement: {
      averageScrollDepth: Math.round(averageScrollDepth),
      topSections: getTopPerformingSections(analytics),
      totalInteractions: Object.values(analytics.sectionEngagement)
        .reduce((sum, section) => sum + section.interactions, 0),
    },
    conversions: {
      ctaClicks: analytics.conversionMetrics.ctaClicks,
      formSubmissions: analytics.conversionMetrics.formSubmissions,
      clickToSubmissionRate: analytics.conversionMetrics.ctaClicks > 0 
        ? Math.round((analytics.conversionMetrics.formSubmissions / analytics.conversionMetrics.ctaClicks) * 100)
        : 0,
    },
  };
};

// Form utilities

/**
 * Process form submission data
 */
export const processFormSubmission = (submission: BrandStoryFormSubmission) => {
  return {
    id: `${submission.formId}-${submission.timestamp.getTime()}`,
    formId: submission.formId,
    sectionId: submission.sectionId,
    data: submission.data,
    submittedAt: submission.timestamp,
    source: {
      userAgent: submission.userAgent,
      referrer: submission.referrer,
      sessionId: submission.sessionId,
    },
  };
};

/**
 * Generate form field validation rules
 */
export const generateFormValidation = (fields: any[]) => {
  return fields.reduce((rules: any, field) => {
    rules[field.name] = [];
    
    if (field.required) {
      rules[field.name].push({ required: true, message: `${field.label} is required` });
    }
    
    if (field.type === 'email') {
      rules[field.name].push({ 
        type: 'email', 
        message: 'Please enter a valid email address' 
      });
    }
    
    if (field.validation) {
      rules[field.name].push(...field.validation);
    }
    
    return rules;
  }, {});
};

// Export all utilities (removed duplicate export block)