import { Metadata } from 'next';
import Link from 'next/link';
import { strapiClient } from '@/lib/strapi-client';
import { generateStaticPageMetadata } from '@/lib/metadata';
import { Service, Industry, Page } from '@/types';
import Card from '@/components/ui/Card';
import { ParallaxServiceShowcase, ParallaxHero } from '@/components/animations';
import { serviceShowcasePresets } from '@/components/animations/ParallaxServiceShowcase';
import { cn } from '@/lib/utils';

// Enable ISR with 300s revalidation
export const revalidate = 300;

// Generate metadata for the Services page
export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await strapiClient.getPage('services');
    return generateStaticPageMetadata({
      title: 'Services',
      seoTitle: page.seoTitle,
      metaDescription: page.metaDescription || 'Discover our luxury brand communications services: Communications & PR, Experiences & Events, and Customer Relationship Management.',
      ogImage: page.ogImage,
      keywords: ['luxury brand services', 'PR services', 'brand communications', 'event management', 'CRM'],
    });
  } catch (error) {
    console.error('Error fetching Services page metadata:', error);
    return {
      title: 'Services',
      description: 'Discover our luxury brand communications services.',
    };
  }
}

export default async function ServicesPage() {
  let pageContent: Page | null = null;
  let services: Service[] = [];
  let industries: Industry[] = [];
  let error: string | null = null;

  try {
    // Try to fetch from Strapi, but fall back to mock data if not available
    try {
      pageContent = await strapiClient.getPage('services');
    } catch (pageErr) {
      console.log('Using fallback page content');
      pageContent = {
        id: 1,
        slug: 'services',
        title: 'Our Services',
        seoTitle: 'Services - The Bureau of Wonders',
        metaDescription: 'Discover our luxury brand communications services: Communications & PR, Experiences & Events, and Customer Relationship Management.',
        content: 'Our comprehensive services for luxury brands',
        publishedAt: '2024-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };
    }

    try {
      services = await strapiClient.getServices();
    } catch (servicesErr) {
      console.log('Using fallback services data');
      services = [
        {
          id: 1,
          title: 'Communications & PR',
          slug: 'communications-pr',
          description: 'Strategic communications and public relations services for luxury brands including media relations, press releases, and brand positioning.',
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
          description: 'Create unforgettable luxury brand experiences including product launches, VIP events, and brand activations.',
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
          description: 'Build lasting customer relationships with personalized CRM, email marketing, and digital engagement strategies.',
          icon: '💎',
          order: 3,
          seoTitle: 'CRM Services',
          metaDescription: 'Build lasting customer relationships with personalized CRM.',
          publishedAt: '2024-01-01T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
    }

    try {
      industries = await strapiClient.getIndustries();
    } catch (industriesErr) {
      console.log('Using fallback industries data');
      industries = [
        { id: 1, name: 'Jewelry', slug: 'jewelry', description: 'Expertise in fine jewelry communications', icon: '💎', order: 1, publishedAt: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        { id: 2, name: 'Watch', slug: 'watch', description: 'Specialized knowledge in haute horlogerie', icon: '⌚', order: 2, publishedAt: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        { id: 3, name: 'Fashion', slug: 'fashion', description: 'Deep understanding of luxury fashion communications', icon: '👗', order: 3, publishedAt: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        { id: 4, name: 'Leather Goods', slug: 'leather-goods', description: 'Crafting narratives for premium leather goods', icon: '👜', order: 4, publishedAt: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        { id: 5, name: 'Real Estate', slug: 'real-estate', description: 'Luxury property marketing and communications', icon: '🏛️', order: 5, publishedAt: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        { id: 6, name: 'Finance', slug: 'finance', description: 'Private banking and wealth management communications', icon: '💰', order: 6, publishedAt: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        { id: 7, name: 'Hospitality', slug: 'hospitality', description: 'Five-star hotel and resort marketing', icon: '🏨', order: 7, publishedAt: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        { id: 8, name: 'Art', slug: 'art', description: 'Gallery, auction house, and fine art communications', icon: '🎨', order: 8, publishedAt: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        { id: 9, name: 'Design', slug: 'design', description: 'Luxury interior design and furniture brand communications', icon: '🪑', order: 9, publishedAt: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
        { id: 10, name: 'Insurance', slug: 'insurance', description: 'Premium insurance and risk management communications', icon: '🛡️', order: 10, publishedAt: '2024-01-01T00:00:00.000Z', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' },
      ];
    }
  } catch (err) {
    console.error('Error fetching Services page:', err);
    error = 'Unable to load content. Please try again later.';
  }

  if (error || !pageContent) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Our Services
          </h1>
          <p className="text-error text-lg">
            {error || 'Content not available.'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section with Parallax */}
      <ParallaxHero
        height="h-96 md:h-[500px] lg:h-[600px]"
        overlayGradient="from-primary-200/80 via-white/60 to-primary-200/80"
        intensity={0.4}
        enableMultiLayer={false}
        decorativeElements={true}
      >
        <div className="text-center text-neutral-800">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 drop-shadow-sm">
            Our Services
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto drop-shadow-sm">
            Comprehensive luxury brand communications solutions tailored to elevate your brand
          </p>
        </div>
      </ParallaxHero>

      {/* Services Grid with Parallax */}
      {services.length > 0 && (
        <ParallaxServiceShowcase
          className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white"
          backgroundElements={serviceShowcasePresets?.communications?.backgroundElements as any || []}
          intensity={0.3}
          enableInteraction={true}
        >
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
                What We Offer
              </h2>
              <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
                Strategic services designed to amplify your brand's presence in the luxury market
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {services.map((service, index) => {
                // Use different presets for different services
                const presetKey = index === 0 ? 'communications' : index === 1 ? 'events' : 'crm';
                
                return (
                  <Link key={service.id} href={`/services/${service.slug}`}>
                    <Card 
                      className={`h-full p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-primary-500 animate-fade-in-up relative overflow-hidden`}
                    >
                      {/* Service-specific background elements */}
                      <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <div className={cn(
                          "absolute top-2 right-2 w-16 h-16 rounded-full blur-lg",
                          index === 0 ? "bg-blue-200" : index === 1 ? "bg-yellow-200" : "bg-green-200"
                        )} />
                      </div>
                      
                      {service.icon && (
                        <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                          {service.icon}
                        </div>
                      )}
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-3 sm:mb-4 group-hover:text-primary-500 transition-colors relative z-10">
                        {service.title}
                      </h3>
                      <div className="text-neutral-600 text-sm sm:text-base leading-relaxed line-clamp-4 mb-4 relative z-10">
                        {typeof service.description === 'string' 
                          ? service.description.replace(/[#*]/g, '').substring(0, 180) + '...'
                          : 'Learn more about this service'}
                      </div>
                      <div className="mt-auto pt-4 text-primary-500 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center relative z-10">
                        Learn More 
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </ParallaxServiceShowcase>
      )}

      {/* Industries Section */}
      {industries.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-primary-100 to-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
                Industries We Serve
              </h2>
              <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
                Specialized expertise across the luxury landscape
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {industries.map((industry) => (
                <Card
                  key={industry.id}
                  className="text-center p-5 sm:p-6 md:p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white group cursor-pointer animate-fade-in-up"
                >
                  {industry.icon && (
                    <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      {industry.icon}
                    </div>
                  )}
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-800 group-hover:text-primary-500 transition-colors">
                    {industry.name}
                  </h3>
                  {industry.description && (
                    <p className="text-xs sm:text-sm text-neutral-600 mt-2 line-clamp-2">
                      {typeof industry.description === 'string' 
                        ? industry.description.replace(/[#*]/g, '').substring(0, 60)
                        : ''}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-primary-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Elevate Your Brand?
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-white/90">
            Let's discuss how we can help you achieve your communications goals
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-accent-gold text-neutral-900 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-accent-gold-light transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            Get in Touch
          </Link>
        </div>
      </section>

    </main>
  );
}
