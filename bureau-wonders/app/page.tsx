import { Metadata } from 'next';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import { SITE_NAME } from '@/lib/constants';
import HeroSection from '@/components/content/HeroSection';
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
          <HeroSection
            title={settings?.siteName || SITE_NAME}
            subtitle={introText}
            ctaText="Explore Our Services"
            ctaLink="/services"
            useGradient={true}
          />
        </>
      )}
    </main>
  );
}
