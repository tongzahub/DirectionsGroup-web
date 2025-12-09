# Quick Deploy Guide

Get Bureau of Wonders deployed in under 30 minutes.

## Prerequisites

- GitHub account with this repository
- Vercel account (free): https://vercel.com
- Railway account (free): https://railway.app OR Render account (free): https://render.com

---

## Step 1: Deploy Backend (Strapi) - 10 minutes

### Using Railway (Recommended)

1. **Create Railway Project**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose `bureau-wonders-cms` as root directory

2. **Add PostgreSQL Database**
   - In Railway project, click "New" → "Database" → "PostgreSQL"
   - Railway auto-generates `DATABASE_URL`

3. **Generate Secrets**
   ```bash
   node scripts/generate-secrets.js
   ```

4. **Add Environment Variables**
   
   Copy the generated secrets and add these in Railway:
   ```bash
   NODE_ENV=production
   HOST=0.0.0.0
   PORT=1337
   DATABASE_CLIENT=postgres
   DATABASE_SSL=false
   
   # Paste generated secrets here
   APP_KEYS=...
   API_TOKEN_SALT=...
   ADMIN_JWT_SECRET=...
   TRANSFER_TOKEN_SALT=...
   JWT_SECRET=...
   ENCRYPTION_KEY=...
   ```

5. **Deploy**
   - Railway automatically deploys
   - Wait 3-5 minutes for build
   - Copy your Railway URL (e.g., `https://your-app.railway.app`)

6. **Create Admin Account**
   - Visit `https://your-app.railway.app/admin`
   - Create your admin account
   - Complete setup wizard

7. **Create API Token**
   - In Strapi admin: Settings → API Tokens → Create new
   - Name: "Vercel Frontend"
   - Type: "Read-only"
   - Duration: "Unlimited"
   - **Copy the token** (you'll need it for Vercel)

8. **Set Permissions**
   - Settings → Users & Permissions → Roles → Public
   - Enable:
     - Page: find, findOne
     - Blog-post: find, findOne
     - Case-study: find, findOne
     - Job-listing: find, findOne
     - Site-settings: find
     - Contact-inquiry: create

---

## Step 2: Deploy Frontend (Next.js) - 5 minutes

### Using Vercel

1. **Create Vercel Project**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Select `bureau-wonders` as root directory

2. **Add Environment Variables**
   ```bash
   NEXT_PUBLIC_STRAPI_URL=https://your-app.railway.app
   STRAPI_API_TOKEN=your-token-from-step-1.7
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live!

---

## Step 3: Add Content - 10 minutes

1. **Log into Strapi Admin**
   - Visit your Railway URL + `/admin`

2. **Create Site Settings**
   - Content Manager → Site Settings (Single Type)
   - Fill in:
     - Site name
     - Contact email, phone, address
     - Social links
     - Homepage intro text
     - Culture statement
     - Values
   - Click "Publish"

3. **Create Sample Content**
   - Create a blog post
   - Create a case study
   - Add a job listing (optional)
   - Publish all content

4. **Test Your Site**
   - Visit your Vercel URL
   - Content should appear within 60 seconds

---

## Step 4: Configure Email (Optional) - 5 minutes

### Using SendGrid (Free tier available)

1. **Sign up at SendGrid**
   - https://sendgrid.com
   - Create API key

2. **Add to Railway Environment Variables**
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USERNAME=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   SMTP_DEFAULT_FROM=noreply@bureauofwonders.com
   SMTP_DEFAULT_REPLY_TO=info@bureauofwonders.com
   CONTACT_FORM_RECIPIENT=contact@bureauofwonders.com
   ```

3. **Restart Strapi**
   - Railway will auto-restart after env var changes

4. **Test Contact Form**
   - Submit a test message on your site
   - Check your email

---

## Troubleshooting

### Backend Issues

**Build fails:**
- Check Railway logs for errors
- Verify all environment variables are set
- Ensure Node.js version is 20.x

**Can't access admin:**
- Verify service is running in Railway
- Check URL is correct (include `/admin`)
- Clear browser cache

**Database connection error:**
- Verify PostgreSQL service is running
- Check `DATABASE_URL` is set correctly

### Frontend Issues

**Build fails:**
- Check Vercel logs
- Verify environment variables are set
- Check for TypeScript errors

**Content not showing:**
- Verify `NEXT_PUBLIC_STRAPI_URL` is correct
- Check Strapi API token is valid
- Verify content is published in Strapi
- Wait 60 seconds for ISR revalidation

**Images not loading:**
- Check Strapi media library
- Verify images are uploaded
- Check CORS settings in Strapi

---

## Next Steps

- [ ] Add custom domain (optional)
- [ ] Configure email notifications
- [ ] Add more content
- [ ] Invite team members to Strapi
- [ ] Set up monitoring
- [ ] Review security settings

---

## Support

- **Full Documentation**: See `DEPLOYMENT.md` files
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Strapi Docs**: https://docs.strapi.io

---

## Costs

**Free Tier Limits:**
- **Railway**: $5 free credit/month (enough for small sites)
- **Render**: Free tier available (with limitations)
- **Vercel**: Generous free tier for personal projects
- **SendGrid**: 100 emails/day free

**Estimated Monthly Cost (Paid Tiers):**
- Railway Starter: ~$5-10/month
- Render Starter: ~$7/month
- Vercel Pro: $20/month (optional)
- SendGrid Essentials: $15/month (optional)

Total: ~$12-20/month for production-ready hosting
