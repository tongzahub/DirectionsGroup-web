module.exports = {
  // Brand Story specific admin configurations
  brandStory: {
    // Character limits for different field types
    characterLimits: {
      headline: 80,
      subheadline: 150,
      title: 100,
      buttonText: 30,
      shortDescription: 200,
      seoTitle: 60,
      metaDescription: 160,
    },
    
    // Content quality thresholds
    qualityThresholds: {
      excellent: 80,
      good: 60,
      needsWork: 40,
    },
    
    // Workflow stages configuration
    workflowStages: [
      {
        id: 'draft',
        name: 'Content Creation',
        description: 'Initial content creation and editing',
        permissions: ['content-creator', 'content-manager', 'admin'],
        nextStages: ['content_review'],
      },
      {
        id: 'content_review',
        name: 'Content Review',
        description: 'Editorial review for quality and guidelines',
        permissions: ['content-manager', 'admin'],
        nextStages: ['brand_review', 'draft'],
        assignee: 'Content Team',
      },
      {
        id: 'brand_review',
        name: 'Brand Guidelines Review',
        description: 'Brand guidelines and messaging alignment',
        permissions: ['brand-manager', 'admin'],
        nextStages: ['final_approval', 'content_review'],
        assignee: 'Brand Manager',
      },
      {
        id: 'final_approval',
        name: 'Final Approval',
        description: 'Marketing director sign-off',
        permissions: ['marketing-director', 'admin'],
        nextStages: ['published', 'brand_review'],
        assignee: 'Marketing Director',
      },
      {
        id: 'published',
        name: 'Published',
        description: 'Live content available to users',
        permissions: ['admin'],
        nextStages: [],
      },
    ],
    
    // StoryBrand framework validation rules
    storyBrandValidation: {
      requiredSections: [
        'heroHeadline',
        'heroSubheadline',
        'problemTitle',
        'guideTitle',
        'planTitle',
        'primaryCtaHeadline',
      ],
      recommendedSections: [
        'empathyStatement',
        'planIntroduction',
        'primaryCtaDescription',
        'seoTitle',
        'metaDescription',
      ],
      componentMinimums: {
        problems: 1,
        processSteps: 1,
        authorityElements: 1,
      },
      componentMaximums: {
        problems: 5,
        processSteps: 4,
        authorityElements: 6,
      },
    },
    
    // Content guidelines configuration
    guidelines: {
      hero: {
        headline: {
          focus: 'Address target audience directly',
          tone: 'Aspirational, benefit-focused',
          examples: ['Luxury Brands Deserve Extraordinary Stories'],
        },
        subheadline: {
          focus: 'Hint at transformation possible',
          tone: 'Emotional, resonant',
          examples: ['Transform your brand narrative into market leadership'],
        },
      },
      problem: {
        structure: 'External → Internal → Philosophical problems',
        tone: 'Empathetic, not accusatory',
        limit: '3-5 problems for optimal experience',
      },
      guide: {
        empathy: 'Show understanding with "we understand" language',
        authority: 'Demonstrate competence through specific examples',
        positioning: 'Helpful guide, not the hero',
      },
      plan: {
        complexity: '3-4 steps maximum to reduce anxiety',
        clarity: 'Each step easily understood and actionable',
        reassurance: 'Include anxiety-reducing statements',
      },
      success: {
        focus: 'Client transformation, not your process',
        metrics: 'Include specific, measurable results',
        relatability: 'Choose relevant case studies',
      },
      stakes: {
        approach: 'Opportunity cost, not fear tactics',
        tone: 'Professional, luxury-appropriate',
        urgency: 'Subtle without pressure',
      },
      cta: {
        options: 'Multiple engagement levels',
        trust: 'Include guarantees and risk reduction',
        clarity: 'Crystal clear next steps',
      },
    },
    
    // Preview configuration
    preview: {
      sections: [
        'hero',
        'problem',
        'guide',
        'plan',
        'success',
        'stakes',
        'cta',
      ],
      mobileBreakpoint: 768,
      tabletBreakpoint: 1024,
    },
    
    // Analytics and tracking
    analytics: {
      trackContentChanges: true,
      trackWorkflowActions: true,
      trackQualityScores: true,
      trackPublishingMetrics: true,
    },
  },
  
  // General admin interface customizations
  interface: {
    theme: {
      primaryColor: '#D4AF37',
      secondaryColor: '#1B2951',
      accentColor: '#FEFEFE',
    },
    branding: {
      title: 'Bureau of Wonders CMS',
      subtitle: 'Brand Story Management',
      logo: '/favicon.png',
    },
    features: {
      tutorials: false,
      notifications: {
        releases: false,
      },
    },
  },
};