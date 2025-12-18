'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types';
import StrapiImage from '@/components/ui/StrapiImage';

export interface BlogPostCardProps {
  post: BlogPost;
}

const CATEGORY_COLORS = {
  'News': 'bg-primary-500 text-white',
  'Case Study': 'bg-primary-800 text-white',
  'Thought Leadership': 'bg-primary-200 text-primary-800',
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formattedDate = React.useMemo(() => {
    try {
      return new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }, [post.publishedAt]);

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <motion.div
        className="rounded-2xl p-0 shadow-card bg-white overflow-hidden touch-manipulation"
        whileHover={{ 
          y: -4, 
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' 
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Thumbnail Image */}
        <div className="relative w-full h-44 sm:h-48 md:h-52 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
          {post.featuredImage?.url ? (
            <StrapiImage
              src={post.featuredImage.url}
              alt={post.featuredImage.alternativeText || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 md:p-6">
          {/* Category Badge */}
          <div className="mb-2 sm:mb-3">
            <span
              className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                CATEGORY_COLORS[post.category]
              }`}
            >
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-2 line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-3 sm:mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-500 mb-4">
            <span>{formattedDate}</span>
            {post.author && (
              <span className="font-medium">By {post.author}</span>
            )}
          </div>

          {/* Read More Link */}
          <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
            <span>Read More</span>
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogPostCard;
