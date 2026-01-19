import { Metadata } from 'next';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import { SITE_NAME } from '@/lib/constants';
import HeroSection from '@/components/content/HeroSection';
import { ParallaxHero } from '@/components/animations';
import FloatingLines from '@/components/animations/FloatingLines';
import { ClientOnly } from '@/components/utils';
import { SiteSettings } from '@/types';

// Enable ISR with 60s revalidation
export const revalidate = 60;

// Generate metadata for the homepage
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await strapiClient.getSiteSettings();
    return generatePageMetadata({
      title: 'Luxury Brand Communications & PR',
      description: 'The Bureau of Wonders is a luxury brand communications and PR agency specializing in jewelry, watches, fashion, and more.',
      keywords: ['luxury brand communications', 'PR agency', 'jewelry PR', 'fashion PR', 'luxury marketing', 'brand strategy'],
    });
  } catch (error) {
    console.error('Error fetching site settings for metadata:', error);
    return {
      title: 'Luxury Brand Communications & PR',
      description: 'The Bureau of Wonders is a luxury brand communications and PR agency.',
    };
  }
}

export default async function Home() {
  let settings: SiteSettings | null = null;
  let error: string | null = null;

  try {
    settings = await strapiClient.getSiteSettings();
  } catch (err) {
    console.error('Error fetching homepage data:', err);
    error = 'Unable to load content. Please try again later.';
  }

  // Extract intro text from settings
  const introText = settings?.homepageIntro 
    ? (typeof settings.homepageIntro === 'string' 
        ? settings.homepageIntro 
        : JSON.stringify(settings.homepageIntro))
    : 'Welcome to The Bureau of Wonders';

  return (
    <main className="min-h-screen">
      {error ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-error text-lg">{error}</p>
        </div>
      ) : (
        <>
          <div className="relative min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-900 overflow-hidden">
            {/* Floating Lines Background */}
            <ClientOnly>
              <FloatingLines 
                className="opacity-40"
                lineCount={10}
                colors={['#D4AF37', '#B8860B', '#CD853F', '#FFD700', '#F4A460', '#DAA520']}
                speed={0.6}
              />
            </ClientOnly>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 to-accent-copper/20"></div>
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent-copper/5 rounded-full blur-2xl"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen">
              <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
                <div className="text-white">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-lg">
                    {settings?.siteName || SITE_NAME}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-shadow-md text-neutral-100">
                    {introText}
                  </p>
                  <a
                    href="/services"
                    className="inline-block bg-accent-gold text-neutral-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent-gold-light transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                  >
                    Explore Our Services
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
