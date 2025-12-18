import { Media, RichText, CaseStudy, TeamMember } from './index';

// Core Brand Story Section Interfaces

export interface HeroSection {
  headline: string;
  subheadline: string;
  backgroundImage?: Media;
  ctaButton?: CallToAction;
}

export interface ProblemSection {
  title: string;
  problems: ProblemItem[];
  transitionStatement?: string;
}

export interface ProblemItem {
  headline: string;
  description: string;
  icon?: string;
  impact?: string;
}

export interface GuideSection {
  title: string;
  empathyStatement: string;
  authorityElements: AuthorityElement[];
  teamHighlight: TeamMember[];
}

export interface AuthorityElement {
  type: 'credential' | 'experience' | 'recognition';
  title: string;
  description: string;
  visual?: Media;
}

export interface PlanSection {
  title: string;
  introduction: string;
  steps: ProcessStep[];
  reassurance?: string;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  details?: string[];
  icon?: string;
}

export interface SuccessSection {
  title: string;
  caseStudies: CaseStudy[];
  overallImpact?: string;
}

export interface StakesSection {
  title: string;
  failureScenarios: FailureScenario[];
  opportunityCost?: string;
  transitionToAction?: string;
}

export interface FailureScenario {
  scenario: string;
  consequences: string[];
  realWorldExample?: string;
}

export interface CTASection {
  primaryCTA: PrimaryCTA;
  secondaryCTA?: SecondaryCTA;
}

export interface PrimaryCTA {
  headline: string;
  description: string;
  buttonText: string;
  formFields?: FormField[];
}

export interface SecondaryCTA {
  title: string;
  options: CTAOption[];
}

export interface CTAOption {
  type: 'resource' | 'case-study' | 'consultation';
  title: string;
  description: string;
  link: string;
  buttonText?: string;
}

// Supporting Types

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string;
  companyName: string;
  quote: string;
  avatar?: Media;
  companyLogo?: Media;
}

export interface Metric {
  label: string;
  value: string;
  improvement?: string;
  timeframe?: string;
}

export interface CallToAction {
  text: string;
  link: string;
  style?: 'primary' | 'secondary' | 'outline';
  trackingId?: string;
}

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: string | number;
  message: string;
}

// Main Brand Story Content Model

export interface BrandStoryContent {
  id: string;
  title: string;
  slug: string;
  sections: {
    hero: HeroSection;
    problem: ProblemSection;
    guide: GuideSection;
    plan: PlanSection;
    success: SuccessSection;
    stakes: StakesSection;
    cta: CTASection;
  };
  seoMetadata: SEOMetadata;
  publishedAt: Date;
  updatedAt: Date;
}

export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: Media;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
}

// API Response Types

export interface BrandStoryAPIResponse {
  data: BrandStoryContent;
  meta?: {
    lastModified: string;
    version: number;
  };
}

export interface BrandStoryListResponse {
  data: BrandStoryContent[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Analytics and Performance Types

export interface BrandStoryAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  scrollDepth: {
    '25%': number;
    '50%': number;
    '75%': number;
    '100%': number;
  };
  sectionEngagement: {
    [sectionName: string]: {
      views: number;
      timeSpent: number;
      interactions: number;
    };
  };
  conversionMetrics: {
    ctaClicks: number;
    formSubmissions: number;
    conversionRate: number;
  };
}

export interface BrandStoryPerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

// Content Management Types

export interface BrandStoryDraft {
  id: string;
  title: string;
  sections: Partial<BrandStoryContent['sections']>;
  lastModified: Date;
  author: string;
  status: 'draft' | 'review' | 'approved' | 'published';
}

export interface ContentValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Form and Interaction Types

export interface BrandStoryFormSubmission {
  formId: string;
  sectionId: string;
  data: Record<string, any>;
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
  sessionId?: string;
}

export interface BrandStoryInteraction {
  type: 'scroll' | 'click' | 'hover' | 'focus' | 'form_submit';
  element: string;
  sectionId: string;
  timestamp: Date;
  value?: string | number;
  metadata?: Record<string, any>;
}

// Export all types for easy importing (removed duplicate export block)