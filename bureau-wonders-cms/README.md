# Bureau of Wonders CMS

This is the Strapi CMS backend for the Bureau of Wonders website.

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 12 or higher
- npm or yarn

## Database Setup

1. Install PostgreSQL if not already installed
2. Create a new database:
   ```bash
   createdb bureau_wonders_cms
   ```
   
   Or using psql:
   ```sql
   CREATE DATABASE bureau_wonders_cms;
   ```

3. Update the `.env` file with your database credentials

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env` if not already present
   - Update database credentials in `.env`
   - Generate new secrets for production environments

## Running the Application

### Development Mode
Start Strapi in watch mode (auto-restart on file changes):
```bash
npm run develop
```

The admin panel will be available at: http://localhost:1337/admin

### Production Mode
Build and start Strapi:
```bash
npm run build
npm run start
```

## First Time Setup

1. Start the development server: `npm run develop`
2. Navigate to http://localhost:1337/admin
3. Create your admin user account
4. Configure content types and permissions

## Environment Variables

Key environment variables (see `.env.example` for full list):

- `DATABASE_CLIENT`: Database type (postgres)
- `DATABASE_HOST`: Database host (default: localhost)
- `DATABASE_PORT`: Database port (default: 5432)
- `DATABASE_NAME`: Database name
- `DATABASE_USERNAME`: Database user
- `DATABASE_PASSWORD`: Database password
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 1337)

## Available Commands

- `npm run develop` - Start in development mode with auto-reload
- `npm run start` - Start in production mode
- `npm run build` - Build the admin panel
- `npm run strapi` - Display all available Strapi commands

## Content Types

The following content types will be configured:
- Pages (with SEO fields)
- Blog Posts
- Case Studies
- Job Listings
- Contact Inquiries
- Site Settings (single type)

## API Documentation

Once running, API documentation is available at:
- http://localhost:1337/documentation (if documentation plugin is enabled)

## Deployment

### Quick Deploy (15 minutes)

See [QUICK_DEPLOY.md](../QUICK_DEPLOY.md) for a fast deployment guide.

### Full Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- Railway deployment (recommended)
- Render deployment
- PostgreSQL setup
- Environment variables
- Email configuration
- Security best practices
- Troubleshooting

### Generate Production Secrets

Run this command to generate secure secrets for production:
```bash
node ../scripts/generate-secrets.js
```

### Deployment Checklist

Use [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md) to ensure all steps are completed.

## Recommended Platforms

- **Railway** (recommended) - Simple deployment with built-in PostgreSQL
- **Render** - Free tier available with PostgreSQL
- **Heroku** - Classic PaaS with PostgreSQL add-on
- **DigitalOcean App Platform** - Managed platform with database

## Post-Deployment Configuration

After deploying:

1. **Create Admin Account**
   - Visit `/admin` on your deployed URL
   - Create your admin user

2. **Generate API Token**
   - Settings → API Tokens → Create new
   - Type: "Read-only"
   - Copy token for frontend deployment

3. **Configure Permissions**
   - Settings → Users & Permissions → Roles → Public
   - Enable appropriate permissions for public access

4. **Set up Email**
   - Configure SMTP settings in environment variables
   - Test contact form functionality

5. **Add Content**
   - Create Site Settings
   - Add initial pages, blog posts, case studies
   - Publish all content

## Security Notes

- Always use strong, unique secrets in production
- Never commit `.env` file to version control
- Enable SSL for database connections in production
- Configure CORS to only allow your frontend domain
- Set up rate limiting for API endpoints
- Use read-only API tokens for frontend
- Regular security updates and backups
