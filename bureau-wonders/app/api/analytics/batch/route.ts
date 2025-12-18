import { NextRequest, NextResponse } from 'next/server';

interface BatchAnalyticsRequest {
  metrics: Array<{
    action: string;
    category: string;
    label?: string;
    value?: string | number;
    customParameters?: Record<string, any>;
    timestamp: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { metrics }: BatchAnalyticsRequest = await request.json();
    
    if (!Array.isArray(metrics) || metrics.length === 0) {
      return NextResponse.json(
        { error: 'Invalid metrics array' },
        { status: 400 }
      );
    }

    // Validate each metric
    const validMetrics = metrics.filter(metric => 
      metric.action && 
      metric.category && 
      metric.timestamp &&
      typeof metric.timestamp === 'number'
    );

    if (validMetrics.length === 0) {
      return NextResponse.json(
        { error: 'No valid metrics found' },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Batch insert into database
    // 2. Send to analytics service
    // 3. Queue for processing
    // 4. Aggregate for real-time dashboards
    
    console.log(`Processed ${validMetrics.length} analytics metrics in batch`);
    
    // Log sample of metrics for debugging
    const sampleMetrics = validMetrics.slice(0, 3).map(metric => ({
      action: metric.action,
      category: metric.category,
      label: metric.label,
      timestamp: new Date(metric.timestamp).toISOString(),
    }));
    
    console.log('Sample metrics:', sampleMetrics);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      processed: validMetrics.length,
      skipped: metrics.length - validMetrics.length,
    });
  } catch (error) {
    console.error('Error processing batch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to process batch analytics' },
      { status: 500 }
    );
  }
}