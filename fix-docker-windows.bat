@echo off
echo ========================================
echo Docker Windows Fix Script
echo ========================================
echo.

echo Checking Docker status...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo.
echo Checking container mode...
docker info | findstr "OSType: windows" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Docker is in Windows container mode!
    echo.
    echo You need to switch to Linux containers:
    echo 1. Right-click Docker Desktop icon in system tray
    echo 2. Click "Switch to Linux containers..."
    echo 3. Wait for Docker to restart
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo [OK] Docker is in Linux container mode
echo.

echo Pulling Docker images with platform specification...
docker pull --platform linux/amd64 postgres:16
if %errorlevel% neq 0 (
    echo [ERROR] Failed to pull PostgreSQL image
    pause
    exit /b 1
)

docker pull --platform linux/amd64 dpage/pgadmin4:latest
if %errorlevel% neq 0 (
    echo [WARNING] Failed to pull pgAdmin image (optional)
)

echo.
echo Starting PostgreSQL container...
docker-compose up -d postgres

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [SUCCESS] PostgreSQL is running!
    echo ========================================
    echo.
    echo Next steps:
    echo.
    echo 1. Start Strapi CMS:
    echo    cd bureau-wonders-cms
    echo    npm install
    echo    npm run develop
    echo.
    echo 2. Start Next.js frontend:
    echo    cd bureau-wonders
    echo    npm install
    echo    npm run dev
    echo.
    echo Access:
    echo - Frontend: http://localhost:3000
    echo - Strapi Admin: http://localhost:1337/admin
    echo - pgAdmin: http://localhost:5050
    echo.
) else (
    echo [ERROR] Failed to start PostgreSQL
    echo.
    echo Try running: docker-compose logs postgres
)

pause
