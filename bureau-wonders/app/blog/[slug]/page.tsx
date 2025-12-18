import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { strapiClient, getStrapiMediaUrl } from '@/lib/strapi-client';
import { generateBlogPostMetadata } from '@/lib/metadata';
import { RichText } from '@/types';
import { ScrollToTopButton } from '@/components/animations';
import TableOfContents from '@/components/blog/TableOfContents';
import ClientScrollProgress from '@/components/blog/ClientScrollProgress';

export const revalidate = 300; // ISR with 300s revalidation

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for the blog post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const post = await strapiClient.getBlogPost(resolvedParams.slug);
    return generateBlogPostMetadata(post);
  } catch (error) {
    console.error('Error fetching blog post metadata:', error);
    return {
      title: 'Blog Post',
      description: 'Read our latest insights on luxury brand communications.',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post;
  const resolvedParams = await params;

  try {
    post = await strapiClient.getBlogPost(resolvedParams.slug);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formattedDate = formatDate(post.publishedAt);

  const CATEGORY_COLORS = {
    'News': 'bg-primary-blue text-white',
    'Case Study': 'bg-primary-darker text-white',
    'Thought Leadership': 'bg-accent-mist text-primary-darker',
  };

  // Render rich text content
  const renderContent = (content: RichText) => {
    if (typeof content === 'string') {
      // Configure marked options for better rendering
      marked.setOptions({
        breaks: true,
        gfm: true,
      });
      
      // Convert markdown to HTML
      const htmlContent = marked(content);
      
      return (
        <div
          className="prose prose-lg max-w-none text-neutral-gray-dark leading-relaxed prose-headings:text-neutral-gray-dark prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6 prose-p:mb-4 prose-ul:mb-4 prose-li:mb-1 prose-strong:font-semibold prose-em:italic"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    }
    // Handle structured rich text if needed
    return (
      <div className="prose prose-lg max-w-none text-neutral-gray-dark">
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg text-sm">
          {JSON.stringify(content, null, 2)}
        </pre>
      </div>
    );
  };

  // Calculate estimated reading time (average 200 words per minute)
  const wordCount = typeof post.content === 'string' 
    ? post.content.split(' ').length 
    : 500; // fallback
  const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <main className="min-h-screen bg-white">
      {/* Scroll Progress Indicator */}
      <ClientScrollProgress estimatedReadingTime={estimatedReadingTime} />

      {/* Enhanced Featured Image with Parallax */}
      {post.featuredImage?.url && (
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden">
          <img
            src={getStrapiMediaUrl(post.featuredImage.url) || ''}
            alt={post.featuredImage.alternativeText || post.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl py-12 md:py-16 lg:py-20">
        {/* Back to Blog Button */}
        <div className="mb-8">
          <a 
            href="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Enhanced Table of Contents - Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0">
            <TableOfContents estimatedReadingTime={estimatedReadingTime} />
          </aside>

          {/* Enhanced Article Content */}
          <article className="flex-1 max-w-4xl">
            {/* Enhanced Category Badge */}
            <div className="mb-6">
              <span
                className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 ${
                  CATEGORY_COLORS[post.category]
                }`}
              >
                <div className="w-2 h-2 bg-current rounded-full mr-2 opacity-70"></div>
                {post.category}
              </span>
            </div>

            {/* Enhanced Title with Better Typography */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-gray-dark mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Enhanced Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-neutral-gray mb-10 pb-8 border-b border-neutral-soft-gray/50">
              <time dateTime={post.publishedAt} className="text-base font-medium flex items-center">
                <svg className="w-4 h-4 mr-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </time>
              {post.author && (
                <span className="text-base font-medium flex items-center">
                  <svg className="w-4 h-4 mr-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author}
                </span>
              )}
              <span className="text-sm bg-accent-mist px-3 py-1 rounded-full font-medium">
                {estimatedReadingTime} min read
              </span>
            </div>

            {/* Enhanced Excerpt */}
            {post.excerpt && (
              <div className="mb-12 p-8 bg-gradient-to-r from-accent-mist-blue/10 to-transparent rounded-2xl border-l-4 border-primary-blue">
                <p className="text-xl md:text-2xl text-neutral-gray-dark leading-relaxed font-medium italic">
                  "{post.excerpt}"
                </p>
              </div>
            )}

            {/* Enhanced Content with Better Typography */}
            <div className="mb-12" id="article-content">
              {renderContent(post.content)}
            </div>

            {/* Enhanced Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-8 border-t border-neutral-soft-gray/50 mb-12">
                <h3 className="text-lg font-bold text-neutral-gray-dark mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-accent-mist to-accent-mist-blue text-primary-darker text-sm font-medium rounded-full hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="pt-8 border-t border-neutral-soft-gray/50">
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-neutral-gray-dark mb-4">
                  Ready to Transform Your Brand?
                </h3>
                <p className="text-neutral-gray mb-6 max-w-2xl mx-auto">
                  Let's discuss how we can help elevate your luxury brand communications and create meaningful connections with your audience.
                </p>
                <a 
                  href="/contact"
                  className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Get in Touch
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton 
        threshold={400}
        position="bottom-right"
        size="md"
      />


    </main>
  );
}
