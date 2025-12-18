const { validateBrandStoryContent, getContentQualityScore } = require('../admin/utils/contentValidation');

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Only apply to brand-story content type
    if (ctx.request.url.includes('/api/brand-stories') || 
        ctx.request.url.includes('/content-manager/single-types/api::brand-story.brand-story')) {
      
      // Handle POST and PUT requests (create/update)
      if (ctx.request.method === 'POST' || ctx.request.method === 'PUT') {
        const data = ctx.request.body.data || ctx.request.body;
        
        // Validate content quality
        const validation = validateBrandStoryContent(data);
        const qualityScore = getContentQualityScore(data);
        
        // Add validation metadata to response
        ctx.state.brandStoryValidation = {
          validation,
          qualityScore,
          timestamp: new Date().toISOString(),
        };
        
        // Log content changes for audit trail
        if (strapi.log) {
          strapi.log.info('Brand Story Content Updated', {
            contentId: data.id || 'new',
            qualityScore,
            validationErrors: validation.errors.length,
            validationWarnings: validation.warnings.length,
            user: ctx.state.user?.email || 'anonymous',
            timestamp: new Date().toISOString(),
          });
        }
        
        // Prevent publishing if content has errors
        if (data.publishedAt && !validation.isValid) {
          ctx.throw(400, 'Cannot publish content with validation errors', {
            details: {
              errors: validation.errors,
              warnings: validation.warnings,
            },
          });
        }
        
        // Add workflow status if not present
        if (!data.workflowStatus) {
          data.workflowStatus = 'draft';
        }
        
        // Update workflow history
        if (!data.workflowHistory) {
          data.workflowHistory = [];
        }
        
        // Add current action to workflow history
        data.workflowHistory.push({
          action: ctx.request.method === 'POST' ? 'created' : 'updated',
          status: data.workflowStatus,
          user: ctx.state.user?.email || 'anonymous',
          timestamp: new Date().toISOString(),
          qualityScore,
          validationStatus: validation.isValid ? 'passed' : 'failed',
        });
      }
      
      // Handle workflow status changes
      if (ctx.request.body.workflowAction) {
        const { workflowAction, comments } = ctx.request.body;
        const data = ctx.request.body.data || ctx.request.body;
        
        // Validate workflow transition
        const validTransitions = {
          draft: ['content_review'],
          content_review: ['brand_review', 'draft'],
          brand_review: ['final_approval', 'content_review'],
          final_approval: ['published', 'brand_review'],
          published: [],
        };
        
        const currentStatus = data.workflowStatus || 'draft';
        const newStatus = workflowAction === 'approve' ? getNextStatus(currentStatus) : 'draft';
        
        if (!validTransitions[currentStatus].includes(newStatus)) {
          ctx.throw(400, `Invalid workflow transition from ${currentStatus} to ${newStatus}`);
        }
        
        // Update workflow status and history
        data.workflowStatus = newStatus;
        data.workflowHistory = data.workflowHistory || [];
        data.workflowHistory.push({
          action: workflowAction,
          fromStatus: currentStatus,
          toStatus: newStatus,
          user: ctx.state.user?.email || 'anonymous',
          timestamp: new Date().toISOString(),
          comments: comments || '',
        });
        
        // Log workflow action
        if (strapi.log) {
          strapi.log.info('Brand Story Workflow Action', {
            contentId: data.id,
            action: workflowAction,
            fromStatus: currentStatus,
            toStatus: newStatus,
            user: ctx.state.user?.email || 'anonymous',
            comments: comments || '',
          });
        }
      }
    }
    
    await next();
    
    // Add validation metadata to response
    if (ctx.state.brandStoryValidation && ctx.response.body) {
      if (typeof ctx.response.body === 'object') {
        ctx.response.body.meta = {
          ...ctx.response.body.meta,
          brandStoryValidation: ctx.state.brandStoryValidation,
        };
      }
    }
  };
};

function getNextStatus(currentStatus) {
  const statusOrder = ['draft', 'content_review', 'brand_review', 'final_approval', 'published'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  return statusOrder[currentIndex + 1] || 'published';
}