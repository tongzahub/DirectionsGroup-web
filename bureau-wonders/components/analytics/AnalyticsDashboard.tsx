'use client';

import React, { useState, useEffect } from 'react';
import { useAnalyticsDashboard } from '@/lib/analytics';
import Card from '@/components/ui/Card';

interface DashboardProps {
  className?: string;
}

export const AnalyticsDashboard: React.FC<DashboardProps> = ({ className = '' }) => {
  const { realTimeData, storyPerformance, loading } = useAnalyticsDashboard();
  const [selectedDateRange, setSelectedDateRange] = useState<'24h' | '7d' | '30d'>('7d');

  if (loading) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`analytics-dashboard space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Brand Story Analytics</h2>
        <div className="flex space-x-2">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedDateRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedDateRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={realTimeData?.activeUsers || 0}
          change="+12%"
          changeType="positive"
          icon="👥"
        />
        <MetricCard
          title="Page Views"
          value={realTimeData?.pageViews || 0}
          change="+8%"
          changeType="positive"
          icon="👁️"
        />
        <MetricCard
          title="Conversions"
          value={realTimeData?.conversions || 0}
          change="+15%"
          changeType="positive"
          icon="🎯"
        />
        <MetricCard
          title="Avg. Scroll Depth"
          value={`${storyPerformance?.avgScrollDepth || 0}%`}
          change="+5%"
          changeType="positive"
          icon="📊"
        />
      </div>

      {/* Story Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Story Section Performance</h3>
          <div className="space-y-4">
            {storyPerformance?.sectionMetrics?.map((section: any) => (
              <SectionMetric key={section.section} section={section} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {realTimeData?.conversionFunnel?.map((step: any, index: number) => (
              <FunnelStep key={step.step} step={step} index={index} />
            ))}
          </div>
        </Card>
      </div>

      {/* A/B Test Results */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">A/B Test Results</h3>
        <div className="space-y-6">
          {storyPerformance?.abTestResults?.map((test: any) => (
            <ABTestResult key={test.testId} test={test} />
          ))}
        </div>
      </Card>

      {/* Top Performing Sections */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Sections</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Section</th>
                <th className="text-right py-2">Views</th>
                <th className="text-right py-2">Avg. Time</th>
                <th className="text-right py-2">Scroll Depth</th>
                <th className="text-right py-2">Exit Rate</th>
              </tr>
            </thead>
            <tbody>
              {realTimeData?.topSections?.map((section: any) => (
                <tr key={section.section} className="border-b">
                  <td className="py-2 font-medium capitalize">
                    {section.section.replace('_', ' ')}
                  </td>
                  <td className="text-right py-2">{section.views.toLocaleString()}</td>
                  <td className="text-right py-2">{formatTime(section.avgTimeSpent)}</td>
                  <td className="text-right py-2">{section.scrollDepth || 0}%</td>
                  <td className="text-right py-2">{section.exitRate || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
    <div className="mt-2">
      <span
        className={`text-sm font-medium ${
          changeType === 'positive'
            ? 'text-green-600'
            : changeType === 'negative'
            ? 'text-red-600'
            : 'text-gray-600'
        }`}
      >
        {change}
      </span>
      <span className="text-sm text-gray-500 ml-1">vs previous period</span>
    </div>
  </Card>
);

interface SectionMetricProps {
  section: {
    section: string;
    views: number;
    avgTimeSpent: number;
    scrollDepth: number;
    exitRate: number;
  };
}

const SectionMetric: React.FC<SectionMetricProps> = ({ section }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div>
      <h4 className="font-medium capitalize">{section.section.replace('_', ' ')}</h4>
      <p className="text-sm text-gray-600">
        {section.views} views • {formatTime(section.avgTimeSpent)} avg time
      </p>
    </div>
    <div className="text-right">
      <div className="text-sm font-medium">{section.scrollDepth}% scroll</div>
      <div className="text-sm text-gray-600">{section.exitRate}% exit</div>
    </div>
  </div>
);

interface FunnelStepProps {
  step: {
    step: string;
    users: number;
    conversionRate: number;
  };
  index: number;
}

const FunnelStep: React.FC<FunnelStepProps> = ({ step, index }) => (
  <div className="flex items-center space-x-4">
    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
      {index + 1}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <span className="font-medium capitalize">{step.step.replace('_', ' ')}</span>
        <span className="text-sm text-gray-600">{step.users} users</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${step.conversionRate}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-600 mt-1">{step.conversionRate.toFixed(1)}% conversion</div>
    </div>
  </div>
);

interface ABTestResultProps {
  test: {
    testId: string;
    variants: Array<{
      variant: string;
      conversions: number;
      views: number;
      conversionRate: number;
    }>;
  };
}

const ABTestResult: React.FC<ABTestResultProps> = ({ test }) => (
  <div>
    <h4 className="font-medium mb-3 capitalize">{test.testId.replace('_', ' ')}</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {test.variants.map((variant) => (
        <div key={variant.variant} className="p-4 border rounded-lg">
          <div className="font-medium capitalize mb-2">{variant.variant.replace('_', ' ')}</div>
          <div className="space-y-1 text-sm">
            <div>Views: {variant.views}</div>
            <div>Conversions: {variant.conversions}</div>
            <div className="font-medium">Rate: {variant.conversionRate.toFixed(2)}%</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Utility functions
const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

export default AnalyticsDashboard;