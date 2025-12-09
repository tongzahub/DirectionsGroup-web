// Media type for images and files
export interface Media {
  id: number;
  name: string;
  url: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  alternativeText?: string;
  caption?: string;
}

// Rich text content type
export type RichText = string | object;

// Page content type
export interface Page {
  id: number;
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  ogImage?: Media;
  content: RichText;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// About Section content type
export interface AboutSection {
  id: number;
  title: string;
  slug: string;
  content: RichText;
  order: number;
  seoTitle?: string;
  metaDescription?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Blog Post content type
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: RichText;
  featuredImage?: Media;
  category: 'News' | 'Case Study' | 'Thought Leadership';
  tags: string[];
  author: string;
  publishedAt: string;
  scheduledAt?: string;
  seoTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

// Case Study content type
export interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  client: string;
  challenge: RichText;
  strategy: RichText;
  execution: RichText;
  results: RichText;
  gallery: Media[];
  featuredImage?: Media;
  publishedAt: string;
  seoTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

// Job Listing content type
export interface JobListing {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: RichText;
  requirements: RichText;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Inquiry content type
export interface ContactInquiry {
  id: number;
  name: string;
  company: string;
  email: string;
  message: string;
  status: 'New' | 'Read' | 'Responded';
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Social Link component
export interface SocialLink {
  platform: string;
  url: string;
}

// Site Settings content type (Single Type)
export interface SiteSettings {
  id: number;
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  socialLinks: SocialLink[];
  homepageIntro: RichText;
  cultureStatement: RichText;
  values: string[];
  updatedAt: string;
}

// Contact Form Data
export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  message: string;
}

// Navigation Item
export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

// API Response wrapper
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// API Error
export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details?: unknown;
}
