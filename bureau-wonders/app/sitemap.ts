import { MetadataRoute } from 'next';
import { strapiClient } from '@/lib/strapi-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bureauofwonders.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

  try {
    // Fetch blog posts
    const blogPosts = await strapiClient.getBlogPosts();
    const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    // Fetch case studies
    const caseStudies = await strapiClient.getCaseStudies();
    const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
      url: `${baseUrl}/case-studies/${caseStudy.slug}`,
      lastModified: new Date(caseStudy.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...staticPages, ...blogPostPages, ...caseStudyPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if dynamic content fetch fails
    return staticPages;
  }
}
