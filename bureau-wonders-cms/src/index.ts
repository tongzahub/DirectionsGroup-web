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
    
    // Seed about sections
    await seedAboutSections(strapi);
    
    // Seed blog posts
    await seedBlogPosts(strapi);
    
    // Seed services
    await seedServices(strapi);
    
    // Seed industries
    await seedIndustries(strapi);
    
    // Seed job listings
    await seedJobListings(strapi);
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
    
    // About Section content type
    { controller: 'about-section', action: 'find' },
    { controller: 'about-section', action: 'findOne' },
    
    // Blog Post content type
    { controller: 'blog-post', action: 'find' },
    { controller: 'blog-post', action: 'findOne' },
    
    // Case Study content type
    { controller: 'case-study', action: 'find' },
    { controller: 'case-study', action: 'findOne' },
    
    // Job Listing content type
    { controller: 'job-listing', action: 'find' },
    { controller: 'job-listing', action: 'findOne' },
    
    // Service content type
    { controller: 'service', action: 'find' },
    { controller: 'service', action: 'findOne' },
    
    // Industry content type
    { controller: 'industry', action: 'find' },
    { controller: 'industry', action: 'findOne' },
    
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

  for (const page of pages) {
    await strapi.entityService.create('api::page.page', {
      data: page,
    });
    console.log(`✓ Page created: ${page.title}`);
  }

  console.log('✓ Initial data seeded successfully');
}

/**
 * Seed About Sections data
 */
