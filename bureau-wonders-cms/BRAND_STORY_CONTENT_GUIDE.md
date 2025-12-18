# Brand Story Content Management Guide

## Overview

This guide provides comprehensive instructions for managing brand story content using the StoryBrand framework within the Bureau of Wonders CMS. The brand story is designed to position luxury brand clients as heroes and The Bureau as their trusted guide.

## Content Structure

### 1. Hero Section
**Purpose**: Immediately identify with luxury brand decision-makers

**Fields**:
- **Headline** (Required, Rich Text): Should address the target audience directly
  - Character limit: Recommended 60-80 characters
  - Example: "Luxury Brands Deserve Extraordinary Stories"
  
- **Subheadline** (Required, Rich Text): Hint at transformation possible
  - Character limit: Recommended 120-150 characters
  - Example: "Transform your brand narrative into market leadership"
  
- **Background Image** (Optional): High-quality luxury brand imagery
  - Recommended size: 1920x1080px minimum
  - Format: WebP or high-quality JPEG
  
- **CTA Button Text** (Optional): Action-oriented language
  - Character limit: 30 characters maximum
  - Examples: "Start Your Journey", "Discover Your Story"

**Guidelines**:
- Focus on client aspirations, not your services
- Use emotional, benefit-focused language
- Maintain luxury brand appropriate tone

### 2. Problem Section
**Purpose**: Articulate communication challenges luxury brands face

**Fields**:
- **Title** (Required): Section heading
  - Character limit: 100 characters maximum
  - Example: "The Communication Challenges Facing Luxury Brands"
  
- **Problems** (Repeatable Component): Individual problem statements
  - **Headline**: Specific problem statement (100 characters max)
  - **Description**: Detailed explanation (Rich Text)
  - **Icon**: Visual representation (Optional)
  - **Impact**: Consequence statement (200 characters max)
  
- **Transition Statement** (Optional, Rich Text): Bridge to guide section

