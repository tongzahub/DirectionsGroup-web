import { Metadata } from 'next';
import { strapiClient } from '@/lib/strapi-client';
import { AboutSection } from '@/types';
import { generateStaticPageMetadata } from '@/lib/metadata';
import ContentSection from '@/components/content/ContentSection';
import AboutSubmenu from '@/components/layout/AboutSubmenu';
import { ScrollTriggeredReveal, StaggeredReveal } from '@/components/animations';
import WebGLOrb from '@/components/backgrounds/WebGLOrb';
import { ClientOnly } from '@/components/utils';

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
      {/* Enhanced Hero Section with WebGL Orb Background */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-black">
        {/* WebGL Orb Background */}
        <ClientOnly fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
        }>
          <WebGLOrb 
            className="absolute inset-0 z-0"
            hue={45} // Gold hue
            hoverIntensity={0.3}
            rotateOnHover={true}
            forceHoverState={false}
          />
        </ClientOnly>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
          <ScrollTriggeredReveal direction="up" delay={200}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              {pageContent.title}
            </h1>
          </ScrollTriggeredReveal>
          <ScrollTriggeredReveal direction="up" delay={400}>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-neutral-200 mb-8">
              Discover who we are, what we believe, and how we create extraordinary experiences for luxury brands.
            </p>
          </ScrollTriggeredReveal>
          <ScrollTriggeredReveal direction="up" delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-accent-gold to-accent-gold-light text-neutral-900 font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
              >
                Explore Our Work
              </a>
            </div>
          </ScrollTriggeredReveal>
        </div>
      </section>

      {/* Submenu Navigation */}
      <ScrollTriggeredReveal direction="fade" delay={100}>
        <AboutSubmenu sections={sections} />
      </ScrollTriggeredReveal>

      {/* Main Content with Enhanced Design */}
      <section className="relative bg-white py-20 md:py-28">
        {/* Subtle WebGL Orb for Content */}
        <ClientOnly>
          <WebGLOrb 
            className="absolute inset-0 z-0 opacity-20"
            hue={30} // Warm gold
            hoverIntensity={0.1}
            rotateOnHover={false}
            forceHoverState={false}
          />
        </ClientOnly>
        
        <div className="relative z-10">
          <StaggeredReveal 
            direction="up" 
            staggerDelay={0.2}
          >
            <ContentSection
              content={pageContent.content}
              layout="single"
              className="py-0"
            />
          </StaggeredReveal>
        </div>
      </section>

      {/* Enhanced Call to Action Section */}
      <ScrollTriggeredReveal direction="up" delay={300}>
        <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-black py-20 md:py-28 overflow-hidden">
          {/* Dark WebGL Orb Background */}
          <ClientOnly>
            <WebGLOrb 
              className="absolute inset-0 z-0"
              hue={60} // Bright gold
              hoverIntensity={0.4}
              rotateOnHover={true}
              forceHoverState={false}
            />
          </ClientOnly>
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Create Something
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-accent-gold-light">
                Extraordinary?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-neutral-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover how The Bureau of Wonders can help your luxury brand tell its story and connect with the right audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-accent-gold to-accent-gold-light text-neutral-900 font-bold rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start a Conversation
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm text-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Explore Our Services
              </a>
            </div>
          </div>
        </section>
      </ScrollTriggeredReveal>
    </main>
  );
}
