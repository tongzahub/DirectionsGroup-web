# SEO Implementation Guide

This document describes the SEO metadata system implemented for The Bureau of Wonders website.

## Overview

The website implements a comprehensive SEO metadata system that includes:

- Dynamic metadata generation for all pages
- Open Graph tags for social media sharing
- Twitter Card support
- Structured sitemap.xml generation
- robots.txt configuration
- Fallback metadata when CMS fields are not defined

## Files Created/Modified

### New Files

1. **`app/sitemap.ts`** - Dynamic sitemap generation
   - Includes all static pages
   - Dynamically fetches and includes blog posts and case studies
   - Updates automatically with ISR

2. **`app/robots.ts`** - Robots.txt configuration
   - Allows all search engines
   - Disallows API and Next.js internal routes
   - References sitemap.xml

3. **`lib/metadata.ts`** - Metadata utility functions
   - `generatePageMetadata()` - General page metadata
   - `generateBlogPostMetadata()` - Blog post specific metadata
   - `generateCaseStudyMetadata()` - Case study specific metadata
   - `generateStaticPageMetadata()` - Static page metadata

### Modified Files

1. **`app/layout.tsx`** - Enhanced root metadata
   - Added metadataBase for absolute URLs
   - Added title template
   - Added comprehensive Open Graph tags
   - Added Twitter Card configuration
   - Added robots configuration

2. **All page files** - Updated to use metadata utilities
   - `app/page.tsx` (Homepage)
   - `app/about/page.tsx`
   - `app/services/page.tsx`
   - `app/blog/page.tsx`
   - `app/blog/[slug]/page.tsx`
   - `app/case-studies/page.tsx`
   - `app/case-studies/[slug]/page.tsx`
   - `app/careers/page.tsx`
   - `app/contact/page.tsx`

## Metadata Features

### 1. Title Tags

Each page has a unique title that follows the pattern:
- Homepage: "Luxury Brand Communications & PR | The Bureau of Wonders"
- Other pages: "[Page Name] | The Bureau of Wonders"

Titles can be customized via Strapi's `seoTitle` field.

### 2. Meta Descriptions

All pages have descriptive meta descriptions:
- Fetched from Strapi's `metaDescription` field
- Fallback to default descriptions if not set
- Optimized for search engine snippets (150-160 characters)

### 3. Open Graph Tags

Complete Open Graph implementation for social media sharing:
- `og:title` - Page title
- `og:description` - Page description
- `og:image` - Featured image (from Strapi)
- `og:type` - 'website' or 'article'
- `og:url` - Canonical URL
- `og:site_name` - Site name
- `og:published_time` - For blog posts and case studies

### 4. Twitter Cards

Twitter Card tags for enhanced Twitter sharing:
- `twitter:card` - 'summary_large_image'
- `twitter:title` - Page title
- `twitter:description` - Page description
- `twitter:image` - Featured image

### 5. Keywords

Relevant keywords added to each page for SEO:
- Homepage: luxury brand communications, PR agency, jewelry PR, etc.
- About: about us, luxury brand agency, brand story, etc.
- Services: luxury brand services, PR services, brand communications, etc.
- Blog: luxury brand blog, PR insights, thought leadership, etc.
- Case Studies: case studies, luxury brand campaigns, PR success stories, etc.

### 6. Structured Data

The sitemap.xml includes:
- All static pages with priorities
- Dynamic blog posts with last modified dates
- Dynamic case studies with last modified dates
- Change frequency hints for search engines

## CMS Integration

### Strapi SEO Fields

Each content type in Strapi includes SEO fields:

**Page Content Type:**
- `seoTitle` - Custom page title
- `metaDescription` - Custom meta description
- `ogImage` - Open Graph image

**Blog Post Content Type:**
- `seoTitle` - Custom post title
- `metaDescription` - Custom meta description
- `featuredImage` - Used as OG image

**Case Study Content Type:**
- `seoTitle` - Custom case study title
- `metaDescription` - Custom meta description
- `featuredImage` - Used as OG image

### Fallback Behavior

