# Deployment Checklist - Bureau of Wonders

Complete this checklist to ensure a successful deployment of both frontend and backend.

## Pre-Deployment

### Code Preparation

- [ ] All code committed to Git repository
- [ ] `.env` files are in `.gitignore`
- [ ] No sensitive data in code
- [ ] All dependencies in `package.json`
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors

### Content Preparation

- [ ] Sample content created in local Strapi
- [ ] Images optimized and ready for upload
- [ ] Content structure tested locally

---

## Backend Deployment (Strapi CMS)

### 1. Choose Platform

- [ ] Railway (recommended) OR
- [ ] Render

### 2. Database Setup

- [ ] PostgreSQL database created
- [ ] Database connection string obtained
- [ ] Database accessible from backend service

### 3. Environment Variables

Generate secrets using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Required variables:
- [ ] `DATABASE_URL` or `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- [ ] `DATABASE_CLIENT=postgres`
- [ ] `DATABASE_SSL=false` (or `true` if required)
- [ ] `APP_KEYS` (generated)
- [ ] `API_TOKEN_SALT` (generated)
- [ ] `ADMIN_JWT_SECRET` (generated)
- [ ] `TRANSFER_TOKEN_SALT` (generated)
- [ ] `JWT_SECRET` (generated)
- [ ] `ENCRYPTION_KEY` (generated)
- [ ] `NODE_ENV=production`
- [ ] `HOST=0.0.0.0`
- [ ] `PORT=1337` (Railway) or `10000` (Render)

Email configuration:
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USERNAME`
- [ ] `SMTP_PASSWORD`
- [ ] `SMTP_DEFAULT_FROM`
- [ ] `SMTP_DEFAULT_REPLY_TO`
- [ ] `CONTACT_FORM_RECIPIENT`

Optional:
- [ ] `FRONTEND_URL` (for CORS)

### 4. Deploy Backend

- [ ] Service deployed successfully
- [ ] Build completed without errors
- [ ] Service is running
- [ ] Health check passing
- [ ] Backend URL obtained (e.g., `https://your-app.railway.app`)

### 5. Initial Backend Configuration

- [ ] Admin panel accessible at `/admin`
- [ ] Admin account created
- [ ] Setup wizard completed

### 6. Create API Token

- [ ] Navigate to Settings → API Tokens
- [ ] Create new token named "Vercel Frontend"
- [ ] Token type: "Read-only"
- [ ] Token duration: "Unlimited"
- [ ] Token copied and saved securely

### 7. Configure Permissions

Settings → Users & Permissions Plugin → Roles → Public:

- [ ] **Page**: find, findOne enabled
- [ ] **Blog-post**: find, findOne enabled
- [ ] **Case-study**: find, findOne enabled
- [ ] **Job-listing**: find, findOne enabled
- [ ] **Site-settings**: find enabled
- [ ] **Contact-inquiry**: create enabled

### 8. Upload Content

- [ ] Site Settings created and published
- [ ] Homepage content added
- [ ] About page content added
- [ ] Services page content added
- [ ] Sample blog posts created
- [ ] Sample case studies created
- [ ] Job listings added (if any)
- [ ] All content published

### 9. Test Backend

- [ ] API endpoints accessible
- [ ] Content returns correctly
- [ ] Images load properly
- [ ] Contact form submission works
- [ ] Email notifications received

---

## Frontend Deployment (Next.js on Vercel)

### 1. Vercel Setup

- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Project created

### 2. Configure Build Settings

- [ ] Framework: Next.js (auto-detected)
- [ ] Root directory: `bureau-wonders` (if monorepo)
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Node version: 20.x

### 3. Environment Variables

- [ ] `NEXT_PUBLIC_STRAPI_URL` = Your Strapi backend URL
- [ ] `STRAPI_API_TOKEN` = Token from Strapi admin
- [ ] `NEXT_PUBLIC_SITE_URL` = Your Vercel URL (or custom domain)

### 4. Deploy Frontend

- [ ] Initial deployment triggered
- [ ] Build completed successfully
- [ ] No build errors
- [ ] Site accessible at Vercel URL

### 5. Test Frontend

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] All pages accessible:
  - [ ] Homepage (/)
  - [ ] About (/about)
  - [ ] Services (/services)
  - [ ] Blog listing (/blog)
  - [ ] Blog post detail (/blog/[slug])
  - [ ] Case studies listing (/case-studies)
  - [ ] Case study detail (/case-studies/[slug])
  - [ ] Careers (/careers)
  - [ ] Contact (/contact)
