import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { strapiClient } from '@/lib/strapi-client';
import { generateStaticPageMetadata } from '@/lib/metadata';
import ContentSection from '@/components/content/ContentSection';
import AboutSubmenu from '@/components/layout/AboutSubmenu';

// Enable ISR with 300s revalidation
export const revalidate = 300;

interface AboutSectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for the About section page
export async function generateMetadata({ params }: AboutSectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const section = await strapiClient.getAboutSection(slug);
    return generateStaticPageMetadata({
      title: section.title,
      seoTitle: section.seoTitle,
      metaDescription: section.metaDescription || `Learn about ${section.title} at The Bureau of Wonders.`,
      keywords: ['about us', 'luxury brand agency', section.title.toLowerCase()],
    });
  } catch (error) {
    console.error('Error fetching About section metadata:', error);
    return {
      title: 'About',
      description: 'Learn about The Bureau of Wonders.',
    };
  }
}

export default async function AboutSectionPage({ params }: AboutSectionPageProps) {
  const { slug } = await params;
  
  let section = null;
  let sections = [];

  try {
    section = await strapiClient.getAboutSection(slug);
    sections = await strapiClient.getAboutSections();
  } catch (err) {
    console.error('Error fetching About section:', err);
    notFound();
  }

  if (!section) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="bg-white border-b border-neutral-gray-light py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-gray-dark mb-4">
            {section.title}
          </h1>
        </div>
      </section>

      {/* Submenu Navigation */}
      <AboutSubmenu sections={sections} />

      {/* Main Content */}
      <ContentSection
        content={section.content}
        layout="single"
        className="bg-white"
      />
    </main>
  );
}
