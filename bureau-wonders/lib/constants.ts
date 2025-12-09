// API Configuration
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';
export const API_TIMEOUT = 10000; // 10 seconds

// Site Configuration
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const SITE_NAME = 'The Bureau of Wonders';

// Revalidation times (in seconds)
export const REVALIDATE = {
  HOMEPAGE: 60,
  BLOG_LISTING: 60,
  BLOG_POST: 300,
  CASE_STUDY: 300,
  CAREERS: 60,
  ABOUT: 300,
  SERVICES: 300,
  STATIC: false, // No revalidation
};

// Navigation items
export const NAVIGATION_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

// Blog categories
export const BLOG_CATEGORIES = ['News', 'Case Study', 'Thought Leadership'] as const;

// Job types
export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract'] as const;

// Contact inquiry statuses
export const INQUIRY_STATUSES = ['New', 'Read', 'Responded'] as const;

// Responsive breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440,
};

// Animation durations (in ms)
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 400,
};