- [ ] Content from Strapi displays correctly
- [ ] Images load properly
- [ ] Contact form works
- [ ] Mobile responsive design works
- [ ] Animations work smoothly

### 6. SEO Verification

- [ ] Meta tags present in page source
- [ ] Open Graph tags present
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Favicon loads

---

## CORS Configuration

### Update Strapi CORS Settings

- [ ] Log into Strapi admin
- [ ] Go to Settings → Global Settings → CORS (or middleware config)
- [ ] Add Vercel frontend URL to allowed origins
- [ ] Save and restart if needed

---

## Custom Domain (Optional)

### Backend Domain

- [ ] Custom domain configured (e.g., `api.bureauofwonders.com`)
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] Update `NEXT_PUBLIC_STRAPI_URL` in Vercel

### Frontend Domain

- [ ] Custom domain added in Vercel
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Update `NEXT_PUBLIC_SITE_URL` in Vercel
- [ ] Update CORS in Strapi with new domain

---

## Post-Deployment

### Performance Testing

- [ ] Run Lighthouse audit
  - [ ] Performance score >90
  - [ ] Accessibility score >95
  - [ ] Best Practices score >90
  - [ ] SEO score >90
- [ ] Test page load times
- [ ] Test on mobile devices
- [ ] Test on different browsers

### Functionality Testing

- [ ] All pages load correctly
- [ ] Navigation works on all devices
- [ ] Contact form submits successfully
- [ ] Email notifications received
- [ ] Content updates in Strapi reflect on frontend (within revalidation time)
- [ ] Images display correctly
- [ ] Animations work smoothly
- [ ] No console errors

### Security

- [ ] HTTPS enabled on both frontend and backend
- [ ] Security headers present
- [ ] API tokens secured
- [ ] Admin panel secured with strong password
- [ ] Database credentials secured

### Monitoring Setup

- [ ] Vercel Analytics enabled (optional)
- [ ] Error tracking configured (optional)
- [ ] Uptime monitoring configured (optional)

### Documentation

- [ ] Deployment URLs documented
- [ ] Admin credentials stored securely
- [ ] API tokens stored securely
- [ ] Team members have access

---

## Automatic Deployments

### Configure Git Workflow

- [ ] Main branch deploys to production
- [ ] Pull requests create preview deployments
- [ ] Team understands deployment workflow

---

## Backup Strategy

### Database Backups

- [ ] Automatic backups enabled on Railway/Render
- [ ] Backup schedule configured
- [ ] Backup restoration tested

### Content Backups

- [ ] Regular exports of Strapi content
- [ ] Media files backed up
- [ ] Backup storage location documented

---

## Rollback Plan

### Frontend Rollback

- [ ] Know how to rollback in Vercel (Deployments → Promote to Production)
- [ ] Previous working deployment identified

### Backend Rollback

- [ ] Know how to rollback in Railway/Render
- [ ] Database backup available for restoration

---

## Support & Maintenance

### Documentation

- [ ] Deployment documentation accessible to team
- [ ] Environment variables documented
- [ ] Common issues and solutions documented

### Monitoring

- [ ] Set up alerts for downtime
- [ ] Monitor error rates
- [ ] Track performance metrics

### Updates

- [ ] Plan for regular dependency updates
- [ ] Security patch process defined
- [ ] Content update workflow established

---

## Launch Checklist

### Final Verification

- [ ] All functionality tested end-to-end
- [ ] Performance meets requirements
- [ ] Security measures in place
- [ ] Team trained on CMS
- [ ] Support plan in place

### Go Live

- [ ] DNS updated (if using custom domain)
- [ ] SSL certificates active
- [ ] Monitoring active
- [ ] Team notified
- [ ] Stakeholders informed

---

## Post-Launch

### Week 1

- [ ] Monitor error logs daily
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Address any critical issues

### Month 1

- [ ] Review analytics
- [ ] Optimize based on real usage
- [ ] Plan improvements
- [ ] Update documentation

---

## Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Railway Support**: https://railway.app/help
- **Render Support**: https://render.com/support
- **Strapi Community**: https://discord.strapi.io

---

## Notes

Use this space to document deployment-specific information:

- Deployment date: _______________
- Backend URL: _______________
- Frontend URL: _______________
- Custom domains: _______________
- Team members with access: _______________
- Special configurations: _______________
