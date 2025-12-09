import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import BlogGrid from '@/components/grids/BlogGrid';

export const revalidate = 60; // ISR with 60s revalidation

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog & Insights',
  description: 'Explore our latest news, case studies, and thought leadership in luxury brand communications and PR.',
  keywords: ['luxury brand blog', 'PR insights', 'brand communications', 'thought leadership', 'case studies'],
});

const categories = [
  { name: 'All', value: undefined },
  { name: 'News', value: 'News' },
  { name: 'Case Studies', value: 'Case Study' },
  { name: 'Thought Leadership', value: 'Thought Leadership' },
];

interface BlogPageProps {
  searchParams: {
    category?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  let posts;
  let error = null;
  const selectedCategory = searchParams.category;

  try {
    posts = await strapiClient.getBlogPosts(
      selectedCategory ? { category: selectedCategory } : undefined
    );
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    error = err;
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-gray-light py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-gray-dark mb-3 sm:mb-4">
            Blog & Insights
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-gray max-w-2xl mx-auto">
            Explore our latest news, case studies, and thought leadership in luxury brand communications.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-neutral-gray/20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <div className="flex flex-wrap gap-2 sm:gap-4 py-4">
            {categories.map((category) => {
              const isActive = selectedCategory === category.value || (!selectedCategory && !category.value);
              return (
                <Link
                  key={category.name}
                  href={category.value ? `/blog?category=${category.value}` : '/blog'}
                  className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-blue text-white'
                      : 'bg-accent-mist text-neutral-gray-dark hover:bg-accent-mist-blue'
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
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