When SEO fields are not defined in Strapi:
1. Title falls back to page name + site name
2. Description falls back to default page description
3. OG image is omitted (uses site default)
4. All other metadata uses sensible defaults

## Environment Variables

Required environment variable:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

This is used for:
- Sitemap URL generation
- Canonical URLs
- Open Graph URLs
- Robots.txt sitemap reference

## Testing SEO Implementation

### 1. Verify Metadata in Browser

Open any page and view source (Ctrl+U):
- Check `<title>` tag
- Check `<meta name="description">` tag
- Check Open Graph tags (`<meta property="og:*">`)
- Check Twitter Card tags (`<meta name="twitter:*">`)

### 2. Test with SEO Tools

**Google Rich Results Test:**
- URL: https://search.google.com/test/rich-results
- Test any page URL to verify structured data

**Facebook Sharing Debugger:**
- URL: https://developers.facebook.com/tools/debug/
- Test Open Graph tags

**Twitter Card Validator:**
- URL: https://cards-dev.twitter.com/validator
- Test Twitter Card implementation

**Lighthouse SEO Audit:**
- Run in Chrome DevTools
- Target score: 100/100

### 3. Verify Sitemap

Access sitemap at: `https://yourdomain.com/sitemap.xml`

Check that it includes:
- All static pages
- All published blog posts
- All published case studies
- Correct last modified dates
- Appropriate priorities

### 4. Verify Robots.txt

Access robots.txt at: `https://yourdomain.com/robots.txt`

Verify:
- Allows all user agents
- Disallows /api/ and /_next/
- References sitemap.xml

## Best Practices

### Content Editors

1. **Always fill SEO fields** in Strapi for important pages
2. **Keep titles under 60 characters** for optimal display
3. **Keep descriptions between 150-160 characters**
4. **Use descriptive, keyword-rich titles** without keyword stuffing
5. **Upload high-quality OG images** (1200x630px recommended)
6. **Write unique descriptions** for each page/post

### Developers

1. **Test metadata** after any page changes
2. **Verify sitemap** updates after adding new content types
3. **Check robots.txt** after deployment
4. **Monitor Core Web Vitals** alongside SEO metrics
5. **Keep metadata utilities** DRY and consistent

## Performance Considerations

- Metadata generation happens at build time (ISR)
- Sitemap is cached and regenerated on-demand
- No client-side JavaScript required for SEO tags
- Minimal impact on page load performance

## Future Enhancements

Potential improvements for post-MVP:

1. **JSON-LD Structured Data**
   - Organization schema
   - Article schema for blog posts
   - BreadcrumbList schema

2. **Canonical URLs**
   - Prevent duplicate content issues
   - Handle URL variations

3. **Alternate Language Tags**
   - For multi-language support
   - hreflang implementation

4. **Advanced Sitemap**
   - Image sitemap
   - Video sitemap (if applicable)
   - News sitemap

5. **Schema.org Markup**
   - LocalBusiness schema
   - ContactPoint schema
   - Review/Rating schema

## Troubleshooting

### Metadata Not Updating

1. Clear Next.js cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Check ISR revalidation times
4. Verify Strapi API is returning updated data

### Sitemap Not Showing Content

1. Check Strapi API permissions
2. Verify content is published (not draft)
3. Check `publishedAt` dates are in the past
4. Review server logs for errors

### Images Not Showing in Social Shares

1. Verify image URLs are absolute (not relative)
2. Check image file size (< 8MB for Facebook)
3. Verify image dimensions (1200x630px recommended)
4. Clear social media cache (use debugger tools)

## Requirements Satisfied

This implementation satisfies the following requirements:

- **9.1**: CMS provides editable SEO fields for each page ✓
- **9.2**: Content Editors can set unique SEO fields per page ✓
- **9.3**: Website renders metadata in HTML head when defined ✓
- **9.4**: Website renders default metadata when not defined ✓

Additional features implemented:
- robots.txt generation
- sitemap.xml generation with dynamic content
- Comprehensive Open Graph support
- Twitter Card support
- Keyword optimization
- Structured metadata utilities