async function seedAboutSections(strapi: Core.Strapi) {
  // Check if about sections already exist
  const existingSections = await strapi.entityService.findMany('api::about-section.about-section', {
    limit: 1,
  });

  if (existingSections && existingSections.length > 0) {
    console.log('About sections already seeded, skipping...');
    return;
  }

  console.log('Seeding About Sections...');

  const sections = [
    {
      title: 'Brand Story',
      slug: 'brand-story',
      order: 1,
      content: `# Our Brand Story

The Bureau of Wonders was born from a simple yet powerful belief: that luxury brands deserve communications partners who truly understand the art of storytelling and the science of building desire.

Founded in the heart of New York, our journey began when a group of seasoned luxury brand professionals came together with a shared vision. We had worked with some of the world's most prestigious brands and witnessed firsthand the transformative power of authentic, strategic communications.

## The Beginning

Our founders brought together decades of experience from luxury houses, leading PR agencies, and high-end event production companies. What united us was a passion for excellence and a deep appreciation for the craftsmanship, heritage, and artistry that define luxury brands.

## Our Evolution

Over the years, we've grown from a boutique consultancy to a full-service luxury communications agency. Yet, we've never lost sight of what makes us special: our intimate understanding of luxury, our commitment to personalized service, and our ability to create moments of wonder that captivate audiences.

## Today

Today, The Bureau of Wonders stands as a trusted partner to luxury brands across multiple sectors. We've orchestrated unforgettable product launches, crafted compelling brand narratives, and built lasting relationships between brands and their most valued customers.

Every project we undertake is infused with the same dedication to excellence that our clients bring to their own creations. Because we believe that in the world of luxury, nothing less than extraordinary will do.`,
      seoTitle: 'Our Brand Story - The Bureau of Wonders',
      metaDescription: 'Discover the story behind The Bureau of Wonders, from our founding vision to becoming a trusted luxury brand communications partner.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Brand Philosophy',
      slug: 'brand-philosophy',
      order: 2,
      content: `# Our Brand Philosophy

## The Art of Wonder

At The Bureau of Wonders, we believe that luxury is not just about products—it's about creating moments of wonder, surprise, and delight. Every touchpoint, every communication, every experience should evoke emotion and build desire.

## Authenticity Above All

In an age of digital noise and fleeting trends, we champion authenticity. We help luxury brands tell their true stories—stories rooted in heritage, craftsmanship, and genuine value. Because today's discerning consumers can sense authenticity, and they reward it with their loyalty.

## The Power of Relationships

Luxury is personal. It's about relationships built on trust, understanding, and shared values. We don't just create campaigns; we build bridges between brands and the people who will cherish them for a lifetime.

## Excellence in Every Detail

Just as luxury brands obsess over every stitch, every finish, every detail, we bring the same meticulous attention to our work. From the first strategic conversation to the final execution, excellence is our standard.

## Innovation Meets Tradition

We honor the traditions and heritage that make luxury brands special, while embracing innovation in how we communicate their stories. We blend time-tested PR principles with cutting-edge digital strategies to create campaigns that resonate across generations.

## Sustainability and Responsibility

We believe that true luxury is sustainable luxury. We encourage and support our clients in communicating their commitments to environmental and social responsibility, because the future of luxury depends on it.

## Creating Legacy

Every brand we work with is building a legacy. Our role is to ensure that legacy is communicated with clarity, celebrated with creativity, and preserved with care. We're not just in the business of marketing—we're in the business of building enduring brand value.`,
      seoTitle: 'Our Brand Philosophy - The Bureau of Wonders',
      metaDescription: 'Explore the core philosophy that guides our approach to luxury brand communications: authenticity, excellence, and the art of creating wonder.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Who We Are',
      slug: 'who-we-are',
      order: 3,
      content: `# Who We Are

## A Team of Luxury Specialists

The Bureau of Wonders is home to a diverse team of communications professionals, each bringing unique expertise and a shared passion for luxury brands.

## Our Expertise

### Strategic Communications
Our strategists have worked with luxury brands across multiple sectors, from haute horlogerie to high jewelry, from luxury real estate to premium hospitality. They understand the nuances of luxury marketing and the expectations of high-net-worth individuals.

### Creative Excellence
Our creative team includes award-winning copywriters, art directors, and content creators who know how to craft messages that resonate with sophisticated audiences. They've created campaigns for some of the world's most prestigious brands.

### Media Relations
Our PR professionals have deep relationships with top-tier media outlets, luxury lifestyle publications, and influential journalists. They know how to secure the coverage that matters most to luxury brands.

### Event Production
Our event specialists have orchestrated everything from intimate VIP dinners to large-scale brand activations. They understand that in luxury, every detail matters.

### Digital Innovation
Our digital team stays ahead of trends in social media, influencer marketing, and digital storytelling. They know how to leverage technology while maintaining the exclusivity and prestige that luxury brands require.

## Our Culture

We foster a culture of collaboration, creativity, and continuous learning. Our team members are encouraged to bring fresh ideas, challenge conventions, and push boundaries—all while maintaining the highest standards of professionalism and client service.

## Our Commitment

We're committed to being more than just an agency—we're partners in our clients' success. We invest time in understanding each brand's unique story, challenges, and aspirations. And we bring that understanding to every project we undertake.`,
      seoTitle: 'Who We Are - Meet The Bureau of Wonders Team',
      metaDescription: 'Meet the team behind The Bureau of Wonders: luxury communications specialists, creative experts, and strategic thinkers dedicated to your brand\'s success.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Leadership Introduction',
      slug: 'leadership-introduction',
      order: 4,
      content: `# Our Leadership

## Guiding The Bureau of Wonders

Our leadership team brings together decades of experience in luxury brand management, communications, and strategic consulting. They've worked with iconic brands, launched groundbreaking campaigns, and built lasting relationships in the luxury industry.

## Sophia Chen - Founder & CEO

**"Luxury is about creating desire through authenticity and artistry."**

With over 20 years of experience in luxury brand communications, Sophia founded The Bureau of Wonders with a vision to create an agency that truly understands the luxury mindset. Prior to founding the agency, she led communications for several prestigious jewelry and watch brands, and served as VP of Marketing for a leading luxury hospitality group.

Sophia holds an MBA from Columbia Business School and a degree in Art History from Yale University. She's a frequent speaker at luxury industry conferences and has been featured in publications including Vogue Business, Luxury Daily, and The Business of Fashion.

## Marcus Beaumont - Chief Strategy Officer

**"Strategy without creativity is just planning. Creativity without strategy is just art. We bring both."**

Marcus brings 18 years of strategic consulting experience to The Bureau of Wonders. He's developed brand strategies for luxury fashion houses, high-end real estate developers, and premium automotive brands. His analytical approach combined with creative thinking has helped numerous brands navigate market challenges and seize new opportunities.

Before joining The Bureau of Wonders, Marcus was a Partner at a leading brand strategy consultancy. He holds degrees from Oxford University and INSEAD.

## Isabella Rodriguez - Creative Director

**"Every brand has a story worth telling. Our job is to tell it beautifully."**

Isabella's creative vision has shaped campaigns for some of the world's most recognizable luxury brands. With a background in fashion journalism and brand creative direction, she brings a unique perspective that blends editorial sophistication with commercial effectiveness.

Her work has won numerous industry awards, including Cannes Lions and Clio Awards. Isabella previously served as Creative Director for a prestigious fashion house and as Features Editor for a leading luxury lifestyle magazine.

## James Wellington - Managing Director, Client Services

**"Our clients' success is our success. It's that simple."**

James ensures that every client receives exceptional service and strategic guidance. With 15 years of experience in luxury brand management and client relations, he's known for his ability to build strong partnerships and deliver results that exceed expectations.

Prior to joining The Bureau of Wonders, James held senior positions at leading luxury PR agencies and worked directly for several high-end brands. He's a graduate of the London School of Economics.`,
      seoTitle: 'Leadership Team - The Bureau of Wonders',
      metaDescription: 'Meet the leadership team at The Bureau of Wonders: experienced luxury brand professionals guiding our strategic vision and creative excellence.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Our Values',
      slug: 'our-values',
      order: 5,
      content: `# Our Values

These core values guide everything we do at The Bureau of Wonders. They shape how we work with clients, how we collaborate as a team, and how we approach every project.

## Excellence

**We strive for perfection in everything we do.**

Excellence isn't just a goal—it's our standard. From strategic planning to creative execution, from client communications to event production, we bring meticulous attention to detail and an unwavering commitment to quality. We believe that luxury brands deserve nothing less than exceptional service and outstanding results.

## Innovation

**We push boundaries and embrace new ideas.**

The luxury industry is evolving, and we evolve with it. We stay ahead of trends, experiment with new technologies, and constantly seek fresh approaches to communications challenges. But we never innovate for innovation's sake—every new idea must serve our clients' strategic objectives and enhance their brand value.

## Integrity

**We build trust through transparency and honesty.**

In an industry built on relationships, integrity is everything. We're honest with our clients about what's possible, transparent about our processes, and accountable for our results. We protect our clients' confidentiality, respect their trust, and always act in their best interests.

## Collaboration

**We work as partners with our clients.**

We don't believe in the traditional agency-client hierarchy. Instead, we see ourselves as partners in our clients' success. We listen carefully, share ideas openly, and work together to achieve shared goals. The best results come from true collaboration, where diverse perspectives and expertise come together.

## Creativity

**We bring imagination to every project.**

Creativity is at the heart of what we do. Whether we're crafting a press release, planning an event, or developing a social media strategy, we approach every challenge with fresh eyes and imaginative thinking. We believe that creative solutions are often the most effective solutions—especially in the world of luxury, where standing out matters.

## Respect

**We honor the heritage and craftsmanship of luxury brands.**

We have deep respect for the artisans, designers, and visionaries who create luxury products. We understand that behind every luxury brand is a story of dedication, skill, and passion. Our role is to honor that story and communicate it in ways that resonate with audiences who appreciate true quality.

## Sustainability

**We support responsible luxury.**

We believe that the future of luxury is sustainable luxury. We encourage our clients to embrace environmental and social responsibility, and we help them communicate their commitments authentically. Because true luxury should enhance the world, not diminish it.`,
      seoTitle: 'Our Values - The Bureau of Wonders',
      metaDescription: 'Discover the core values that guide The Bureau of Wonders: excellence, innovation, integrity, collaboration, creativity, respect, and sustainability.',
      publishedAt: new Date().toISOString(),
    },
  ];

  for (const section of sections) {
    await strapi.entityService.create('api::about-section.about-section', {
      data: section,
    });
    console.log(`✓ About section created: ${section.title}`);
  }

  console.log('✓ About Sections seeded successfully');
}

