import { 
  BrandStoryContent, 
  BrandStoryAnalytics, 
  BrandStoryPerformanceMetrics,
  BrandStoryFormSubmission,
  BrandStoryInteraction,
  ContentValidationResult
} from './brand-story';

// Base API Response structure
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

// Error response structure
export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Paginated response structure
export interface PaginatedResponse<T> extends APIResponse<T[]> {
  meta: {
    pagination: PaginationMeta;
  };
}

// Brand Story API Responses

// Get single brand story
export interface GetBrandStoryResponse extends APIResponse<BrandStoryContent> {
  meta?: {
    lastModified: string;
    version: number;
    cacheExpiry?: string;
  };
}

// Get brand story list
export interface GetBrandStoryListResponse extends PaginatedResponse<BrandStoryContent> {
  meta: {
    pagination: PaginationMeta;
    filters?: {
      status?: string;
      author?: string;
      dateRange?: {
        from: string;
        to: string;
      };
    };
  };
}

// Create/Update brand story response
export interface CreateBrandStoryResponse extends APIResponse<BrandStoryContent> {
  meta: {
    created: boolean;
    validationResult: ContentValidationResult;
  };
}

export interface UpdateBrandStoryResponse extends APIResponse<BrandStoryContent> {
  meta: {
    updated: boolean;
    previousVersion?: number;
    validationResult: ContentValidationResult;
  };
}

// Delete brand story response
export interface DeleteBrandStoryResponse extends APIResponse<{ id: string }> {
  meta: {
    deleted: boolean;
    backupCreated?: boolean;
  };
}

// Analytics API Responses

// Get brand story analytics
export interface GetBrandStoryAnalyticsResponse extends APIResponse<BrandStoryAnalytics> {
  meta: {
    dateRange: {
      from: string;
      to: string;
    };
    granularity: 'hour' | 'day' | 'week' | 'month';
    realtime?: boolean;
  };
}

// Get performance metrics
export interface GetPerformanceMetricsResponse extends APIResponse<BrandStoryPerformanceMetrics> {
  meta: {
    measurementPeriod: string;
    deviceType?: 'desktop' | 'mobile' | 'tablet';
    location?: string;
  };
}

// Form Submission API Responses

// Submit form response
export interface SubmitFormResponse extends APIResponse<{ submissionId: string }> {
  meta: {
    formId: string;
    sectionId: string;
    processed: boolean;
    notifications?: {
      email?: boolean;
      webhook?: boolean;
    };
  };
}

// Get form submissions
export interface GetFormSubmissionsResponse extends PaginatedResponse<BrandStoryFormSubmission> {
  meta: {
    pagination: PaginationMeta;
    filters?: {
      formId?: string;
      sectionId?: string;
      dateRange?: {
        from: string;
        to: string;
      };
    };
    summary?: {
      totalSubmissions: number;
      conversionRate: number;
      averageCompletionTime: number;
    };
  };
}

// Interaction Tracking API Responses

// Track interaction response
export interface TrackInteractionResponse extends APIResponse<{ tracked: boolean }> {
  meta: {
    interactionId: string;
    sessionId?: string;
    batchProcessed?: boolean;
  };
}

// Get interactions response
export interface GetInteractionsResponse extends PaginatedResponse<BrandStoryInteraction> {
  meta: {
    pagination: PaginationMeta;
    filters?: {
      type?: string;
      sectionId?: string;
      dateRange?: {
        from: string;
        to: string;
      };
    };
    aggregations?: {
      byType: Record<string, number>;
      bySection: Record<string, number>;
      byHour: Record<string, number>;
    };
  };
}

// Content Management API Responses

// Validate content response
export interface ValidateContentResponse extends APIResponse<ContentValidationResult> {
  meta: {
    validatedAt: string;
    validationType: 'full' | 'partial' | 'draft';
  };
}

// Preview content response
export interface PreviewContentResponse extends APIResponse<{
  previewUrl: string;
  expiresAt: string;
}> {
  meta: {
    previewId: string;
    version: number;
  };
}

// Publish content response
export interface PublishContentResponse extends APIResponse<BrandStoryContent> {
  meta: {
    published: boolean;
    publishedAt: string;
    previousStatus: string;
    cacheInvalidated?: boolean;
  };
}

// Search and Filter Types

export interface BrandStorySearchParams {
  query?: string;
  status?: 'draft' | 'review' | 'approved' | 'published';
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  sortBy?: 'title' | 'updatedAt' | 'publishedAt' | 'views';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface SearchBrandStoryResponse extends PaginatedResponse<BrandStoryContent> {
  meta: {
    pagination: PaginationMeta;
    searchParams: BrandStorySearchParams;
    searchTime: number;
    suggestions?: string[];
  };
}

// Batch Operations

export interface BatchOperation {
  operation: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  id?: string;
  data?: Partial<BrandStoryContent>;
}

export interface BatchOperationResponse extends APIResponse<{
  successful: number;
  failed: number;
  results: Array<{
    id: string;
    operation: string;
    success: boolean;
    error?: string;
  }>;
}> {
  meta: {
    totalOperations: number;
    processingTime: number;
  };
}

// Real-time Updates

export interface RealtimeUpdate {
  type: 'content_updated' | 'analytics_updated' | 'form_submitted' | 'interaction_tracked';
  data: any;
  timestamp: string;
  userId?: string;
}

export interface SubscribeToUpdatesResponse extends APIResponse<{
  subscriptionId: string;
  websocketUrl?: string;
}> {
  meta: {
    subscriptionType: string[];
    expiresAt: string;
  };
}

// Health and Status

export interface HealthCheckResponse extends APIResponse<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    database: 'up' | 'down';
    cache: 'up' | 'down';
    storage: 'up' | 'down';
    analytics: 'up' | 'down';
  };
}> {
  meta: {
    version: string;
    uptime: number;
    timestamp: string;
  };
}

// Export all API response types (removed duplicate export block)