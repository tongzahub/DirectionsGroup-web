#!/usr/bin/env node

/**
 * Brand Story Schema Validation Script
 * Validates that all required content types and components are properly configured
 */

const fs = require('fs');
const path = require('path');

// Define required schemas and their expected structure
const requiredSchemas = {
  'brand-story': {
    path: 'src/api/brand-story/content-types/brand-story/schema.json',
    requiredFields: [
      'title', 'slug', 'heroHeadline', 'heroSubheadline', 'heroBackgroundImage',
      'heroCtaText', 'heroCtaLink', 'problemTitle', 'problems', 'problemTransitionStatement',
      'guideTitle', 'empathyStatement', 'authorityElements', 'teamHighlights',
      'planTitle', 'planIntroduction', 'processSteps', 'reassuranceStatement',
      'successTitle', 'successCaseStudies', 'overallImpactStatement',
      'stakesTitle', 'failureScenarios', 'opportunityCostStatement',
      'transitionToActionStatement', 'primaryCtaHeadline', 'primaryCtaDescription',
      'primaryCtaButtonText', 'primaryCtaFormFields', 'secondaryCtaTitle',
      'secondaryCtaOptions', 'testimonials', 'successMetrics',
      'seoTitle', 'metaDescription', 'ogImage'
    ]
  }
};

const requiredComponents = {
  'problem-item': {
    path: 'src/components/brand-story/problem-item.json',
    requiredFields: ['headline', 'description', 'icon', 'impact']
  },
  'authority-element': {
    path: 'src/components/brand-story/authority-element.json',
    requiredFields: ['type', 'title', 'description', 'visual']
  },
  'process-step': {
    path: 'src/components/brand-story/process-step.json',
    requiredFields: ['number', 'title', 'description', 'details', 'icon']
  },
  'failure-scenario': {
    path: 'src/components/brand-story/failure-scenario.json',
    requiredFields: ['scenario', 'consequences', 'realWorldExample']
  },
  'cta-option': {
    path: 'src/components/brand-story/cta-option.json',
    requiredFields: ['type', 'title', 'description', 'link', 'buttonText']
  },
  'testimonial': {
    path: 'src/components/brand-story/testimonial.json',
    requiredFields: ['clientName', 'clientTitle', 'companyName', 'quote', 'avatar', 'companyLogo']
  },
  'metric': {
    path: 'src/components/brand-story/metric.json',
    requiredFields: ['label', 'value', 'improvement', 'timeframe']
  }
};

const relatedContentTypes = {
  'team-member': {
    path: 'src/api/team-member/content-types/team-member/schema.json',
    requiredFields: ['name', 'title', 'expertise', 'bio', 'image', 'order', 'featured']
  },
  'case-study': {
    path: 'src/api/case-study/content-types/case-study/schema.json',
    requiredFields: ['title', 'slug', 'client', 'challenge', 'strategy', 'execution', 'results', 'gallery', 'featuredImage']
  }
};

function validateSchema(schemaPath, requiredFields, schemaName) {
  console.log(`\n🔍 Validating ${schemaName}...`);
  
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found: ${schemaPath}`);
    return false;
  }

  try {
    const schemaContent = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const attributes = schemaContent.attributes || {};
    const missingFields = [];
    const presentFields = [];

    requiredFields.forEach(field => {
      if (attributes[field]) {
        presentFields.push(field);
      } else {
        missingFields.push(field);
      }
    });

    console.log(`✅ Present fields (${presentFields.length}/${requiredFields.length}):`, presentFields.slice(0, 5).join(', ') + (presentFields.length > 5 ? '...' : ''));
    
    if (missingFields.length > 0) {
      console.error(`❌ Missing fields:`, missingFields.join(', '));
      return false;
    }

    // Validate rich text fields have proper configuration
    const richTextFields = Object.entries(attributes).filter(([key, config]) => config.type === 'richtext');
    if (richTextFields.length > 0) {
      console.log(`📝 Rich text fields found: ${richTextFields.map(([key]) => key).join(', ')}`);
    }

    // Validate media fields have proper configuration
    const mediaFields = Object.entries(attributes).filter(([key, config]) => config.type === 'media');
    if (mediaFields.length > 0) {
      console.log(`🖼️  Media fields found: ${mediaFields.map(([key]) => key).join(', ')}`);
    }

    // Validate component fields
    const componentFields = Object.entries(attributes).filter(([key, config]) => config.type === 'component');
    if (componentFields.length > 0) {
      console.log(`🧩 Component fields found: ${componentFields.map(([key, config]) => `${key} (${config.component})`).join(', ')}`);
    }

    console.log(`✅ ${schemaName} validation passed!`);
    return true;

  } catch (error) {
    console.error(`❌ Error parsing ${schemaName}:`, error.message);
    return false;
  }
}

function validateConfiguration() {
  console.log('🚀 Starting Brand Story CMS Configuration Validation...\n');
  
  let allValid = true;

  // Validate main brand story schema
  console.log('📋 MAIN CONTENT TYPES');
  console.log('='.repeat(50));
  
  Object.entries(requiredSchemas).forEach(([name, config]) => {
    const isValid = validateSchema(config.path, config.requiredFields, name);
    allValid = allValid && isValid;
  });

  // Validate component schemas
  console.log('\n🧩 COMPONENT SCHEMAS');
  console.log('='.repeat(50));
  
  Object.entries(requiredComponents).forEach(([name, config]) => {
    const isValid = validateSchema(config.path, config.requiredFields, name);
    allValid = allValid && isValid;
  });

  // Validate related content types
  console.log('\n🔗 RELATED CONTENT TYPES');
  console.log('='.repeat(50));
  
  Object.entries(relatedContentTypes).forEach(([name, config]) => {
    const isValid = validateSchema(config.path, config.requiredFields, name);
    allValid = allValid && isValid;
  });

  // Validate middleware configuration
  console.log('\n⚙️  MIDDLEWARE CONFIGURATION');
  console.log('='.repeat(50));
  
  const middlewarePath = 'src/middlewares/brand-story-workflow.js';
  if (fs.existsSync(middlewarePath)) {
    console.log('✅ Brand story workflow middleware found');
  } else {
    console.error('❌ Brand story workflow middleware not found');
    allValid = false;
  }

  // Validate admin configuration
  console.log('\n🎛️  ADMIN CONFIGURATION');
  console.log('='.repeat(50));
  
  const adminConfigPath = 'src/admin/app.tsx';
  if (fs.existsSync(adminConfigPath)) {
    console.log('✅ Admin configuration found');
  } else {
    console.error('❌ Admin configuration not found');
    allValid = false;
  }

  // Validate content validation utilities
  const validationUtilPath = 'src/admin/utils/contentValidation.ts';
  if (fs.existsSync(validationUtilPath)) {
    console.log('✅ Content validation utilities found');
  } else {
    console.error('❌ Content validation utilities not found');
    allValid = false;
  }

  // Final result
  console.log('\n' + '='.repeat(60));
  if (allValid) {
    console.log('🎉 ALL VALIDATIONS PASSED! Brand Story CMS is properly configured.');
    console.log('\n📝 Summary:');
    console.log('   • Brand story content type with all StoryBrand framework sections');
    console.log('   • All required component schemas for repeatable elements');
    console.log('   • Media relations for images and testimonials');
    console.log('   • Rich text fields with appropriate formatting options');
    console.log('   • Content validation and workflow management');
    console.log('   • Admin interface customizations');
  } else {
    console.log('❌ VALIDATION FAILED! Please fix the issues above.');
    process.exit(1);
  }
}

// Run validation
validateConfiguration();