**Guidelines**:
- Address external problems (what they face)
- Include internal problems (how it makes them feel)
- Consider philosophical problems (why it's wrong)
- Use empathetic, not accusatory tone
- Limit to 3-5 problems for optimal user experience

### 3. Guide Section
**Purpose**: Position The Bureau as empathetic, experienced guide

**Fields**:
- **Title** (Required): Section heading (100 characters max)
- **Empathy Statement** (Required, Rich Text): Show understanding
- **Authority Elements** (Repeatable): Credentials and expertise
  - **Type**: credential | experience | recognition
  - **Title**: Authority item name (100 characters max)
  - **Description**: Detailed explanation (Rich Text)
  - **Visual**: Supporting image (Optional)
- **Team Highlights**: Relation to team members

**Guidelines**:
- Balance empathy ("we understand") with authority
- Demonstrate competence through specific examples
- Position as helpful guide, not the hero
- Include recognizable credentials and client success

### 4. Plan Section
**Purpose**: Present clear, simple methodology

**Fields**:
- **Title** (Required): Section heading (100 characters max)
- **Introduction** (Required, Rich Text): Context for methodology
- **Process Steps** (Repeatable): Individual methodology steps
  - **Number**: Step order (1-10)
  - **Title**: Step name (80 characters max)
  - **Description**: Step explanation (Rich Text)
  - **Details**: Additional information (JSON format)
  - **Icon**: Visual representation (Optional)
- **Reassurance Statement** (Optional, Rich Text): Anxiety reduction

**Guidelines**:
- Limit to 3-4 steps maximum to reduce complexity
- Make each step easily understood and actionable
- Include reassurance to reduce client anxiety
- Focus on client benefits, not internal processes

### 5. Success Stories Section
**Purpose**: Paint picture of transformation and success

**Fields**:
- **Title** (Required): Section heading (100 characters max)
- **Case Studies**: Relation to existing case studies
- **Overall Impact Statement** (Optional, Rich Text): Summary of success

**Guidelines**:
- Focus on client transformation, not your process
- Include specific, measurable results when possible
- Choose relatable case studies for target audience
- Emphasize before/after scenarios

### 6. Stakes Section
**Purpose**: Clarify consequences of inaction

**Fields**:
- **Title** (Required): Section heading (100 characters max)
- **Failure Scenarios** (Repeatable): Consequences of inaction
  - **Scenario**: Failure situation (150 characters max)
  - **Consequences**: List of negative outcomes (JSON format)
  - **Real World Example**: Supporting story (Rich Text, Optional)
- **Opportunity Cost Statement** (Optional, Rich Text): What they miss
- **Transition to Action** (Optional, Rich Text): Bridge to CTA

**Guidelines**:
- Present consequences without being aggressive
- Focus on opportunity cost, not fear tactics
- Maintain professional, luxury-appropriate tone
- Use subtle urgency without pressure

### 7. Call-to-Action Section
**Purpose**: Provide clear next steps for engagement

**Fields**:
- **Primary CTA Headline** (Required): Main action heading (100 characters max)
- **Primary CTA Description** (Required, Rich Text): Action explanation
- **Primary CTA Button Text** (Required): Button label (30 characters max)
- **Primary CTA Form Fields** (Optional, JSON): Form configuration
- **Secondary CTA Title** (Optional): Alternative actions heading
- **Secondary CTA Options** (Repeatable): Alternative engagement options
  - **Type**: resource | case-study | consultation
  - **Title**: Option name (80 characters max)
  - **Description**: Option explanation (Rich Text)
  - **Link**: Destination URL
  - **Button Text**: Action label (30 characters max, Optional)

**Guidelines**:
- Provide multiple engagement levels
- Include trust signals and guarantees
- Make next steps crystal clear
- Reduce friction with smart pre-population

## Supporting Content

### Testimonials
**Purpose**: Provide social proof throughout the story

**Fields**:
- **Client Name** (Required): Full name (100 characters max)
- **Client Title** (Optional): Job title (100 characters max)
- **Company Name** (Required): Organization (100 characters max)
- **Quote** (Required, Rich Text): Testimonial content
- **Avatar** (Optional): Client photo
- **Company Logo** (Optional): Organization logo

### Success Metrics
**Purpose**: Quantify transformation outcomes

**Fields**:
- **Label** (Required): Metric description (50 characters max)
- **Value** (Required): Metric result (30 characters max)
- **Improvement** (Optional): Change indicator (50 characters max)
- **Timeframe** (Optional): Duration context (30 characters max)

## Content Quality Guidelines

### Character Limits
- **Headlines**: 60-80 characters for optimal display
- **Subheadlines**: 120-150 characters for readability
- **Button Text**: 30 characters maximum for mobile compatibility
- **Descriptions**: Vary by section, guided by user experience

### SEO Optimization
- **SEO Title**: 50-60 characters, include primary keywords
- **Meta Description**: 150-160 characters, compelling summary
- **OG Image**: 1200x630px for social media sharing

### Accessibility Requirements
- **Alt Text**: Required for all images
- **Heading Structure**: Proper H1-H6 hierarchy
- **Color Contrast**: WCAG AA compliance minimum
- **Keyboard Navigation**: All interactive elements accessible

## Workflow Management

### Content Stages
1. **Draft**: Initial content creation
2. **Content Review**: Editorial review for quality and guidelines
3. **Brand Review**: Brand guidelines and messaging alignment
4. **Final Approval**: Marketing director sign-off
5. **Published**: Live content available to users

### Approval Process
- Each stage requires explicit approval to proceed
- Rejections include required feedback for improvements
- Comments and approval history tracked for accountability
- Version control maintains content change history

### Quality Checklist
Before publishing, ensure:
- [ ] All required sections completed with appropriate character limits
- [ ] SEO title and meta description optimized (60/160 characters)
- [ ] Images optimized and include alt text for accessibility
- [ ] Content follows StoryBrand framework structure
- [ ] Preview reviewed and approved by content team
- [ ] Brand guidelines compliance verified
- [ ] Mobile responsiveness tested
- [ ] Performance impact assessed

## StoryBrand Framework Compliance

### Seven Essential Elements
1. **Character**: Luxury brand decision-makers clearly identified
2. **Problem**: Communication challenges articulated (external, internal, philosophical)
3. **Guide**: Bureau positioned as empathetic expert with authority
4. **Plan**: Clear, simple methodology presented (3-4 steps max)
5. **Call-to-Action**: Specific next steps provided with multiple options
6. **Success**: Client transformation stories and measurable outcomes
7. **Failure**: Stakes of inaction presented professionally

### Content Validation
The system automatically validates:
- Required fields completion
- Character limit compliance
- StoryBrand framework structure
- SEO optimization
- Content quality score (target: 80%+)

## Best Practices

### Writing Guidelines
- Use active voice throughout
- Write in second person ("you") to address the client directly
- Maintain consistent luxury brand tone
- Focus on benefits, not features
- Include specific examples and metrics when possible

### Visual Content
- Use high-quality, professional imagery
- Maintain consistent visual style
- Optimize images for web performance
- Include diverse representation when appropriate
- Ensure brand consistency across all visuals

### Performance Optimization
- Compress images without quality loss
- Use WebP format when possible
- Implement lazy loading for below-fold content
- Monitor Core Web Vitals compliance
- Test on mobile devices regularly

## Troubleshooting

### Common Issues
- **Character limit exceeded**: Review content for conciseness
- **Low quality score**: Check validation warnings and address issues
- **SEO warnings**: Optimize title and description fields
- **Framework compliance**: Ensure all seven StoryBrand elements present

### Support Resources
- Content team: content@bureauofwonders.com
- Technical support: tech@bureauofwonders.com
- Brand guidelines: [Internal brand guide link]
- StoryBrand resources: [Framework documentation link]

## Version History
- v1.0: Initial content management system setup
- v1.1: Added workflow management and approval process
- v1.2: Enhanced quality validation and preview functionality
- v1.3: Integrated StoryBrand framework compliance checking