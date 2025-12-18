import axios from 'axios';

const API_URL = 'http://localhost:1337/api';
const TOKEN = '44d7d02e56c1f0c5915de077a4a553864b5bbab3318078a46527ce41f7fb6f92c2b369745e26e4deb570a9c25df01e6372437c3ea6ce5ebb537169f5760b9a84fa2615317f73ee58dbbf2c72ea1c14bdfe426e798813c3954ddcc8fedeabe184625cdc1cc20a481f9cf8ad4b3f2f5a613d201bfacdfb78178f6e51a88b91890f';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const pages = [
  {
    title: 'Home',
    slug: 'home',
    content: '# Welcome to The Bureau of Wonders\n\nWe are a luxury brand communications and PR agency specializing in creating extraordinary experiences for the world\'s most prestigious brands.\n\n## Our Expertise\n\nWith decades of combined experience in luxury brand communications, we understand the nuances of high-end marketing and the expectations of discerning clientele.\n\n## Industries We Serve\n\n- Jewelry & Watches\n- Fashion & Leather Goods\n- Real Estate\n- Finance & Banking\n- Hospitality\n- Art & Design\n- Insurance',
    seoTitle: 'The Bureau of Wonders - Luxury Brand Communications',
    metaDescription: 'Premier luxury brand communications and PR agency specializing in jewelry, fashion, real estate, and high-end lifestyle brands.',
    publishedAt: '2025-12-09T14:00:00.000Z',
  },
  {
    title: 'About',
    slug: 'about',
    content: '# About The Bureau of Wonders\n\n## Our Story\n\nFounded with a passion for luxury and a commitment to excellence, The Bureau of Wonders has become a trusted partner for the world\'s most prestigious brands.\n\n## Our Philosophy\n\nWe believe that luxury is not just about products—it\'s about creating experiences, telling stories, and building emotional connections that last a lifetime.\n\n## Our Team\n\nOur team consists of seasoned professionals with backgrounds in luxury brand management, public relations, event production, and digital marketing.\n\n## Our Values\n\n- **Excellence**: We strive for perfection in everything we do\n- **Innovation**: We push boundaries and embrace new ideas\n- **Integrity**: We build trust through transparency and honesty\n- **Collaboration**: We work as partners with our clients\n- **Creativity**: We bring imagination to every project',
    seoTitle: 'About Us - The Bureau of Wonders',
    metaDescription: 'Learn about The Bureau of Wonders, our story, philosophy, team, and commitment to luxury brand communications excellence.',
    publishedAt: '2025-12-09T14:00:00.000Z',
  },
  {
    title: 'Services',
    slug: 'services',
    content: '# Our Services\n\n## Communications & PR\n\nStrategic communications planning, media relations, press releases, and brand positioning for luxury markets.\n\n### What We Offer:\n- Media Strategy & Planning\n- Press Release Writing & Distribution\n- Media Relations & Outreach\n- Crisis Communications\n- Brand Positioning\n\n## Experiences & Events\n\nUnforgettable events and experiences that showcase your brand\'s unique story and values.\n\n### Event Services:\n- Product Launches\n- Brand Activations\n- VIP Experiences\n- Trade Shows & Exhibitions\n- Private Events\n\n## CRM & Digital Marketing\n\nBuilding and nurturing relationships with your most valuable customers through personalized communications.\n\n### Digital Services:\n- Email Marketing Campaigns\n- Social Media Strategy\n- Content Creation\n- Influencer Partnerships\n- Digital Analytics\n\n## Industries We Serve\n\nWe specialize in luxury sectors including jewelry, watches, fashion, leather goods, real estate, finance, hospitality, art, design, and insurance.',
    seoTitle: 'Services - Luxury Brand Communications & PR',
    metaDescription: 'Comprehensive luxury brand services including communications, PR, event experiences, and CRM for high-end brands.',
    publishedAt: '2025-12-09T14:00:00.000Z',
  },
  {
    title: 'Blog',
    slug: 'blog',
    content: '# Insights & News\n\nStay updated with the latest trends, insights, and news from the world of luxury brand communications.\n\nExplore our articles on industry trends, case studies, and thought leadership pieces that showcase our expertise and perspective on the luxury market.',
    seoTitle: 'Blog - Luxury Brand Insights & News',
    metaDescription: 'Read the latest insights, trends, and news about luxury brand communications, PR, and marketing from The Bureau of Wonders.',
    publishedAt: '2025-12-09T14:00:00.000Z',
  },
  {
    title: 'Case Studies',
    slug: 'case-studies',
    content: '# Case Studies\n\nDiscover how we\'ve helped luxury brands achieve their goals through strategic communications, memorable events, and innovative marketing campaigns.\n\nEach case study showcases our approach to solving unique challenges and delivering exceptional results for our clients.',
    seoTitle: 'Case Studies - Our Work in Luxury Brand Communications',
    metaDescription: 'Explore our portfolio of successful luxury brand campaigns, events, and communications strategies.',
    publishedAt: '2025-12-09T14:00:00.000Z',
  },
  {
    title: 'Careers',
    slug: 'careers',
    content: '# Join Our Team\n\n## Why Work With Us?\n\nAt The Bureau of Wonders, we\'re always looking for talented individuals who share our passion for luxury brands and exceptional client service.\n\n## Our Culture\n\nWe foster a collaborative, creative environment where innovation thrives and every team member\'s contribution is valued.\n\n## What We Offer\n\n- Competitive compensation\n- Professional development opportunities\n- Work with prestigious luxury brands\n- Creative and collaborative environment\n- Flexible work arrangements\n\n## Current Openings\n\nBrowse our current job listings below and find your next career opportunity.',
    seoTitle: 'Careers - Join The Bureau of Wonders',
    metaDescription: 'Explore career opportunities at The Bureau of Wonders. Join our team of luxury brand communications professionals.',
    publishedAt: '2025-12-09T14:00:00.000Z',
  },
  {
    title: 'Contact',
    slug: 'contact',
    content: '# Get In Touch\n\nWe\'d love to hear from you. Whether you\'re interested in our services, have a question, or want to explore a partnership, our team is here to help.\n\n## Contact Information\n\n**Email:** hello@bureauofwonders.com  \n**Phone:** +1 (555) 123-4567\n\n**Office Address:**  \n989 Siam Piwat Tower 19th Floor Unit B2/1  \nRama 1 Road, Pathumwan  \nBangkok 10330, Thailand\n\n## Office Hours\n\nMonday - Friday: 9:00 AM - 6:00 PM EST  \nSaturday - Sunday: Closed\n\n## Send Us a Message\n\nFill out the form below and we\'ll get back to you within 24 hours.',
    seoTitle: 'Contact Us - The Bureau of Wonders',
    metaDescription: 'Get in touch with The Bureau of Wonders. Contact our luxury brand communications team for inquiries and consultations.',
    publishedAt: '2025-12-09T14:00:00.000Z',
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
  console.log('Starting seed...\n');

  try {
    // Seed Site Settings
    console.log('Seeding Site Settings...');
    try {
      await client.put('/site-setting', { data: siteSettings });
      console.log('✓ Site Settings created/updated\n');
    } catch (error) {
      console.log('Site Settings error:', error.response?.data || error.message || error);
    }

    // Seed Pages
    console.log('Seeding Pages...');
    for (const page of pages) {
      try {
        // Check if page exists
        const existing = await client.get(`/pages?filters[slug][$eq]=${page.slug}`);
        
        if (existing.data.data && existing.data.data.length > 0) {
          console.log(`- Page already exists: ${page.title}`);
        } else {
          await client.post('/pages', { data: page });
          console.log(`✓ Created page: ${page.title}`);
        }
      } catch (error) {
        console.log(`Error creating ${page.title}:`, error.response?.data || error.message || error);
      }
    }

    console.log('\n✓ Seeding completed!');
  } catch (error) {
    console.error('Seed error:', error);
  }
}

seed();
