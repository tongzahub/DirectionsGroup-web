/**
 * Seed script to populate initial data
 * Run with: npm run strapi -- scripts/seed-data.js
 */

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
989 Siam Piwat Tower 19th Floor Unit B2/1  
Rama 1 Road, Pathumwan  
Bangkok 10330, Thailand

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

const siteSettings = {
  siteName: 'The Bureau of Wonders Company Limited',
  contactEmail: 'hello@bureauofwonders.com',
  contactPhone: '+1 (555) 123-4567',
  officeAddress: '989 Siam Piwat Tower 19th Floor Unit B2/1 Rama 1 Road, Pathumwan, Bangkok 10330, Thailand',
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com/bureauofwonders' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/bureauofwonders' },
    { platform: 'Twitter', url: 'https://twitter.com/bureauofwonders' },
  ],
  homepageIntro: 'We are The Bureau of Wonders, a luxury brand communications agency crafting extraordinary experiences for the world\'s most prestigious brands.',
  cultureStatement: 'At The Bureau of Wonders, we believe in the power of storytelling, the magic of creativity, and the importance of building lasting relationships with our clients and their audiences.',
  values: ['Excellence', 'Innovation', 'Integrity', 'Collaboration', 'Creativity'],
};

async function seed() {
  const strapi = require('@strapi/strapi')();
  await strapi.load();

  console.log('Starting data seed...');

  try {
    // Seed Site Settings
    console.log('\nChecking Site Settings...');
    const existingSiteSettings = await strapi.entityService.findMany(
      'api::site-setting.site-setting'
    );

    if (!existingSiteSettings) {
      await strapi.entityService.create('api::site-setting.site-setting', {
        data: siteSettings,
      });
      console.log('✓ Site Settings created');
    } else {
      console.log('✓ Site Settings already exist');
    }

    // Seed Pages
    console.log('\nSeeding Pages...');
    for (const page of pages) {
      const existing = await strapi.entityService.findMany('api::page.page', {
        filters: { slug: page.slug },
      });

      if (!existing || existing.length === 0) {
        await strapi.entityService.create('api::page.page', {
          data: page,
        });
        console.log(`✓ Created page: ${page.title}`);
      } else {
        console.log(`- Page already exists: ${page.title}`);
      }
    }

    console.log('\n✓ Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await strapi.destroy();
    process.exit(0);
  }
}

seed();
