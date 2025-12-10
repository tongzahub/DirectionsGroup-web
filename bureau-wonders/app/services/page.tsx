import { Metadata } from 'next';
import Link from 'next/link';
import { strapiClient } from '@/lib/strapi-client';
import { generateStaticPageMetadata } from '@/lib/metadata';
import Card from '@/components/ui/Card';

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
  let pageContent = null;
  let services = [];
  let industries = [];
  let error: string | null = null;

  try {
    [pageContent, services, industries] = await Promise.all([
      strapiClient.getPage('services'),
      strapiClient.getServices(),
      strapiClient.getIndustries(),
    ]);
  } catch (err) {
    console.error('Error fetching Services page:', err);
    error = 'Unable to load content. Please try again later.';
  }

  if (error || !pageContent) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-gray-dark mb-4">
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-blue via-accent-light-blue to-primary-blue py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
              Our Services
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed">
              Comprehensive luxury brand communications solutions tailored to elevate your brand
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      {services.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-gray-dark mb-4">
                What We Offer
              </h2>
              <p className="text-lg sm:text-xl text-neutral-gray max-w-3xl mx-auto">
                Strategic services designed to amplify your brand's presence in the luxury market
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {services.map((service, index) => (
                <Link key={service.id} href={`/services/${service.slug}`}>
                  <Card 
                    className="h-full p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-primary-blue"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    {service.icon && (
                      <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                    )}
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-gray-dark mb-3 sm:mb-4 group-hover:text-primary-blue transition-colors">
                      {service.title}
                    </h3>
                    <div className="text-neutral-gray text-sm sm:text-base leading-relaxed line-clamp-4 mb-4">
                      {typeof service.description === 'string' 
                        ? service.description.replace(/[#*]/g, '').substring(0, 180) + '...'
                        : 'Learn more about this service'}
                    </div>
                    <div className="mt-auto pt-4 text-primary-blue font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                      Learn More 
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Industries Section */}
      {industries.length > 0 && (
        <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-accent-mist-blue to-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-gray-dark mb-4">
                Industries We Serve
              </h2>
              <p className="text-lg sm:text-xl text-neutral-gray max-w-3xl mx-auto">
                Specialized expertise across the luxury landscape
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {industries.map((industry, index) => (
                <Card
                  key={industry.id}
                  className="text-center p-5 sm:p-6 md:p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white group cursor-pointer"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.05}s both`
                  }}
                >
                  {industry.icon && (
                    <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      {industry.icon}
                    </div>
                  )}
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-gray-dark group-hover:text-primary-blue transition-colors">
                    {industry.name}
                  </h3>
                  {industry.description && (
                    <p className="text-xs sm:text-sm text-neutral-gray mt-2 line-clamp-2">
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
      <section className="py-16 sm:py-20 md:py-24 bg-primary-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Elevate Your Brand?
          </h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-10 text-white/90">
            Let's discuss how we can help you achieve your communications goals
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-white text-primary-blue px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-accent-mist transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
