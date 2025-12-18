import { NextRequest, NextResponse } from 'next/server';

// Mock data for real-time analytics
// In production, this would query your analytics database
export async function GET(request: NextRequest) {
  try {
    // Simulate real-time data calculation
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // In production, these would be actual database queries
    const realTimeData = {
      activeUsers: Math.floor(Math.random() * 50) + 10, // 10-60 active users
      pageViews: Math.floor(Math.random() * 500) + 100, // 100-600 page views
      conversions: Math.floor(Math.random() * 20) + 5, // 5-25 conversions
      
      topSections: [
        {
          section: 'hero',
          views: Math.floor(Math.random() * 200) + 50,
          avgTimeSpent: Math.floor(Math.random() * 30) + 15, // 15-45 seconds
          scrollDepth: Math.floor(Math.random() * 40) + 60, // 60-100%
          exitRate: Math.floor(Math.random() * 20) + 5, // 5-25%
        },
        {
          section: 'problem',
          views: Math.floor(Math.random() * 180) + 40,
          avgTimeSpent: Math.floor(Math.random() * 45) + 20,
          scrollDepth: Math.floor(Math.random() * 30) + 70,
          exitRate: Math.floor(Math.random() * 15) + 8,
        },
        {
          section: 'guide',
          views: Math.floor(Math.random() * 160) + 35,
          avgTimeSpent: Math.floor(Math.random() * 60) + 25,
          scrollDepth: Math.floor(Math.random() * 25) + 75,
          exitRate: Math.floor(Math.random() * 12) + 6,
        },
        {
          section: 'plan',
          views: Math.floor(Math.random() * 140) + 30,
          avgTimeSpent: Math.floor(Math.random() * 50) + 30,
          scrollDepth: Math.floor(Math.random() * 20) + 80,
          exitRate: Math.floor(Math.random() * 10) + 5,
        },
        {
          section: 'success',
          views: Math.floor(Math.random() * 120) + 25,
          avgTimeSpent: Math.floor(Math.random() * 70) + 35,
          scrollDepth: Math.floor(Math.random() * 15) + 85,
          exitRate: Math.floor(Math.random() * 8) + 4,
        },
        {
          section: 'stakes',
          views: Math.floor(Math.random() * 100) + 20,
          avgTimeSpent: Math.floor(Math.random() * 40) + 20,
          scrollDepth: Math.floor(Math.random() * 20) + 70,
          exitRate: Math.floor(Math.random() * 15) + 10,
        },
        {
          section: 'cta',
          views: Math.floor(Math.random() * 90) + 15,
          avgTimeSpent: Math.floor(Math.random() * 30) + 10,
          scrollDepth: Math.floor(Math.random() * 10) + 90,
          exitRate: Math.floor(Math.random() * 5) + 2,
        },
      ],
      
      conversionFunnel: [
        {
          step: 'page_view',
          users: Math.floor(Math.random() * 1000) + 500,
          conversionRate: 100,
        },
        {
          step: 'hero_engagement',
          users: Math.floor(Math.random() * 800) + 400,
          conversionRate: Math.floor(Math.random() * 20) + 70, // 70-90%
        },
        {
          step: 'story_completion',
          users: Math.floor(Math.random() * 600) + 300,
          conversionRate: Math.floor(Math.random() * 15) + 50, // 50-65%
        },
        {
          step: 'cta_interaction',
          users: Math.floor(Math.random() * 200) + 100,
          conversionRate: Math.floor(Math.random() * 10) + 20, // 20-30%
        },
        {
          step: 'form_submission',
          users: Math.floor(Math.random() * 50) + 25,
          conversionRate: Math.floor(Math.random() * 5) + 10, // 10-15%
        },
      ],
    };

    // Add some realistic variance based on time of day
    const hour = new Date().getHours();
    const timeMultiplier = hour >= 9 && hour <= 17 ? 1.5 : 0.7; // Higher during business hours
    
    realTimeData.activeUsers = Math.floor(realTimeData.activeUsers * timeMultiplier);
    realTimeData.pageViews = Math.floor(realTimeData.pageViews * timeMultiplier);

    return NextResponse.json(realTimeData);
  } catch (error) {
    console.error('Error fetching real-time analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch real-time analytics' },
      { status: 500 }
    );
  }
}