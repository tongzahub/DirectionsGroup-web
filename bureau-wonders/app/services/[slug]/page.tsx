import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import ContentSection from '@/components/content/ContentSection';

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
      <section className="bg-accent-mist py-4">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-neutral-gray hover:text-primary-blue transition-colors">
              Home
            </Link>
            <span className="text-neutral-gray">/</span>
            <Link href="/services" className="text-neutral-gray hover:text-primary-blue transition-colors">
              Services
            </Link>
            <span className="text-neutral-gray">/</span>
            <span className="text-neutral-gray-dark font-medium">{service.title}</span>
          </nav>
        </div>
      </section>

      {/* Service Header */}
      <section className="bg-gradient-to-br from-primary-blue to-accent-light-blue py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          {service.icon && (
            <div className="text-6xl mb-6">{service.icon}</div>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            {service.title}
          </h1>
        </div>
      </section>

      {/* Service Content */}
      <ContentSection
        content={service.description}
        layout="single"
        className="bg-white"
      />

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-accent-mist">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-gray-dark text-center mb-8 sm:mb-12">
              Other Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {relatedServices.map((relatedService) => (
                <Link key={relatedService.id} href={`/services/${relatedService.slug}`}>
                  <div className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                    {relatedService.icon && (
                      <div className="text-3xl mb-3">{relatedService.icon}</div>
                    )}
                    <h3 className="text-xl font-bold text-neutral-gray-dark mb-2 group-hover:text-primary-blue transition-colors">
                      {relatedService.title}
                    </h3>
                    <div className="text-primary-blue font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                      Learn More →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-primary-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Let's discuss how we can help elevate your luxury brand.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-primary-blue font-semibold rounded-xl hover:bg-accent-mist transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
