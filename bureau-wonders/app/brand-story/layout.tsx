import { metadata } from './metadata';
import type { Metadata } from 'next';

// Export the metadata for this route
export { metadata };

interface BrandStoryLayoutProps {
  children: React.ReactNode;
}

export default function BrandStoryLayout({ children }: BrandStoryLayoutProps) {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'Brand Story - The Bureau of Wonders',
            description: 'Discover how The Bureau of Wonders transforms luxury brands through strategic StoryBrand framework communications.',
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/brand-story`,
            mainEntity: {
              '@type': 'Organization',
              name: 'The Bureau of Wonders',
              description: 'Luxury brand communications and PR agency specializing in strategic storytelling and brand transformation.',
              url: process.env.NEXT_PUBLIC_SITE_URL,
              sameAs: [
                // Add social media URLs when available
                // 'https://linkedin.com/company/bureau-of-wonders',
                // 'https://twitter.com/bureauofwonders'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`
              },
              areaServed: {
                '@type': 'Place',
                name: 'Global'
              },
              serviceType: [
                'Brand Communications',
                'Strategic Storytelling',
                'Luxury Brand Marketing',
                'Public Relations',
                'Brand Strategy'
              ]
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: process.env.NEXT_PUBLIC_SITE_URL
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Brand Story',
                  item: `${process.env.NEXT_PUBLIC_SITE_URL}/brand-story`
                }
              ]
            }
          })
        }}
      />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS prefetch for potential external resources */}
      <link rel="dns-prefetch" href="//api.placeholder" />
      
      {children}
    </>
  );
}