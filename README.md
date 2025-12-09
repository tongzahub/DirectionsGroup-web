# Bureau of Wonders - Full Stack Project

A modern marketing website for a luxury brand communications and PR agency, built with Next.js, TypeScript, and Strapi CMS.

## 🚀 Quick Start

### Windows Server Users

**Recommended**: Install PostgreSQL directly instead of using Docker.

📖 **See**: [WINDOWS_SERVER_SETUP.md](./WINDOWS_SERVER_SETUP.md) for complete guide.

Quick steps:
1. Install PostgreSQL 16 on Windows
2. Create database: `bureau_wonders_cms`
3. Configure `.env` files
4. Start applications

---

### Windows Desktop Users (Docker)

If you see "no matching manifest for windows/amd64" error:

**Option 1: Use the fix script** (Easiest)
```powershell
.\fix-docker-windows.bat
```

**Option 2: Manual fix**
1. Right-click Docker Desktop icon in system tray
2. Click "Switch to Linux containers..."
3. Wait for Docker to restart (30-60 seconds)
4. Continue with steps below

📖 **Detailed guides**:
- [DOCKER_ERROR_FIX.md](./DOCKER_ERROR_FIX.md) - Quick error fix
- [SWITCH_TO_LINUX_CONTAINERS.md](./SWITCH_TO_LINUX_CONTAINERS.md) - Visual guide
- [DOCKER_SETUP_WINDOWS.md](./DOCKER_SETUP_WINDOWS.md) - Complete Windows setup

---

### Local Development (All Platforms)

1. **Start PostgreSQL**:
   ```bash
   docker-compose up -d postgres
   ```

3. **Start Backend** (in one terminal):
   ```bash
   cd bureau-wonders-cms
   npm install
   npm run develop
   ```

4. **Start Frontend** (in another terminal):
   ```bash
   cd bureau-wonders
   npm install
   npm run dev
   ```

5. **Access applications**:
   - Frontend: http://localhost:3000
   - Strapi Admin: http://localhost:1337/admin

📖 **Full guide**: [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)

---

## 📦 Project Structure

```
bureau-wonders/
├── bureau-wonders/          # Next.js frontend
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
│
├── bureau-wonders-cms/     # Strapi CMS backend
│   ├── src/               # Strapi source
│   ├── config/            # Configuration
│   └── public/            # Static files
│
├── scripts/               # Utility scripts
├── .github/              # CI/CD workflows
└── docker-compose.yml    # Docker configuration
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Deployment**: Vercel

### Backend
- **CMS**: Strapi 5
- **Database**: PostgreSQL 16
- **Language**: TypeScript
- **Deployment**: Railway / Render

---

## 📚 Documentation

### Development
- [Local Development Setup](./LOCAL_DEVELOPMENT.md) - Docker + PostgreSQL setup
- [Docker Setup (Windows)](./DOCKER_SETUP_WINDOWS.md) - Windows-specific instructions
- [Frontend README](./bureau-wonders/README.md) - Next.js documentation
- [Backend README](./bureau-wonders-cms/README.md) - Strapi documentation

### Deployment
- [Quick Deploy Guide](./QUICK_DEPLOY.md) - 30-minute deployment
- [Frontend Deployment](./bureau-wonders/DEPLOYMENT.md) - Vercel setup
- [Backend Deployment](./bureau-wonders-cms/DEPLOYMENT.md) - Railway/Render setup
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Complete verification
- [Environment Variables](./ENVIRONMENT_VARIABLES.md) - Complete reference

### Configuration
- [CMS Setup](./CMS_SETUP.md) - Strapi configuration
- [Email Setup](./bureau-wonders-cms/EMAIL_SETUP.md) - SMTP configuration
- [Permissions Setup](./bureau-wonders-cms/PERMISSIONS_SETUP.md) - API permissions
- [SEO Implementation](./bureau-wonders/SEO_IMPLEMENTATION.md) - SEO guide
- [Animations](./bureau-wonders/ANIMATIONS.md) - Animation guide

---

## 🎯 Features

### Content Management
- ✅ Headless CMS with Strapi
- ✅ PostgreSQL database
- ✅ Rich text editor
- ✅ Media library
- ✅ Content scheduling
- ✅ Multi-language ready

### Frontend
- ✅ Server-side rendering (SSR)
- ✅ Incremental Static Regeneration (ISR)
- ✅ Image optimization
- ✅ SEO optimization
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Contact form with validation

### Pages
- Homepage
- About
- Services
- Blog / Insights
- Case Studies
- Careers
- Contact

---

## 🔧 Development Commands

### Database (Docker)
```bash
# Start PostgreSQL
docker-compose up -d postgres

