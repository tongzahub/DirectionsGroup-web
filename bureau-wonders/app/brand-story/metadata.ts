import { Metadata } from 'next';

const BRAND_STORY_TITLE = 'Our Brand Story - Transforming Luxury Communications | The Bureau of Wonders';
const BRAND_STORY_DESCRIPTION = 'Discover how The Bureau of Wonders transforms luxury brands through strategic StoryBrand framework communications. See our proven methodology, client success stories, and results-driven approach to luxury brand storytelling.';
const BRAND_STORY_KEYWORDS = [
  'luxury brand communications',
  'StoryBrand framework',
  'brand storytelling',
  'strategic communications',
  'brand transformation',
  'luxury marketing agency',
  'brand narrative',
  'client success stories',
  'luxury brand strategy',
  'communications consulting'
];

export const metadata: Metadata = {
  title: BRAND_STORY_TITLE,
  description: BRAND_STORY_DESCRIPTION,
  keywords: BRAND_STORY_KEYWORDS.join(', '),
  
  // Enhanced Open Graph
  openGraph: {
    title: BRAND_STORY_TITLE,
    description: BRAND_STORY_DESCRIPTION,
    type: 'website',
    url: '/brand-story',
    siteName: 'The Bureau of Wonders Company Limited',
    locale: 'en_US',
    images: [
      {
        url: '/images/brand-story-og.jpg', // This would be created later
        width: 1200,
        height: 630,
        alt: 'The Bureau of Wonders Brand Story - Luxury Communications Agency',
      },
    ],
  },
  
  // Enhanced Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: BRAND_STORY_TITLE,
    description: BRAND_STORY_DESCRIPTION,
    images: ['/images/brand-story-twitter.jpg'], // This would be created later
    creator: '@BureauOfWonders',
    site: '@BureauOfWonders',
  },
  
  // Additional SEO enhancements
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Structured data hints
  other: {
    'article:author': 'The Bureau of Wonders',
    'article:section': 'About',
    'og:type': 'website',
    'og:locale': 'en_US',
  },
  
  // Canonical URL
  alternates: {
    canonical: '/brand-story',
  },
};