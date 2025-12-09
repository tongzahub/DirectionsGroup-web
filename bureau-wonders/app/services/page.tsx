import { Metadata } from 'next';
import Link from 'next/link';
import { strapiClient } from '@/lib/strapi-client';
import { generateStaticPageMetadata } from '@/lib/metadata';
import ContentSection from '@/components/content/ContentSection';
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
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-blue to-accent-light-blue py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            {pageContent.title}
          </h1>
        </div>
      </section>

      {/* Services Grid */}
      {services.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service) => (
                <Link key={service.id} href={`/services/${service.slug}`}>
                  <Card className="h-full p-6 sm:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    {service.icon && (
                      <div className="text-4xl mb-4">{service.icon}</div>
                    )}
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-gray-dark mb-3 group-hover:text-primary-blue transition-colors">
                      {service.title}
                    </h3>
                    <div className="text-neutral-gray line-clamp-3">
                      {typeof service.description === 'string' 
                        ? service.description.substring(0, 150) + '...'
                        : 'Learn more about this service'}
                    </div>
                    <div className="mt-4 text-primary-blue font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
                      Learn More →
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
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-accent-mist-blue">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-gray-dark text-center mb-8 sm:mb-10 md:mb-12">
              Industries We Serve
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {industries.map((industry) => (
                <Card
                  key={industry.id}
                  className="text-center p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  {industry.icon && (
                    <div className="text-3xl mb-2">{industry.icon}</div>
                  )}
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-gray-dark">
                    {industry.name}
                  </h3>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
