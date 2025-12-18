import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: string | number;
  customParameters?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId: string;
  url: string;
  referrer: string;
  userAgent: string;
}

// In-memory storage for demo purposes
// In production, this would be stored in a database
const analyticsEvents: AnalyticsEvent[] = [];
const MAX_EVENTS = 10000; // Keep last 10k events

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json();
    
    // Validate required fields
    if (!event.action || !event.category || !event.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: action, category, timestamp' },
        { status: 400 }
      );
    }

    // Add event to storage
    analyticsEvents.push(event);
    
    // Keep only the most recent events
    if (analyticsEvents.length > MAX_EVENTS) {
      analyticsEvents.splice(0, analyticsEvents.length - MAX_EVENTS);
    }

    // In production, you would:
    // 1. Store in database (PostgreSQL, MongoDB, etc.)
    // 2. Send to analytics service (Google Analytics, Mixpanel, etc.)
    // 3. Queue for batch processing
    // 4. Validate and sanitize data
    
    console.log('Analytics event received:', {
      action: event.action,
      category: event.category,
      label: event.label,
      sessionId: event.sessionId,
      timestamp: new Date(event.timestamp).toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const action = searchParams.get('action');
    const startTime = searchParams.get('start');
    const endTime = searchParams.get('end');
    const limit = parseInt(searchParams.get('limit') || '100');

    let filteredEvents = [...analyticsEvents];

    // Apply filters
    if (category) {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }
    
    if (action) {
      filteredEvents = filteredEvents.filter(event => event.action === action);
    }
    
    if (startTime) {
      const start = new Date(startTime).getTime();
      filteredEvents = filteredEvents.filter(event => event.timestamp >= start);
    }
    
    if (endTime) {
      const end = new Date(endTime).getTime();
      filteredEvents = filteredEvents.filter(event => event.timestamp <= end);
    }

    // Sort by timestamp (most recent first)
    filteredEvents.sort((a, b) => b.timestamp - a.timestamp);
    
    // Apply limit
    filteredEvents = filteredEvents.slice(0, limit);

    return NextResponse.json({
      events: filteredEvents,
      total: filteredEvents.length,
      filters: { category, action, startTime, endTime, limit },
    });
  } catch (error) {
    console.error('Error fetching analytics events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics events' },
      { status: 500 }
    );
  }
}