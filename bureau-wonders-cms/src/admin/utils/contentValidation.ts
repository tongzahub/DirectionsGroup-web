interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

interface BrandStoryContent {
  heroHeadline?: string;
  heroSubheadline?: string;
  heroCtaText?: string;
  problemTitle?: string;
  problems?: Array<{ headline: string; description: string }>;
  guideTitle?: string;
  empathyStatement?: string;
  planTitle?: string;
  planIntroduction?: string;
  processSteps?: Array<{ title: string; description: string }>;
  successTitle?: string;
  stakesTitle?: string;
  primaryCtaHeadline?: string;
  primaryCtaDescription?: string;
  primaryCtaButtonText?: string;
  seoTitle?: string;
  metaDescription?: string;
}

export const validateBrandStoryContent = (content: BrandStoryContent): ValidationResult => {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Required field validation
  if (!content.heroHeadline) {
    errors.push('Hero headline is required');
  }
  if (!content.heroSubheadline) {
    errors.push('Hero subheadline is required');
  }
  if (!content.problemTitle) {
    errors.push('Problem section title is required');
  }
  if (!content.guideTitle) {
    errors.push('Guide section title is required');
  }
  if (!content.planTitle) {
    errors.push('Plan section title is required');
  }
  if (!content.primaryCtaHeadline) {
    errors.push('Primary CTA headline is required');
  }

  // Character limit warnings
  if (content.heroCtaText && content.heroCtaText.length > 25) {
    warnings.push('Hero CTA text should be under 25 characters for better mobile display');
  }
  if (content.primaryCtaButtonText && content.primaryCtaButtonText.length > 25) {
    warnings.push('Primary CTA button text should be under 25 characters');
  }

  // SEO validation
  if (!content.seoTitle) {
    warnings.push('SEO title is recommended for better search visibility');
  } else if (content.seoTitle.length > 60) {
    warnings.push('SEO title should be under 60 characters');
  }
  
  if (!content.metaDescription) {
    warnings.push('Meta description is recommended for better search visibility');
  } else if (content.metaDescription.length > 160) {
    warnings.push('Meta description should be under 160 characters');
  }

  // Content structure validation
  if (!content.problems || content.problems.length === 0) {
    warnings.push('At least one problem statement is recommended');
  }
  if (content.problems && content.problems.length > 5) {
    warnings.push('Consider limiting problems to 3-5 items for better user experience');
  }

  if (!content.processSteps || content.processSteps.length === 0) {
    warnings.push('Process steps are recommended to show clear methodology');
  }
  if (content.processSteps && content.processSteps.length > 4) {
    warnings.push('Consider limiting process steps to 3-4 items to reduce complexity');
  }

  // StoryBrand framework validation
  if (!content.empathyStatement) {
    warnings.push('Empathy statement helps establish guide credibility');
  }
  if (!content.planIntroduction) {
    warnings.push('Plan introduction helps set context for methodology');
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

export const getContentQualityScore = (content: BrandStoryContent): number => {
  const validation = validateBrandStoryContent(content);
  const totalChecks = 15; // Total number of quality checks
  const passedChecks = totalChecks - validation.errors.length - validation.warnings.length;
  return Math.round((passedChecks / totalChecks) * 100);
};

export const getContentCompletionPercentage = (content: BrandStoryContent): number => {
  const requiredFields = [
    'heroHeadline',
    'heroSubheadline',
    'problemTitle',
    'guideTitle',
    'planTitle',
    'primaryCtaHeadline',
  ];
  
  const optionalFields = [
    'heroCtaText',
    'empathyStatement',
    'planIntroduction',
    'primaryCtaDescription',
    'seoTitle',
    'metaDescription',
  ];

  const completedRequired = requiredFields.filter(field => 
    content[field as keyof BrandStoryContent]
  ).length;
  
  const completedOptional = optionalFields.filter(field => 
    content[field as keyof BrandStoryContent]
  ).length;

  const totalFields = requiredFields.length + optionalFields.length;
  const completedFields = completedRequired + completedOptional;
  
  return Math.round((completedFields / totalFields) * 100);
};