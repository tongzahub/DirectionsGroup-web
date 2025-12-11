import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { strapiClient, getStrapiMediaUrl } from '@/lib/strapi-client';
import { generateBlogPostMetadata } from '@/lib/metadata';
import { RichText } from '@/types';
import { ScrollProgressIndicator, ScrollToTopButton, TableOfContents } from '@/components/animations';
import { generateTableOfContents } from '@/lib/smooth-scroll';

export const revalidate = 300; // ISR with 300s revalidation

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the blog post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await strapiClient.getBlogPost(params.slug);
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

  try {
    post = await strapiClient.getBlogPost(params.slug);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const CATEGORY_COLORS = {
    'News': 'bg-primary-blue text-white',
    'Case Study': 'bg-primary-darker text-white',
    'Thought Leadership': 'bg-accent-mist text-primary-darker',
  };

  // Render rich text content
  const renderContent = (content: RichText) => {
    if (typeof content === 'string') {
      return (
        <div
          className="prose prose-lg max-w-none text-neutral-gray-dark leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    // Handle structured rich text if needed
    return (
      <div className="prose prose-lg max-w-none text-neutral-gray-dark">
        {JSON.stringify(content)}
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
      <ScrollProgressIndicator
        position="top"
        thickness={3}
        showPercentage={true}
        showReadingTime={true}
        estimatedReadingTime={estimatedReadingTime}
      />

      {/* Enhanced Featured Image with Parallax */}
      {post.featuredImage && (
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alternativeText || post.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl py-12 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Enhanced Table of Contents - Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-to-br from-accent-mist-blue/20 to-primary-blue/10 rounded-2xl p-6 border border-accent-mist-blue/20">
                <h3 className="text-base font-bold text-neutral-gray-dark mb-3 flex items-center">
                  <div className="w-2 h-2 bg-primary-blue rounded-full mr-3"></div>
                  Reading Progress
                </h3>
                <div className="text-sm text-neutral-gray mb-2">
                  Estimated {estimatedReadingTime} min read
                </div>
                <div className="w-full bg-neutral-gray-light/30 rounded-full h-2">
                  <div className="bg-primary-blue h-2 rounded-full transition-all duration-300" style={{width: '0%'}} id="reading-progress-bar"></div>
                </div>
              </div>
              
              {/* Enhanced Table of Contents */}
              <div id="table-of-contents-container" className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-gray-light/20 backdrop-blur-sm">
                {/* This will be populated dynamically */}
              </div>
            </div>
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
            <div className="mb-12 prose prose-lg md:prose-xl max-w-none" id="article-content" style={{
              '--tw-prose-body': 'rgb(75 85 99)',
              '--tw-prose-headings': 'rgb(31 41 55)',
              '--tw-prose-lead': 'rgb(75 85 99)',
              '--tw-prose-links': 'rgb(59 130 246)',
              '--tw-prose-bold': 'rgb(31 41 55)',
              '--tw-prose-counters': 'rgb(107 114 128)',
              '--tw-prose-bullets': 'rgb(209 213 219)',
              '--tw-prose-hr': 'rgb(229 231 235)',
              '--tw-prose-quotes': 'rgb(31 41 55)',
              '--tw-prose-quote-borders': 'rgb(229 231 235)',
              '--tw-prose-captions': 'rgb(107 114 128)',
              '--tw-prose-code': 'rgb(31 41 55)',
              '--tw-prose-pre-code': 'rgb(229 231 235)',
              '--tw-prose-pre-bg': 'rgb(31 41 55)',
              '--tw-prose-th-borders': 'rgb(209 213 219)',
              '--tw-prose-td-borders': 'rgb(229 231 235)',
            } as React.CSSProperties}>
              {renderContent(post.content)}
            </div>

            {/* Enhanced Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-8 border-t border-neutral-soft-gray/50">
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
          </article>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton 
        threshold={400}
        position="bottom-right"
        size="md"
      />

      {/* Client-side script for Table of Contents */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const articleContent = document.getElementById('article-content');
              const tocContainer = document.getElementById('table-of-contents-container');
              
              if (articleContent && tocContainer) {
                const headings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
                
                if (headings.length > 0) {
                  const tocList = document.createElement('ul');
                  tocList.className = 'space-y-1';
                  
                  const tocTitle = document.createElement('h3');
                  tocTitle.className = 'text-sm font-semibold text-neutral-gray-dark mb-3';
                  tocTitle.textContent = 'Table of Contents';
                  tocContainer.appendChild(tocTitle);
                  
                  headings.forEach((heading, index) => {
                    if (!heading.id) {
                      heading.id = 'heading-' + index;
                    }
                    
                    const level = parseInt(heading.tagName.charAt(1));
                    const listItem = document.createElement('li');
                    listItem.className = 'ml-' + ((level - 1) * 3);
                    
                    const link = document.createElement('a');
                    link.href = '#' + heading.id;
                    link.textContent = heading.textContent;
                    link.className = 'text-sm text-neutral-gray hover:text-primary-blue transition-colors duration-200 block py-1 px-2 rounded hover:bg-accent-mist-blue/20';
                    
                    link.addEventListener('click', function(e) {
                      e.preventDefault();
                      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    });
                    
                    listItem.appendChild(link);
                    tocList.appendChild(listItem);
                  });
                  
                  tocContainer.appendChild(tocList);
                }
              }
            });
          `,
        }}
      />
    </main>
  );
}
