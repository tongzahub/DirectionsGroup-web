# Bureau of Wonders - Mac Setup Guide

Complete guide for setting up and running the Bureau of Wonders project on macOS.

## Prerequisites

Install these tools if you don't have them:

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (v18 or higher)
brew install node

# Install Docker Desktop for Mac
brew install --cask docker

# Verify installations
node --version    # Should be v18+
npm --version
docker --version
```

## Project Structure

```
DirectionsGroup-web/
├── bureau-wonders/          # Next.js Frontend (Port 3000)
├── bureau-wonders-cms/      # Strapi CMS Backend (Port 1337)
└── docker-compose.yml       # PostgreSQL Database (Port 5432)
```

---

## 🚀 Quick Start (First Time Setup)

### Step 1: Start Docker & Database

```bash
# Make sure Docker Desktop is running
open -a Docker

# Wait for Docker to start, then run:
docker-compose up -d postgres

# Verify database is running
docker ps
# You should see: bureau-wonders-db (healthy)
```

**Database Access:**
- Host: `localhost`
- Port: `5432`
- Database: `bureau_wonders_cms`
- Username: `postgres`
- Password: `postgres`

### Step 2: Setup Backend (Strapi CMS)

```bash
# Navigate to CMS directory
cd bureau-wonders-cms

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env if needed (default values work for local development)
nano .env

# Start Strapi in development mode
npm run develop
```

**First Time Setup:**
1. Wait for Strapi to start (takes 30-60 seconds)
2. Open http://localhost:1337/admin
3. Create your admin account:
   - First Name: Your name
   - Last Name: Your last name
   - Email: your@email.com
   - Password: (choose a strong password)
4. Click "Let's start"

**Backend is now running at:** http://localhost:1337

### Step 3: Setup Frontend (Next.js)

Open a **new terminal window/tab** and run:

```bash
# Navigate to frontend directory
cd bureau-wonders

# Install dependencies
npm install

# Create .env.local file (if not exists)
cp .env.local.example .env.local 2>/dev/null || cat > .env.local << 'EOF'
# Strapi CMS Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF

# Start Next.js development server
npm run dev
```

**Frontend is now running at:** http://localhost:3000

---

## 📊 Seeding Data (Optional)

### Method 1: Manual Data Entry via Strapi Admin

1. Go to http://localhost:1337/admin
2. Navigate to Content Manager
3. Create content for:
   - **Pages** (Homepage, About, Services, etc.)
   - **Blog Posts**
   - **Case Studies**
   - **Job Listings**
   - **Site Settings**

### Method 2: Import Sample Data (If Available)

```bash
# If you have a data export file
cd bureau-wonders-cms

# Import data
npm run strapi import -- -f ./data/export.tar.gz
```

### Method 3: Create Seed Script

Create a seed script in `bureau-wonders-cms/scripts/seed.js`:

```bash
cd bureau-wonders-cms
mkdir -p scripts

# Create seed script
cat > scripts/seed.js << 'EOF'
// Sample seed data script
const axios = require('axios');

const API_URL = 'http://localhost:1337/api';

async function seedData() {
  console.log('🌱 Seeding data...');
  
  // Add your seed data here
  // Example:
  // await axios.post(`${API_URL}/blog-posts`, {
  //   data: { title: 'Sample Post', content: 'Content here' }
  // });
  
  console.log('✅ Seeding complete!');
}

seedData().catch(console.error);
EOF

# Run seed script
node scripts/seed.js
```

---

## 🔄 Daily Development Workflow

### Starting Everything

**Option 1: Using the startup script**
```bash
# Make script executable (first time only)
chmod +x start-dev.sh

# Run startup script
./start-dev.sh

# Then manually start backend and frontend in separate terminals
```

**Option 2: Manual startup (recommended)**

**Terminal 1 - Database:**
```bash
docker-compose up -d postgres
```

**Terminal 2 - Backend:**
```bash
cd bureau-wonders-cms
npm run develop
```

**Terminal 3 - Frontend:**
```bash
cd bureau-wonders
npm run dev
```

### Stopping Everything

```bash
# Stop frontend: Press Ctrl+C in frontend terminal
# Stop backend: Press Ctrl+C in backend terminal

# Stop database
docker-compose down

# Stop database and remove volumes (⚠️ deletes all data)
docker-compose down -v
```

---

## 🛠️ Useful Commands

### Docker Commands
```bash
# Start database
docker-compose up -d postgres

# Stop database
docker-compose down

# View logs
docker-compose logs -f postgres

# Restart database
docker-compose restart postgres

# Remove all data (⚠️ destructive)
docker-compose down -v
```

### Backend Commands (bureau-wonders-cms)
```bash
npm run develop      # Start with auto-reload
npm run build        # Build admin panel
npm run start        # Start production mode
npm run strapi       # Show all Strapi commands

# Database commands
npm run strapi export -- -f export.tar.gz    # Export data
npm run strapi import -- -f export.tar.gz    # Import data
```

### Frontend Commands (bureau-wonders)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

---

## 🔍 Accessing Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | N/A |
| Strapi Admin | http://localhost:1337/admin | Your admin account |
| Strapi API | http://localhost:1337/api | API tokens |
| PostgreSQL | localhost:5432 | postgres/postgres |
| pgAdmin (optional) | http://localhost:5050 | admin@bureauofwonders.com / admin |

---

## 🐛 Troubleshooting

### Docker Issues

**Docker not running:**
```bash
# Start Docker Desktop
open -a Docker

# Wait 30 seconds, then verify
docker ps
```

**Port 5432 already in use:**
```bash
# Check what's using the port
lsof -i :5432

# Stop local PostgreSQL if running
brew services stop postgresql

# Or change port in docker-compose.yml
```

### Backend Issues

**Database connection failed:**
```bash
# Check database is running
docker ps | grep bureau-wonders-db

# Check .env file has correct credentials
cat bureau-wonders-cms/.env | grep DATABASE

# Restart database
docker-compose restart postgres
```

**Port 1337 already in use:**
```bash
# Find process using port
lsof -i :1337

# Kill the process
kill -9 <PID>

# Or change port in bureau-wonders-cms/.env
```

**Module not found errors:**
```bash
cd bureau-wonders-cms
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

**API connection errors:**
```bash
# Verify backend is running
curl http://localhost:1337/api

# Check .env.local has correct URL
cat bureau-wonders/.env.local | grep STRAPI_URL
```

### Permission Issues

```bash
# Fix file permissions
chmod +x start-dev.sh

# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

---

## 📚 Additional Resources

- **Strapi Documentation:** https://docs.strapi.io/
- **Next.js Documentation:** https://nextjs.org/docs
- **Docker Documentation:** https://docs.docker.com/desktop/install/mac-install/

---

## 🎯 Next Steps

1. ✅ Start all services (database, backend, frontend)
2. ✅ Create admin account in Strapi
3. 📝 Configure content types in Strapi admin
4. 📝 Set up API permissions (Settings → Roles → Public)
5. 📝 Add sample content
6. 🎨 Customize frontend components
7. 🚀 Deploy to production

---

**Need Help?** Check the other documentation files:
- `QUICK_START.md` - General quick start guide
- `CMS_SETUP.md` - Detailed CMS configuration
- `LOCAL_DEVELOPMENT.md` - Development workflow
- `DEPLOYMENT_SUMMARY.md` - Production deployment guide
