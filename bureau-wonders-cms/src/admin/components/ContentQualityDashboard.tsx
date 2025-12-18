import React from 'react';
import { Box, Typography, Flex, ProgressBar, Badge, Alert } from '@strapi/design-system';
import { CheckCircle, ExclamationMarkCircle, Cross } from '@strapi/icons';
import { validateBrandStoryContent, getContentQualityScore, getContentCompletionPercentage } from '../utils/contentValidation';

interface ContentQualityDashboardProps {
  data: any;
}

export const ContentQualityDashboard: React.FC<ContentQualityDashboardProps> = ({ data }) => {
  const validation = validateBrandStoryContent(data);
  const qualityScore = getContentQualityScore(data);
  const completionPercentage = getContentCompletionPercentage(data);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  return (
    <Box padding={4} background="neutral0" borderRadius="4px" shadow="filterShadow" marginBottom={4}>
      <Typography variant="beta" textColor="neutral800" marginBottom={4}>
        Content Quality Dashboard
      </Typography>

      {/* Quality Metrics */}
      <Flex gap={4} marginBottom={4}>
        <Box flex="1">
          <Typography variant="pi" textColor="neutral600" marginBottom={2}>
            Content Completion
          </Typography>
          <ProgressBar value={completionPercentage} size="S" />
          <Typography variant="pi" textColor="neutral600" marginTop={1}>
            {completionPercentage}% Complete
          </Typography>
        </Box>
        
        <Box flex="1">
          <Typography variant="pi" textColor="neutral600" marginBottom={2}>
            Quality Score
          </Typography>
          <ProgressBar value={qualityScore} size="S" />
          <Typography variant="pi" textColor="neutral600" marginTop={1}>
            {qualityScore}/100
          </Typography>
        </Box>
        
        <Box>
          <Badge variant={getScoreVariant(qualityScore)}>
            {qualityScore >= 80 ? 'Excellent' : qualityScore >= 60 ? 'Good' : 'Needs Work'}
          </Badge>
        </Box>
      </Flex>

      {/* Validation Results */}
      {validation.errors.length > 0 && (
        <Alert closeLabel="Close" title="Content Errors" variant="danger" marginBottom={3}>
          {validation.errors.map((error, index) => (
            <Typography key={index} variant="omega" textColor="danger600">
              <Cross style={{ marginRight: '8px' }} />
              {error}
            </Typography>
          ))}
        </Alert>
      )}

      {validation.warnings.length > 0 && (
        <Alert closeLabel="Close" title="Content Recommendations" variant="default" marginBottom={3}>
          {validation.warnings.map((warning, index) => (
            <Typography key={index} variant="omega" textColor="warning600">
              <ExclamationMarkCircle style={{ marginRight: '8px' }} />
              {warning}
            </Typography>
          ))}
        </Alert>
      )}

      {validation.isValid && validation.warnings.length === 0 && (
        <Alert closeLabel="Close" title="Content Ready" variant="success">
          <Typography variant="omega" textColor="success600">
            <CheckCircle style={{ marginRight: '8px' }} />
            Your brand story content meets all quality guidelines and is ready for publication.
          </Typography>
        </Alert>
      )}

      {/* StoryBrand Framework Checklist */}
      <Box marginTop={4}>
        <Typography variant="delta" textColor="neutral800" marginBottom={3}>
          StoryBrand Framework Checklist
        </Typography>
        
        <Flex direction="column" gap={2}>
          <Flex alignItems="center" gap={2}>
            {data.heroHeadline ? 
              <CheckCircle color="success600" /> : 
              <Cross color="danger600" />
            }
            <Typography variant="omega" textColor="neutral700">
              Character (Hero) - Luxury brand decision-makers identified
            </Typography>
          </Flex>
          
          <Flex alignItems="center" gap={2}>
            {data.problems && data.problems.length > 0 ? 
              <CheckCircle color="success600" /> : 
              <Cross color="danger600" />
            }
            <Typography variant="omega" textColor="neutral700">
              Problem - Communication challenges articulated
            </Typography>
          </Flex>
          
          <Flex alignItems="center" gap={2}>
            {data.empathyStatement ? 
              <CheckCircle color="success600" /> : 
              <Cross color="danger600" />
            }
            <Typography variant="omega" textColor="neutral700">
              Guide - Bureau positioned as empathetic expert
            </Typography>
          </Flex>
          
          <Flex alignItems="center" gap={2}>
            {data.processSteps && data.processSteps.length > 0 ? 
              <CheckCircle color="success600" /> : 
              <Cross color="danger600" />
            }
            <Typography variant="omega" textColor="neutral700">
              Plan - Clear methodology presented
            </Typography>
          </Flex>
          
          <Flex alignItems="center" gap={2}>
            {data.primaryCtaHeadline ? 
              <CheckCircle color="success600" /> : 
              <Cross color="danger600" />
            }
            <Typography variant="omega" textColor="neutral700">
              Call-to-Action - Clear next steps provided
            </Typography>
          </Flex>
          
          <Flex alignItems="center" gap={2}>
            {data.successCaseStudies && data.successCaseStudies.length > 0 ? 
              <CheckCircle color="success600" /> : 
              <ExclamationMarkCircle color="warning600" />
            }
            <Typography variant="omega" textColor="neutral700">
              Success - Client transformation stories included
            </Typography>
          </Flex>
          
          <Flex alignItems="center" gap={2}>
            {data.failureScenarios && data.failureScenarios.length > 0 ? 
              <CheckCircle color="success600" /> : 
              <ExclamationMarkCircle color="warning600" />
            }
            <Typography variant="omega" textColor="neutral700">
              Failure - Stakes of inaction presented
            </Typography>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};