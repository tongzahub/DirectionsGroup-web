# The Bureau of Wonders - MVP Website

A modern marketing website for a luxury brand communications and PR agency, built with Next.js 14, TypeScript, and Strapi CMS.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom blue-white theme
- **Animations**: Framer Motion
- **CMS**: Strapi (headless CMS)
- **Database**: PostgreSQL
- **Deployment**: Vercel (frontend), Railway/Render (backend)

## Project Structure

```
bureau-wonders/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── layout/            # Header, Footer, Navigation
│   ├── ui/                # Button, Input, Card
│   ├── content/           # Hero, ContentSection, ImageGallery
│   ├── cards/             # BlogPostCard, CaseStudyCard, JobListingCard
│   └── forms/             # ContactForm
├── lib/                   # Utilities and services
│   └── constants.ts       # Configuration constants
├── types/                 # TypeScript type definitions
│   └── index.ts          # Content type interfaces
├── public/                # Static assets
└── .env.local            # Environment variables
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Strapi backend running (see backend setup)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Strapi URL and API token:
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Design System

### Color Palette

**Primary Colors:**
- Primary Blue: `#4DA3FF`
- Darker Blue: `#1877F2`
- Light Blue Background: `#EAF6FF`

**Neutral Colors:**
- Pure White: `#FFFFFF`
- Snow White: `#F7F9FC`
- Dark Gray: `#1A1A1A`
- Cool Gray: `#6B7280`
- Soft Gray: `#E5E7EB`

**Accent Colors:**
- Success: `#22C55E`
- Warning: `#F59E0B`
- Error: `#EF4444`

### Typography

- Font Family: Inter, system fonts
- Base unit: 4px spacing system
- Border radius: 12px-20px
- Animations: 200ms-400ms transitions

## Features

- ✅ Responsive design (mobile-first)
- ✅ Blue-white minimal aesthetic
- ✅ CMS-driven content management
- ✅ SEO optimization
- ✅ Image galleries
- ✅ Contact form with validation
- ✅ Blog and case study publishing
- ✅ Career listings
- ✅ Smooth animations and micro-interactions

## Deployment

### Quick Deploy (30 minutes)

See [QUICK_DEPLOY.md](../QUICK_DEPLOY.md) for a fast deployment guide.

### Full Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- Vercel setup and configuration
- Environment variables
- Custom domain setup
- Performance optimization
- Troubleshooting

### Deployment Checklist

Use [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md) to ensure all steps are completed.

## Environment Variables

### Development
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-dev-token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production
```bash
NEXT_PUBLIC_STRAPI_URL=https://your-backend.railway.app
STRAPI_API_TOKEN=your-production-token
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
```

## Performance

- Incremental Static Regeneration (ISR) for dynamic content
- Image optimization with Next.js Image component
- Code splitting by route
- Lazy loading for images and heavy components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Private - The Bureau of Wonders
