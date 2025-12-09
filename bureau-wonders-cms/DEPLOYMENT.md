# Deployment Guide - Bureau of Wonders CMS (Strapi)

This guide covers deploying the Strapi backend to Railway or Render with PostgreSQL.

## Prerequisites

- GitHub/GitLab/Bitbucket repository with your code
- Railway or Render account
- PostgreSQL database (provided by Railway/Render)

---

## Option 1: Railway Deployment (Recommended)

Railway offers simple deployment with built-in PostgreSQL.

### 1. Initial Setup

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `bureau-wonders-cms` directory as the root

### 2. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a database and provide connection details

### 3. Configure Environment Variables

Railway auto-generates `DATABASE_URL`. Add these additional variables:

```bash
# Server Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Database (Railway provides DATABASE_URL automatically)
DATABASE_CLIENT=postgres
DATABASE_SSL=false

# Secrets (Generate new secure values!)
APP_KEYS=generate-random-string-here
API_TOKEN_SALT=generate-random-string-here
ADMIN_JWT_SECRET=generate-random-string-here
TRANSFER_TOKEN_SALT=generate-random-string-here
JWT_SECRET=generate-random-string-here
ENCRYPTION_KEY=generate-random-string-here

# Email Configuration (SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_SECURE=false
SMTP_DEFAULT_FROM=noreply@bureauofwonders.com
SMTP_DEFAULT_REPLY_TO=info@bureauofwonders.com

# Contact Form
CONTACT_FORM_RECIPIENT=contact@bureauofwonders.com

# Frontend URL (for CORS)
FRONTEND_URL=https://your-site.vercel.app
```

#### Generate Secure Secrets

Use this command to generate random strings:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Run it 6 times to generate all required secrets.

### 4. Configure Build Settings

Railway should auto-detect Node.js. Verify:

- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Root Directory**: `bureau-wonders-cms` (if monorepo)

### 5. Deploy

1. Click "Deploy"
2. Wait for build to complete (3-5 minutes)
3. Railway will provide a public URL (e.g., `https://your-app.railway.app`)

### 6. Initial Admin Setup

1. Visit `https://your-app.railway.app/admin`
2. Create your admin account
3. Complete the setup wizard

### 7. Configure CORS

1. Log into Strapi admin
2. Go to Settings → Global Settings → CORS
3. Add your Vercel frontend URL to allowed origins

---

## Option 2: Render Deployment

Render is another excellent option with free PostgreSQL tier.

### 1. Initial Setup

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Select the `bureau-wonders-cms` directory

### 2. Configure Web Service

- **Name**: bureau-wonders-cms
- **Environment**: Node
- **Region**: Choose closest to your users
- **Branch**: main
- **Root Directory**: `bureau-wonders-cms` (if monorepo)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

### 3. Add PostgreSQL Database

1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Name: bureau-wonders-db
4. Copy the "Internal Database URL"

### 4. Environment Variables

Add these in Render web service settings:

```bash
# Server
HOST=0.0.0.0
PORT=10000
NODE_ENV=production

# Database (use Internal Database URL from Render PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database
DATABASE_CLIENT=postgres
DATABASE_SSL=false

# Secrets (Generate new secure values!)
APP_KEYS=generate-random-string-here
API_TOKEN_SALT=generate-random-string-here
ADMIN_JWT_SECRET=generate-random-string-here
TRANSFER_TOKEN_SALT=generate-random-string-here
JWT_SECRET=generate-random-string-here
ENCRYPTION_KEY=generate-random-string-here

# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_SECURE=false
SMTP_DEFAULT_FROM=noreply@bureauofwonders.com
SMTP_DEFAULT_REPLY_TO=info@bureauofwonders.com

# Contact Form
CONTACT_FORM_RECIPIENT=contact@bureauofwonders.com

# Frontend URL (for CORS)
FRONTEND_URL=https://your-site.vercel.app
```

### 5. Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes first time)
3. Access your Strapi at the provided URL

---

## Post-Deployment Configuration

### 1. Create API Token for Frontend

1. Log into Strapi admin panel
2. Go to Settings → API Tokens → Create new API Token
3. Name: "Vercel Frontend"
4. Token type: "Read-only"
5. Token duration: "Unlimited"
6. Copy the token
7. Add it to Vercel as `STRAPI_API_TOKEN`

### 2. Configure Public Permissions

