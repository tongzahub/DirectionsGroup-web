# Quick Start Guide

## 🚀 Get Everything Running in 5 Minutes

### Step 1: Build & Start Strapi (Terminal 1)
```bash
cd bureau-wonders-cms
npm run build
npm run develop
```
Wait for: `Server started on http://localhost:1337`

### Step 2: Configure Permissions
1. Open: http://localhost:1337/admin
2. Login with your credentials
3. Go to: **Settings → Roles → Public**
4. Enable for **Service**: `find` ✅ and `findOne` ✅
5. Enable for **Industry**: `find` ✅ and `findOne` ✅
6. Click **Save**

### Step 3: Seed Data (Terminal 2)
```bash
cd bureau-wonders-cms
node seed-comprehensive.mjs
```
You should see: ✅ Created service, ✅ Created industry, etc.

### Step 4: Publish Content
In Strapi Admin (http://localhost:1337/admin):
1. Go to **Content Manager**
2. For each content type (Services, Industries, Blog Posts, Case Studies, Job Listings):
   - Click each item
   - Click **Publish** button
   - Repeat for all items

### Step 5: Start Next.js (Terminal 3)
```bash
cd bureau-wonders
npm run dev
```

### Step 6: View Your Pages! 🎉
- **Services**: http://localhost:3000/services
- **Service Detail**: http://localhost:3000/services/communications-pr
- **Blog**: http://localhost:3000/blog
- **Blog Filtered**: http://localhost:3000/blog?category=News
- **Careers**: http://localhost:3000/careers

## ✅ What You Get

### Services Page
- 3 service cards (Communications & PR, Experiences & Events, CRM)
- 10 industry cards with icons
- Click any service to see details

### Service Detail Pages
- Full description of each service
- Related services section
- Contact CTA

### Blog Page
- 3 blog posts
- Category filter tabs
- Filter by: All, News, Case Studies, Thought Leadership

### Careers Page
- Culture statement
- Company values
- 3 job listings

## 📝 Content Created

- ✅ 3 Services
- ✅ 10 Industries
- ✅ 3 Blog Posts
- ✅ 2 Case Studies
- ✅ 3 Job Listings

## 🔧 Troubleshooting

**Seed script shows errors?**
- Make sure Strapi is running
- Check permissions are set correctly
- Verify API token in seed script

**Content not showing on frontend?**
- Make sure content is Published in Strapi
- Check Public role permissions
- Restart Next.js dev server

**Need new API token?**
1. Settings → API Tokens in Strapi
2. Create new token (Full Access)
3. Copy token
4. Update `TOKEN` in `seed-comprehensive.mjs`

## 📚 Documentation

- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `PAGES_UPDATE_SUMMARY.md` - Technical changes summary
- `สรุปการอัพเดท.md` - Thai language summary
- `GENERATE_CONTENT_TYPES.md` - Content type generation guide

## 🎯 Next Steps

1. Add images to content in Strapi
2. Customize content to match your brand
3. Add more blog posts and case studies
4. Update job listings
5. Optimize SEO metadata

---

**Need help?** Check the detailed documentation files above!
