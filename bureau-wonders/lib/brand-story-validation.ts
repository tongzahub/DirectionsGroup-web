import { z } from 'zod';

// Media validation schema
const MediaSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string().url(),
  mime: z.string(),
  size: z.number().positive(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  alternativeText: z.string().optional(),
  caption: z.string().optional(),
});

// SEO Metadata validation schema
const SEOMetadataSchema = z.object({
  title: z.string().min(1).max(60).optional(),
  description: z.string().min(1).max(160).optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: MediaSchema.optional(),
  ogTitle: z.string().min(1).max(60).optional(),
  ogDescription: z.string().min(1).max(160).optional(),
  twitterCard: z.enum(['summary', 'summary_large_image']).optional(),
  canonicalUrl: z.string().url().optional(),
});

// Form Field validation schema
const FormFieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['text', 'email', 'tel', 'textarea', 'select', 'checkbox']),
  label: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  validation: z.array(z.object({
    type: z.enum(['required', 'email', 'minLength', 'maxLength', 'pattern']),
    value: z.union([z.string(), z.number()]).optional(),
    message: z.string().min(1),
  })).optional(),
});

// Call to Action validation schema
const CallToActionSchema = z.object({
  text: z.string().min(1).max(50),
  link: z.string().url(),
  style: z.enum(['primary', 'secondary', 'outline']).optional(),
  trackingId: z.string().optional(),
});

// Testimonial validation schema
const TestimonialSchema = z.object({
  id: z.string(),
  clientName: z.string().min(1).max(100),
  clientTitle: z.string().max(100).optional(),
  companyName: z.string().min(1).max(100),
  quote: z.string().min(10).max(500),
  avatar: MediaSchema.optional(),
  companyLogo: MediaSchema.optional(),
});

// Metric validation schema
const MetricSchema = z.object({
  label: z.string().min(1).max(50),
  value: z.string().min(1).max(20),
  improvement: z.string().max(50).optional(),
  timeframe: z.string().max(50).optional(),
});

// Problem Item validation schema
const ProblemItemSchema = z.object({
  headline: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  icon: z.string().optional(),
  impact: z.string().max(200).optional(),
});

// Authority Element validation schema
const AuthorityElementSchema = z.object({
  type: z.enum(['credential', 'experience', 'recognition']),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  visual: MediaSchema.optional(),
});

// Process Step validation schema
const ProcessStepSchema = z.object({
  number: z.number().int().positive().max(10),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  details: z.array(z.string().max(200)).optional(),
  icon: z.string().optional(),
});

// Failure Scenario validation schema
const FailureScenarioSchema = z.object({
  scenario: z.string().min(1).max(200),
  consequences: z.array(z.string().min(1).max(150)).min(1).max(5),
  realWorldExample: z.string().max(300).optional(),
});

// CTA Option validation schema
const CTAOptionSchema = z.object({
  type: z.enum(['resource', 'case-study', 'consultation']),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(200),
  link: z.string().url(),
  buttonText: z.string().max(30).optional(),
});

// Hero Section validation schema
export const HeroSectionSchema = z.object({
  headline: z.string().min(1).max(120),
  subheadline: z.string().min(1).max(200),
  backgroundImage: MediaSchema.optional(),
  ctaButton: CallToActionSchema.optional(),
});

// Problem Section validation schema
export const ProblemSectionSchema = z.object({
  title: z.string().min(1).max(100),
  problems: z.array(ProblemItemSchema).min(1).max(5),
  transitionStatement: z.string().max(300).optional(),
});

// Guide Section validation schema
export const GuideSectionSchema = z.object({
  title: z.string().min(1).max(100),
  empathyStatement: z.string().min(1).max(400),
  authorityElements: z.array(AuthorityElementSchema).min(1).max(6),
  teamHighlight: z.array(z.object({
    id: z.number(),
    name: z.string().min(1).max(100),
    title: z.string().min(1).max(100),
    expertise: z.array(z.string()).optional(),
    image: MediaSchema.optional(),
    bio: z.string().optional(),
  })).max(4),
});

// Plan Section validation schema
export const PlanSectionSchema = z.object({
  title: z.string().min(1).max(100),
  introduction: z.string().min(1).max(400),
  steps: z.array(ProcessStepSchema).min(2).max(5),
  reassurance: z.string().max(300).optional(),
});

// Success Section validation schema
export const SuccessSectionSchema = z.object({
  title: z.string().min(1).max(100),
  caseStudies: z.array(z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string(),
    client: z.string(),
    challenge: z.string(),
    strategy: z.string(),
    execution: z.string(),
    results: z.string(),
    gallery: z.array(MediaSchema),
    featuredImage: MediaSchema.optional(),
  })).min(1).max(6),
  overallImpact: z.string().max(400).optional(),
});

// Stakes Section validation schema
export const StakesSectionSchema = z.object({
  title: z.string().min(1).max(100),
  failureScenarios: z.array(FailureScenarioSchema).min(1).max(4),
  opportunityCost: z.string().max(400).optional(),
  transitionToAction: z.string().max(300).optional(),
});

