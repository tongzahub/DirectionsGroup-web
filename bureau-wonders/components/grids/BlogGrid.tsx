'use client';

import { BlogPost } from '@/types';
import BlogPostCard from '@/components/cards/BlogPostCard';
import { StaggerContainer, StaggerItem } from '@/components/animations';

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  return (
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
      {posts.map((post) => (
        <StaggerItem key={post.id}>
          <BlogPostCard post={post} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