/**
 * Seed blog posts data
 */
async function seedBlogPosts(strapi: Core.Strapi) {
  // Check if blog posts already exist
  const existingPosts = await strapi.entityService.findMany('api::blog-post.blog-post', {
    limit: 1,
  });

  if (existingPosts && existingPosts.length > 0) {
    console.log('Blog posts already seeded, skipping...');
    return;
  }

  console.log('Seeding Blog Posts...');

  const blogPosts = [
    {
      title: 'The Future of Luxury Brand Communications in 2025',
      slug: 'future-luxury-brand-communications-2025',
      excerpt: 'Explore the emerging trends shaping luxury brand communications and how forward-thinking brands are adapting to new consumer expectations.',
      content: `# The Future of Luxury Brand Communications in 2025

The luxury landscape is evolving rapidly, driven by changing consumer values, technological innovation, and a new generation of affluent consumers.`,
      category: 'Thought Leadership' as const,
      tags: ['luxury trends', 'digital transformation', 'sustainability', 'brand strategy'],
      author: 'The Bureau of Wonders',
      publishedAt: '2025-12-01T10:00:00.000Z',
      seoTitle: 'Future of Luxury Brand Communications 2025',
      metaDescription: 'Discover the key trends shaping luxury brand communications in 2025, from digital experiences to sustainability.',
    },
    {
      title: 'How to Launch a Luxury Product Successfully',
      slug: 'how-to-launch-luxury-product-successfully',
      excerpt: 'A comprehensive guide to planning and executing a successful luxury product launch that generates buzz and drives sales.',
      content: `# How to Launch a Luxury Product Successfully

Launching a luxury product requires meticulous planning, strategic timing, and flawless execution.`,
      category: 'Thought Leadership' as const,
      tags: ['product launch', 'event marketing', 'luxury strategy', 'brand experience'],
      author: 'The Bureau of Wonders',
      publishedAt: '2025-11-15T10:00:00.000Z',
      seoTitle: 'How to Launch a Luxury Product Successfully',
      metaDescription: 'Learn the proven framework for launching luxury products with maximum impact and lasting success.',
    },
    {
      title: 'The Art of Luxury Brand Storytelling',
      slug: 'art-of-luxury-brand-storytelling',
      excerpt: 'Discover how the world\'s most successful luxury brands use storytelling to create emotional connections.',
      content: `# The Art of Luxury Brand Storytelling

In the luxury sector, storytelling isn't just marketing—it's the essence of brand value.`,
      category: 'Thought Leadership' as const,
      tags: ['brand storytelling', 'luxury marketing', 'content strategy', 'brand heritage'],
      author: 'The Bureau of Wonders',
      publishedAt: '2025-11-01T10:00:00.000Z',
      seoTitle: 'The Art of Luxury Brand Storytelling',
      metaDescription: 'Master luxury brand storytelling with proven strategies for creating emotional connections.',
    },
    {
      title: 'Navigating Crisis Communications in the Luxury Sector',
      slug: 'navigating-crisis-communications-luxury-sector',
      excerpt: 'When reputation is everything, how luxury brands should prepare for and respond to communications crises.',
      content: `# Navigating Crisis Communications in the Luxury Sector

In the luxury industry, reputation is paramount. A single misstep can damage decades of brand building.`,
      category: 'Thought Leadership' as const,
      tags: ['crisis communications', 'reputation management', 'PR strategy', 'brand protection'],
      author: 'Sarah Mitchell',
      publishedAt: '2025-10-20T10:00:00.000Z',
      seoTitle: 'Crisis Communications Guide for Luxury Brands',
      metaDescription: 'Essential strategies for luxury brands to prepare for and navigate communications crises.',
    },
    {
      title: 'The Rise of Experiential Luxury Marketing',
      slug: 'rise-of-experiential-luxury-marketing',
      excerpt: 'Why luxury brands are shifting from product-focused to experience-driven marketing strategies.',
      content: `# The Rise of Experiential Luxury Marketing

Today's affluent consumers increasingly value experiences over possessions.`,
      category: 'Thought Leadership' as const,
      tags: ['experiential marketing', 'luxury events', 'brand experience', 'customer engagement'],
      author: 'James Chen',
      publishedAt: '2025-10-05T10:00:00.000Z',
      seoTitle: 'Experiential Luxury Marketing: The New Standard',
      metaDescription: 'How luxury brands are using experiential marketing to create memorable moments.',
    },
    {
      title: 'Luxury Brand Partnerships: A Strategic Guide',
      slug: 'luxury-brand-partnerships-strategic-guide',
      excerpt: 'How to identify, evaluate, and execute successful brand partnerships that elevate both parties.',
      content: `# Luxury Brand Partnerships: A Strategic Guide

Strategic partnerships can amplify brand reach, enhance credibility, and create unique value propositions.`,
      category: 'Thought Leadership' as const,
      tags: ['brand partnerships', 'collaborations', 'luxury strategy', 'co-branding'],
      author: 'The Bureau of Wonders',
      publishedAt: '2025-09-18T10:00:00.000Z',
      seoTitle: 'Strategic Guide to Luxury Brand Partnerships',
      metaDescription: 'Learn how to identify, evaluate, and execute successful luxury brand partnerships.',
    },
    {
      title: 'Bureau of Wonders Expands to Asia-Pacific Region',
      slug: 'bureau-wonders-expands-asia-pacific',
      excerpt: 'We\'re thrilled to announce the opening of our new office in Singapore.',
      content: `# Bureau of Wonders Expands to Asia-Pacific Region

We're excited to announce a significant milestone in our agency's growth.`,
      category: 'News' as const,
      tags: ['company news', 'expansion', 'asia-pacific', 'singapore'],
      author: 'The Bureau of Wonders',
      publishedAt: '2025-09-01T10:00:00.000Z',
      seoTitle: 'Bureau of Wonders Opens Singapore Office',
      metaDescription: 'Bureau of Wonders announces expansion to Asia-Pacific with new Singapore office.',
    },
    {
      title: 'Sustainability in Luxury: Beyond Greenwashing',
      slug: 'sustainability-luxury-beyond-greenwashing',
      excerpt: 'How luxury brands can authentically communicate their sustainability efforts.',
      content: `# Sustainability in Luxury: Beyond Greenwashing

Sustainability has become a critical concern for luxury consumers.`,
      category: 'Thought Leadership' as const,
      tags: ['sustainability', 'greenwashing', 'brand transparency', 'environmental responsibility'],
      author: 'Emma Rodriguez',
      publishedAt: '2025-08-12T10:00:00.000Z',
      seoTitle: 'Authentic Sustainability Communications for Luxury Brands',
      metaDescription: 'How luxury brands can communicate sustainability efforts authentically without greenwashing.',
    },
    {
      title: 'The Power of Influencer Marketing in Luxury',
      slug: 'power-of-influencer-marketing-luxury',
      excerpt: 'Navigating influencer partnerships in the luxury sector requires a different approach.',
      content: `# The Power of Influencer Marketing in Luxury

Influencer marketing has transformed luxury brand communications.`,
      category: 'Thought Leadership' as const,
      tags: ['influencer marketing', 'social media', 'brand partnerships', 'digital strategy'],
      author: 'Michael Zhang',
      publishedAt: '2025-07-28T10:00:00.000Z',
      seoTitle: 'Influencer Marketing Strategy for Luxury Brands',
      metaDescription: 'Master influencer marketing in luxury with strategies for selecting partners.',
    },
  ];

  for (const post of blogPosts) {
    await strapi.entityService.create('api::blog-post.blog-post', {
      data: post,
    });
    console.log(`✓ Blog post created: ${post.title}`);
  }

  console.log('✓ Blog Posts seeded successfully');
}

