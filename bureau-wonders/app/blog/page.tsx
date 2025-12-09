import React from 'react';
import { Metadata } from 'next';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import BlogGrid from '@/components/grids/BlogGrid';

export const revalidate = 60; // ISR with 60s revalidation

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog & Insights',
  description: 'Explore our latest news, case studies, and thought leadership in luxury brand communications and PR.',
  keywords: ['luxury brand blog', 'PR insights', 'brand communications', 'thought leadership', 'case studies'],
});

export default async function BlogPage() {
  let posts;
  let error = null;

  try {
    posts = await strapiClient.getBlogPosts();
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    error = err;
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-blue to-accent-mist py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Blog & Insights
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl">
            Explore our latest news, case studies, and thought leadership in luxury brand communications.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          {error ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-neutral-gray text-base sm:text-lg">
                Unable to load blog posts. Please try again later.
              </p>
            </div>
          ) : !posts || posts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-neutral-gray text-base sm:text-lg">
                No blog posts available yet. Check back soon!
              </p>
            </div>
          ) : (
            <BlogGrid posts={posts} />
          )}
        </div>
      </section>
    </main>
  );
}
