import { Metadata } from 'next';
import { strapiClient } from '@/lib/strapi-client';
import { AboutSection } from '@/types';
import { generateStaticPageMetadata } from '@/lib/metadata';
import ContentSection from '@/components/content/ContentSection';
import AboutSubmenu from '@/components/layout/AboutSubmenu';
import { ScrollTriggeredReveal, StaggeredReveal, ParallaxHero } from '@/components/animations';

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
  let sections: AboutSection[] = [];
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
      {/* Page Header with Parallax */}
      <ParallaxHero
        height="h-96 md:h-[500px]"
        overlayGradient="from-white/95 via-accent-mist-blue/60 to-white/95"
        intensity={0.3}
        enableMultiLayer={false}
        decorativeElements={true}
      >
        <div className="text-center text-neutral-gray-dark">
          <ScrollTriggeredReveal direction="up" delay={200}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-sm">
              {pageContent.title}
            </h1>
          </ScrollTriggeredReveal>
          <ScrollTriggeredReveal direction="up" delay={400}>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Discover who we are, what we believe, and how we create extraordinary experiences for luxury brands.
            </p>
          </ScrollTriggeredReveal>
        </div>
      </ParallaxHero>

      {/* Submenu Navigation */}
      <ScrollTriggeredReveal direction="fade" delay={100}>
        <AboutSubmenu sections={sections} />
      </ScrollTriggeredReveal>

      {/* Main Content with Staggered Reveals */}
      <StaggeredReveal 
        direction="up" 
        staggerDelay={0.2}
        className="bg-white"
      >
        <ContentSection
          content={pageContent.content}
          layout="single"
          className="bg-white py-16 md:py-20"
        />
      </StaggeredReveal>

      {/* Call to Action Section */}
      <ScrollTriggeredReveal direction="up" delay={300}>
        <section className="bg-gradient-to-br from-accent-mist-blue to-white py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-gray-dark mb-6">
              Ready to Create Something Extraordinary?
            </h2>
            <p className="text-lg text-neutral-gray-dark mb-8 max-w-2xl mx-auto">
              Discover how The Bureau of Wonders can help your luxury brand tell its story and connect with the right audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-primary-blue/90 transition-colors"
              >
                Start a Conversation
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary-blue text-primary-blue font-semibold rounded-lg hover:bg-primary-blue hover:text-white transition-colors"
              >
                Explore Our Services
              </a>
            </div>
          </div>
        </section>
      </ScrollTriggeredReveal>
    </main>
  );
}
