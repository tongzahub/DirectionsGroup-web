# Docker Setup for Windows

## Important: Switch to Linux Containers

PostgreSQL requires Linux containers. Follow these steps to switch Docker Desktop to Linux container mode.

### Step 1: Switch to Linux Containers

1. **Right-click Docker Desktop icon** in system tray (bottom-right corner)
2. **Click "Switch to Linux containers..."**
3. Wait for Docker to restart (30-60 seconds)

![Switch to Linux Containers](https://docs.docker.com/desktop/images/switch-linux-containers.png)

### Step 2: Verify Linux Container Mode

```powershell
docker info | Select-String "OSType"
```

Should show: `OSType: linux`

### Step 3: Start PostgreSQL

```powershell
docker-compose up -d postgres
```

---

## Alternative: Use Windows Script

Run the provided startup script:

```powershell
.\start-dev.bat
```

This will:
1. Check if Docker is running
2. Start PostgreSQL container
3. Show next steps

---

## Troubleshooting

### "No matching manifest for windows/amd64" Error

This error occurs when Docker tries to pull Linux images while in Windows container mode or without platform specification.

**Solution 1: Switch to Linux Containers** (Recommended)
1. Right-click Docker Desktop icon in system tray
2. Click "Switch to Linux containers..."
3. Wait for Docker to restart
4. Run: `docker-compose up -d postgres`

**Solution 2: Platform Already Specified**
The `docker-compose.yml` file now includes `platform: linux/amd64` for all services. Simply ensure Docker Desktop is running and try again:
```powershell
docker-compose pull
docker-compose up -d postgres
```

**Solution 3: Manual Platform Flag**
If issues persist, pull images manually:
```powershell
docker pull --platform linux/amd64 postgres:16
docker pull --platform linux/amd64 dpage/pgadmin4:latest
docker-compose up -d
```

### "Switch to Linux containers" is grayed out

Docker is already in Linux mode. Proceed to start PostgreSQL.

### Docker Desktop not starting

1. **Check Windows features**:
   - Open PowerShell as Administrator
   - Run: `wsl --install`
   - Restart computer

2. **Enable WSL 2**:
   - Open PowerShell as Administrator
   - Run: `wsl --set-default-version 2`

3. **Update Docker Desktop**:
   - Download latest from https://www.docker.com/products/docker-desktop

### Port 5432 already in use

Another PostgreSQL instance is running:

**Option 1: Stop existing PostgreSQL**
1. Open Services (Win + R, type `services.msc`)
2. Find "PostgreSQL" service
3. Right-click → Stop

**Option 2: Use different port**

Edit `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use port 5433 instead
```

Then update `bureau-wonders-cms/.env`:
```bash
DATABASE_PORT=5433
```

### Container won't start

```powershell
# View logs
docker-compose logs postgres

# Remove and recreate
docker-compose down -v
docker-compose up -d postgres
```

---

## Quick Start Commands

```powershell
# Start database
docker-compose up -d postgres

# Check status
docker-compose ps

# View logs
docker-compose logs -f postgres

# Stop database
docker-compose down

# Stop and remove data
docker-compose down -v
```

---

## Next Steps

Once PostgreSQL is running:

1. **Start Strapi** (in one terminal):
   ```powershell
   cd bureau-wonders-cms
   npm install
   npm run develop
   ```

2. **Start Next.js** (in another terminal):
   ```powershell
   cd bureau-wonders
   npm install
   npm run dev
   ```

3. **Access applications**:
   - Frontend: http://localhost:3000
   - Strapi Admin: http://localhost:1337/admin
   - pgAdmin: http://localhost:5050 (optional)

---

## Complete Setup Guide

See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for complete instructions.
