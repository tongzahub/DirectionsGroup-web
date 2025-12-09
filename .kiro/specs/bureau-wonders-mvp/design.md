# Design Document

## Overview

The Bureau of Wonders MVP is a modern marketing website built with a headless CMS architecture. The system separates content management from presentation, enabling flexible content updates while maintaining a fast, responsive frontend. The design prioritizes a minimal blue-white aesthetic, mobile-first responsiveness, and seamless CMS integration for non-technical content editors.

### Technology Stack

**Frontend:**
- Next.js 14+ (React framework with App Router)
- TypeScript for type safety
- Tailwind CSS for styling with custom blue-white theme
- Framer Motion for subtle animations

**CMS:**
- Strapi (headless CMS) for content management
- PostgreSQL database for content storage
- REST API for content delivery

**Deployment:**
- Vercel for frontend hosting
- Railway/Render for Strapi backend hosting

### Design Principles

1. **Mobile-First**: Design and develop for mobile devices first, then scale up
2. **Content-Driven**: CMS controls all dynamic content without code changes
3. **Performance**: Fast page loads with static generation where possible
4. **Accessibility**: WCAG 2.1 AA compliance for inclusive design
5. **Minimal Aesthetic**: Clean layouts with generous whitespace and subtle interactions

## Architecture

### System Architecture Diagram

```
┌─────────────────┐
│   Site Visitor  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Next.js Frontend (Vercel)     │
│  ┌──────────────────────────┐   │
│  │  Pages & Components      │   │
│  │  - Homepage              │   │
│  │  - About                 │   │
│  │  - Services              │   │
│  │  - Blog/Case Studies     │   │
│  │  - Careers               │   │
│  │  - Contact               │   │
│  └──────────────────────────┘   │
└────────┬────────────────────────┘
         │ REST API
         ▼
┌─────────────────────────────────┐
│   Strapi CMS (Railway/Render)   │
│  ┌──────────────────────────┐   │
│  │  Content Types           │   │
│  │  - Pages                 │   │
│  │  - Blog Posts            │   │
│  │  - Case Studies          │   │
│  │  - Job Listings          │   │
│  │  - Contact Inquiries     │   │
│  └──────────────────────────┘   │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   PostgreSQL Database           │
└─────────────────────────────────┘

┌─────────────────┐
│ Content Editor  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Strapi Admin Panel            │
└─────────────────────────────────┘
```

### Data Flow

1. **Content Creation**: Content Editors use Strapi admin panel to create/edit content
2. **Content Storage**: Strapi stores content in PostgreSQL database
3. **Content Delivery**: Next.js fetches content via Strapi REST API
4. **Page Generation**: Next.js generates static pages at build time (ISR for dynamic content)
5. **User Access**: Site Visitors access pre-rendered pages with fast load times

## Components and Interfaces

### Frontend Components

#### Layout Components

**Header Component**
- Logo/brand name
- Navigation menu (desktop: horizontal, mobile: hamburger)
- Sticky positioning on scroll
- Props: `navigation: NavigationItem[]`

**Footer Component**
- Contact information
- Social media links
- Copyright notice
- Props: `contactInfo: ContactInfo, socialLinks: SocialLink[]`

**Navigation Component**
- Responsive menu with mobile drawer
- Active state highlighting
- Smooth scroll for anchor links
- Props: `items: NavigationItem[], isMobile: boolean`

#### Page Components

**Hero Section**
- Large heading with gradient background
- CTA button
- Background image/gradient
- Props: `title: string, subtitle: string, ctaText: string, ctaLink: string`

**Content Section**
- Flexible content blocks
- Support for text, images, and mixed layouts
- Props: `content: RichText, layout: 'single' | 'two-column' | 'grid'`

**Card Component**
- Rounded corners (16px)
- Soft shadow
- Hover animation (lift effect)
- Props: `title: string, description: string, image?: string, link?: string`

**Blog Post Card**
- Thumbnail image
- Title, excerpt, date
- Category badge
- Props: `post: BlogPost`

**Case Study Card**
- Featured image
- Client name, project title
- Quick stats/results
- Props: `caseStudy: CaseStudy`

**Job Listing Card**
- Position title
- Department/type
- Location
- Apply button
- Props: `job: JobListing`

**Contact Form**
- Input fields: Name, Company, Email, Message
- Client-side validation
- Loading state during submission
- Success/error messages
- Props: `onSubmit: (data: ContactFormData) => Promise<void>`

#### UI Components

**Button Component**
- Variants: primary (blue), secondary (outline), text
- Sizes: small, medium, large
- Loading state
- Props: `variant: ButtonVariant, size: ButtonSize, loading?: boolean, onClick: () => void`

