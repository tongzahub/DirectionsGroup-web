import { Metadata } from 'next';
import { strapiClient } from '@/lib/strapi-client';
import { generateStaticPageMetadata } from '@/lib/metadata';
import ContentSection from '@/components/content/ContentSection';
import AboutSubmenu from '@/components/layout/AboutSubmenu';

// Enable ISR with 300s revalidation
export const revalidate = 300;

// Generate metadata for the About page
export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await strapiClient.getPage('about');
    return generateStaticPageMetadata({
      title: 'About',
      seoTitle: page.seoTitle,
      metaDescription: page.metaDescription || 'Learn about The Bureau of Wonders - our story, philosophy, team, and values.',
      ogImage: page.ogImage,
      keywords: ['about us', 'luxury brand agency', 'brand story', 'agency values'],
    });
  } catch (error) {
    console.error('Error fetching About page metadata:', error);
    return {
      title: 'About',
      description: 'Learn about The Bureau of Wonders - our story, philosophy, team, and values.',
    };
  }
}

export default async function AboutPage() {
  let pageContent = null;
  let sections = [];
  let error: string | null = null;

  try {
    pageContent = await strapiClient.getPage('about');
    sections = await strapiClient.getAboutSections();
  } catch (err) {
    console.error('Error fetching About page:', err);
    error = 'Unable to load content. Please try again later.';
  }

  if (error || !pageContent) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-gray-dark mb-4">
            About Us
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
      <section className="bg-white border-b border-neutral-gray-light py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-gray-dark mb-4">
            {pageContent.title}
          </h1>
          <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
            Discover who we are, what we believe, and how we create extraordinary experiences for luxury brands.
          </p>
        </div>
      </section>

      {/* Submenu Navigation */}
      <AboutSubmenu sections={sections} />

      {/* Main Content */}
      <ContentSection
        content={pageContent.content}
        layout="single"
        className="bg-white"
      />
    </main>
  );
}