/**
 * Seed services data
 */
async function seedServices(strapi: Core.Strapi) {
  // Check if services already exist
  const existingServices = await strapi.entityService.findMany('api::service.service', {
    limit: 1,
  });

  if (existingServices && existingServices.length > 0) {
    console.log('Services already seeded, skipping...');
    return;
  }

  console.log('Seeding Services...');

  const services = [
    {
      title: 'Communications & PR',
      slug: 'communications-pr',
      description: `# Strategic Communications & Public Relations

We craft compelling narratives that resonate with luxury audiences and elevate your brand's presence in the market.

## What We Offer

### Media Strategy & Planning
Comprehensive media strategies tailored to luxury brand positioning and target audience engagement. We analyze market trends, identify key opportunities, and develop strategic roadmaps that ensure your brand message reaches the right audience at the right time.

### Press Release Writing & Distribution
Professional press materials that capture attention and communicate your brand's unique value proposition. Our experienced writers understand the nuances of luxury communications and craft messages that resonate with high-end media outlets and discerning readers.

### Media Relations & Outreach
Building and maintaining relationships with key media contacts in luxury, fashion, and lifestyle sectors. We have established connections with top-tier publications, influential journalists, and industry tastemakers who can amplify your brand story.

### Crisis Communications
Protecting your brand reputation with strategic crisis management and rapid response protocols. In the luxury sector, reputation is everything. We help you prepare for potential challenges and respond swiftly and effectively when issues arise.

### Brand Positioning
Defining and communicating your brand's unique position in the luxury market landscape. We help you articulate what makes your brand special and ensure that positioning is consistently communicated across all touchpoints.

### Thought Leadership
Establishing your brand and leadership team as industry authorities through strategic content placement, speaking opportunities, and expert commentary in leading publications.`,
      icon: '📢',
      order: 1,
      seoTitle: 'Communications & PR Services - Luxury Brand Communications',
      metaDescription: 'Strategic communications and PR services for luxury brands including media relations, press releases, and brand positioning.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Experiences & Events',
      slug: 'experiences-events',
      description: `# Unforgettable Experiences & Events

We create immersive brand experiences and flawlessly executed events that leave lasting impressions on your most important audiences.

## Event Services

### Product Launches
Spectacular launch events that generate buzz and create memorable first impressions for new products. From intimate gatherings to large-scale productions, we orchestrate every detail to ensure your product debut makes a lasting impact.

### Brand Activations
Interactive experiences that bring your brand story to life and create emotional connections with audiences. We design activations that engage all senses and create shareable moments that extend your brand reach far beyond the event itself.

### VIP Experiences
Exclusive, personalized experiences for your most valued clients and stakeholders. We understand that luxury is personal, and we create bespoke experiences that make your VIP guests feel truly special.

### Trade Shows & Exhibitions
Strategic presence at industry events with compelling booth design and engagement strategies. We help you stand out in crowded exhibition halls and create meaningful connections with potential clients and partners.

### Private Events
Intimate gatherings that strengthen relationships and showcase your brand's hospitality. From private dinners to exclusive previews, we create environments where meaningful conversations and lasting relationships flourish.

### Fashion Shows & Runway Events
Spectacular presentations that showcase your collections with style and sophistication. We handle everything from venue selection to choreography, ensuring your fashion show is a memorable celebration of your brand's creativity.

### Anniversary Celebrations
Milestone events that honor your brand's heritage while looking toward the future. We create celebrations that engage stakeholders, generate media coverage, and reinforce your brand's enduring value.`,
      icon: '✨',
      order: 2,
      seoTitle: 'Experiences & Events - Luxury Brand Event Management',
      metaDescription: 'Create unforgettable luxury brand experiences including product launches, VIP events, and brand activations.',
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Customer Relationship Management',
      slug: 'customer-relationship-management',
      description: `# Customer Relationship Management

Build and nurture lasting relationships with your most valuable customers through personalized, data-driven communications.

## CRM Services

### Email Marketing Campaigns
Sophisticated email strategies that engage, inform, and convert luxury consumers. We create beautifully designed, personalized email campaigns that respect your customers' time and deliver real value.

### Social Media Strategy
Curated social presence that reflects your brand's values and engages your target audience. We develop comprehensive social strategies that build community, drive engagement, and maintain the exclusivity that luxury brands require.

### Content Creation
Premium content that tells your brand story across all digital touchpoints. From photography and videography to copywriting and graphic design, we create content that captures the essence of luxury.

### Influencer Partnerships
Strategic collaborations with influencers who align with your brand values and reach your target audience. We identify authentic brand advocates and manage partnerships that feel genuine and drive real results.

### Digital Analytics
Data-driven insights to optimize your customer engagement and marketing ROI. We track, analyze, and report on key metrics that matter to your business, providing actionable recommendations for continuous improvement.

### Loyalty Programs
Exclusive programs that reward and retain your most valuable customers. We design loyalty initiatives that make customers feel appreciated while driving repeat purchases and brand advocacy.

### Customer Journey Mapping
Understanding and optimizing every touchpoint in your customer's experience. We map the entire customer journey and identify opportunities to enhance engagement and build stronger relationships.

### Personalization Strategies
Leveraging data and technology to deliver personalized experiences at scale. We help you use customer insights to create tailored communications that resonate with individual preferences and behaviors.`,
      icon: '💎',
      order: 3,
      seoTitle: 'CRM Services - Luxury Customer Relationship Management',
      metaDescription: 'Build lasting customer relationships with personalized CRM, email marketing, and digital engagement strategies.',
      publishedAt: new Date().toISOString(),
    },
  ];

  for (const service of services) {
    await strapi.entityService.create('api::service.service', {
      data: service,
    });
    console.log(`✓ Service created: ${service.title}`);
  }

  console.log('✓ Services seeded successfully');
}