1. Go to Settings → Users & Permissions Plugin → Roles → Public
2. Enable these permissions:
   - **Page**: find, findOne
   - **Blog-post**: find, findOne
   - **Case-study**: find, findOne
   - **Job-listing**: find, findOne
   - **Site-settings**: find
   - **Contact-inquiry**: create

### 3. Upload Media

1. Go to Media Library
2. Upload initial images and assets
3. Verify images are accessible via public URLs

### 4. Create Initial Content

1. Create Site Settings (single type)
2. Add homepage content
3. Create sample blog posts
4. Add case studies
5. Publish all content

---

## Email Configuration

### Using SendGrid (Recommended)

1. Sign up at https://sendgrid.com
2. Create an API key
3. Add to environment variables:
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USERNAME=apikey
   SMTP_PASSWORD=your-sendgrid-api-key
   ```

### Using Gmail (Development Only)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_SECURE=false
```

**Note**: Enable "Less secure app access" or use App Password

### Test Email Configuration

1. Submit a test contact form on your frontend
2. Check if email is received
3. Check Strapi logs for email errors

---

## Database Backups

### Railway

1. Go to PostgreSQL service
2. Click "Backups" tab
3. Enable automatic backups
4. Download manual backup: `pg_dump` command provided

### Render

1. Go to PostgreSQL database
2. Click "Backups"
3. Render provides automatic daily backups
4. Manual backup: Use provided connection string with `pg_dump`

---

## Automatic Deployments

Both Railway and Render support automatic deployments:

- **Production**: Pushes to `main` branch trigger deployment
- **Preview**: Create separate services for staging branches

---

## Monitoring & Logs

### Railway

- View logs in real-time from Railway dashboard
- Set up log drains for external monitoring
- Monitor resource usage (CPU, memory, network)

### Render

- Access logs from Render dashboard
- Set up log streams to external services
- Monitor metrics and performance

---

## Troubleshooting

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check database is running
3. Ensure SSL settings match database requirements
4. Check firewall/network settings

### Build Failures

1. Check build logs for specific errors
2. Verify Node.js version compatibility (20.x)
3. Ensure all dependencies are in `package.json`
4. Check for TypeScript errors

### Admin Panel Not Accessible

1. Verify service is running
2. Check `/admin` route is accessible
3. Clear browser cache
4. Check for CORS issues

### Email Not Sending

1. Verify SMTP credentials
2. Check email provider logs
3. Test with a simple SMTP client
4. Ensure port 587 is not blocked

### Media Upload Issues

1. Check file size limits
2. Verify storage configuration
3. Check file permissions
4. Ensure sufficient disk space

---

## Security Best Practices

### 1. Secrets Management

- Never commit `.env` files to Git
- Use platform environment variables
- Rotate secrets regularly
- Use strong, random values for all secrets

### 2. Database Security

- Use strong database passwords
- Enable SSL for database connections in production
- Restrict database access to application only
- Regular backups

### 3. API Security

- Use read-only tokens for frontend
- Implement rate limiting
- Enable CORS only for your domains
- Regular security updates

### 4. Admin Panel

- Use strong admin passwords
- Enable 2FA if available
- Restrict admin access by IP (optional)
- Regular security audits

---

## Performance Optimization

### 1. Database Optimization

- Add indexes for frequently queried fields
- Use database connection pooling
- Monitor slow queries
- Regular VACUUM operations (PostgreSQL)

### 2. Caching

- Enable Strapi's built-in caching
- Use Redis for session storage (optional)
- Configure CDN for media files

### 3. Media Optimization

- Use image optimization plugins
- Configure CDN for media delivery
- Set appropriate cache headers
- Compress images before upload

---

## Scaling

### Railway

- Upgrade to Pro plan for more resources
- Add replicas for high availability
- Use Railway's built-in load balancing

### Render

- Upgrade instance type for more CPU/memory
- Add multiple instances for load balancing
- Use Render's auto-scaling features

---

## Custom Domain (Optional)

### Railway

1. Go to service settings
2. Click "Networking" → "Custom Domain"
3. Add your domain (e.g., `api.bureauofwonders.com`)
4. Configure DNS CNAME record

### Render

1. Go to service settings
2. Click "Custom Domain"
3. Add your domain
4. Configure DNS as instructed

---

## Support Resources

- **Railway**: https://docs.railway.app
- **Render**: https://render.com/docs
- **Strapi**: https://docs.strapi.io
- **PostgreSQL**: https://www.postgresql.org/docs
