import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import BlogGrid from '@/components/grids/BlogGrid';
import { ErrorState, EmptyState } from '@/components/animations';

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
      <section className="bg-white border-b border-neutral-200 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 mb-3 sm:mb-4">
            Blog & Insights
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            Explore our latest news, case studies, and thought leadership in luxury brand communications.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-neutral-200">
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
                      ? 'bg-primary-500 text-white'
                      : 'bg-primary-100 text-neutral-800 hover:bg-primary-200'
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
            <ErrorState
              type="server"
              title="Unable to Load Blog Posts"
              message="We're having trouble loading the blog posts. Please try again in a moment."
              onRetry={() => window.location.reload()}
              retryLabel="Reload Page"
            />
          ) : !posts || posts.length === 0 ? (
            <EmptyState
              title="No Blog Posts Yet"
              message="We're working on some great content. Check back soon for our latest insights and news!"
              icon={
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              }
            />
          ) : (
            <BlogGrid posts={posts} />
          )}
        </div>
      </section>
    </main>
  );
}
