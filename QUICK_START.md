# Bureau of Wonders - Quick Start Guide

This guide will help you get both the frontend and CMS backend running.

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 12 or higher
- npm

## Quick Setup (5 minutes)

### 1. Set Up Database

```bash
# Create PostgreSQL database
createdb -U postgres bureau_wonders_cms

# Or using psql
psql -U postgres
CREATE DATABASE bureau_wonders_cms;
\q
```

### 2. Start CMS Backend

```bash
# Navigate to CMS directory
cd bureau-wonders-cms

# Install dependencies (first time only)
npm install

# Update .env with your PostgreSQL password if needed
# Edit: bureau-wonders-cms/.env

# Start Strapi in development mode
npm run develop
```

Wait for Strapi to start, then:
- Open http://localhost:1337/admin
- Create your admin account
- You're ready to configure content types!

### 3. Start Frontend (in a new terminal)

```bash
# Navigate to frontend directory
cd bureau-wonders

# Install dependencies (first time only)
npm install

# Start Next.js development server
npm run dev
```

Open http://localhost:3000 to view the frontend.

## Project Structure

```
.
├── bureau-wonders/          # Next.js frontend
│   ├── app/                # Pages (App Router)
│   ├── components/         # React components
│   ├── lib/               # Utilities and API client
│   └── types/             # TypeScript definitions
│
├── bureau-wonders-cms/     # Strapi CMS backend
│   ├── config/            # Configuration files
│   ├── src/               # API and content types
│   └── .env              # Environment variables
│
├── CMS_SETUP.md           # Detailed CMS setup guide
└── QUICK_START.md         # This file
```

## What's Been Completed

✅ **Task 1**: Next.js project initialized with Tailwind CSS
✅ **Task 2**: Strapi CMS backend configured with PostgreSQL

## Next Steps

Follow the implementation plan in `.kiro/specs/bureau-wonders-mvp/tasks.md`:

1. **Task 3**: Create Strapi content types
   - Page, Blog Post, Case Study, Job Listing, Contact Inquiry, Site Settings

2. **Task 4**: Configure permissions and email
   - Set up public API access
   - Configure contact form email notifications

3. **Task 5+**: Build frontend components and pages

## Useful Commands

### Frontend (bureau-wonders)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend (bureau-wonders-cms)
```bash
npm run develop      # Start with auto-reload
npm run build        # Build admin panel
npm run start        # Start production server
npm run strapi       # Show all Strapi commands
```

## Troubleshooting

### CMS won't start
- Check PostgreSQL is running: `pg_isready`
- Verify database exists: `psql -U postgres -l | grep bureau_wonders_cms`
- Check `.env` credentials match your PostgreSQL setup

### Port conflicts
- CMS uses port 1337 (change in `bureau-wonders-cms/.env`)
- Frontend uses port 3000 (change with `npm run dev -- -p 3001`)

### Database connection errors
- Update password in `bureau-wonders-cms/.env`
- Grant permissions: `psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE bureau_wonders_cms TO postgres;"`

## Documentation

- **CMS_SETUP.md** - Comprehensive CMS setup guide
- **bureau-wonders/README.md** - Frontend documentation
- **bureau-wonders-cms/README.md** - CMS documentation
- **bureau-wonders/SETUP.md** - Detailed setup summary

## Getting Help

- Check the troubleshooting sections in documentation
- Review Strapi docs: https://docs.strapi.io/
- Review Next.js docs: https://nextjs.org/docs

---

**Current Status**: Backend configured, ready for content type creation
**Next Task**: Task 3 - Create Strapi content types