/**
 * Seed industries data
 */
async function seedIndustries(strapi: Core.Strapi) {
  // Check if industries already exist
  const existingIndustries = await strapi.entityService.findMany('api::industry.industry', {
    limit: 1,
  });

  if (existingIndustries && existingIndustries.length > 0) {
    console.log('Industries already seeded, skipping...');
    return;
  }

  console.log('Seeding Industries...');

  const industries = [
    {
      name: 'Jewelry',
      slug: 'jewelry',
      description: `Expertise in fine jewelry communications, from heritage brands to contemporary designers. We understand the artistry, craftsmanship, and emotional significance of fine jewelry.`,
      icon: '💎',
      order: 1,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Watch',
      slug: 'watch',
      description: `Specialized knowledge in haute horlogerie and luxury timepiece marketing. We appreciate the technical mastery and heritage that define exceptional watchmaking.`,
      icon: '⌚',
      order: 2,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: `Deep understanding of luxury fashion communications and brand storytelling. We work with fashion houses to articulate their creative vision and connect with style-conscious consumers.`,
      icon: '👗',
      order: 3,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Leather Goods',
      slug: 'leather-goods',
      description: `Crafting narratives for premium leather goods and accessories brands. We highlight the quality, craftsmanship, and timeless appeal of luxury leather products.`,
      icon: '👜',
      order: 4,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Real Estate',
      slug: 'real-estate',
      description: `Luxury property marketing and high-end real estate communications. We help developers and brokers showcase exceptional properties to discerning buyers.`,
      icon: '🏛️',
      order: 5,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Finance',
      slug: 'finance',
      description: `Private banking and wealth management communications expertise. We help financial institutions communicate with high-net-worth individuals with sophistication and discretion.`,
      icon: '💰',
      order: 6,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Hospitality',
      slug: 'hospitality',
      description: `Five-star hotel and resort marketing and guest experience communications. We help luxury hospitality brands create compelling narratives that attract discerning travelers.`,
      icon: '🏨',
      order: 7,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Art',
      slug: 'art',
      description: `Gallery, auction house, and fine art communications. We work with art institutions to engage collectors and art enthusiasts with compelling storytelling.`,
      icon: '🎨',
      order: 8,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Design',
      slug: 'design',
      description: `Luxury interior design and high-end furniture brand communications. We help design brands articulate their aesthetic vision and connect with design-conscious consumers.`,
      icon: '🪑',
      order: 9,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Insurance',
      slug: 'insurance',
      description: `Premium insurance and risk management communications. We help insurance providers communicate complex products to high-net-worth individuals with clarity and confidence.`,
      icon: '🛡️',
      order: 10,
      publishedAt: new Date().toISOString(),
    },
  ];

  for (const industry of industries) {
    await strapi.entityService.create('api::industry.industry', {
      data: industry,
    });
    console.log(`✓ Industry created: ${industry.name}`);
  }

  console.log('✓ Industries seeded successfully');
}

/**
 * Seed job listings data
 */
