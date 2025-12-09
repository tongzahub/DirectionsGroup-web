# Setup Instructions for New Content Types

## ✅ Content Types Created Successfully!

The Service and Industry content types have been created. Now follow these steps:

## Step 1: Start Strapi

```bash
cd bureau-wonders-cms
npm run develop
```

Wait for Strapi to start and open http://localhost:1337/admin

## Step 2: Configure Permissions

1. **Login to Strapi Admin**

2. **Go to Settings → Roles → Public**

3. **Enable permissions for Service:**
   - ✅ find
   - ✅ findOne

4. **Enable permissions for Industry:**
   - ✅ find
   - ✅ findOne

5. **Click Save**

## Step 3: Run the Seed Script

Open a new terminal and run:

```bash
cd bureau-wonders-cms
node seed-comprehensive.mjs
```

This will create:
- ✅ 3 Services (Communications & PR, Experiences & Events, CRM)
- ✅ 10 Industries (Jewelry, Watch, Fashion, etc.)
- ✅ 3 Blog Posts (Thought leadership articles)
- ✅ 2 Case Studies (Real success stories)
- ✅ 3 Job Listings (Open positions)

## Step 4: Publish Content

1. **Go to Content Manager in Strapi Admin**

2. **Publish all items:**
   - Services (3 items)
   - Industries (10 items)
   - Blog Posts (3 items)
   - Case Studies (2 items)
   - Job Listings (3 items)

   For each content type:
   - Click on each item
   - Click "Publish" button
   - Repeat for all items

## Step 5: Test the Frontend

```bash
cd bureau-wonders
npm run dev
```

Visit these pages:
- **Services**: http://localhost:3000/services
- **Service Detail**: http://localhost:3000/services/communications-pr
- **Blog with Filter**: http://localhost:3000/blog?category=News
- **Careers**: http://localhost:3000/careers

## Troubleshooting

### If seed script fails:
1. Make sure Strapi is running (`npm run develop`)
2. Check that permissions are set correctly
3. Verify the API token in `seed-comprehensive.mjs` matches your Strapi token

### To get a new API token:
1. Go to Settings → API Tokens
2. Create new token with full access
3. Copy the token
4. Update `TOKEN` variable in `seed-comprehensive.mjs`

### If content doesn't appear on frontend:
1. Make sure all content is **Published** in Strapi
2. Check that Public role has `find` and `findOne` permissions
3. Restart Next.js dev server

## What's New

### Services Page
- Grid of service cards with icons
- Click any service to see details
- Industries section at bottom
- Fully responsive

### Service Detail Pages
- Full service description
- Related services
- Breadcrumb navigation
- CTA section

### Blog Page
- Category filter tabs (All, News, Case Studies, Thought Leadership)
- URL-based filtering
- Active category highlighting

### All Pages
- Fetch data from Strapi CMS
- SEO optimized
- Error handling
- ISR with 300s revalidation

## Next Steps

1. ✅ Add images to services and blog posts in Strapi
2. ✅ Customize content to match your brand
3. ✅ Add more blog posts and case studies
4. ✅ Update job listings as needed
5. ✅ Review and optimize SEO metadata
