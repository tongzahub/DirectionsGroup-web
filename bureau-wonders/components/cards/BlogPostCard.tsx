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
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <motion.div
        className="rounded-2xl p-0 shadow-card bg-white overflow-hidden touch-manipulation"
        whileHover={{ 
          y: -4, 
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' 
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Thumbnail Image */}
        <div className="relative w-full h-44 sm:h-48 md:h-52 overflow-hidden">
          <StrapiImage
            src={post.featuredImage?.url}
            alt={post.featuredImage?.alternativeText || post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
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

          {/* Date */}
          <p className="text-xs sm:text-sm text-neutral-500">
            {formattedDate}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogPostCard;
