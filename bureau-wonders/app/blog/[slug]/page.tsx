import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { strapiClient } from '@/lib/strapi-client';
import { generateBlogPostMetadata } from '@/lib/metadata';
import { RichText } from '@/types';

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

  return (
    <main className="min-h-screen bg-white">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alternativeText || post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="container mx-auto px-4 max-w-4xl py-12 md:py-16 lg:py-20">
        {/* Category Badge */}
        <div className="mb-4">
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              CATEGORY_COLORS[post.category]
            }`}
          >
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-gray-dark mb-4">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-neutral-gray mb-8 pb-8 border-b border-neutral-soft-gray">
          <time dateTime={post.publishedAt} className="text-sm md:text-base">
            {formattedDate}
          </time>
          {post.author && (
            <>
              <span className="text-neutral-soft-gray">•</span>
              <span className="text-sm md:text-base">By {post.author}</span>
            </>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl md:text-2xl text-neutral-gray leading-relaxed mb-8 font-medium">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="mb-12">
          {renderContent(post.content)}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 border-t border-neutral-soft-gray">
            <h3 className="text-sm font-semibold text-neutral-gray-dark mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent-mist text-primary-darker text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
