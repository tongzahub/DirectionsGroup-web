import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    
    // In production, these would be actual database queries based on date range
    const storyPerformance = {
      totalViews: Math.floor(Math.random() * 5000) + 2000, // 2000-7000 views
      avgScrollDepth: Math.floor(Math.random() * 20) + 70, // 70-90%
      avgTimeOnPage: Math.floor(Math.random() * 120) + 180, // 3-5 minutes
      conversionRate: (Math.random() * 3 + 2).toFixed(2), // 2-5%
      
      sectionMetrics: [
        {
          section: 'hero',
          views: Math.floor(Math.random() * 1000) + 500,
          avgTimeSpent: Math.floor(Math.random() * 30) + 20,
          scrollDepth: Math.floor(Math.random() * 20) + 80,
          exitRate: Math.floor(Math.random() * 10) + 5,
        },
        {
          section: 'problem',
          views: Math.floor(Math.random() * 900) + 450,
          avgTimeSpent: Math.floor(Math.random() * 45) + 25,
          scrollDepth: Math.floor(Math.random() * 15) + 85,
          exitRate: Math.floor(Math.random() * 8) + 4,
        },
        {
          section: 'guide',
          views: Math.floor(Math.random() * 800) + 400,
          avgTimeSpent: Math.floor(Math.random() * 60) + 30,
          scrollDepth: Math.floor(Math.random() * 10) + 90,
          exitRate: Math.floor(Math.random() * 6) + 3,
        },
        {
          section: 'plan',
          views: Math.floor(Math.random() * 700) + 350,
          avgTimeSpent: Math.floor(Math.random() * 50) + 35,
          scrollDepth: Math.floor(Math.random() * 8) + 92,
          exitRate: Math.floor(Math.random() * 5) + 2,
        },
        {
          section: 'success',
          views: Math.floor(Math.random() * 600) + 300,
          avgTimeSpent: Math.floor(Math.random() * 70) + 40,
          scrollDepth: Math.floor(Math.random() * 5) + 95,
          exitRate: Math.floor(Math.random() * 4) + 1,
        },
        {
          section: 'stakes',
          views: Math.floor(Math.random() * 500) + 250,
          avgTimeSpent: Math.floor(Math.random() * 40) + 25,
          scrollDepth: Math.floor(Math.random() * 15) + 80,
          exitRate: Math.floor(Math.random() * 8) + 5,
        },
        {
          section: 'cta',
          views: Math.floor(Math.random() * 400) + 200,
          avgTimeSpent: Math.floor(Math.random() * 30) + 15,
          scrollDepth: Math.floor(Math.random() * 3) + 97,
          exitRate: Math.floor(Math.random() * 3) + 1,
        },
      ],
      
      abTestResults: [
        {
          testId: 'brand_story_headline',
          variants: [
            {
              variant: 'luxury_brands_deserve',
              conversions: Math.floor(Math.random() * 50) + 25,
              views: Math.floor(Math.random() * 500) + 250,
              conversionRate: 0,
            },
            {
              variant: 'transform_your_brand',
              conversions: Math.floor(Math.random() * 60) + 30,
              views: Math.floor(Math.random() * 500) + 250,
              conversionRate: 0,
            },
            {
              variant: 'extraordinary_stories_await',
              conversions: Math.floor(Math.random() * 45) + 20,
              views: Math.floor(Math.random() * 500) + 250,
              conversionRate: 0,
            },
          ],
        },
        {
          testId: 'brand_story_cta',
          variants: [
            {
              variant: 'start_your_transformation',
              conversions: Math.floor(Math.random() * 40) + 20,
              views: Math.floor(Math.random() * 400) + 200,
              conversionRate: 0,
            },
            {
              variant: 'discover_your_story',
              conversions: Math.floor(Math.random() * 35) + 15,
              views: Math.floor(Math.random() * 400) + 200,
              conversionRate: 0,
            },
            {
              variant: 'elevate_your_brand',
              conversions: Math.floor(Math.random() * 45) + 25,
              views: Math.floor(Math.random() * 400) + 200,
              conversionRate: 0,
            },
          ],
        },
      ],
    };

    // Calculate conversion rates for A/B test variants
    storyPerformance.abTestResults.forEach(test => {
      test.variants.forEach(variant => {
        variant.conversionRate = variant.views > 0 
          ? parseFloat(((variant.conversions / variant.views) * 100).toFixed(2))
          : 0;
      });
    });

    return NextResponse.json(storyPerformance);
  } catch (error) {
    console.error('Error fetching story performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch story performance' },
      { status: 500 }
    );
  }
}