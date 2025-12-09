# Local Development Setup with Docker

This guide helps you set up the Bureau of Wonders project locally using Docker for PostgreSQL.

## Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 9.x or higher
- **Docker Desktop**: Latest version
  - Windows: https://docs.docker.com/desktop/install/windows-install/
    - **IMPORTANT**: Must be in **Linux container mode** (see [DOCKER_SETUP_WINDOWS.md](./DOCKER_SETUP_WINDOWS.md))
  - Mac: https://docs.docker.com/desktop/install/mac-install/
  - Linux: https://docs.docker.com/desktop/install/linux-install/

## Quick Start

### 1. Start PostgreSQL with Docker

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Verify it's running
docker-compose ps
```

The database will be available at:
- **Host**: localhost
- **Port**: 5432
- **Database**: bureau_wonders_cms
- **Username**: postgres
- **Password**: postgres

### 2. Start Strapi Backend

```bash
# Navigate to CMS directory
cd bureau-wonders-cms

# Install dependencies (first time only)
npm install

# Start Strapi in development mode
npm run develop
```

Strapi will be available at: http://localhost:1337

### 3. Start Next.js Frontend

Open a new terminal:

```bash
# Navigate to frontend directory
cd bureau-wonders

# Install dependencies (first time only)
npm install

# Start Next.js in development mode
npm run dev
```

Frontend will be available at: http://localhost:3000

---

## Docker Commands

### Start Services

```bash
# Start PostgreSQL only
docker-compose up -d postgres

# Start PostgreSQL + pgAdmin
docker-compose up -d

# View logs
docker-compose logs -f postgres
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data!)
docker-compose down -v
```

### Database Management

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d bureau_wonders_cms

# Create database backup
docker-compose exec postgres pg_dump -U postgres bureau_wonders_cms > backup.sql

# Restore database backup
docker-compose exec -T postgres psql -U postgres bureau_wonders_cms < backup.sql
```

---

## Optional: pgAdmin (Database GUI)

pgAdmin is included in the Docker Compose setup for easy database management.

### Access pgAdmin

1. Start pgAdmin:
   ```bash
   docker-compose up -d pgadmin
   ```

2. Open browser: http://localhost:5050

3. Login:
   - **Email**: admin@bureauofwonders.com
   - **Password**: admin

4. Add PostgreSQL server:
   - Right-click "Servers" → "Register" → "Server"
   - **General Tab**:
     - Name: Bureau Wonders DB
   - **Connection Tab**:
     - Host: postgres (container name)
     - Port: 5432
     - Database: bureau_wonders_cms
     - Username: postgres
     - Password: postgres

---

## Environment Variables

### Backend (.env)

The backend is already configured to use Docker PostgreSQL. Verify your `bureau-wonders-cms/.env`:

```bash
# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=bureau_wonders_cms
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false
```

### Frontend (.env.local)

Verify your `bureau-wonders/.env.local`:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## First Time Setup

### 1. Start Database

```bash
docker-compose up -d postgres
```

Wait for PostgreSQL to be ready (about 10 seconds).

### 2. Initialize Strapi

```bash
cd bureau-wonders-cms
npm install
npm run develop
```

### 3. Create Admin Account

1. Visit http://localhost:1337/admin
2. Fill in admin details:
   - First name
   - Last name
   - Email
   - Password (min 8 characters)
3. Click "Let's start"

### 4. Generate API Token

1. In Strapi admin: Settings → API Tokens → Create new API Token
2. Name: "Local Development"
3. Token type: "Full access" (for development)
4. Token duration: "Unlimited"
5. Click "Save"
6. Copy the token

### 5. Configure Frontend

1. Create `.env.local` in `bureau-wonders/`:
   ```bash
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   STRAPI_API_TOKEN=your-token-from-step-4
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. Start frontend:
   ```bash
   cd bureau-wonders
   npm install
   npm run dev
   ```

### 6. Configure Permissions

1. In Strapi admin: Settings → Users & Permissions Plugin → Roles → Public
2. Enable these permissions:
   - **Page**: find, findOne
   - **Blog-post**: find, findOne
   - **Case-study**: find, findOne
   - **Job-listing**: find, findOne
   - **Site-settings**: find
   - **Contact-inquiry**: create
3. Click "Save"

### 7. Add Sample Content

1. Create Site Settings (Content Manager → Site Settings)
2. Add a blog post
3. Add a case study
4. Publish all content

---

## Development Workflow

### Daily Workflow

```bash
# 1. Start database
docker-compose up -d postgres

# 2. Start backend (in one terminal)
cd bureau-wonders-cms
npm run develop

# 3. Start frontend (in another terminal)
cd bureau-wonders
npm run dev
```

### Stopping Development

```bash
# Stop Next.js: Ctrl+C in terminal
# Stop Strapi: Ctrl+C in terminal

# Stop Docker containers
docker-compose down
```

---

## Troubleshooting

### PostgreSQL Issues

**Container won't start:**
```bash
# Check if port 5432 is already in use
netstat -ano | findstr :5432

