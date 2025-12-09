# Docker Setup Summary

## ✅ What Was Created

### Docker Configuration Files

1. **docker-compose.yml**
   - PostgreSQL 16 service
   - pgAdmin service (optional database GUI)
   - Persistent volumes for data
   - Health checks
   - Windows-compatible configuration

2. **.dockerignore**
   - Excludes unnecessary files from Docker context
   - Improves build performance

3. **.gitignore** (root)
   - Excludes Docker volumes from Git
   - Prevents committing sensitive data

### Documentation

1. **LOCAL_DEVELOPMENT.md**
   - Complete local development guide
   - Docker setup instructions
   - PostgreSQL management
   - Troubleshooting guide
   - Database backup/restore
   - pgAdmin setup

2. **DOCKER_SETUP_WINDOWS.md**
   - Windows-specific Docker instructions
   - Switch to Linux containers
   - Troubleshooting for Windows
   - Port conflict resolution

3. **README.md** (root)
   - Project overview
   - Quick start guide
   - Documentation index
   - Tech stack
   - Features list

### Startup Scripts

1. **start-dev.sh** (Linux/Mac)
   - Bash script to start development environment
   - Checks Docker status
   - Starts PostgreSQL
   - Shows next steps

2. **start-dev.bat** (Windows)
   - Batch script for Windows
   - Same functionality as bash script
   - Windows-friendly commands

---

## 🐳 Docker Services

### PostgreSQL
- **Image**: postgres:16
- **Port**: 5432
- **Database**: bureau_wonders_cms
- **Username**: postgres
- **Password**: postgres
- **Volume**: postgres_data (persistent)

### pgAdmin (Optional)
- **Image**: dpage/pgadmin4
- **Port**: 5050
- **Email**: admin@bureauofwonders.com
- **Password**: admin
- **Volume**: pgadmin_data (persistent)

---

## 🚀 How to Use

### Windows Users

**IMPORTANT**: Docker must be in Linux container mode!

1. **Switch to Linux containers**:
   - Right-click Docker Desktop icon
   - Click "Switch to Linux containers..."
   - Wait for restart

2. **Start database**:
   ```powershell
   docker-compose up -d postgres
   ```

   Or use the script:
   ```powershell
   .\start-dev.bat
   ```

3. **Verify it's running**:
   ```powershell
   docker-compose ps
   ```

### Mac/Linux Users

1. **Start database**:
   ```bash
   docker-compose up -d postgres
   ```

   Or use the script:
   ```bash
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

2. **Verify it's running**:
   ```bash
   docker-compose ps
   ```

---

## 📋 Next Steps

After starting PostgreSQL:

### 1. Start Strapi Backend

```bash
cd bureau-wonders-cms
npm install
npm run develop
```

Access at: http://localhost:1337/admin

### 2. Create Admin Account

First time only:
1. Visit http://localhost:1337/admin
2. Fill in admin details
3. Click "Let's start"

### 3. Generate API Token

1. Settings → API Tokens → Create new
2. Name: "Local Development"
3. Type: "Full access"
4. Duration: "Unlimited"
5. Copy the token

### 4. Configure Frontend

Create `bureau-wonders/.env.local`:
```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-token-from-step-3
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Start Frontend

```bash
cd bureau-wonders
npm install
npm run dev
```

Access at: http://localhost:3000

---

## 🔧 Common Commands

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

# Stop and remove data (⚠️ deletes database!)
docker-compose down -v
```

### Database Management
```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d bureau_wonders_cms

# Backup database
docker-compose exec postgres pg_dump -U postgres bureau_wonders_cms > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres bureau_wonders_cms < backup.sql

# View running containers
docker-compose ps

# View all containers
docker ps -a
```

---

## 🐛 Troubleshooting

### Docker is in Windows container mode

**Error**: `no matching manifest for windows`

**Solution**:
1. Right-click Docker Desktop icon
2. Click "Switch to Linux containers..."
3. Wait for restart
4. Try again

### Port 5432 already in use

**Solution 1**: Stop existing PostgreSQL
- Windows: Services → PostgreSQL → Stop
- Mac: `brew services stop postgresql`
- Linux: `sudo systemctl stop postgresql`

**Solution 2**: Use different port

Edit `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"
```

Update `bureau-wonders-cms/.env`:
```bash
DATABASE_PORT=5433
```

### Container won't start

```bash
# View detailed logs
docker-compose logs postgres

# Remove and recreate
docker-compose down -v
docker-compose up -d postgres
```

### Database connection refused

```bash
# Check container is running
docker-compose ps

# Check container health
docker inspect bureau-wonders-db | grep -i health

# Restart container
docker-compose restart postgres
```

---

## 📊 What's Running

After successful setup:

| Service | URL | Credentials |
|---------|-----|-------------|
| PostgreSQL | localhost:5432 | postgres / postgres |
| Strapi Admin | http://localhost:1337/admin | Your admin account |
| Next.js Frontend | http://localhost:3000 | - |
| pgAdmin (optional) | http://localhost:5050 | admin@bureauofwonders.com / admin |

---

## 🔐 Security Notes

### Development
- Default credentials are for local development only
- Never use these credentials in production
- Database is only accessible from localhost

### Production
- Use strong passwords
- Enable SSL for database connections
- Use managed database services (Railway, Render)
- See [DEPLOYMENT.md](./bureau-wonders-cms/DEPLOYMENT.md)

---

## 📚 Additional Resources

- [Local Development Guide](./LOCAL_DEVELOPMENT.md) - Complete setup guide
- [Docker Setup (Windows)](./DOCKER_SETUP_WINDOWS.md) - Windows instructions
- [Environment Variables](./ENVIRONMENT_VARIABLES.md) - Variable reference
- [Quick Deploy](./QUICK_DEPLOY.md) - Production deployment

---

## ✅ Verification Checklist

- [ ] Docker Desktop installed
- [ ] Docker in Linux container mode (Windows)
- [ ] PostgreSQL container running
- [ ] Can access database (psql or pgAdmin)
- [ ] Strapi backend running
- [ ] Frontend running
- [ ] Can create content in Strapi
- [ ] Content appears on frontend

---

## 🆘 Need Help?

1. Check [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) troubleshooting section
2. Check [DOCKER_SETUP_WINDOWS.md](./DOCKER_SETUP_WINDOWS.md) for Windows issues
3. View Docker logs: `docker-compose logs postgres`
4. Check Docker Desktop dashboard
5. Restart Docker Desktop

---

**Docker setup complete! 🎉**

Your local development environment is ready to use.
