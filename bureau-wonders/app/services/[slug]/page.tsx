import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import ContentSection from '@/components/content/ContentSection';

export const revalidate = 300;

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  try {
    const service = await strapiClient.getService(params.slug);
    return generatePageMetadata({
      title: service.title,
      description: service.metaDescription || `Learn about our ${service.title} services for luxury brands.`,
      keywords: ['luxury services', service.title, 'brand communications'],
    });
  } catch (error) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  let service;
  let allServices = [];

  try {
    [service, allServices] = await Promise.all([
      strapiClient.getService(params.slug),
      strapiClient.getServices(),
    ]);
  } catch (error) {
    console.error('Error fetching service:', error);
    notFound();
  }

  // Filter out current service from related services
  const relatedServices = allServices.filter(s => s.slug !== params.slug);

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
