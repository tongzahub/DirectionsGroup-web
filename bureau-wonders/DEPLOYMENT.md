# Deployment Guide - Bureau of Wonders Frontend

This guide covers deploying the Next.js frontend to Vercel.

## Prerequisites

- GitHub/GitLab/Bitbucket repository with your code
- Vercel account (sign up at https://vercel.com)
- Strapi backend deployed and accessible

## Vercel Deployment Steps

### 1. Initial Setup

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your Git repository containing the `bureau-wonders` folder
4. Select the `bureau-wonders` directory as the root directory

### 2. Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `bureau-wonders` (if monorepo)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`
- **Node Version**: 20.x

### 3. Environment Variables

Add the following environment variables in Vercel project settings:

#### Required Variables

```bash
# Strapi CMS URL (your deployed Strapi backend URL)
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-backend.railway.app

# Strapi API Token (generate in Strapi admin panel)
STRAPI_API_TOKEN=your-production-api-token-here

# Site URL (your Vercel deployment URL)
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
```

#### How to Get STRAPI_API_TOKEN

1. Log into your Strapi admin panel
2. Go to Settings → API Tokens
3. Click "Create new API Token"
4. Name: "Vercel Frontend"
5. Token type: "Read-only" (or "Full access" if needed)
6. Token duration: "Unlimited"
7. Copy the generated token and add it to Vercel

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete (typically 2-3 minutes)
3. Your site will be live at `https://your-project.vercel.app`

### 5. Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `bureauofwonders.com`)
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_SITE_URL` environment variable to your custom domain

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

## Revalidation & ISR

The site uses Incremental Static Regeneration (ISR):
- Homepage: Revalidates every 60 seconds
- Blog listing: Revalidates every 60 seconds
- Blog posts: Revalidates every 300 seconds (5 minutes)
- Case studies: Revalidates every 300 seconds
- About/Services: Revalidates every 300 seconds
- Careers: Revalidates every 60 seconds

Content updates in Strapi will appear on the frontend within these timeframes.

## Troubleshooting

### Build Fails

**Check build logs** in Vercel dashboard for specific errors.

Common issues:
- Missing environment variables
- TypeScript errors
- Dependency installation failures

### API Connection Issues

1. Verify `NEXT_PUBLIC_STRAPI_URL` is correct
2. Ensure Strapi backend is running and accessible
3. Check CORS settings in Strapi allow your Vercel domain
4. Verify `STRAPI_API_TOKEN` is valid

### Images Not Loading

1. Check Strapi media library is accessible
2. Verify image URLs in Strapi responses
3. Ensure Next.js Image domains are configured in `next.config.ts`

## Performance Optimization

### Vercel Analytics (Optional)

1. Enable Vercel Analytics in project settings
2. Monitor Core Web Vitals
3. Track page performance metrics

### Edge Functions (Optional)

Consider using Vercel Edge Functions for:
- API routes that need low latency
- Middleware for authentication
- Dynamic content personalization

## Monitoring

### Recommended Tools

- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking (add @sentry/nextjs)
- **LogRocket**: Session replay and debugging

## Security

### Environment Variables

- Never commit `.env.local` to Git
- Use Vercel's encrypted environment variables
- Rotate API tokens regularly

### Headers

Security headers are configured in `next.config.ts`:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options

## Rollback

If a deployment has issues:

1. Go to Vercel project → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support