// CTA Section validation schema
export const CTASectionSchema = z.object({
  primaryCTA: z.object({
    headline: z.string().min(1).max(100),
    description: z.string().min(1).max(300),
    buttonText: z.string().min(1).max(30),
    formFields: z.array(FormFieldSchema).optional(),
  }),
  secondaryCTA: z.object({
    title: z.string().min(1).max(100),
    options: z.array(CTAOptionSchema).min(1).max(4),
  }).optional(),
});

// Main Brand Story Content validation schema
export const BrandStoryContentSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  sections: z.object({
    hero: HeroSectionSchema,
    problem: ProblemSectionSchema,
    guide: GuideSectionSchema,
    plan: PlanSectionSchema,
    success: SuccessSectionSchema,
    stakes: StakesSectionSchema,
    cta: CTASectionSchema,
  }),
  seoMetadata: SEOMetadataSchema,
  publishedAt: z.date(),
  updatedAt: z.date(),
});

// Brand Story Draft validation schema
export const BrandStoryDraftSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  sections: z.object({
    hero: HeroSectionSchema.partial().optional(),
    problem: ProblemSectionSchema.partial().optional(),
    guide: GuideSectionSchema.partial().optional(),
    plan: PlanSectionSchema.partial().optional(),
    success: SuccessSectionSchema.partial().optional(),
    stakes: StakesSectionSchema.partial().optional(),
    cta: CTASectionSchema.partial().optional(),
  }),
  lastModified: z.date(),
  author: z.string().min(1),
  status: z.enum(['draft', 'review', 'approved', 'published']),
});

// Form Submission validation schema
export const BrandStoryFormSubmissionSchema = z.object({
  formId: z.string(),
  sectionId: z.string(),
  data: z.record(z.string(), z.any()),
  timestamp: z.date(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  sessionId: z.string().optional(),
});

// Analytics validation schema
export const BrandStoryAnalyticsSchema = z.object({
  pageViews: z.number().int().nonnegative(),
  uniqueVisitors: z.number().int().nonnegative(),
  averageTimeOnPage: z.number().nonnegative(),
  scrollDepth: z.object({
    '25%': z.number().int().nonnegative(),
    '50%': z.number().int().nonnegative(),
    '75%': z.number().int().nonnegative(),
    '100%': z.number().int().nonnegative(),
  }),
  sectionEngagement: z.record(z.string(), z.object({
    views: z.number().int().nonnegative(),
    timeSpent: z.number().nonnegative(),
    interactions: z.number().int().nonnegative(),
  })),
  conversionMetrics: z.object({
    ctaClicks: z.number().int().nonnegative(),
    formSubmissions: z.number().int().nonnegative(),
    conversionRate: z.number().min(0).max(1),
  }),
});

// Validation helper functions
export const validateBrandStoryContent = (data: unknown) => {
  return BrandStoryContentSchema.safeParse(data);
};

export const validateBrandStoryDraft = (data: unknown) => {
  return BrandStoryDraftSchema.safeParse(data);
};

export const validateFormSubmission = (data: unknown) => {
  return BrandStoryFormSubmissionSchema.safeParse(data);
};

export const validateAnalytics = (data: unknown) => {
  return BrandStoryAnalyticsSchema.safeParse(data);
};

// Content integrity validation
export const validateContentIntegrity = (content: any) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required sections
  const requiredSections = ['hero', 'problem', 'guide', 'plan', 'success', 'stakes', 'cta'];
  requiredSections.forEach(section => {
    if (!content.sections?.[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  });

  // Check hero section completeness
  if (content.sections?.hero) {
    if (!content.sections.hero.headline) {
      errors.push('Hero section missing headline');
    }
    if (!content.sections.hero.subheadline) {
      warnings.push('Hero section missing subheadline for better engagement');
    }
  }

  // Check problem section has sufficient problems
  if (content.sections?.problem?.problems?.length < 2) {
    warnings.push('Consider adding more problem items for better resonance');
  }

  // Check guide section has authority elements
  if (content.sections?.guide?.authorityElements?.length < 2) {
    warnings.push('Add more authority elements to build credibility');
  }

  // Check plan section has appropriate number of steps
  if (content.sections?.plan?.steps?.length < 3) {
    warnings.push('Consider having at least 3 steps in your plan for clarity');
  }

  // Check success section has case studies
  if (content.sections?.success?.caseStudies?.length === 0) {
    errors.push('Success section must include at least one case study');
  }

  // Check CTA section completeness
  if (content.sections?.cta && !content.sections.cta.primaryCTA?.buttonText) {
    errors.push('Primary CTA must have button text');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.map(error => ({ field: 'content', message: error, severity: 'error' as const })),
    warnings: warnings.map(warning => ({ field: 'content', message: warning, suggestion: 'Consider improving this for better engagement' })),
  };
};

// Export validation schemas (removed duplicate export block)