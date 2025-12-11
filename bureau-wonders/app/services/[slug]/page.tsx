import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import ContentSection from '@/components/content/ContentSection';
import { ScrollTriggeredReveal, StaggeredReveal, ParallaxServiceShowcase } from '@/components/animations';
import { serviceShowcasePresets } from '@/components/animations/ParallaxServiceShowcase';

export const revalidate = 300;

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const service = await strapiClient.getService(slug);
    return generatePageMetadata({
      title: service.title,
      description: service.metaDescription || `Learn about our ${service.title} services for luxury brands.`,
      keywords: ['luxury services', service.title, 'brand communications'],
    });
  } catch (error) {
    // Fallback metadata for known services
    const fallbackMetadata = {
      'communications-pr': {
        title: 'Communications & PR',
        description: 'Strategic communications and PR services for luxury brands.',
      },
      'experiences-events': {
        title: 'Experiences & Events',
        description: 'Create unforgettable luxury brand experiences.',
      },
      'customer-relationship-management': {
        title: 'Customer Relationship Management',
        description: 'Build lasting customer relationships with personalized CRM.',
      },
    };

    const fallback = fallbackMetadata[slug as keyof typeof fallbackMetadata];
    if (fallback) {
      return generatePageMetadata({
        title: fallback.title,
        description: fallback.description,
        keywords: ['luxury services', fallback.title, 'brand communications'],
      });
    }

    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  let service;
  let allServices = [];

  // Fallback service data
  const fallbackServices = [
    {
      id: 1,
      title: 'Communications & PR',
      slug: 'communications-pr',
      description: `# Strategic Communications & Public Relations

Our Communications & PR services are designed to elevate your luxury brand's presence in the market through strategic storytelling and media relations.

## What We Offer

### Media Relations
- Press release development and distribution
- Media kit creation and management
- Journalist relationship building
- Crisis communication management

### Brand Positioning
- Brand narrative development
- Thought leadership positioning
- Industry expertise establishment
- Competitive differentiation

### Content Strategy
- Editorial calendar planning
- Content creation and curation
- Social media strategy
- Digital storytelling

## Industries We Serve

We specialize in luxury sectors including jewelry, watches, fashion, real estate, and hospitality, bringing deep industry knowledge to every campaign.

## Why Choose Us

Our team combines decades of luxury brand experience with cutting-edge communication strategies to deliver results that matter to your business.`,
      icon: '📢',
      order: 1,
      seoTitle: 'Communications & PR Services',
      metaDescription: 'Strategic communications and PR services for luxury brands.',
      publishedAt: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      title: 'Experiences & Events',
      slug: 'experiences-events',
      description: `# Experiences & Events

Create unforgettable luxury brand experiences that resonate with your target audience and drive meaningful engagement.

## Our Expertise

### Event Planning & Management
- Product launch events
- VIP customer experiences
- Trade show presentations
- Brand activation campaigns

### Experience Design
- Immersive brand experiences
- Pop-up installations
- Exclusive customer events
- Digital experience integration

### Venue & Logistics
- Premium venue selection
- Vendor coordination
- Timeline management
- On-site execution

## Event Types

### Product Launches
Showcase your latest collections with sophisticated launch events that generate buzz and media coverage.

### VIP Experiences
Create exclusive experiences for your most valued customers and stakeholders.

### Brand Activations
Engage audiences through interactive brand experiences that create lasting impressions.

## Our Approach

We believe every event should tell your brand's story while creating memorable moments that strengthen customer relationships.`,
      icon: '✨',
      order: 2,
      seoTitle: 'Experiences & Events Services',
      metaDescription: 'Create unforgettable luxury brand experiences.',
      publishedAt: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 3,
      title: 'Customer Relationship Management',
      slug: 'customer-relationship-management',
      description: `# Customer Relationship Management

Build lasting relationships with your luxury customers through personalized CRM strategies and digital engagement.

## Our Services

### CRM Strategy & Implementation
- Customer journey mapping
- Segmentation strategies
- Personalization frameworks
- Loyalty program development

### Email Marketing
- Automated campaign setup
- Personalized content creation
- Performance tracking
- A/B testing optimization

### Digital Engagement
- Social media management
- Content personalization
- Customer lifecycle marketing
- Retention strategies

## Technology Integration

### CRM Platforms
We work with leading CRM platforms to ensure seamless integration with your existing systems.

### Analytics & Reporting
Comprehensive reporting and analytics to measure engagement and ROI.

### Automation
Smart automation workflows that nurture customer relationships at scale.

## Benefits

### Increased Customer Lifetime Value
Our strategies focus on building long-term customer relationships that drive repeat business.

### Enhanced Customer Experience
Personalized touchpoints that make every customer feel valued and understood.

### Data-Driven Insights
Actionable insights that help you make informed decisions about your customer strategy.`,
      icon: '💎',
      order: 3,
      seoTitle: 'CRM Services',
      metaDescription: 'Build lasting customer relationships with personalized CRM.',
      publishedAt: '2024-01-01T00:00:00.000Z',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ];

  try {
    [service, allServices] = await Promise.all([
      strapiClient.getService(slug),
      strapiClient.getServices(),
    ]);
  } catch (error) {
    console.error('Error fetching service:', error);
    // Use fallback data instead of notFound()
    service = fallbackServices.find(s => s.slug === slug);
    allServices = fallbackServices;
    
    if (!service) {
      notFound();
    }
  }

  // Filter out current service from related services
  const relatedServices = allServices.filter(s => s.slug !== slug);

  return (
    <main className="min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-primary-100 py-4">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-neutral-600 hover:text-primary-500 transition-colors">
              Home
            </Link>
            <span className="text-neutral-600">/</span>
            <Link href="/services" className="text-neutral-600 hover:text-primary-500 transition-colors">
              Services
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-800 font-medium">{service.title}</span>
          </nav>
        </div>
      </section>

      {/* Service Header with Parallax */}
      <div className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 to-accent-copper/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent-copper/5 rounded-full blur-2xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
            <ScrollTriggeredReveal direction="scale" delay={200}>
              {service.icon && (
                <div className="text-6xl mb-6 animate-pulse">{service.icon}</div>
              )}
            </ScrollTriggeredReveal>
            <ScrollTriggeredReveal direction="up" delay={400}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 text-shadow-lg">
                {service.title}
              </h1>
            </ScrollTriggeredReveal>
          </div>
        </div>
      </div>

      {/* Enhanced Service Content with Interactive Features */}
      <ScrollTriggeredReveal direction="up" delay={200}>
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
            <div className="prose prose-lg md:prose-xl max-w-none text-neutral-800">
              <ContentSection
                content={service.description}
                layout="single"
                className="bg-transparent p-0"
              />
            </div>
          </div>
        </section>
      </ScrollTriggeredReveal>

      {/* Interactive Service Features */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-100-blue/20 to-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
          <ScrollTriggeredReveal direction="up" delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 text-center mb-12">
              Key Features & Benefits
            </h2>
          </ScrollTriggeredReveal>
          
          <StaggeredReveal 
            direction="up" 
            staggerDelay={0.15}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Dynamic features based on service type */}
            {service.slug === 'communications-pr' && (
              <>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-blue-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-blue-600 transition-colors">
                    Media Relations
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Strategic media outreach and relationship building with key journalists and influencers in the luxury sector.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-green-600 transition-colors">
                    Brand Positioning
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Develop compelling brand narratives that differentiate your luxury brand in competitive markets.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-purple-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-purple-600 transition-colors">
                    Content Strategy
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Create engaging content calendars and storytelling frameworks that resonate with luxury audiences.
                  </p>
                </div>
              </>
            )}
            
            {service.slug === 'experiences-events' && (
              <>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-yellow-200">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-yellow-600 transition-colors">
                    Event Planning
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    End-to-end event management from concept to execution, ensuring flawless luxury experiences.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-pink-200">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-pink-600 transition-colors">
                    VIP Experiences
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Curate exclusive experiences that create lasting emotional connections with your most valued clients.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-indigo-200">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-indigo-600 transition-colors">
                    Brand Activations
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Interactive brand experiences that engage audiences and create memorable brand moments.
                  </p>
                </div>
              </>
            )}
            
            {service.slug === 'customer-relationship-management' && (
              <>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-emerald-200">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-emerald-600 transition-colors">
                    Customer Segmentation
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Advanced customer profiling and segmentation strategies for personalized luxury experiences.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-cyan-200">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-cyan-600 transition-colors">
                    Email Marketing
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Sophisticated email campaigns with personalization and automation for luxury customer journeys.
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-orange-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-orange-600 transition-colors">
                    Analytics & Insights
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Comprehensive reporting and data analysis to optimize customer engagement and ROI.
                  </p>
                </div>
              </>
            )}
          </StaggeredReveal>
        </div>
      </section>

      {/* Related Services with Staggered Animation */}
      {relatedServices.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-primary-100">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <ScrollTriggeredReveal direction="up" delay={100}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 text-center mb-8 sm:mb-12">
                Other Services
              </h2>
            </ScrollTriggeredReveal>
            <StaggeredReveal 
              direction="up" 
              staggerDelay={0.2}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
            >
              {relatedServices.map((relatedService) => (
                <Link key={relatedService.id} href={`/services/${relatedService.slug}`}>
                  <div className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                    {relatedService.icon && (
                      <div className="text-3xl mb-3">{relatedService.icon}</div>
                    )}
                    <h3 className="text-xl font-bold text-neutral-800 mb-2 group-hover:text-primary-500 transition-colors">
                      {relatedService.title}
                    </h3>
                    <div className="text-primary-500 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                      Learn More →
                    </div>
                  </div>
                </Link>
              ))}
            </StaggeredReveal>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Let's discuss how we can help elevate your luxury brand.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-accent-gold text-neutral-900 font-semibold rounded-xl hover:bg-accent-gold-light transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
