import React from 'react';
import { Box, Typography, Accordion, AccordionToggle, AccordionContent, AccordionGroup } from '@strapi/design-system';
import { Information } from '@strapi/icons';

export const ContentGuidelines: React.FC = () => {
  return (
    <Box padding={4} background="neutral100" borderRadius="4px" marginBottom={4}>
      <Box marginBottom={3}>
        <Typography variant="beta" textColor="neutral800">
          <Information style={{ marginRight: '8px' }} />
          Brand Story Content Guidelines
        </Typography>
      </Box>
      
      <AccordionGroup>
        <Accordion expanded={false} id="hero-guidelines">
          <AccordionToggle title="Hero Section Guidelines" />
          <AccordionContent>
            <Box padding={3}>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Headline:</strong> Should immediately identify with luxury brand decision-makers. Focus on their aspirations, not your services.
              </Typography>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Subheadline:</strong> Hint at the transformation possible. Keep it benefit-focused and emotionally resonant.
              </Typography>
              <Typography variant="omega" textColor="neutral700">
                <strong>CTA Button:</strong> Use action-oriented language. Examples: "Start Your Journey", "Discover Your Story", "Transform Your Brand"
              </Typography>
            </Box>
          </AccordionContent>
        </Accordion>

        <Accordion expanded={false} id="problem-guidelines">
          <AccordionToggle title="Problem Section Guidelines" />
          <AccordionContent>
            <Box padding={3}>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Problem Statements:</strong> Focus on external problems (what they face), internal problems (how it makes them feel), and philosophical problems (why it's wrong).
              </Typography>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Tone:</strong> Empathetic, not accusatory. Show understanding of their challenges.
              </Typography>
              <Typography variant="omega" textColor="neutral700">
                <strong>Structure:</strong> Start with the most relatable problem, then build to more complex challenges.
              </Typography>
            </Box>
          </AccordionContent>
        </Accordion>

        <Accordion expanded={false} id="guide-guidelines">
          <AccordionToggle title="Guide Section Guidelines" />
          <AccordionContent>
            <Box padding={3}>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Empathy:</strong> Show you understand their world and challenges. Use "we understand" language.
              </Typography>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Authority:</strong> Demonstrate competence through credentials, experience, and client success stories.
              </Typography>
              <Typography variant="omega" textColor="neutral700">
                <strong>Balance:</strong> Be confident but not arrogant. Position as helpful guide, not the hero.
              </Typography>
            </Box>
          </AccordionContent>
        </Accordion>

        <Accordion expanded={false} id="plan-guidelines">
          <AccordionToggle title="Plan Section Guidelines" />
          <AccordionContent>
            <Box padding={3}>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Simplicity:</strong> Keep to 3-4 clear steps maximum. Complex processes create anxiety.
              </Typography>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Clarity:</strong> Each step should be easily understood and actionable.
              </Typography>
              <Typography variant="omega" textColor="neutral700">
                <strong>Reassurance:</strong> Include statements that reduce risk and anxiety about the process.
              </Typography>
            </Box>
          </AccordionContent>
        </Accordion>

        <Accordion expanded={false} id="success-guidelines">
          <AccordionToggle title="Success Stories Guidelines" />
          <AccordionContent>
            <Box padding={3}>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Transformation Focus:</strong> Show before/after scenarios. Focus on client outcomes, not your process.
              </Typography>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Metrics:</strong> Include specific, measurable results when possible.
              </Typography>
              <Typography variant="omega" textColor="neutral700">
                <strong>Relatability:</strong> Choose case studies that resonate with your target audience.
              </Typography>
            </Box>
          </AccordionContent>
        </Accordion>

        <Accordion expanded={false} id="stakes-guidelines">
          <AccordionToggle title="Stakes Section Guidelines" />
          <AccordionContent>
            <Box padding={3}>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Subtlety:</strong> Present consequences without being aggressive or fear-mongering.
              </Typography>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Opportunity Cost:</strong> Focus on what they miss by not acting, not what bad things will happen.
              </Typography>
              <Typography variant="omega" textColor="neutral700">
                <strong>Professional Tone:</strong> Maintain luxury brand appropriate messaging throughout.
              </Typography>
            </Box>
          </AccordionContent>
        </Accordion>

        <Accordion expanded={false} id="cta-guidelines">
          <AccordionToggle title="Call-to-Action Guidelines" />
          <AccordionContent>
            <Box padding={3}>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Multiple Options:</strong> Provide different engagement levels (consultation, resources, contact).
              </Typography>
              <Typography variant="omega" textColor="neutral700" marginBottom={2}>
                <strong>Trust Signals:</strong> Include guarantees, testimonials, or risk-reduction statements.
              </Typography>
              <Typography variant="omega" textColor="neutral700">
                <strong>Clear Next Steps:</strong> Make it obvious what happens after they take action.
              </Typography>
            </Box>
          </AccordionContent>
        </Accordion>
      </AccordionGroup>
    </Box>
  );
};