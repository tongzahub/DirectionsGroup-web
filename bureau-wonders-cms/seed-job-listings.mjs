import axios from 'axios';

const API_URL = 'http://localhost:1337/api';
const TOKEN = '44d7d02e56c1f0c5915de077a4a553864b5bbab3318078a46527ce41f7fb6f92c2b369745e26e4deb570a9c25df01e6372437c3ea6ce5ebb537169f5760b9a84fa2615317f73ee58dbbf2c72ea1c14bdfe426e798813c3954ddcc8fedeabe184625cdc1cc20a481f9cf8ad4b3f2f5a613d201bfacdfb78178f6e51a88b91890f';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const jobListings = [
  {
    title: 'Senior Account Manager - Luxury Brands',
    department: 'Client Services',
    location: 'Bangkok, Thailand',
    type: 'Full-time',
    description: `# Senior Account Manager - Luxury Brands

Join our dynamic team as a Senior Account Manager specializing in luxury brand communications. You'll be responsible for managing high-profile client relationships and delivering exceptional strategic communications solutions.

## About This Role

As a Senior Account Manager, you'll work directly with luxury brands across jewelry, fashion, hospitality, and lifestyle sectors. You'll lead strategic planning, oversee campaign execution, and ensure our clients receive world-class service that exceeds their expectations.

## Key Responsibilities

- **Client Relationship Management**: Serve as the primary point of contact for assigned luxury brand clients
- **Strategic Planning**: Develop comprehensive communications strategies aligned with client objectives
- **Campaign Oversight**: Manage end-to-end campaign execution from concept to completion
- **Team Leadership**: Guide junior team members and coordinate cross-functional projects
- **Business Development**: Identify opportunities for account growth and new service offerings
- **Quality Assurance**: Ensure all deliverables meet our high standards and client expectations

## What You'll Do Daily

- Conduct strategic planning sessions with clients and internal teams
- Review and approve creative concepts, press materials, and campaign assets
- Coordinate with media contacts and manage press relationships
- Present campaign results and strategic recommendations to clients
- Mentor junior team members and provide guidance on best practices
- Collaborate with creative, digital, and events teams on integrated campaigns`,
    requirements: `## Required Qualifications

### Experience & Background
- **5+ years** of account management experience in luxury brand communications, PR, or marketing
- **Proven track record** managing high-end clients in luxury sectors (jewelry, fashion, hospitality, automotive, etc.)
- **Bachelor's degree** in Communications, Marketing, Public Relations, or related field
- **Agency experience** preferred, with understanding of client service excellence

### Core Skills
- **Strategic Thinking**: Ability to develop comprehensive communications strategies
- **Client Management**: Exceptional relationship-building and client service skills
- **Project Management**: Strong organizational skills with ability to manage multiple projects
- **Communication**: Excellent written and verbal communication in English and Thai
- **Leadership**: Experience mentoring junior team members and leading projects

### Technical Requirements
- **Digital Proficiency**: Familiarity with social media platforms, PR tools, and project management software
- **Media Relations**: Established relationships with luxury lifestyle media preferred
- **Presentation Skills**: Confident presenting to C-level executives and senior stakeholders

## Preferred Qualifications

- **Advanced degree** in Marketing, Communications, or MBA
- **Luxury industry experience** with understanding of high-net-worth consumer behavior
- **International experience** or multicultural client management
- **Additional languages** (Mandarin, Japanese, or European languages) a plus
- **Event management** experience for luxury brand activations

## What We Offer

- **Competitive salary** commensurate with experience
- **Performance bonuses** based on client satisfaction and account growth
- **Professional development** opportunities including industry conferences and training
- **Flexible work arrangements** with hybrid remote options
- **Health and wellness** comprehensive benefits package
- **Career advancement** clear path for growth within our expanding agency`,
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Creative Director',
    department: 'Creative',
    location: 'Bangkok, Thailand',
    type: 'Full-time',
    description: `# Creative Director

Lead our creative vision and drive innovative campaigns for the world's most prestigious luxury brands. As Creative Director, you'll shape the creative strategy and oversee the development of compelling brand narratives.

## About This Role

We're seeking a visionary Creative Director to join our leadership team and elevate our creative output. You'll work with luxury brands across multiple sectors, creating campaigns that resonate with sophisticated audiences and drive meaningful engagement.

## Key Responsibilities

- **Creative Leadership**: Set creative vision and standards across all client work
- **Strategic Development**: Collaborate on creative strategies that align with business objectives
- **Team Management**: Lead and inspire a team of designers, copywriters, and creative professionals
- **Client Collaboration**: Present creative concepts to senior client stakeholders
- **Brand Storytelling**: Develop compelling narratives that capture luxury brand essence
- **Quality Control**: Ensure all creative output meets luxury brand standards

## Creative Focus Areas

- **Brand Identity**: Logo design, brand guidelines, and visual identity systems
- **Campaign Development**: Integrated campaigns across digital and traditional media
- **Content Creation**: Photography direction, video concepts, and editorial content
- **Event Design**: Creative concepts for luxury brand experiences and activations
- **Digital Innovation**: Cutting-edge digital experiences and interactive content`,
    requirements: `## Required Qualifications

### Experience & Portfolio
- **8+ years** of creative leadership experience in luxury brand communications
- **Strong portfolio** demonstrating luxury brand work across multiple touchpoints
- **Agency experience** with proven track record of award-winning campaigns
- **Team leadership** experience managing creative departments

### Creative Skills
- **Visual Excellence**: Exceptional eye for design, typography, and luxury aesthetics
- **Strategic Thinking**: Ability to translate business objectives into creative solutions
- **Brand Understanding**: Deep appreciation for luxury brand values and positioning
- **Storytelling**: Expertise in crafting compelling brand narratives

### Technical Proficiency
- **Design Software**: Expert level in Adobe Creative Suite (Photoshop, Illustrator, InDesign)
- **Digital Platforms**: Understanding of web design, social media, and digital marketing
- **Production Knowledge**: Experience with print production, photography, and video
- **Presentation Skills**: Ability to present and defend creative concepts to clients

## Leadership Qualities

- **Vision**: Ability to see the big picture and inspire others with creative direction
- **Collaboration**: Strong interpersonal skills for working with clients and teams
- **Innovation**: Drive to push creative boundaries while respecting brand heritage
- **Mentorship**: Passion for developing junior creative talent

## What We Offer

- **Creative Freedom**: Opportunity to work on prestigious luxury brand projects
- **Competitive Package**: Salary, bonuses, and equity participation
- **Professional Growth**: Conference attendance, industry networking, and skill development
- **State-of-the-Art Tools**: Latest creative software and hardware
- **Inspiring Environment**: Beautiful office space designed for creative collaboration`,
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Digital Marketing Specialist',
    department: 'Digital',
    location: 'Bangkok, Thailand',
    type: 'Full-time',
    description: `# Digital Marketing Specialist

Drive digital excellence for luxury brands through innovative online strategies, social media management, and data-driven campaigns that engage high-value audiences.

## About This Role

Join our digital team to create and execute sophisticated digital marketing strategies for luxury brands. You'll manage social media presence, develop content strategies, and optimize digital campaigns to reach affluent consumers across multiple platforms.

## Key Responsibilities

- **Social Media Management**: Develop and execute social media strategies across platforms
- **Content Creation**: Create engaging content that reflects luxury brand values
- **Campaign Management**: Plan and execute digital advertising campaigns
- **Analytics & Reporting**: Monitor performance and provide actionable insights
- **Influencer Relations**: Identify and manage partnerships with luxury lifestyle influencers
- **SEO/SEM**: Optimize digital presence for search engines and paid advertising

## Digital Platforms

- **Social Media**: Instagram, Facebook, LinkedIn, TikTok, YouTube
- **Advertising**: Google Ads, Facebook Ads, LinkedIn Ads, programmatic display
- **Analytics**: Google Analytics, social media insights, campaign performance tools
- **Content Management**: WordPress, Shopify, luxury e-commerce platforms`,
    requirements: `## Required Qualifications

### Experience & Skills
- **3+ years** of digital marketing experience, preferably with luxury brands
- **Bachelor's degree** in Marketing, Communications, or related field
- **Social media expertise** with proven track record of growing luxury brand presence
- **Content creation skills** including copywriting, basic design, and video editing

### Technical Requirements
- **Platform Proficiency**: Expert knowledge of major social media platforms
- **Analytics Tools**: Google Analytics, Facebook Business Manager, social media analytics
- **Design Software**: Basic proficiency in Canva, Adobe Creative Suite, or similar tools
- **Campaign Management**: Experience with paid social and search advertising

### Luxury Brand Understanding
- **Aesthetic Sense**: Understanding of luxury brand visual standards and tone
- **Target Audience**: Knowledge of high-net-worth consumer behavior and preferences
- **Brand Voice**: Ability to maintain sophisticated, on-brand communication
- **Trend Awareness**: Stay current with luxury lifestyle and digital marketing trends

## Preferred Qualifications

- **Certification**: Google Ads, Facebook Blueprint, or similar digital marketing certifications
- **E-commerce Experience**: Familiarity with luxury retail and online shopping behavior
- **Multilingual**: English and Thai required, additional languages preferred
- **Photography/Video**: Basic skills in content creation and visual storytelling

## Growth Opportunities

- **Skill Development**: Training in advanced digital marketing techniques
- **Client Exposure**: Direct interaction with luxury brand marketing teams
- **Career Path**: Progression to Senior Digital Specialist or Digital Strategy roles
- **Industry Recognition**: Opportunity to work on award-winning digital campaigns`,
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Public Relations Executive',
    department: 'Public Relations',
    location: 'Bangkok, Thailand',
    type: 'Full-time',
    description: `# Public Relations Executive

Execute strategic PR campaigns for luxury brands, manage media relationships, and create compelling stories that elevate brand presence in premium lifestyle publications.

## About This Role

As a PR Executive, you'll be at the forefront of luxury brand communications, crafting press materials, building media relationships, and securing high-impact coverage in top-tier publications.

## Key Responsibilities

- **Media Relations**: Build and maintain relationships with luxury lifestyle journalists
- **Press Materials**: Write press releases, media kits, and pitch materials
- **Event Support**: Coordinate press coverage for luxury brand events and launches
- **Crisis Management**: Support crisis communications and reputation management
- **Monitoring**: Track media coverage and compile comprehensive reports
- **Research**: Stay informed about industry trends and competitive landscape`,
    requirements: `## Required Qualifications

### Experience & Background
- **2+ years** of PR experience, preferably in luxury brands or lifestyle sectors
- **Bachelor's degree** in Communications, Journalism, Public Relations, or related field
- **Writing skills** with portfolio of published press materials and media coverage
- **Media contacts** in luxury lifestyle, fashion, or business publications preferred

### Core Competencies
- **Excellent Writing**: Ability to craft compelling press materials and pitches
- **Relationship Building**: Strong interpersonal skills for media relationship management
- **Project Management**: Organized approach to managing multiple PR campaigns
- **Research Skills**: Ability to identify relevant media opportunities and trends

### Industry Knowledge
- **Luxury Market**: Understanding of luxury brand positioning and target audiences
- **Media Landscape**: Familiarity with key publications, journalists, and influencers
- **Digital PR**: Knowledge of online media, blogs, and digital influencer relations
- **Event Experience**: Support for press events, product launches, and media briefings

## Career Development

- **Mentorship**: Work closely with senior PR professionals
- **Media Training**: Opportunities to develop spokesperson and presentation skills
- **Industry Events**: Attend luxury brand events and media functions
- **Advancement**: Clear path to Senior PR Executive and Account Director roles`,
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Event Coordinator',
    department: 'Events & Experiences',
    location: 'Bangkok, Thailand',
    type: 'Full-time',
    description: `# Event Coordinator

Create unforgettable luxury brand experiences through meticulous event planning, vendor management, and flawless execution of high-end activations and launches.

## About This Role

Join our events team to produce world-class luxury brand experiences. You'll coordinate every detail of exclusive events, from intimate VIP dinners to large-scale product launches, ensuring each event reflects the sophistication and excellence our clients expect.

## Key Responsibilities

- **Event Planning**: Coordinate all aspects of luxury brand events and activations
- **Vendor Management**: Source and manage premium vendors, venues, and suppliers
- **Budget Management**: Track event budgets and ensure cost-effective execution
- **Timeline Coordination**: Develop and manage detailed event timelines and logistics
- **On-site Management**: Oversee event execution and troubleshoot any issues
- **Client Liaison**: Work directly with clients to understand their vision and requirements`,
    requirements: `## Required Qualifications

### Experience & Skills
- **2+ years** of event planning experience, preferably with luxury brands or high-end events
- **Bachelor's degree** in Event Management, Hospitality, Marketing, or related field
- **Project management** skills with attention to detail and ability to multitask
- **Vendor relationships** with premium suppliers in Bangkok and surrounding areas

### Event Expertise
- **Luxury Standards**: Understanding of high-end event expectations and quality standards
- **Logistics Management**: Experience coordinating complex event logistics and timelines
- **Budget Management**: Ability to manage event budgets and negotiate with vendors
- **Problem Solving**: Quick thinking and creative solutions for event challenges

### Personal Qualities
- **Professional Demeanor**: Polished presentation suitable for luxury brand environments
- **Stress Management**: Ability to remain calm and composed under pressure
- **Flexibility**: Willingness to work evenings and weekends for events
- **Cultural Sensitivity**: Understanding of diverse client needs and cultural considerations

## Event Types

- **Product Launches**: Luxury brand product unveilings and press events
- **VIP Experiences**: Exclusive client entertainment and relationship building
- **Trade Shows**: Premium exhibition presence and hospitality suites
- **Corporate Events**: Board meetings, annual gatherings, and milestone celebrations
- **Fashion Shows**: Runway events and designer showcases`,
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Content Writer - Luxury Brands',
    department: 'Content & Strategy',
    location: 'Bangkok, Thailand',
    type: 'Contract',
    description: `# Content Writer - Luxury Brands

Craft compelling content that captures the essence of luxury brands through sophisticated storytelling, brand narratives, and premium lifestyle content across multiple platforms.

## About This Role

We're seeking a talented Content Writer to join our team on a contract basis. You'll create premium content for luxury brands, from website copy and blog articles to social media content and brand storytelling pieces.

## Key Responsibilities

- **Brand Storytelling**: Develop compelling narratives that reflect luxury brand heritage and values
- **Content Creation**: Write website copy, blog articles, social media content, and marketing materials
- **Brand Voice**: Maintain consistent, sophisticated tone across all content touchpoints
- **Research**: Conduct thorough research on luxury markets, trends, and target audiences
- **Collaboration**: Work with creative and strategy teams to develop integrated content approaches
- **SEO Optimization**: Create content that performs well in search while maintaining luxury brand standards`,
    requirements: `## Required Qualifications

### Writing & Experience
- **3+ years** of professional writing experience, preferably with luxury brands
- **Portfolio** demonstrating luxury brand content across multiple formats
- **Bachelor's degree** in English, Journalism, Communications, or related field
- **Published work** in luxury lifestyle publications or brand content preferred

### Content Expertise
- **Brand Voice**: Ability to adapt writing style to match sophisticated brand personalities
- **Storytelling**: Skill in crafting compelling narratives that engage affluent audiences
- **Research Skills**: Thorough approach to understanding brand history, values, and market position
- **SEO Knowledge**: Understanding of content optimization without compromising brand voice

### Industry Understanding
- **Luxury Market**: Knowledge of luxury consumer behavior and brand positioning
- **Cultural Sensitivity**: Ability to create content that resonates across diverse markets
- **Trend Awareness**: Stay current with luxury lifestyle trends and cultural movements
- **Quality Standards**: Commitment to excellence and attention to detail

## Contract Details

- **Duration**: 6-month contract with possibility of extension
- **Schedule**: Flexible hours with core collaboration time
- **Remote Options**: Hybrid work arrangement available
- **Project Variety**: Opportunity to work across multiple luxury brand sectors`,
    publishedAt: new Date().toISOString(),
  },
  {
    title: 'Business Development Manager',
    department: 'Business Development',
    location: 'Bangkok, Thailand',
    type: 'Full-time',
    description: `# Business Development Manager

Drive agency growth by identifying new business opportunities, building relationships with luxury brands, and developing strategic partnerships that expand our market presence.

## About This Role

Lead our business development efforts to grow The Bureau of Wonders' client portfolio. You'll identify and pursue new business opportunities with luxury brands across Southeast Asia, building relationships that result in long-term partnerships.

## Key Responsibilities

- **New Business Development**: Identify and pursue opportunities with luxury brands
- **Relationship Building**: Develop relationships with key decision-makers at target companies
- **Proposal Development**: Create compelling proposals and presentations for prospective clients
- **Market Research**: Analyze market trends and identify growth opportunities
- **Partnership Development**: Explore strategic partnerships with complementary service providers
- **Revenue Growth**: Contribute to agency revenue targets through new client acquisition`,
    requirements: `## Required Qualifications

### Experience & Background
- **5+ years** of business development experience, preferably in luxury brands or agency services
- **Proven track record** of new business acquisition and revenue generation
- **Bachelor's degree** in Business, Marketing, or related field
- **Network**: Existing relationships with luxury brands in Southeast Asia preferred

### Business Skills
- **Sales Expertise**: Strong consultative selling skills and ability to close complex deals
- **Presentation Skills**: Confident presenting to C-level executives and senior stakeholders
- **Negotiation**: Experience negotiating service agreements and contract terms
- **Strategic Thinking**: Ability to identify market opportunities and develop growth strategies

### Industry Knowledge
- **Luxury Market**: Deep understanding of luxury brand challenges and opportunities
- **Agency Services**: Knowledge of communications, PR, and marketing service offerings
- **Regional Expertise**: Understanding of Southeast Asian luxury market dynamics
- **Cultural Intelligence**: Ability to work effectively across diverse cultural contexts

## Growth Potential

- **Leadership Track**: Opportunity to build and lead business development team
- **Equity Participation**: Potential for equity participation based on performance
- **Regional Expansion**: Lead expansion into new markets across Asia-Pacific
- **Strategic Role**: Influence agency strategic direction and service development`,
    publishedAt: new Date().toISOString(),
  }
];

async function seedJobListings() {
  console.log('Starting job listings seed...\n');

  try {
    console.log('Seeding Job Listings...');
    for (const job of jobListings) {
      try {
        // Check if job exists
        const existing = await client.get(`/job-listings?filters[title][$eq]=${encodeURIComponent(job.title)}`);
        
        if (existing.data.data && existing.data.data.length > 0) {
          console.log(`- Job already exists: ${job.title}`);
        } else {
          await client.post('/job-listings', { data: job });
          console.log(`✓ Created job: ${job.title}`);
        }
      } catch (error) {
        console.log(`Error creating ${job.title}:`, error.response?.data || error.message || error);
      }
    }

    console.log('\n✓ Job listings seeding completed!');
    console.log(`\nCreated ${jobListings.length} job listings:`);
    jobListings.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} (${job.department} - ${job.type})`);
    });
  } catch (error) {
    console.error('Seed error:', error);
  }
}

seedJobListings();