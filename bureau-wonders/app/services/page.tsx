import { Metadata } from 'next';
import Link from 'next/link';
import { strapiClient } from '@/lib/strapi-client';
import { generateStaticPageMetadata } from '@/lib/metadata';
import { Service, Industry, Page } from '@/types';
import Card from '@/components/ui/Card';
import { ParallaxServiceShowcase, ParallaxHero } from '@/components/animations';
import { serviceShowcasePresets } from '@/components/animations/ParallaxServiceShowcase';
import { FadeInUp, StaggerReveal } from '@/components/animations';
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
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white services-page services-pattern-bg">
      {/* Enhanced Hero Section with Parallax */}
      <ParallaxHero
        height="h-[70vh] md:h-[80vh] lg:h-[85vh]"
        overlayGradient="from-primary-100/90 via-white/70 to-primary-50/90"
        intensity={0.3}
        enableMultiLayer={true}
        decorativeElements={true}
      >
        <FadeInUp delay={0.2}>
          <div className="text-center text-neutral-800 max-w-6xl mx-auto">
            <div className="mb-6 inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <span className="text-sm font-medium text-primary-700 tracking-wide uppercase">
                Premium Services
              </span>
            </div>
            <h1 className="luxury-text-display-xl font-bold mb-6 text-shadow-md text-luxury-gradient">
              Elevate Your Brand
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-8 text-neutral-700 leading-relaxed">
              Comprehensive luxury communications solutions
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto text-neutral-600 font-light">
              Crafted for discerning brands that demand excellence in every touchpoint
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/contact"
                className="group luxury-button inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-full font-semibold text-lg hover:bg-primary-700 transition-all duration-300 hover:scale-105 luxury-shadow-md hover:luxury-shadow-lg relative z-10"
              >
                Start Your Journey
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="#services-overview"
                className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-primary-700 rounded-full font-semibold text-lg hover:bg-white transition-all duration-300 hover:scale-105 luxury-shadow-sm hover:luxury-shadow-md border border-primary-200"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </FadeInUp>
      </ParallaxHero>

      {/* Enhanced Services Grid with Parallax */}
      {services.length > 0 && (
        <section id="services-overview" className="py-20 sm:py-24 md:py-28 lg:py-32 bg-white relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-gold/20 rounded-full blur-3xl opacity-20" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-50 to-transparent opacity-40" />
          </div>

          <div className="luxury-container relative z-10">
            <FadeInUp delay={0.1}>
              <div className="text-center mb-16 sm:mb-20">
                <div className="mb-6 inline-flex items-center px-4 py-2 bg-primary-100 rounded-full">
                  <span className="text-sm font-medium text-primary-700 tracking-wide uppercase">
                    Our Expertise
                  </span>
                </div>
                <h2 className="luxury-text-display-lg font-bold text-neutral-800 mb-6">
                  Exceptional Services
                </h2>
                <p className="text-xl sm:text-2xl text-neutral-600 max-w-4xl mx-auto font-light leading-relaxed">
                  Strategic services designed to amplify your brand's presence in the luxury market
                </p>
              </div>
            </FadeInUp>

            <StaggerReveal className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              {services.map((service, index) => {
                const gradients = [
                  'from-blue-50 to-indigo-50',
                  'from-amber-50 to-orange-50', 
                  'from-emerald-50 to-teal-50'
                ];
                const iconColors = [
                  'text-blue-600',
                  'text-amber-600',
                  'text-emerald-600'
                ];
                const borderColors = [
                  'hover:border-blue-200',
                  'hover:border-amber-200',
                  'hover:border-emerald-200'
                ];
                
                return (
                  <Link key={service.id} href={`/services/${service.slug}`} className="group">
                    <div className={cn(
                      "service-card relative h-full p-8 lg:p-10 rounded-3xl border-2 border-transparent transition-all duration-500 cursor-pointer overflow-hidden",
                      "bg-gradient-to-br", gradients[index % 3],
                      "hover:scale-[1.02] hover:luxury-shadow-xl service-card-float",
                      borderColors[index % 3],
                      "backdrop-blur-sm"
                    )}>
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
                        <div className={cn(
                          "absolute top-4 right-4 w-24 h-24 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150",
                          index === 0 ? "bg-blue-200/50" : index === 1 ? "bg-amber-200/50" : "bg-emerald-200/50"
                        )} />
                      </div>
                      
                      {/* Service Icon */}
                      {service.icon && (
                        <div className={cn(
                          "text-6xl lg:text-7xl mb-6 transition-all duration-500 relative z-10",
                          "group-hover:scale-110 group-hover:rotate-3",
                          iconColors[index % 3]
                        )}>
                          {service.icon}
                        </div>
                      )}
                      
                      {/* Service Title */}
                      <h3 className="text-2xl lg:text-3xl font-bold text-neutral-800 mb-4 group-hover:text-primary-700 transition-colors duration-300 relative z-10 leading-tight">
                        {service.title}
                      </h3>
                      
                      {/* Service Description */}
                      <div className="text-neutral-600 text-base lg:text-lg leading-relaxed mb-6 relative z-10 font-light">
                        {typeof service.description === 'string' 
                          ? service.description.replace(/[#*]/g, '').substring(0, 160) + '...'
                          : 'Discover how we can elevate your brand with our specialized expertise.'}
                      </div>
                      
                      {/* CTA */}
                      <div className="mt-auto pt-6 relative z-10">
                        <div className="inline-flex items-center text-primary-600 font-semibold text-lg group-hover:text-primary-700 transition-all duration-300 group-hover:translate-x-2">
                          Explore Service
                          <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </StaggerReveal>
          </div>
        </section>
      )}

      {/* Enhanced Industries Section */}
      {industries.length > 0 && (
        <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-gradient-to-b from-primary-50 via-white to-neutral-50 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 right-20 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
          </div>

          <div className="luxury-container relative z-10">
            <FadeInUp delay={0.2}>
              <div className="text-center mb-16 sm:mb-20">
                <div className="mb-6 inline-flex items-center px-4 py-2 bg-accent-gold/10 rounded-full">
                  <span className="text-sm font-medium text-accent-gold tracking-wide uppercase">
                    Luxury Sectors
                  </span>
                </div>
                <h2 className="luxury-text-display-lg font-bold text-neutral-800 mb-6">
                  Industries We Serve
                </h2>
                <p className="text-xl sm:text-2xl text-neutral-600 max-w-4xl mx-auto font-light leading-relaxed">
                  Specialized expertise across the luxury landscape, tailored to each sector's unique requirements
                </p>
              </div>
            </FadeInUp>
            
            <StaggerReveal className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
              {industries.map((industry, index) => (
                <div
                  key={industry.id}
                  className="group relative"
                >
                  <div className="industry-card relative text-center p-6 sm:p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white hover:luxury-shadow-lg transition-all duration-500 cursor-pointer overflow-hidden hover:scale-105">
                    {/* Hover background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Industry Icon */}
                    {industry.icon && (
                      <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-all duration-500 relative z-10 group-hover:rotate-3">
                        {industry.icon}
                      </div>
                    )}
                    
                    {/* Industry Name */}
                    <h3 className="text-sm sm:text-base font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors duration-300 relative z-10 mb-2">
                      {industry.name}
                    </h3>
                    
                    {/* Industry Description */}
                    {industry.description && (
                      <p className="text-xs sm:text-sm text-neutral-600 group-hover:text-neutral-700 transition-colors duration-300 relative z-10 line-clamp-2 font-light">
                        {typeof industry.description === 'string' 
                          ? industry.description.replace(/[#*]/g, '').substring(0, 50) + '...'
                          : ''}
                      </p>
                    )}

                    {/* Decorative element */}
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-primary-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150 blur-sm" />
                  </div>
                </div>
              ))}
            </StaggerReveal>

            {/* Additional Industries CTA */}
            <FadeInUp delay={0.4}>
              <div className="text-center mt-16">
                <p className="text-lg text-neutral-600 mb-6 font-light">
                  Don't see your industry? We work with brands across all luxury sectors.
                </p>
                <Link 
                  href="/contact"
                  className="luxury-button inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-all duration-300 hover:scale-105 luxury-shadow-md hover:luxury-shadow-lg relative z-10"
                >
                  Discuss Your Sector
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </FadeInUp>
          </div>
        </section>
      )}

      {/* Enhanced CTA Section */}
      <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-gradient-to-br from-primary-800 via-primary-900 to-neutral-900 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary-700/20 to-transparent" />
        </div>

        <div className="luxury-container relative z-10">
          <FadeInUp delay={0.1}>
            <div className="text-center max-w-5xl mx-auto">
              <div className="mb-8 inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-sm font-medium text-accent-gold tracking-wide uppercase">
                  Ready to Begin?
                </span>
              </div>
              
              <h2 className="luxury-text-display-lg font-bold mb-6 text-shadow-lg">
                Transform Your Brand Story
              </h2>
              
              <p className="text-xl sm:text-2xl mb-4 text-white/90 font-light leading-relaxed max-w-4xl mx-auto">
                Let's craft a communications strategy that reflects your brand's true luxury
              </p>
              
              <p className="text-lg text-white/70 mb-12 font-light max-w-3xl mx-auto">
                Schedule a consultation to discover how we can elevate your brand's presence in the luxury market
              </p>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link 
                  href="/contact"
                  className="group luxury-button inline-flex items-center px-10 py-5 bg-accent-gold text-neutral-900 rounded-full font-semibold text-lg hover:bg-accent-gold-light transition-all duration-300 hover:scale-105 luxury-shadow-xl hover:luxury-shadow-2xl relative z-10"
                >
                  Start Your Journey
                  <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <Link 
                  href="/about"
                  className="group luxury-button inline-flex items-center px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/30 hover:border-white/50 relative z-10"
                >
                  Learn About Us
                  <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-16 pt-12 border-t border-white/20">
                <p className="text-sm text-white/60 mb-6 font-light">
                  Trusted by luxury brands worldwide
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                  <div className="text-2xl">💎</div>
                  <div className="text-2xl">⌚</div>
                  <div className="text-2xl">👗</div>
                  <div className="text-2xl">🏛️</div>
                  <div className="text-2xl">🎨</div>
                  <div className="text-2xl">🏨</div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

    </main>
  );
}
