import { Metadata } from 'next';
import { SITE_NAME } from './constants';
import { Media } from '@/types';

interface GenerateMetadataParams {
  title?: string;
  description?: string;
  ogImage?: Media;
  type?: 'website' | 'article';
  publishedTime?: string;
  keywords?: string[];
}

/**
 * Generate consistent metadata for pages
 * Provides fallback values when SEO fields are not defined
 */
export function generatePageMetadata({
  title,
  description,
  ogImage,
  type = 'website',
  publishedTime,
  keywords,
}: GenerateMetadataParams): Metadata {
  const defaultDescription = 'Luxury brand communications and PR agency specializing in jewelry, watches, fashion, and more.';
  
  const metadata: Metadata = {
    title: title || SITE_NAME,
    description: description || defaultDescription,
  };

  // Add keywords if provided
  if (keywords && keywords.length > 0) {
    metadata.keywords = keywords;
  }

  // Open Graph metadata
  metadata.openGraph = {
    title: title || SITE_NAME,
    description: description || defaultDescription,
    type,
    siteName: SITE_NAME,
  };

  // Add OG image if provided
  if (ogImage && metadata.openGraph) {
    metadata.openGraph.images = [
      {
        url: ogImage.url,
        width: ogImage.width,
        height: ogImage.height,
        alt: ogImage.alternativeText || title || SITE_NAME,
      },
    ];
  }

  // Add published time for articles
  if (type === 'article' && publishedTime && metadata.openGraph) {
    (metadata.openGraph as any).publishedTime = publishedTime;
  }

  // Twitter Card metadata
  metadata.twitter = {
    card: 'summary_large_image',
    title: title || SITE_NAME,
    description: description || defaultDescription,
  };

  if (ogImage) {
    metadata.twitter.images = [ogImage.url];
  }

  return metadata;
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogPostMetadata({
  title,
  excerpt,
  seoTitle,
  metaDescription,
  featuredImage,
  publishedAt,
  category,
}: {
  title: string;
  excerpt: string;
  seoTitle?: string;
  metaDescription?: string;
  featuredImage?: Media;
  publishedAt: string;
  category: string;
}): Metadata {
  return generatePageMetadata({
    title: seoTitle || `${title} | ${SITE_NAME}`,
    description: metaDescription || excerpt,
    ogImage: featuredImage,
    type: 'article',
    publishedTime: publishedAt,
    keywords: ['luxury brand communications', 'PR', category.toLowerCase()],
  });
}

/**
 * Generate metadata for case studies
 */
export function generateCaseStudyMetadata({
  title,
  client,
  seoTitle,
  metaDescription,
  featuredImage,
  publishedAt,
}: {
  title: string;
  client: string;
  seoTitle?: string;
  metaDescription?: string;
  featuredImage?: Media;
  publishedAt: string;
}): Metadata {
  return generatePageMetadata({
    title: seoTitle || `${title} | ${SITE_NAME}`,
    description: metaDescription || `Case study: ${client} - ${title}`,
    ogImage: featuredImage,
    type: 'article',
    publishedTime: publishedAt,
    keywords: ['case study', 'luxury brand', 'PR campaign', client.toLowerCase()],
  });
}

/**
 * Generate metadata for static pages
 */
export function generateStaticPageMetadata({
  title,
  seoTitle,
  metaDescription,
  ogImage,
  keywords,
}: {
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: Media;
  keywords?: string[];
}): Metadata {
  return generatePageMetadata({
    title: seoTitle || `${title} | ${SITE_NAME}`,
    description: metaDescription,
    ogImage,
    keywords,
  });
}