async function seedJobListings(strapi: Core.Strapi) {
  // Check if job listings already exist
  const existingJobListings = await strapi.entityService.findMany('api::job-listing.job-listing', {
    limit: 1,
  });

  if (existingJobListings && existingJobListings.length > 0) {
    console.log('Job listings already seeded, skipping...');
    return;
  }

  console.log('Seeding Job Listings...');

  const jobListings: Array<{
    title: string;
    department: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract';
    description: string;
    requirements: string;
    publishedAt: string;
  }> = [
    {
      title: 'Senior Account Manager - Luxury Brands',
      department: 'Client Services',
      location: 'Bangkok, Thailand',
      type: 'Full-time' as const,
      description: `# Senior Account Manager - Luxury Brands

Join our dynamic team as a Senior Account Manager specializing in luxury brand communications. You'll be responsible for managing high-profile client relationships and delivering exceptional strategic communications solutions.

## About This Role

As a Senior Account Manager, you'll work directly with luxury brands across jewelry, fashion, hospitality, and lifestyle sectors. You'll lead strategic planning, oversee campaign execution, and ensure our clients receive world-class service that exceeds their expectations.

## Key Responsibilities

- **Client Relationship Management**: Serve as the primary point of contact for assigned luxury brand clients
- **Strategic Planning**: Develop comprehensive communications strategies aligned with client objectives
- **Campaign Oversight**: Manage end-to-end campaign execution from concept to completion
- **Team Leadership**: Guide junior team members and coordinate cross-functional projects
- **Business Development**: Identify opportunities for account growth and new service offerings
- **Quality Assurance**: Ensure all deliverables meet our high standards and client expectations

## What You'll Do Daily

- Conduct strategic planning sessions with clients and internal teams
- Review and approve creative concepts, press materials, and campaign assets
- Coordinate with media contacts and manage press relationships
- Present campaign results and strategic recommendations to clients
- Mentor junior team members and provide guidance on best practices
- Collaborate with creative, digital, and events teams on integrated campaigns`,
      requirements: `## Required Qualifications

### Experience & Background
- **5+ years** of account management experience in luxury brand communications, PR, or marketing
- **Proven track record** managing high-end clients in luxury sectors (jewelry, fashion, hospitality, automotive, etc.)
- **Bachelor's degree** in Communications, Marketing, Public Relations, or related field
- **Agency experience** preferred, with understanding of client service excellence

### Core Skills
- **Strategic Thinking**: Ability to develop comprehensive communications strategies
- **Client Management**: Exceptional relationship-building and client service skills
- **Project Management**: Strong organizational skills with ability to manage multiple projects
- **Communication**: Excellent written and verbal communication in English and Thai
- **Leadership**: Experience mentoring junior team members and leading projects

### Technical Requirements
- **Digital Proficiency**: Familiarity with social media platforms, PR tools, and project management software
- **Media Relations**: Established relationships with luxury lifestyle media preferred
- **Presentation Skills**: Confident presenting to C-level executives and senior stakeholders

## Preferred Qualifications

- **Advanced degree** in Marketing, Communications, or MBA
- **Luxury industry experience** with understanding of high-net-worth consumer behavior
- **International experience** or multicultural client management
- **Additional languages** (Mandarin, Japanese, or European languages) a plus
- **Event management** experience for luxury brand activations

## What We Offer

- **Competitive salary** commensurate with experience
- **Performance bonuses** based on client satisfaction and account growth
- **Professional development** opportunities including industry conferences and training
- **Flexible work arrangements** with hybrid remote options
- **Health and wellness** comprehensive benefits package
- **Career advancement** clear path for growth within our expanding agency`,
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Creative Director',
      department: 'Creative',
      location: 'Bangkok, Thailand',
      type: 'Full-time' as const,
      description: `# Creative Director

Lead our creative vision and drive innovative campaigns for the world's most prestigious luxury brands. As Creative Director, you'll shape the creative strategy and oversee the development of compelling brand narratives.

## About This Role

We're seeking a visionary Creative Director to join our leadership team and elevate our creative output. You'll work with luxury brands across multiple sectors, creating campaigns that resonate with sophisticated audiences and drive meaningful engagement.

## Key Responsibilities

- **Creative Leadership**: Set creative vision and standards across all client work
- **Strategic Development**: Collaborate on creative strategies that align with business objectives
- **Team Management**: Lead and inspire a team of designers, copywriters, and creative professionals
- **Client Collaboration**: Present creative concepts to senior client stakeholders
- **Brand Storytelling**: Develop compelling narratives that capture luxury brand essence
- **Quality Control**: Ensure all creative output meets luxury brand standards

## Creative Focus Areas

- **Brand Identity**: Logo design, brand guidelines, and visual identity systems
- **Campaign Development**: Integrated campaigns across digital and traditional media
- **Content Creation**: Photography direction, video concepts, and editorial content
- **Event Design**: Creative concepts for luxury brand experiences and activations
- **Digital Innovation**: Cutting-edge digital experiences and interactive content`,
      requirements: `## Required Qualifications

### Experience & Portfolio
- **8+ years** of creative leadership experience in luxury brand communications
- **Strong portfolio** demonstrating luxury brand work across multiple touchpoints
- **Agency experience** with proven track record of award-winning campaigns
- **Team leadership** experience managing creative departments

### Creative Skills
- **Visual Excellence**: Exceptional eye for design, typography, and luxury aesthetics
- **Strategic Thinking**: Ability to translate business objectives into creative solutions
- **Brand Understanding**: Deep appreciation for luxury brand values and positioning
- **Storytelling**: Expertise in crafting compelling brand narratives

### Technical Proficiency
- **Design Software**: Expert level in Adobe Creative Suite (Photoshop, Illustrator, InDesign)
- **Digital Platforms**: Understanding of web design, social media, and digital marketing
- **Production Knowledge**: Experience with print production, photography, and video
- **Presentation Skills**: Ability to present and defend creative concepts to clients

## Leadership Qualities

- **Vision**: Ability to see the big picture and inspire others with creative direction
- **Collaboration**: Strong interpersonal skills for working with clients and teams
- **Innovation**: Drive to push creative boundaries while respecting brand heritage
- **Mentorship**: Passion for developing junior creative talent

## What We Offer

- **Creative Freedom**: Opportunity to work on prestigious luxury brand projects
- **Competitive Package**: Salary, bonuses, and equity participation
- **Professional Growth**: Conference attendance, industry networking, and skill development
- **State-of-the-Art Tools**: Latest creative software and hardware
- **Inspiring Environment**: Beautiful office space designed for creative collaboration`,
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Digital Marketing Specialist',
      department: 'Digital',
      location: 'Bangkok, Thailand',
      type: 'Full-time' as const,
      description: `# Digital Marketing Specialist

Drive digital excellence for luxury brands through innovative online strategies, social media management, and data-driven campaigns that engage high-value audiences.

## About This Role

Join our digital team to create and execute sophisticated digital marketing strategies for luxury brands. You'll manage social media presence, develop content strategies, and optimize digital campaigns to reach affluent consumers across multiple platforms.

## Key Responsibilities

- **Social Media Management**: Develop and execute social media strategies across platforms
- **Content Creation**: Create engaging content that reflects luxury brand values
- **Campaign Management**: Plan and execute digital advertising campaigns
- **Analytics & Reporting**: Monitor performance and provide actionable insights
- **Influencer Relations**: Identify and manage partnerships with luxury lifestyle influencers
- **SEO/SEM**: Optimize digital presence for search engines and paid advertising

## Digital Platforms

- **Social Media**: Instagram, Facebook, LinkedIn, TikTok, YouTube
- **Advertising**: Google Ads, Facebook Ads, LinkedIn Ads, programmatic display
- **Analytics**: Google Analytics, social media insights, campaign performance tools
- **Content Management**: WordPress, Shopify, luxury e-commerce platforms`,
      requirements: `## Required Qualifications

### Experience & Skills
- **3+ years** of digital marketing experience, preferably with luxury brands
- **Bachelor's degree** in Marketing, Communications, or related field
- **Social media expertise** with proven track record of growing luxury brand presence
- **Content creation skills** including copywriting, basic design, and video editing

### Technical Requirements
- **Platform Proficiency**: Expert knowledge of major social media platforms
- **Analytics Tools**: Google Analytics, Facebook Business Manager, social media analytics
- **Design Software**: Basic proficiency in Canva, Adobe Creative Suite, or similar tools
- **Campaign Management**: Experience with paid social and search advertising

### Luxury Brand Understanding
- **Aesthetic Sense**: Understanding of luxury brand visual standards and tone
- **Target Audience**: Knowledge of high-net-worth consumer behavior and preferences
- **Brand Voice**: Ability to maintain sophisticated, on-brand communication
- **Trend Awareness**: Stay current with luxury lifestyle and digital marketing trends

## Preferred Qualifications

- **Certification**: Google Ads, Facebook Blueprint, or similar digital marketing certifications
- **E-commerce Experience**: Familiarity with luxury retail and online shopping behavior
- **Multilingual**: English and Thai required, additional languages preferred
- **Photography/Video**: Basic skills in content creation and visual storytelling

## Growth Opportunities

- **Skill Development**: Training in advanced digital marketing techniques
- **Client Exposure**: Direct interaction with luxury brand marketing teams
- **Career Path**: Progression to Senior Digital Specialist or Digital Strategy roles
- **Industry Recognition**: Opportunity to work on award-winning digital campaigns`,
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Public Relations Executive',
      department: 'Public Relations',
      location: 'Bangkok, Thailand',
      type: 'Full-time' as const,
      description: `# Public Relations Executive

Execute strategic PR campaigns for luxury brands, manage media relationships, and create compelling stories that elevate brand presence in premium lifestyle publications.

## About This Role

As a PR Executive, you'll be at the forefront of luxury brand communications, crafting press materials, building media relationships, and securing high-impact coverage in top-tier publications.

## Key Responsibilities

- **Media Relations**: Build and maintain relationships with luxury lifestyle journalists
- **Press Materials**: Write press releases, media kits, and pitch materials
- **Event Support**: Coordinate press coverage for luxury brand events and launches
- **Crisis Management**: Support crisis communications and reputation management
- **Monitoring**: Track media coverage and compile comprehensive reports
- **Research**: Stay informed about industry trends and competitive landscape`,
      requirements: `## Required Qualifications

### Experience & Background
- **2+ years** of PR experience, preferably in luxury brands or lifestyle sectors
- **Bachelor's degree** in Communications, Journalism, Public Relations, or related field
- **Writing skills** with portfolio of published press materials and media coverage
- **Media contacts** in luxury lifestyle, fashion, or business publications preferred

### Core Competencies
- **Excellent Writing**: Ability to craft compelling press materials and pitches
- **Relationship Building**: Strong interpersonal skills for media relationship management
- **Project Management**: Organized approach to managing multiple PR campaigns
- **Research Skills**: Ability to identify relevant media opportunities and trends

### Industry Knowledge
- **Luxury Market**: Understanding of luxury brand positioning and target audiences
- **Media Landscape**: Familiarity with key publications, journalists, and influencers
- **Digital PR**: Knowledge of online media, blogs, and digital influencer relations
- **Event Experience**: Support for press events, product launches, and media briefings

## Career Development

- **Mentorship**: Work closely with senior PR professionals
- **Media Training**: Opportunities to develop spokesperson and presentation skills
- **Industry Events**: Attend luxury brand events and media functions
- **Advancement**: Clear path to Senior PR Executive and Account Director roles`,
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Event Coordinator',
      department: 'Events & Experiences',
      location: 'Bangkok, Thailand',
      type: 'Full-time' as const,
      description: `# Event Coordinator

Create unforgettable luxury brand experiences through meticulous event planning, vendor management, and flawless execution of high-end activations and launches.

## About This Role

Join our events team to produce world-class luxury brand experiences. You'll coordinate every detail of exclusive events, from intimate VIP dinners to large-scale product launches, ensuring each event reflects the sophistication and excellence our clients expect.

## Key Responsibilities

- **Event Planning**: Coordinate all aspects of luxury brand events and activations
- **Vendor Management**: Source and manage premium vendors, venues, and suppliers
- **Budget Management**: Track event budgets and ensure cost-effective execution
- **Timeline Coordination**: Develop and manage detailed event timelines and logistics
- **On-site Management**: Oversee event execution and troubleshoot any issues
- **Client Liaison**: Work directly with clients to understand their vision and requirements`,
      requirements: `## Required Qualifications

### Experience & Skills
- **2+ years** of event planning experience, preferably with luxury brands or high-end events
- **Bachelor's degree** in Event Management, Hospitality, Marketing, or related field
- **Project management** skills with attention to detail and ability to multitask
- **Vendor relationships** with premium suppliers in Bangkok and surrounding areas

### Event Expertise
- **Luxury Standards**: Understanding of high-end event expectations and quality standards
- **Logistics Management**: Experience coordinating complex event logistics and timelines
- **Budget Management**: Ability to manage event budgets and negotiate with vendors
- **Problem Solving**: Quick thinking and creative solutions for event challenges

### Personal Qualities
- **Professional Demeanor**: Polished presentation suitable for luxury brand environments
- **Stress Management**: Ability to remain calm and composed under pressure
- **Flexibility**: Willingness to work evenings and weekends for events
- **Cultural Sensitivity**: Understanding of diverse client needs and cultural considerations

## Event Types

- **Product Launches**: Luxury brand product unveilings and press events
- **VIP Experiences**: Exclusive client entertainment and relationship building
- **Trade Shows**: Premium exhibition presence and hospitality suites
- **Corporate Events**: Board meetings, annual gatherings, and milestone celebrations
- **Fashion Shows**: Runway events and designer showcases`,
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Content Writer - Luxury Brands',
      department: 'Content & Strategy',
      location: 'Bangkok, Thailand',
      type: 'Contract' as const,
      description: `# Content Writer - Luxury Brands

Craft compelling content that captures the essence of luxury brands through sophisticated storytelling, brand narratives, and premium lifestyle content across multiple platforms.

## About This Role

We're seeking a talented Content Writer to join our team on a contract basis. You'll create premium content for luxury brands, from website copy and blog articles to social media content and brand storytelling pieces.

## Key Responsibilities

- **Brand Storytelling**: Develop compelling narratives that reflect luxury brand heritage and values
- **Content Creation**: Write website copy, blog articles, social media content, and marketing materials
- **Brand Voice**: Maintain consistent, sophisticated tone across all content touchpoints
- **Research**: Conduct thorough research on luxury markets, trends, and target audiences
- **Collaboration**: Work with creative and strategy teams to develop integrated content approaches
- **SEO Optimization**: Create content that performs well in search while maintaining luxury brand standards`,
      requirements: `## Required Qualifications

### Writing & Experience
- **3+ years** of professional writing experience, preferably with luxury brands
- **Portfolio** demonstrating luxury brand content across multiple formats
- **Bachelor's degree** in English, Journalism, Communications, or related field
- **Published work** in luxury lifestyle publications or brand content preferred

### Content Expertise
- **Brand Voice**: Ability to adapt writing style to match sophisticated brand personalities
- **Storytelling**: Skill in crafting compelling narratives that engage affluent audiences
- **Research Skills**: Thorough approach to understanding brand history, values, and market position
- **SEO Knowledge**: Understanding of content optimization without compromising brand voice

### Industry Understanding
- **Luxury Market**: Knowledge of luxury consumer behavior and brand positioning
- **Cultural Sensitivity**: Ability to create content that resonates across diverse markets
- **Trend Awareness**: Stay current with luxury lifestyle trends and cultural movements
- **Quality Standards**: Commitment to excellence and attention to detail

## Contract Details

- **Duration**: 6-month contract with possibility of extension
- **Schedule**: Flexible hours with core collaboration time
- **Remote Options**: Hybrid work arrangement available
- **Project Variety**: Opportunity to work across multiple luxury brand sectors`,
      publishedAt: new Date().toISOString(),
    },
    {
      title: 'Business Development Manager',
      department: 'Business Development',
      location: 'Bangkok, Thailand',
      type: 'Full-time' as const,
      description: `# Business Development Manager

Drive agency growth by identifying new business opportunities, building relationships with luxury brands, and developing strategic partnerships that expand our market presence.

## About This Role

Lead our business development efforts to grow The Bureau of Wonders' client portfolio. You'll identify and pursue new business opportunities with luxury brands across Southeast Asia, building relationships that result in long-term partnerships.

## Key Responsibilities

- **New Business Development**: Identify and pursue opportunities with luxury brands
- **Relationship Building**: Develop relationships with key decision-makers at target companies
- **Proposal Development**: Create compelling proposals and presentations for prospective clients
- **Market Research**: Analyze market trends and identify growth opportunities
- **Partnership Development**: Explore strategic partnerships with complementary service providers
- **Revenue Growth**: Contribute to agency revenue targets through new client acquisition`,
      requirements: `## Required Qualifications

### Experience & Background
- **5+ years** of business development experience, preferably in luxury brands or agency services
- **Proven track record** of new business acquisition and revenue generation
- **Bachelor's degree** in Business, Marketing, or related field
- **Network**: Existing relationships with luxury brands in Southeast Asia preferred

### Business Skills
- **Sales Expertise**: Strong consultative selling skills and ability to close complex deals
- **Presentation Skills**: Confident presenting to C-level executives and senior stakeholders
- **Negotiation**: Experience negotiating service agreements and contract terms
- **Strategic Thinking**: Ability to identify market opportunities and develop growth strategies

### Industry Knowledge
- **Luxury Market**: Deep understanding of luxury brand challenges and opportunities
- **Agency Services**: Knowledge of communications, PR, and marketing service offerings
- **Regional Expertise**: Understanding of Southeast Asian luxury market dynamics
- **Cultural Intelligence**: Ability to work effectively across diverse cultural contexts

## Growth Potential

- **Leadership Track**: Opportunity to build and lead business development team
- **Equity Participation**: Potential for equity participation based on performance
- **Regional Expansion**: Lead expansion into new markets across Asia-Pacific
- **Strategic Role**: Influence agency strategic direction and service development`,
      publishedAt: new Date().toISOString(),
    }
  ];

  for (const job of jobListings) {
    await strapi.entityService.create('api::job-listing.job-listing', {
      data: job,
    });
    console.log(`✓ Job listing created: ${job.title}`);
  }

  console.log('✓ Job Listings seeded successfully');
}