**Input Component**
- Text, email, textarea variants
- Label and error message support
- Focus states with blue accent
- Props: `type: InputType, label: string, error?: string, value: string, onChange: (value: string) => void`

**Image Gallery**
- Grid layout with lightbox
- Lazy loading
- Responsive columns (1-4 based on screen size)
- Props: `images: GalleryImage[]`

### API Interfaces

#### Strapi Content Types

**Page Content Type**
```typescript
interface Page {
  id: number;
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  ogImage: Media;
  content: RichText;
  sections: Section[];
  publishedAt: Date;
}
```

**Blog Post Content Type**
```typescript
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: RichText;
  featuredImage: Media;
  category: 'News' | 'Case Study' | 'Thought Leadership';
  tags: string[];
  author: string;
  publishedAt: Date;
  scheduledAt?: Date;
  seoTitle: string;
  metaDescription: string;
}
```

**Case Study Content Type**
```typescript
interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  client: string;
  challenge: RichText;
  strategy: RichText;
  execution: RichText;
  results: RichText;
  gallery: Media[];
  featuredImage: Media;
  publishedAt: Date;
  seoTitle: string;
  metaDescription: string;
}
```

**Job Listing Content Type**
```typescript
interface JobListing {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: RichText;
  requirements: RichText;
  publishedAt: Date;
}
```

**Contact Inquiry Content Type**
```typescript
interface ContactInquiry {
  id: number;
  name: string;
  company: string;
  email: string;
  message: string;
  status: 'New' | 'Read' | 'Responded';
  submittedAt: Date;
}
```

**Site Settings Content Type (Single Type)**
```typescript
interface SiteSettings {
  id: number;
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
  homepageIntro: RichText;
  cultureStatement: RichText;
  values: string[];
}
```

### Frontend API Service

**API Client**
```typescript
class StrapiClient {
  baseUrl: string;
  
  async getPage(slug: string): Promise<Page>;
  async getBlogPosts(filters?: BlogFilters): Promise<BlogPost[]>;
  async getBlogPost(slug: string): Promise<BlogPost>;
  async getCaseStudies(): Promise<CaseStudy[]>;
  async getCaseStudy(slug: string): Promise<CaseStudy>;
  async getJobListings(): Promise<JobListing[]>;
  async getSiteSettings(): Promise<SiteSettings>;
  async submitContactForm(data: ContactFormData): Promise<void>;
}
```

## Data Models

### Database Schema

**Pages Table**
- id (PK)
- slug (unique)
- title
- seo_title
- meta_description
- og_image_id (FK)
- content (JSON)
- published_at
- created_at
- updated_at

**Blog Posts Table**
- id (PK)
- title
- slug (unique)
- excerpt
- content (JSON)
- featured_image_id (FK)
- category (enum)
- tags (JSON array)
- author
- published_at
- scheduled_at
- seo_title
- meta_description
- created_at
- updated_at

**Case Studies Table**
- id (PK)
- title
- slug (unique)
- client
- challenge (JSON)
- strategy (JSON)
- execution (JSON)
- results (JSON)
- featured_image_id (FK)
- published_at
- seo_title
- meta_description
- created_at
- updated_at

**Case Study Gallery Table** (Many-to-Many)
- id (PK)
- case_study_id (FK)
- media_id (FK)
- order

**Job Listings Table**
- id (PK)
- title
- department
- location
- type (enum)
- description (JSON)
- requirements (JSON)
- published_at
- created_at
- updated_at

**Contact Inquiries Table**
- id (PK)
- name
- company
- email
- message
- status (enum)
- submitted_at
- created_at
- updated_at

**Site Settings Table** (Single Row)
- id (PK)
- site_name
- contact_email
- contact_phone
- office_address
- social_links (JSON)
- homepage_intro (JSON)
- culture_statement (JSON)
- values (JSON array)
- updated_at

**Media Table** (Strapi built-in)
- id (PK)
- name
- url
- mime_type
- size
- width
- height
- created_at

## Error Handling

### Frontend Error Handling

**API Request Errors**
- Network errors: Display user-friendly message "Unable to connect. Please check your internet connection."
- 404 errors: Redirect to custom 404 page
- 500 errors: Display "Something went wrong. Please try again later."
- Timeout errors (>10s): Display "Request timed out. Please try again."

**Form Validation Errors**
- Client-side validation before submission
- Display inline error messages below each field
- Highlight invalid fields with red border
- Prevent submission until all fields are valid

**Contact Form Submission**
- Success: Display success message and clear form
- Failure: Display error message and retain form data
- Email service failure: Log error, store inquiry in database, notify admin

