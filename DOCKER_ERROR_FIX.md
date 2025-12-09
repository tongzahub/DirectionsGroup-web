# Fix: "No Matching Manifest for Windows/amd64" Error

## The Problem

When running `docker-compose up` or `docker pull`, you see:
```
no matching manifest for windows/amd64 in the manifest list entries
```

## Root Cause

Docker Desktop is in **Windows container mode**, but PostgreSQL and pgAdmin are **Linux-based images**.

## Quick Fix (Choose One)

### Option 1: Automated Script (Easiest)

Run the fix script:
```powershell
.\fix-docker-windows.bat
```

This will:
1. Check if Docker is in Linux mode
2. Guide you to switch if needed
3. Pull images with correct platform
4. Start PostgreSQL

---

### Option 2: Manual Switch (Recommended)

1. **Right-click Docker Desktop icon** in system tray (bottom-right corner)
2. **Click "Switch to Linux containers..."**
3. **Wait for Docker to restart** (30-60 seconds)
4. **Start containers**:
   ```powershell
   docker-compose up -d postgres
   ```

---

### Option 3: Keep Windows Mode (Advanced)

If you must stay in Windows container mode, you'll need Windows-compatible alternatives:
- Use SQL Server instead of PostgreSQL
- Or install PostgreSQL directly on Windows (not recommended for this project)

---

## Verify the Fix

Check Docker is in Linux mode:
```powershell
docker info | Select-String "OSType"
```

Should show: `OSType: linux`

---

## Why This Happens

- **PostgreSQL** and **pgAdmin** are Linux applications
- They don't have Windows container versions
- Docker Desktop can run either Windows OR Linux containers (not both simultaneously)
- Most development tools use Linux containers

---

## Already Fixed in docker-compose.yml

The `docker-compose.yml` file now includes `platform: linux/amd64` for all services:

```yaml
services:
  postgres:
    image: postgres:16
    platform: linux/amd64  # ← This ensures Linux platform
    # ...
```

This helps Docker pull the correct image, but you still need to be in Linux container mode.

---

## Next Steps

Once PostgreSQL is running:

1. **Start Strapi CMS**:
   ```powershell
   cd bureau-wonders-cms
   npm install
   npm run develop
   ```

2. **Start Next.js frontend**:
   ```powershell
   cd bureau-wonders
   npm install
   npm run dev
   ```

3. **Access applications**:
   - Frontend: http://localhost:3000
   - Strapi Admin: http://localhost:1337/admin
   - pgAdmin: http://localhost:5050

---

## Still Having Issues?

See [DOCKER_SETUP_WINDOWS.md](./DOCKER_SETUP_WINDOWS.md) for complete troubleshooting guide.
