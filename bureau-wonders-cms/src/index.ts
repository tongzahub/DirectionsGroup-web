import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Set up public role permissions
    await setupPublicPermissions(strapi);
    
    // Seed initial data
    await seedInitialData(strapi);
  },
};

/**
 * Configure public role permissions for API access
 */
async function setupPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    console.warn('Public role not found');
    return;
  }

  // Define permissions to enable for public access
  const permissionsToEnable = [
    // Page content type
    { controller: 'page', action: 'find' },
    { controller: 'page', action: 'findOne' },
    
    // Blog Post content type
    { controller: 'blog-post', action: 'find' },
    { controller: 'blog-post', action: 'findOne' },
    
    // Case Study content type
    { controller: 'case-study', action: 'find' },
    { controller: 'case-study', action: 'findOne' },
    
    // Job Listing content type
    { controller: 'job-listing', action: 'find' },
    { controller: 'job-listing', action: 'findOne' },
    
    // Site Settings (single type)
    { controller: 'site-setting', action: 'find' },
    
    // Contact Inquiry - allow creation
    { controller: 'contact-inquiry', action: 'create' },
  ];

  // Get all existing permissions for the public role
  const allPermissions = await strapi
    .query('plugin::users-permissions.permission')
    .findMany({
      where: {
        role: publicRole.id,
      },
    });

  // Update permissions
  for (const permission of permissionsToEnable) {
    const existingPermission = allPermissions.find(
      (p: any) =>
        p.action === `api::${permission.controller}.${permission.controller}.${permission.action}`
    );

    if (existingPermission && !existingPermission.enabled) {
      await strapi.query('plugin::users-permissions.permission').update({
        where: { id: existingPermission.id },
        data: { enabled: true },
      });
      console.log(`✓ Enabled public permission: ${permission.controller}.${permission.action}`);
    }
  }

  console.log('Public role permissions configured successfully');
}

/**
 * Seed initial data for pages and site settings
 */