### Backend Error Handling

**Strapi API Errors**
- Validation errors: Return 400 with field-specific error messages
- Authentication errors: Return 401 for unauthorized access
- Not found errors: Return 404 with resource type
- Server errors: Return 500, log error details, send admin notification

**Database Errors**
- Connection failures: Retry 3 times with exponential backoff
- Query errors: Log error, return generic error to client
- Constraint violations: Return 400 with user-friendly message

**Email Service Errors**
- SMTP failures: Log error, queue for retry (max 3 attempts)
- Invalid recipient: Log error, notify admin
- Rate limiting: Queue email for delayed sending

## Testing Strategy

### Unit Testing

**Frontend Components**
- Test component rendering with various props
- Test user interactions (clicks, form inputs)
- Test conditional rendering logic
- Test accessibility attributes
- Tools: Jest, React Testing Library

**API Client**
- Test API request formatting
- Test response parsing
- Test error handling
- Mock Strapi responses
- Tools: Jest, MSW (Mock Service Worker)

**Utility Functions**
- Test data formatting functions
- Test validation logic
- Test date/time utilities
- Tools: Jest

### Integration Testing

**API Integration**
- Test Next.js pages fetching data from Strapi
- Test contact form submission end-to-end
- Test image uploads and retrieval
- Tools: Jest, Playwright

**CMS Integration**
- Test content creation in Strapi
- Test content updates reflecting on frontend
- Test scheduled publishing
- Tools: Manual testing, Strapi API tests

### End-to-End Testing

**Critical User Flows**
- Homepage → Services → Contact form submission
- Blog listing → Blog post detail
- Case study browsing and gallery interaction
- Job listing viewing
- Mobile navigation and responsive behavior
- Tools: Playwright

**Cross-Browser Testing**
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Android)
- Tools: BrowserStack or manual testing

### Performance Testing

**Metrics**
- Lighthouse scores: Performance >90, Accessibility >95
- First Contentful Paint <1.5s
- Largest Contentful Paint <2.5s
- Time to Interactive <3.5s
- Tools: Lighthouse, WebPageTest

**Load Testing**
- Test concurrent users (target: 100 simultaneous)
- Test API response times under load
- Tools: k6 or Artillery

### Accessibility Testing

**Automated Testing**
- Run axe-core on all pages
- Check color contrast ratios (WCAG AA)
- Verify semantic HTML structure
- Tools: axe DevTools, Lighthouse

**Manual Testing**
- Keyboard navigation (tab order, focus states)
- Screen reader testing (NVDA, VoiceOver)
- Zoom testing (up to 200%)
- Tools: Manual testing with assistive technologies

## Design System

### Color Palette

**Primary Colors**
- Primary Blue: `#4DA3FF` - Main brand color, links, primary buttons
- Darker Blue: `#1877F2` - CTA buttons, hover states, active elements
- Light Blue Background: `#EAF6FF` - Section backgrounds, cards

**Neutral Colors**
- Pure White: `#FFFFFF` - Main background
- Snow White: `#F7F9FC` - Alternate backgrounds, subtle sections
- Dark Gray: `#1A1A1A` - Primary text
- Cool Gray: `#6B7280` - Secondary text, captions
- Soft Gray: `#E5E7EB` - Borders, dividers

**Accent Colors**
- Success: `#22C55E` - Success messages, positive indicators
- Warning: `#F59E0B` - Warning messages, alerts
- Error: `#EF4444` - Error messages, validation errors

### Typography

**Font Stack**
- Primary: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Fallback ensures system fonts on all platforms

**Type Scale**
- Heading 1: 48px / 56px line-height (mobile: 36px / 44px)
- Heading 2: 36px / 44px line-height (mobile: 28px / 36px)
- Heading 3: 28px / 36px line-height (mobile: 24px / 32px)
- Heading 4: 24px / 32px line-height (mobile: 20px / 28px)
- Body Large: 18px / 28px line-height
- Body: 16px / 24px line-height
- Body Small: 14px / 20px line-height
- Caption: 12px / 16px line-height

**Font Weights**
- Regular: 400 (body text)
- Medium: 500 (subheadings, emphasis)
- Semibold: 600 (headings, buttons)
- Bold: 700 (major headings)

### Spacing System

**Base Unit: 4px**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px
- 4xl: 96px

### Component Specifications

**Buttons**
- Height: 44px (mobile-friendly touch target)
- Padding: 16px 24px
- Border radius: 12px
- Font: 16px, semibold
- Transition: all 200ms ease
- Hover: Lift 2px, increase shadow
- Active: Scale 0.98

