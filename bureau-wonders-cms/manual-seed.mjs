import axios from 'axios';

const API_URL = 'http://localhost:1337/api';
const ADMIN_TOKEN = '44d7d02e56c1f0c5915de077a4a553864b5bbab3318078a46527ce41f7fb6f92c2b369745e26e4deb570a9c25df01e6372437c3ea6ce5ebb537169f5760b9a84fa2615317f73ee58dbbf2c72ea1c14bdfe426e798813c3954ddcc8fedeabe184625cdc1cc20a481f9cf8ad4b3f2f5a613d201bfacdfb78178f6e51a88b91890f';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Services data
const services = [
  {
    title: 'Communications & PR',
    slug: 'communications-pr',
    description: 'Strategic communications and public relations services for luxury brands including media relations, press releases, and brand positioning.',
    icon: '📢',
    order: 1,
    seoTitle: 'Communications & PR Services - Luxury Brand Communications',
    metaDescription: 'Strategic communications and PR services for luxury brands including media relations, press releases, and brand positioning.',
  },
  {
    title: 'Experiences & Events',
    slug: 'experiences-events',
    description: 'Create unforgettable luxury brand experiences including product launches, VIP events, and brand activations.',
    icon: '✨',
    order: 2,
    seoTitle: 'Experiences & Events - Luxury Brand Event Management',
    metaDescription: 'Create unforgettable luxury brand experiences including product launches, VIP events, and brand activations.',
  },
  {
    title: 'Customer Relationship Management',
    slug: 'customer-relationship-management',
    description: 'Build lasting customer relationships with personalized CRM, email marketing, and digital engagement strategies.',
    icon: '💎',
    order: 3,
    seoTitle: 'CRM Services - Luxury Customer Relationship Management',
    metaDescription: 'Build lasting customer relationships with personalized CRM, email marketing, and digital engagement strategies.',
  },
];

// Industries data
const industries = [
  { name: 'Jewelry', slug: 'jewelry', description: 'Expertise in fine jewelry communications, from heritage brands to contemporary designers.', icon: '💎', order: 1 },
  { name: 'Watch', slug: 'watch', description: 'Specialized knowledge in haute horlogerie and luxury timepiece marketing.', icon: '⌚', order: 2 },
  { name: 'Fashion', slug: 'fashion', description: 'Deep understanding of luxury fashion communications and brand storytelling.', icon: '👗', order: 3 },
  { name: 'Leather Goods', slug: 'leather-goods', description: 'Crafting narratives for premium leather goods and accessories brands.', icon: '👜', order: 4 },
  { name: 'Real Estate', slug: 'real-estate', description: 'Luxury property marketing and high-end real estate communications.', icon: '🏛️', order: 5 },
  { name: 'Finance', slug: 'finance', description: 'Private banking and wealth management communications expertise.', icon: '💰', order: 6 },
  { name: 'Hospitality', slug: 'hospitality', description: 'Five-star hotel and resort marketing and guest experience communications.', icon: '🏨', order: 7 },
  { name: 'Art', slug: 'art', description: 'Gallery, auction house, and fine art communications.', icon: '🎨', order: 8 },
  { name: 'Design', slug: 'design', description: 'Luxury interior design and high-end furniture brand communications.', icon: '🪑', order: 9 },
  { name: 'Insurance', slug: 'insurance', description: 'Premium insurance and risk management communications.', icon: '🛡️', order: 10 },
];

async function seedData() {
  console.log('🌱 Starting manual seed...\n');

  try {
    // First, let's check if the endpoints exist
    console.log('🔍 Checking API endpoints...');
    
    try {
      const servicesCheck = await client.get('/services');
      console.log('✅ Services API exists');
    } catch (error) {
      console.log('❌ Services API not found:', error.response?.status);
      return;
    }

    try {
      const industriesCheck = await client.get('/industries');
      console.log('✅ Industries API exists');
    } catch (error) {
      console.log('❌ Industries API not found:', error.response?.status);
      return;
    }

    // Seed Services
    console.log('\n📋 Seeding Services...');
    for (const service of services) {
      try {
        const response = await client.post('/services', { data: service });
        console.log(`  ✅ Created service: ${service.title}`);
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('already exists')) {
          console.log(`  ⏭️  Service already exists: ${service.title}`);
        } else {
          console.log(`  ❌ Error creating ${service.title}:`, error.response?.data?.error?.message || error.message);
        }
      }
    }

    // Seed Industries
    console.log('\n🏭 Seeding Industries...');
    for (const industry of industries) {
      try {
        const response = await client.post('/industries', { data: industry });
        console.log(`  ✅ Created industry: ${industry.name}`);
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('already exists')) {
          console.log(`  ⏭️  Industry already exists: ${industry.name}`);
        } else {
          console.log(`  ❌ Error creating ${industry.name}:`, error.response?.data?.error?.message || error.message);
        }
      }
    }

    console.log('\n✨ Manual seeding completed!\n');
    
    // Verify the data
    console.log('🔍 Verifying seeded data...');
    const servicesResult = await client.get('/services');
    const industriesResult = await client.get('/industries');
    
    console.log(`📊 Services created: ${servicesResult.data.data?.length || 0}`);
    console.log(`📊 Industries created: ${industriesResult.data.data?.length || 0}`);
    
  } catch (error) {
    console.error('\n❌ Seed error:', error.response?.data || error.message);
  }
}

seedData();