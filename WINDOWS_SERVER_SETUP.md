# Windows Server Setup (Without Docker)

Since you're on Windows Server, installing PostgreSQL directly is simpler than using Docker.

## Install PostgreSQL on Windows Server

### Option 1: Using Chocolatey (Recommended)

1. **Install Chocolatey** (if not already installed):
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force
   [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
   iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Install PostgreSQL**:
   ```powershell
   choco install postgresql16 -y
   ```

3. **Set password for postgres user**:
   ```powershell
   # PostgreSQL will prompt you during installation
   # Use password: postgres (or your preferred password)
   ```

### Option 2: Manual Download

1. **Download PostgreSQL 16**:
   - Visit: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Download PostgreSQL 16.x for Windows x86-64

2. **Run the installer**:
   - Accept defaults
   - Set password for postgres user: `postgres`
   - Port: `5432`
   - Locale: Default

3. **Verify installation**:
   ```powershell
   psql --version
   ```

---

## Create Database

1. **Open PowerShell as Administrator**

2. **Connect to PostgreSQL**:
   ```powershell
   psql -U postgres
   ```

3. **Create database**:
   ```sql
   CREATE DATABASE bureau_wonders_cms;
   \q
   ```

---

## Configure Strapi CMS

1. **Navigate to CMS directory**:
   ```powershell
   cd bureau-wonders-cms
   ```

2. **Create .env file** (if not exists):
   ```powershell
   Copy-Item .env.example .env
   ```

3. **Edit .env file** with these settings:
   ```env
   HOST=0.0.0.0
   PORT=1337
   
   # Database
   DATABASE_CLIENT=postgres
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=bureau_wonders_cms
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_SSL=false
   
   # Secrets (generate new ones for production)
   APP_KEYS=toBeModified1,toBeModified2
   API_TOKEN_SALT=toBeModified
   ADMIN_JWT_SECRET=toBeModified
   TRANSFER_TOKEN_SALT=toBeModified
   JWT_SECRET=toBeModified
   ```

4. **Install dependencies**:
   ```powershell
   npm install
   ```

5. **Start Strapi**:
   ```powershell
   npm run develop
   ```

---

## Configure Next.js Frontend

1. **Navigate to frontend directory**:
   ```powershell
   cd ..\bureau-wonders
   ```

2. **Create .env.local file**:
   ```env
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   STRAPI_API_TOKEN=your-api-token-here
   ```

3. **Install dependencies**:
   ```powershell
   npm install
   ```

4. **Start Next.js**:
   ```powershell
   npm run dev
   ```

---

## Access Applications

- **Frontend**: http://localhost:3000
- **Strapi Admin**: http://localhost:1337/admin
- **PostgreSQL**: localhost:5432

---

## Verify PostgreSQL Service

Check if PostgreSQL is running:

```powershell
Get-Service -Name postgresql*
```

Start PostgreSQL if stopped:

```powershell
Start-Service -Name postgresql-x64-16
```

---

## Troubleshooting

### PostgreSQL service won't start

```powershell
# Check logs
Get-EventLog -LogName Application -Source PostgreSQL -Newest 10

# Restart service
Restart-Service -Name postgresql-x64-16
```

### Can't connect to database

1. Check PostgreSQL is running:
   ```powershell
   Get-Service postgresql*
   ```

2. Test connection:
   ```powershell
   psql -U postgres -d bureau_wonders_cms
   ```

3. Check pg_hba.conf allows local connections:
   - Location: `C:\Program Files\PostgreSQL\16\data\pg_hba.conf`
   - Should have: `host all all 127.0.0.1/32 md5`

### Port 5432 already in use

Check what's using the port:

```powershell
netstat -ano | findstr :5432
```

---

## Production Deployment

For production on Windows Server:

1. **Use IIS with iisnode** for Next.js
2. **Run Strapi as Windows Service** using node-windows
3. **Configure PostgreSQL** for production (see PostgreSQL docs)
4. **Set up SSL certificates**
5. **Configure Windows Firewall**

See [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) for more details.

---

## Alternative: Use WSL2

If you prefer Docker, you can use WSL2:

1. **Install WSL2**:
   ```powershell
   wsl --install
   ```

2. **Install Docker Desktop** (it will use WSL2 backend automatically)

3. **Follow Linux setup instructions**

This gives you a Linux environment on Windows Server.
