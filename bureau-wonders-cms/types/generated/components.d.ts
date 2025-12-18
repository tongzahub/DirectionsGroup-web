import type { Schema, Struct } from '@strapi/strapi';

export interface BrandStoryAuthorityElement extends Struct.ComponentSchema {
  collectionName: 'components_brand_story_authority_elements';
  info: {
    description: 'Credentials, experience, or recognition items';
    displayName: 'Authority Element';
  };
  attributes: {
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    type: Schema.Attribute.Enumeration<
      ['credential', 'experience', 'recognition']
    > &
      Schema.Attribute.Required;
    visual: Schema.Attribute.Media<'images'>;
  };
}

export interface BrandStoryCtaOption extends Struct.ComponentSchema {
  collectionName: 'components_brand_story_cta_options';
  info: {
    description: 'Secondary call-to-action options';
    displayName: 'CTA Option';
  };
  attributes: {
    buttonText: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 30;
      }>;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    type: Schema.Attribute.Enumeration<
      ['resource', 'case-study', 'consultation']
    > &
      Schema.Attribute.Required;
  };
}

export interface BrandStoryFailureScenario extends Struct.ComponentSchema {
  collectionName: 'components_brand_story_failure_scenarios';
  info: {
    description: 'Consequences of inaction or poor decisions';
    displayName: 'Failure Scenario';
  };
  attributes: {
    consequences: Schema.Attribute.JSON & Schema.Attribute.Required;
    realWorldExample: Schema.Attribute.RichText;
    scenario: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 150;
      }>;
  };
}

export interface BrandStoryMetric extends Struct.ComponentSchema {
  collectionName: 'components_brand_story_metrics';
  info: {
    description: 'Success metrics and outcomes';
    displayName: 'Metric';
  };
  attributes: {
    improvement: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    timeframe: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 30;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 30;
      }>;
  };
}

export interface BrandStoryProblemItem extends Struct.ComponentSchema {
  collectionName: 'components_brand_story_problem_items';
  info: {
    description: 'Individual problem statement with icon and impact';
    displayName: 'Problem Item';
  };
  attributes: {
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    headline: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    icon: Schema.Attribute.Media<'images'>;
    impact: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface BrandStoryProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_brand_story_process_steps';
  info: {
    description: 'Individual step in the methodology plan';
    displayName: 'Process Step';
  };
  attributes: {
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    details: Schema.Attribute.JSON;
    icon: Schema.Attribute.Media<'images'>;
    number: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface BrandStoryTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_brand_story_testimonials';
  info: {
    description: 'Client testimonial with attribution';
    displayName: 'Testimonial';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    clientName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    clientTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    companyLogo: Schema.Attribute.Media<'images'>;
    companyName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    quote: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface SiteSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_site_social_links';
  info: {
    description: 'Social media platform and URL';
    displayName: 'Social Link';
  };
  attributes: {
    platform: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'brand-story.authority-element': BrandStoryAuthorityElement;
      'brand-story.cta-option': BrandStoryCtaOption;
      'brand-story.failure-scenario': BrandStoryFailureScenario;
      'brand-story.metric': BrandStoryMetric;
      'brand-story.problem-item': BrandStoryProblemItem;
      'brand-story.process-step': BrandStoryProcessStep;
      'brand-story.testimonial': BrandStoryTestimonial;
      'site.social-link': SiteSocialLink;
    }
  }
}