async function seedInitialData(strapi: Core.Strapi) {
  // Check if data already exists
  const existingPages = await strapi.entityService.findMany('api::page.page', {
    limit: 1,
  });

  if (existingPages && existingPages.length > 0) {
    console.log('Data already seeded, skipping...');
    return;
  }

  console.log('Seeding initial data...');

  // Seed Site Settings
  const existingSiteSettings = await strapi.entityService.findMany(
    'api::site-setting.site-setting'
  );

  if (!existingSiteSettings) {
    await strapi.entityService.create('api::site-setting.site-setting', {
      data: {
        siteName: 'The Bureau of Wonders',
        contactEmail: 'hello@bureauofwonders.com',
        contactPhone: '+1 (555) 123-4567',
        officeAddress: '123 Luxury Lane, New York, NY 10001',
        socialLinks: [
          { platform: 'Instagram', url: 'https://instagram.com/bureauofwonders' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/company/bureauofwonders' },
          { platform: 'Twitter', url: 'https://twitter.com/bureauofwonders' },
        ],
        homepageIntro: 'We are The Bureau of Wonders, a luxury brand communications agency crafting extraordinary experiences for the world\'s most prestigious brands.',
        cultureStatement: 'At The Bureau of Wonders, we believe in the power of storytelling, the magic of creativity, and the importance of building lasting relationships with our clients and their audiences.',
        values: ['Excellence', 'Innovation', 'Integrity', 'Collaboration', 'Creativity'],
      },
    });
    console.log('✓ Site Settings created');
  }

  // Seed Pages
  const pages = [
    {
      title: 'Home',
      slug: 'home',
      content: `# Welcome to The Bureau of Wonders

We are a luxury brand communications and PR agency specializing in creating extraordinary experiences for the world's most prestigious brands.

## Our Expertise

With decades of combined experience in luxury brand communications, we understand the nuances of high-end marketing and the expectations of discerning clientele.

## Industries We Serve

- Jewelry & Watches
- Fashion & Leather Goods
- Real Estate
- Finance & Banking
- Hospitality
- Art & Design
- Insurance`,
      seoTitle: 'The Bureau of Wonders - Luxury Brand Communications',
      metaDescription: 'Premier luxury brand communications and PR agency specializing in jewelry, fashion, real estate, and high-end lifestyle brands.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'About',
      slug: 'about',
      content: `# About The Bureau of Wonders

## Our Story

Founded with a passion for luxury and a commitment to excellence, The Bureau of Wonders has become a trusted partner for the world's most prestigious brands.

## Our Philosophy

We believe that luxury is not just about products—it's about creating experiences, telling stories, and building emotional connections that last a lifetime.

## Our Team

Our team consists of seasoned professionals with backgrounds in luxury brand management, public relations, event production, and digital marketing.

## Our Values

- **Excellence**: We strive for perfection in everything we do
- **Innovation**: We push boundaries and embrace new ideas
- **Integrity**: We build trust through transparency and honesty
- **Collaboration**: We work as partners with our clients
- **Creativity**: We bring imagination to every project`,
      seoTitle: 'About Us - The Bureau of Wonders',
      metaDescription: 'Learn about The Bureau of Wonders, our story, philosophy, team, and commitment to luxury brand communications excellence.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Services',
      slug: 'services',
      content: `# Our Services

## Communications & PR

Strategic communications planning, media relations, press releases, and brand positioning for luxury markets.

### What We Offer:
- Media Strategy & Planning
- Press Release Writing & Distribution
- Media Relations & Outreach
- Crisis Communications
- Brand Positioning

## Experiences & Events

Unforgettable events and experiences that showcase your brand's unique story and values.

### Event Services:
- Product Launches
- Brand Activations
- VIP Experiences
- Trade Shows & Exhibitions
- Private Events

## CRM & Digital Marketing

Building and nurturing relationships with your most valuable customers through personalized communications.

### Digital Services:
- Email Marketing Campaigns
- Social Media Strategy
- Content Creation
- Influencer Partnerships
- Digital Analytics

## Industries We Serve

We specialize in luxury sectors including jewelry, watches, fashion, leather goods, real estate, finance, hospitality, art, design, and insurance.`,
      seoTitle: 'Services - Luxury Brand Communications & PR',
      metaDescription: 'Comprehensive luxury brand services including communications, PR, event experiences, and CRM for high-end brands.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Blog',
      slug: 'blog',
      content: `# Insights & News

Stay updated with the latest trends, insights, and news from the world of luxury brand communications.

Explore our articles on industry trends, case studies, and thought leadership pieces that showcase our expertise and perspective on the luxury market.`,
      seoTitle: 'Blog - Luxury Brand Insights & News',
      metaDescription: 'Read the latest insights, trends, and news about luxury brand communications, PR, and marketing from The Bureau of Wonders.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Case Studies',
      slug: 'case-studies',
      content: `# Case Studies

Discover how we've helped luxury brands achieve their goals through strategic communications, memorable events, and innovative marketing campaigns.

Each case study showcases our approach to solving unique challenges and delivering exceptional results for our clients.`,
      seoTitle: 'Case Studies - Our Work in Luxury Brand Communications',
      metaDescription: 'Explore our portfolio of successful luxury brand campaigns, events, and communications strategies.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Careers',
      slug: 'careers',
      content: `# Join Our Team

## Why Work With Us?

At The Bureau of Wonders, we're always looking for talented individuals who share our passion for luxury brands and exceptional client service.

## Our Culture

We foster a collaborative, creative environment where innovation thrives and every team member's contribution is valued.

## What We Offer

- Competitive compensation
- Professional development opportunities
- Work with prestigious luxury brands
- Creative and collaborative environment
- Flexible work arrangements

## Current Openings

Browse our current job listings below and find your next career opportunity.`,
      seoTitle: 'Careers - Join The Bureau of Wonders',
      metaDescription: 'Explore career opportunities at The Bureau of Wonders. Join our team of luxury brand communications professionals.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Contact',
      slug: 'contact',
      content: `# Get In Touch

We'd love to hear from you. Whether you're interested in our services, have a question, or want to explore a partnership, our team is here to help.

## Contact Information

**Email:** hello@bureauofwonders.com  
**Phone:** +1 (555) 123-4567

**Office Address:**  
123 Luxury Lane  
New York, NY 10001

## Office Hours

Monday - Friday: 9:00 AM - 6:00 PM EST  
Saturday - Sunday: Closed

## Send Us a Message

Fill out the form below and we'll get back to you within 24 hours.`,
      seoTitle: 'Contact Us - The Bureau of Wonders',
      metaDescription: 'Get in touch with The Bureau of Wonders. Contact our luxury brand communications team for inquiries and consultations.',
      publishedAt: new Date().toISOString(),
    },
  ];

  for (const page of pages) {
    await strapi.entityService.create('api::page.page', {
      data: page,
    });
    console.log(`✓ Page created: ${page.title}`);
  }

  console.log('✓ Initial data seeded successfully');
}
