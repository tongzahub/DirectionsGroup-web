import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  Page,
  AboutSection,
  BlogPost,
  CaseStudy,
  JobListing,
  SiteSettings,
  ContactFormData,
  StrapiResponse,
  StrapiError,
} from '@/types';
import { STRAPI_URL, STRAPI_API_TOKEN, API_TIMEOUT } from './constants';

/**
 * Custom error class for Strapi API errors
 */
export class StrapiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'StrapiClientError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Strapi API client for fetching and submitting content
 */
export class StrapiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${STRAPI_URL}/api`,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<StrapiError>) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle API errors and convert to StrapiClientError
   */
  private handleError(error: AxiosError<StrapiError>): StrapiClientError {
    // Network error (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return new StrapiClientError(
          'Request timed out. Please try again.',
          408
        );
      }
      return new StrapiClientError(
        'Unable to connect. Please check your internet connection.',
        0
      );
    }

    // HTTP error responses
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    const details = error.response.data?.details;

    switch (status) {
      case 404:
        return new StrapiClientError('Content not found.', 404, details);
      case 500:
      case 502:
      case 503:
        return new StrapiClientError(
          'Something went wrong. Please try again later.',
          status,
          details
        );
      default:
        return new StrapiClientError(message, status, details);
    }
  }

  /**
   * Fetch a page by slug
   */
  async getPage(slug: string): Promise<Page> {
    const response = await this.client.get<StrapiResponse<Page[]>>('/pages', {
      params: {
        filters: { slug: { $eq: slug } },
        populate: 'ogImage',
      },
    });

    const pages = response.data.data;
    if (!pages || pages.length === 0) {
      throw new StrapiClientError(`Page with slug "${slug}" not found.`, 404);
    }

    return pages[0];
  }

  /**
   * Fetch all about sections
   */
  async getAboutSections(): Promise<AboutSection[]> {
    const response = await this.client.get<StrapiResponse<AboutSection[]>>(
      '/about-sections',
      {
        params: {
          sort: 'order:asc',
          filters: {
            publishedAt: { $lte: new Date().toISOString() },
          },
        },
      }
    );

    return response.data.data || [];
  }

  /**
   * Fetch a single about section by slug
   */
  async getAboutSection(slug: string): Promise<AboutSection> {
    const response = await this.client.get<StrapiResponse<AboutSection[]>>(
      '/about-sections',
      {
        params: {
          filters: { slug: { $eq: slug } },
        },
      }
    );

    const sections = response.data.data;
    if (!sections || sections.length === 0) {
      throw new StrapiClientError(
        `About section with slug "${slug}" not found.`,
        404
      );
    }

    return sections[0];
  }

  /**
   * Fetch all blog posts with optional filtering
   */
  async getBlogPosts(filters?: {
    category?: string;
    tag?: string;
    limit?: number;
  }): Promise<BlogPost[]> {
    const filterObj: Record<string, unknown> = {
      publishedAt: { $lte: new Date().toISOString() },
    };

    if (filters?.category) {
      filterObj.category = { $eq: filters.category };
    }

    if (filters?.tag) {
      filterObj.tags = { $contains: filters.tag };
    }

    const params: Record<string, unknown> = {
      populate: 'featuredImage',
      sort: 'publishedAt:desc',
      filters: filterObj,
    };

    if (filters?.limit) {
      params.pagination = { limit: filters.limit };
    }

    const response = await this.client.get<StrapiResponse<BlogPost[]>>(
      '/blog-posts',
      { params }
    );

    return response.data.data || [];
  }

  /**
   * Fetch a single blog post by slug
   */
  async getBlogPost(slug: string): Promise<BlogPost> {
    const response = await this.client.get<StrapiResponse<BlogPost[]>>(
      '/blog-posts',
      {
        params: {
          filters: { slug: { $eq: slug } },
          populate: 'featuredImage',
        },
      }
    );

    const posts = response.data.data;
    if (!posts || posts.length === 0) {
      throw new StrapiClientError(
        `Blog post with slug "${slug}" not found.`,
        404
      );
    }

    return posts[0];
  }

  /**
   * Fetch all case studies
   */
  async getCaseStudies(): Promise<CaseStudy[]> {
    const response = await this.client.get<StrapiResponse<CaseStudy[]>>(
      '/case-studies',
      {
        params: {
          populate: ['featuredImage', 'gallery'],
          sort: 'publishedAt:desc',
          filters: {
            publishedAt: { $lte: new Date().toISOString() },
          },
        },
      }
    );

    return response.data.data || [];
  }

  /**
   * Fetch a single case study by slug
   */
  async getCaseStudy(slug: string): Promise<CaseStudy> {
    const response = await this.client.get<StrapiResponse<CaseStudy[]>>(
      '/case-studies',
      {
        params: {
          filters: { slug: { $eq: slug } },
          populate: ['featuredImage', 'gallery'],
        },
      }
    );

    const caseStudies = response.data.data;
    if (!caseStudies || caseStudies.length === 0) {
      throw new StrapiClientError(
        `Case study with slug "${slug}" not found.`,
        404
      );
    }

    return caseStudies[0];
  }

  /**
   * Fetch all job listings
   */
  async getJobListings(): Promise<JobListing[]> {
    const response = await this.client.get<StrapiResponse<JobListing[]>>(
      '/job-listings',
      {
        params: {
          sort: 'publishedAt:desc',
          filters: {
            publishedAt: { $lte: new Date().toISOString() },
          },
        },
      }
    );

    return response.data.data || [];
  }

  /**
   * Fetch site settings (single type)
   */
  async getSiteSettings(): Promise<SiteSettings> {
    const response = await this.client.get<StrapiResponse<SiteSettings>>(
      '/site-setting',
      {
        params: {
          populate: 'socialLinks',
        },
      }
    );

    return response.data.data;
  }

  /**
   * Submit contact form inquiry
   */
  async submitContactForm(data: ContactFormData): Promise<void> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new StrapiClientError('Invalid email format.', 400);
    }

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      throw new StrapiClientError('All fields are required.', 400);
    }

    await this.client.post('/contact-inquiries', {
      data: {
        ...data,
        status: 'New',
        submittedAt: new Date().toISOString(),
      },
    });
  }
}

// Export singleton instance
export const strapiClient = new StrapiClient();
