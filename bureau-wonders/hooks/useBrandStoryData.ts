'use client';

import { useState, useEffect } from 'react';
import { BrandStoryContent } from '@/types/brand-story';

interface UseBrandStoryDataReturn {
  data: BrandStoryContent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface BrandStoryApiResponse {
  data: {
    id: number;
    attributes: {
      title: string;
      slug: string;
      heroHeadline: string;
      heroSubheadline: string;
      heroBackgroundImage?: {
        data?: {
          attributes: {
            url: string;
            alternativeText?: string;
            name: string;
            width: number;
            height: number;
          };
        };
      };
      heroCtaText?: string;
      heroCtaLink?: string;
      // Add other fields as needed
      publishedAt: string;
      updatedAt: string;
    };
  };
}

export const useBrandStoryData = (): UseBrandStoryDataReturn => {
  const [data, setData] = useState<BrandStoryContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrandStoryData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Construct API URL with population for media fields
      const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/api/brand-story?populate[heroBackgroundImage][fields][0]=url&populate[heroBackgroundImage][fields][1]=alternativeText&populate[heroBackgroundImage][fields][2]=name&populate[heroBackgroundImage][fields][3]=width&populate[heroBackgroundImage][fields][4]=height`;

      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch brand story data: ${response.status} ${response.statusText}`);
      }

      const result: BrandStoryApiResponse = await response.json();

      if (!result.data) {
        throw new Error('No brand story data found');
      }

      // Transform API response to match our BrandStoryContent interface
      const transformedData: BrandStoryContent = {
        id: result.data.id.toString(),
        title: result.data.attributes.title,
        slug: result.data.attributes.slug,
        sections: {
          hero: {
            headline: result.data.attributes.heroHeadline,
            subheadline: result.data.attributes.heroSubheadline,
            backgroundImage: result.data.attributes.heroBackgroundImage?.data ? {
              id: result.data.id,
              name: result.data.attributes.heroBackgroundImage.data.attributes.name,
              url: `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${result.data.attributes.heroBackgroundImage.data.attributes.url}`,
              alternativeText: result.data.attributes.heroBackgroundImage.data.attributes.alternativeText || '',
              width: result.data.attributes.heroBackgroundImage.data.attributes.width,
              height: result.data.attributes.heroBackgroundImage.data.attributes.height,
              mime: 'image/jpeg', // Default, could be enhanced to get actual mime type
              size: 0, // Not provided by this API call
            } : undefined,
            ctaButton: {
              text: result.data.attributes.heroCtaText || 'Start Your Transformation',
              link: result.data.attributes.heroCtaLink || '#success-stories',
            },
          },
          // Initialize other sections with empty data for now
          problem: {
            title: '',
            problems: [],
            transitionStatement: '',
          },
          guide: {
            title: '',
            empathyStatement: '',
            authorityElements: [],
            teamHighlight: [],
          },
          plan: {
            title: '',
            introduction: '',
            steps: [],
            reassurance: '',
          },
          success: {
            title: '',
            caseStudies: [],
            overallImpact: '',
          },
          stakes: {
            title: '',
            failureScenarios: [],
            opportunityCost: '',
            transitionToAction: '',
          },
          cta: {
            primaryCTA: {
              headline: '',
              description: '',
              buttonText: '',
              formFields: [],
            },
            secondaryCTA: {
              title: '',
              options: [],
            },
          },
        },
        seoMetadata: {
          title: result.data.attributes.title,
          description: '', // Would need to be added to CMS schema
          ogImage: undefined, // Would need to be populated
        },
        publishedAt: new Date(result.data.attributes.publishedAt),
        updatedAt: new Date(result.data.attributes.updatedAt),
      };

      setData(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching brand story data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async (): Promise<void> => {
    await fetchBrandStoryData();
  };

  useEffect(() => {
    fetchBrandStoryData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

// Hook for just hero section data (lighter weight)
export const useBrandStoryHeroData = () => {
  const { data, loading, error, refetch } = useBrandStoryData();
  
  return {
    heroData: data?.sections.hero || null,
    loading,
    error,
    refetch,
  };
};