# Stop PostgreSQL
docker-compose down

# View logs
docker-compose logs -f postgres

# Access database CLI
docker-compose exec postgres psql -U postgres -d bureau_wonders_cms
```

### Backend (Strapi)
```bash
cd bureau-wonders-cms

# Development mode (auto-reload)
npm run develop

# Production build
npm run build
npm run start

# Strapi commands
npm run strapi -- help
```

### Frontend (Next.js)
```bash
cd bureau-wonders

# Development mode
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

---

## 🌐 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (.env)
```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=bureau_wonders_cms
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
```

📖 **Complete reference**: [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)

---

## 🚢 Deployment

### Quick Deploy (30 minutes)

1. **Deploy Backend to Railway**:
   - Create Railway project
   - Add PostgreSQL
   - Set environment variables
   - Deploy Strapi

2. **Deploy Frontend to Vercel**:
   - Import GitHub repository
   - Set environment variables
   - Deploy Next.js

📖 **Full guide**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

### Deployment Platforms

| Service | Platform | Free Tier |
|---------|----------|-----------|
| Frontend | Vercel | ✅ Yes |
| Backend | Railway | $5 credit/month |
| Backend | Render | ✅ Yes (limited) |
| Database | Railway/Render | Included |

---

## 🔐 Security

- Environment variables encrypted
- API tokens with read-only access
- CORS configured
- Security headers enabled
- Database SSL support
- Regular dependency updates

---

## 📊 Performance

- Lighthouse score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Incremental Static Regeneration
- Image optimization
- Code splitting

---

## 🧪 Testing

### CI/CD
- GitHub Actions workflows
- Automated build checks
- Linting on PRs
- PostgreSQL integration tests

### Manual Testing
- Cross-browser testing
- Mobile responsiveness
- Performance audits
- Accessibility checks

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Make changes
3. Test locally
4. Create pull request
5. Automated checks run
6. Review and merge

### Code Style

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

---

## 📝 License

Private - The Bureau of Wonders

---

## 🆘 Support

### Documentation
- [Local Development](./LOCAL_DEVELOPMENT.md)
- [Deployment Guide](./QUICK_DEPLOY.md)
- [Troubleshooting](./LOCAL_DEVELOPMENT.md#troubleshooting)

### Platform Support
- **Vercel**: https://vercel.com/support
- **Railway**: https://railway.app/help
- **Strapi**: https://discord.strapi.io
- **Next.js**: https://nextjs.org/docs

---

## 🎨 Design System

### Colors
- Primary Blue: `#4DA3FF`
- Darker Blue: `#1877F2`
- Pure White: `#FFFFFF`
- Dark Gray: `#1A1A1A`

### Typography
- Font: Inter
- Base unit: 4px
- Border radius: 12-20px

---

## 📈 Roadmap

### Phase 1: MVP ✅
- [x] Project setup
- [x] Core pages
- [x] CMS integration
- [x] Deployment configuration

### Phase 2: Enhancement
- [ ] Advanced animations
- [ ] Search functionality
- [ ] Newsletter integration
- [ ] Analytics dashboard

### Phase 3: Optimization
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] A/B testing
- [ ] CDN for media

---

## 🔗 Quick Links

- [Frontend](./bureau-wonders/)
- [Backend](./bureau-wonders-cms/)
- [Local Setup](./LOCAL_DEVELOPMENT.md)
- [Deploy Guide](./QUICK_DEPLOY.md)
- [Environment Vars](./ENVIRONMENT_VARIABLES.md)

---

**Built with ❤️ for The Bureau of Wonders**