**Cards**
- Border radius: 16px
- Padding: 24px
- Shadow: `0 2px 8px rgba(0, 0, 0, 0.08)`
- Hover shadow: `0 4px 16px rgba(0, 0, 0, 0.12)`
- Transition: all 300ms ease

**Input Fields**
- Height: 44px
- Padding: 12px 16px
- Border: 1px solid #E5E7EB
- Border radius: 12px
- Focus: Border color #4DA3FF, shadow `0 0 0 3px rgba(77, 163, 255, 0.1)`

**Animations**
- Fade in: opacity 0 → 1, 300ms ease
- Slide up: translateY(20px) → 0, 400ms ease-out
- Hover lift: translateY(0) → translateY(-4px), 200ms ease
- Scale: scale(1) → scale(1.02), 200ms ease

### Responsive Breakpoints

- Mobile: 0-767px
- Tablet: 768px-1023px
- Desktop: 1024px-1439px
- Large Desktop: 1440px+

**Container Max Widths**
- Mobile: 100% (16px padding)
- Tablet: 720px
- Desktop: 1024px
- Large Desktop: 1280px

## Implementation Notes

### Next.js Configuration

**Static Generation Strategy**
- Homepage: ISR with 60s revalidation
- About, Services: ISR with 300s revalidation
- Blog listing: ISR with 60s revalidation
- Blog posts: ISR with 300s revalidation
- Case studies: ISR with 300s revalidation
- Careers: ISR with 60s revalidation
- Contact: Static generation

**Image Optimization**
- Use Next.js Image component for all images
- Lazy load images below fold
- Serve WebP format with fallbacks
- Responsive image sizes based on viewport

### Strapi Configuration

**Content Type Builder**
- Create all content types as defined in Data Models
- Configure relationships (Case Study → Gallery images)
- Set up single type for Site Settings

**Roles & Permissions**
- Public role: Read access to published content
- Authenticated role: Full CRUD for Content Editors
- Admin role: Full system access

**Email Plugin**
- Configure SMTP settings for contact form notifications
- Set up email templates for inquiries
- Configure recipient email addresses

**Media Library**
- Configure upload size limits (10MB per file)
- Enable image optimization
- Set up folder structure for organization

### Deployment Configuration

**Vercel (Frontend)**
- Environment variables: `NEXT_PUBLIC_STRAPI_URL`, `STRAPI_API_TOKEN`
- Build command: `npm run build`
- Output directory: `.next`
- Node version: 18.x

**Railway/Render (Backend)**
- Environment variables: Database URL, JWT secret, admin credentials
- Start command: `npm run start`
- Health check endpoint: `/api/health`
- Auto-deploy on main branch push

### Performance Optimizations

**Frontend**
- Code splitting by route
- Dynamic imports for heavy components
- Prefetch links on hover
- Compress assets (Gzip/Brotli)
- CDN for static assets

**Backend**
- Database query optimization with indexes
- API response caching (Redis optional)
- Image CDN for media files
- Rate limiting on API endpoints

### Security Considerations

**Frontend**
- Sanitize user inputs before display
- HTTPS only
- Content Security Policy headers
- XSS protection

**Backend**
- CORS configuration (whitelist frontend domain)
- Rate limiting on contact form (5 submissions per hour per IP)
- SQL injection protection (Strapi ORM)
- Authentication for admin panel (strong password requirements)
- Regular security updates

## MVP Scope

### Included in MVP

✅ All 6 public pages (Home, About, Services, Blog, Careers, Contact)
✅ Strapi CMS with all content types
✅ Blog and case study publishing
✅ Contact form with email notifications
✅ SEO metadata management
✅ Responsive design (mobile, tablet, desktop)
✅ Blue-white design system implementation
✅ Basic animations and interactions
✅ Image galleries for case studies
✅ Job listings management

### Deferred for Post-MVP

❌ Advanced analytics integration
❌ Multi-language support
❌ Advanced search functionality
❌ User comments on blog posts
❌ Newsletter subscription
❌ Social media feed integration
❌ Advanced filtering for blog/case studies
❌ PDF generation for case studies
❌ Interactive map on contact page
❌ Live chat support

## Success Metrics

**Performance**
- Lighthouse Performance score >90
- Page load time <2s on 4G connection
- Time to Interactive <3.5s

**Accessibility**
- Lighthouse Accessibility score >95
- WCAG 2.1 AA compliance
- Keyboard navigation support

**Functionality**
- All pages render correctly
- CMS content updates reflect within 60s
- Contact form 99% delivery rate
- Zero critical bugs in production

**User Experience**
- Mobile-friendly navigation
- Smooth animations (60fps)
- Clear visual hierarchy
- Intuitive CMS for content editors
