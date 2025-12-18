#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Setting up Brand Story Admin Interface...');

// Check if admin app.tsx exists
const adminAppPath = path.join(__dirname, '../src/admin/app.tsx');
if (fs.existsSync(adminAppPath)) {
  console.log('✅ Admin app configuration found');
} else {
  console.log('❌ Admin app configuration missing');
  process.exit(1);
}

// Check if brand story schema exists
const brandStorySchemaPath = path.join(__dirname, '../src/api/brand-story/content-types/brand-story/schema.json');
if (fs.existsSync(brandStorySchemaPath)) {
  console.log('✅ Brand story content type found');
} else {
  console.log('❌ Brand story content type missing');
  process.exit(1);
}

// Check if all component schemas exist
const componentSchemas = [
  'problem-item.json',
  'authority-element.json',
  'process-step.json',
  'testimonial.json',
  'failure-scenario.json',
  'cta-option.json',
  'metric.json'
];

const componentsPath = path.join(__dirname, '../src/components/brand-story');
let allComponentsExist = true;

componentSchemas.forEach(schema => {
  const schemaPath = path.join(componentsPath, schema);
  if (fs.existsSync(schemaPath)) {
    console.log(`✅ Component schema found: ${schema}`);
  } else {
    console.log(`❌ Component schema missing: ${schema}`);
    allComponentsExist = false;
  }
});

if (!allComponentsExist) {
  console.log('❌ Some component schemas are missing');
  process.exit(1);
}

// Check if admin components exist
const adminComponents = [
  'CharacterLimitField.tsx',
  'BrandStoryPreview.tsx',
  'ContentGuidelines.tsx',
  'BrandStoryEditView.tsx',
  'ContentQualityDashboard.tsx',
  'WorkflowManager.tsx'
];

const adminComponentsPath = path.join(__dirname, '../src/admin/components');
let allAdminComponentsExist = true;

adminComponents.forEach(component => {
  const componentPath = path.join(adminComponentsPath, component);
  if (fs.existsSync(componentPath)) {
    console.log(`✅ Admin component found: ${component}`);
  } else {
    console.log(`❌ Admin component missing: ${component}`);
    allAdminComponentsExist = false;
  }
});

if (!allAdminComponentsExist) {
  console.log('❌ Some admin components are missing');
  process.exit(1);
}

// Check if middleware is registered
const middlewaresPath = path.join(__dirname, '../config/middlewares.ts');
if (fs.existsSync(middlewaresPath)) {
  const middlewaresContent = fs.readFileSync(middlewaresPath, 'utf8');
  if (middlewaresContent.includes('brand-story-workflow')) {
    console.log('✅ Brand story workflow middleware registered');
  } else {
    console.log('❌ Brand story workflow middleware not registered');
    process.exit(1);
  }
} else {
  console.log('❌ Middlewares configuration missing');
  process.exit(1);
}

// Check if content guide exists
const contentGuidePath = path.join(__dirname, '../BRAND_STORY_CONTENT_GUIDE.md');
if (fs.existsSync(contentGuidePath)) {
  console.log('✅ Brand story content guide found');
} else {
  console.log('❌ Brand story content guide missing');
  process.exit(1);
}

console.log('\n🎉 Brand Story Admin Interface setup complete!');
console.log('\nNext steps:');
console.log('1. Start the Strapi development server: npm run develop');
console.log('2. Access the admin panel at http://localhost:1337/admin');
console.log('3. Navigate to Content Manager > Brand Story to begin content management');
console.log('4. Refer to BRAND_STORY_CONTENT_GUIDE.md for detailed usage instructions');

console.log('\nFeatures available:');
console.log('• Character limit validation with visual indicators');
console.log('• Content quality scoring and validation');
console.log('• StoryBrand framework compliance checking');
console.log('• Content preview functionality');
console.log('• Workflow management with approval process');
console.log('• Content guidelines and best practices');
console.log('• SEO optimization helpers');
console.log('• Accessibility compliance checking');

console.log('\n📚 For support, refer to the content guide or contact the development team.');