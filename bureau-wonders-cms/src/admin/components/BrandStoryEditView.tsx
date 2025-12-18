import React from 'react';
import { Box, Flex, Button, Typography } from '@strapi/design-system';
import { ContentGuidelines } from './ContentGuidelines';
import { BrandStoryPreview } from './BrandStoryPreview';

interface BrandStoryEditViewProps {
  data: any;
  children: React.ReactNode;
}

export const BrandStoryEditView: React.FC<BrandStoryEditViewProps> = ({ data, children }) => {
  return (
    <Box>
      {/* Content Guidelines */}
      <ContentGuidelines />
      
      {/* Preview Button */}
      <Flex justifyContent="flex-end" marginBottom={4}>
        <BrandStoryPreview data={data} />
      </Flex>
      
      {/* Original Form Content */}
      {children}
      
      {/* SEO and Publishing Guidelines */}
      <Box padding={4} background="neutral100" borderRadius="4px" marginTop={4}>
        <Typography variant="beta" textColor="neutral800" marginBottom={3}>
          Publishing Checklist
        </Typography>
        <Box marginBottom={2}>
          <Typography variant="omega" textColor="neutral700">
            ✓ All required sections completed with appropriate character limits
          </Typography>
        </Box>
        <Box marginBottom={2}>
          <Typography variant="omega" textColor="neutral700">
            ✓ SEO title and meta description optimized (60/160 characters)
          </Typography>
        </Box>
        <Box marginBottom={2}>
          <Typography variant="omega" textColor="neutral700">
            ✓ Images optimized and include alt text for accessibility
          </Typography>
        </Box>
        <Box marginBottom={2}>
          <Typography variant="omega" textColor="neutral700">
            ✓ Content follows StoryBrand framework structure
          </Typography>
        </Box>
        <Box>
          <Typography variant="omega" textColor="neutral700">
            ✓ Preview reviewed and approved by content team
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};