# Stop existing PostgreSQL service
# Windows: Services → PostgreSQL → Stop
# Mac/Linux: sudo systemctl stop postgresql

# Or change port in docker-compose.yml:
ports:
  - "5433:5432"  # Use port 5433 instead
```

**Connection refused:**
```bash
# Check container is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart container
docker-compose restart postgres
```

**Database doesn't exist:**
```bash
# Access PostgreSQL and create database
docker-compose exec postgres psql -U postgres
CREATE DATABASE bureau_wonders_cms;
\q
```

### Strapi Issues

**Build fails:**
```bash
# Clear cache and rebuild
cd bureau-wonders-cms
rm -rf .cache build
npm run build
```

**Database connection error:**
- Verify PostgreSQL is running: `docker-compose ps`
- Check `.env` database credentials
- Ensure `DATABASE_HOST=localhost` (not `postgres`)

**Port 1337 already in use:**
```bash
# Change port in .env
PORT=1338

# Or kill process using port 1337
# Windows:
netstat -ano | findstr :1337
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:1337 | xargs kill -9
```

### Frontend Issues

**API connection error:**
- Verify Strapi is running at http://localhost:1337
- Check `NEXT_PUBLIC_STRAPI_URL` in `.env.local`
- Verify API token is correct

**Port 3000 already in use:**
```bash
# Next.js will automatically use next available port (3001, 3002, etc.)
# Or specify port:
PORT=3001 npm run dev
```

---

## Database Management

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres bureau_wonders_cms > backup_$(date +%Y%m%d).sql

# Or with Docker command
docker exec bureau-wonders-db pg_dump -U postgres bureau_wonders_cms > backup.sql
```

### Restore Database

```bash
# Restore from backup
docker-compose exec -T postgres psql -U postgres bureau_wonders_cms < backup.sql
```

### Reset Database

```bash
# Stop Strapi first!

# Drop and recreate database
docker-compose exec postgres psql -U postgres -c "DROP DATABASE bureau_wonders_cms;"
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE bureau_wonders_cms;"

# Restart Strapi to rebuild schema
cd bureau-wonders-cms
npm run develop
```

### View Database

**Using psql:**
```bash
docker-compose exec postgres psql -U postgres bureau_wonders_cms

# Useful commands:
\dt              # List tables
\d table_name    # Describe table
SELECT * FROM blog_posts;
\q               # Quit
```

**Using pgAdmin:**
- Access http://localhost:5050
- Navigate to Servers → Bureau Wonders DB → Databases → bureau_wonders_cms

---

## Performance Tips

### Speed Up Development

1. **Use SSD for Docker volumes** (if possible)
2. **Allocate more resources to Docker Desktop**:
   - Settings → Resources
   - Increase CPU and Memory

3. **Keep containers running** between sessions:
   ```bash
   # Don't stop containers, just stop Node processes
   docker-compose up -d postgres
   # Keep running overnight
   ```

4. **Use nodemon for auto-restart** (Strapi already includes this)

---

## Docker Compose Configuration

The `docker-compose.yml` includes:

### PostgreSQL Service
- **Image**: postgres:16-alpine (lightweight)
- **Port**: 5432
- **Volume**: Persistent data storage
- **Health check**: Ensures database is ready

### pgAdmin Service (Optional)
- **Image**: dpage/pgadmin4
- **Port**: 5050
- **Web-based database management**

---

## Alternative: Without Docker

If you prefer not to use Docker, install PostgreSQL directly:

### Windows
1. Download from https://www.postgresql.org/download/windows/
2. Run installer
3. Set password for postgres user
4. Create database: `bureau_wonders_cms`

### Mac (Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
createdb bureau_wonders_cms
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb bureau_wonders_cms
```

---

## VS Code Integration

### Recommended Extensions

1. **Docker** - Manage containers from VS Code
2. **PostgreSQL** - Database management
3. **Thunder Client** - Test Strapi API

### Docker Extension Usage

1. Install Docker extension
2. View containers in sidebar
3. Right-click container for options:
   - View logs
   - Attach shell
   - Stop/Start/Restart

---

## Next Steps

1. ✅ Start Docker PostgreSQL
2. ✅ Start Strapi backend
3. ✅ Create admin account
4. ✅ Generate API token
5. ✅ Start Next.js frontend
6. ✅ Configure permissions
7. ✅ Add sample content
8. 🚀 Start developing!

---

## Support

- **Docker Issues**: https://docs.docker.com/
- **PostgreSQL Issues**: https://www.postgresql.org/docs/
- **Strapi Issues**: https://docs.strapi.io/
- **Next.js Issues**: https://nextjs.org/docs

---

## Quick Reference

```bash
# Start everything
docker-compose up -d
cd bureau-wonders-cms && npm run develop &
cd bureau-wonders && npm run dev

# Stop everything
# Ctrl+C in terminals
docker-compose down

# View logs
docker-compose logs -f postgres

# Database backup
docker-compose exec postgres pg_dump -U postgres bureau_wonders_cms > backup.sql

# Access database
docker-compose exec postgres psql -U postgres bureau_wonders_cms
```
