import React from 'react';
import { Box, Typography, Flex, Button, Modal, ModalLayout, ModalHeader, ModalBody } from '@strapi/design-system';
import { Eye } from '@strapi/icons';
import { useIntl } from 'react-intl';

interface BrandStoryData {
  heroHeadline?: string;
  heroSubheadline?: string;
  problemTitle?: string;
  problems?: Array<{
    headline: string;
    description: string;
  }>;
  guideTitle?: string;
  empathyStatement?: string;
  planTitle?: string;
  planIntroduction?: string;
  processSteps?: Array<{
    title: string;
    description: string;
  }>;
  successTitle?: string;
  stakesTitle?: string;
  primaryCtaHeadline?: string;
  primaryCtaDescription?: string;
}

interface BrandStoryPreviewProps {
  data: BrandStoryData;
}

export const BrandStoryPreview: React.FC<BrandStoryPreviewProps> = ({ data }) => {
  const { formatMessage } = useIntl();
  const [isVisible, setIsVisible] = React.useState(false);

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <>
      <Button
        variant="secondary"
        startIcon={<Eye />}
        onClick={() => setIsVisible(true)}
      >
        Preview Brand Story
      </Button>

      {isVisible && (
        <Modal onClose={() => setIsVisible(false)}>
          <ModalLayout>
            <ModalHeader>
              <Typography fontWeight="bold" textColor="neutral800" as="h2">
                Brand Story Preview
              </Typography>
            </ModalHeader>
            <ModalBody>
              <Box padding={4} style={{ maxHeight: '70vh', overflow: 'auto' }}>
                {/* Hero Section */}
                {data.heroHeadline && (
                  <Box marginBottom={6}>
                    <Typography variant="alpha" textColor="neutral800" marginBottom={2}>
                      Hero Section
                    </Typography>
                    <Typography variant="beta" textColor="neutral700" marginBottom={2}>
                      {stripHtml(data.heroHeadline)}
                    </Typography>
                    {data.heroSubheadline && (
                      <Typography variant="epsilon" textColor="neutral600">
                        {stripHtml(data.heroSubheadline)}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Problem Section */}
                {data.problemTitle && (
                  <Box marginBottom={6}>
                    <Typography variant="alpha" textColor="neutral800" marginBottom={2}>
                      Problem Section
                    </Typography>
                    <Typography variant="beta" textColor="neutral700" marginBottom={3}>
                      {data.problemTitle}
                    </Typography>
                    {data.problems?.map((problem, index) => (
                      <Box key={index} marginBottom={2} padding={3} background="neutral100" borderRadius="4px">
                        <Typography variant="delta" textColor="neutral800" marginBottom={1}>
                          {problem.headline}
                        </Typography>
                        <Typography variant="omega" textColor="neutral600">
                          {stripHtml(problem.description)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Guide Section */}
                {data.guideTitle && (
                  <Box marginBottom={6}>
                    <Typography variant="alpha" textColor="neutral800" marginBottom={2}>
                      Guide Section
                    </Typography>
                    <Typography variant="beta" textColor="neutral700" marginBottom={2}>
                      {data.guideTitle}
                    </Typography>
                    {data.empathyStatement && (
                      <Typography variant="epsilon" textColor="neutral600">
                        {stripHtml(data.empathyStatement)}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Plan Section */}
                {data.planTitle && (
                  <Box marginBottom={6}>
                    <Typography variant="alpha" textColor="neutral800" marginBottom={2}>
                      Plan Section
                    </Typography>
                    <Typography variant="beta" textColor="neutral700" marginBottom={2}>
                      {data.planTitle}
                    </Typography>
                    {data.planIntroduction && (
                      <Typography variant="epsilon" textColor="neutral600" marginBottom={3}>
                        {stripHtml(data.planIntroduction)}
                      </Typography>
                    )}
                    {data.processSteps?.map((step, index) => (
                      <Box key={index} marginBottom={2} padding={3} background="neutral100" borderRadius="4px">
                        <Typography variant="delta" textColor="neutral800" marginBottom={1}>
                          Step {index + 1}: {step.title}
                        </Typography>
                        <Typography variant="omega" textColor="neutral600">
                          {stripHtml(step.description)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Success Section */}
                {data.successTitle && (
                  <Box marginBottom={6}>
                    <Typography variant="alpha" textColor="neutral800" marginBottom={2}>
                      Success Section
                    </Typography>
                    <Typography variant="beta" textColor="neutral700">
                      {data.successTitle}
                    </Typography>
                  </Box>
                )}

                {/* Stakes Section */}
                {data.stakesTitle && (
                  <Box marginBottom={6}>
                    <Typography variant="alpha" textColor="neutral800" marginBottom={2}>
                      Stakes Section
                    </Typography>
                    <Typography variant="beta" textColor="neutral700">
                      {data.stakesTitle}
                    </Typography>
                  </Box>
                )}

                {/* CTA Section */}
                {data.primaryCtaHeadline && (
                  <Box marginBottom={6}>
                    <Typography variant="alpha" textColor="neutral800" marginBottom={2}>
                      Call-to-Action Section
                    </Typography>
                    <Typography variant="beta" textColor="neutral700" marginBottom={2}>
                      {data.primaryCtaHeadline}
                    </Typography>
                    {data.primaryCtaDescription && (
                      <Typography variant="epsilon" textColor="neutral600">
                        {stripHtml(data.primaryCtaDescription)}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </ModalBody>
          </ModalLayout>
        </Modal>
      )}
    </>
  );
};