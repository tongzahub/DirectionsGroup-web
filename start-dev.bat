@echo off
REM Bureau of Wonders - Development Startup Script (Windows)
REM This script starts all services needed for local development

echo.
echo Starting Bureau of Wonders Development Environment...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Start PostgreSQL
echo Starting PostgreSQL container...
docker-compose up -d postgres

REM Wait for PostgreSQL to be ready
echo Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

echo.
echo Database is running at localhost:5432
echo.
echo Next steps:
echo    1. Start Strapi backend:
echo       cd bureau-wonders-cms ^&^& npm run develop
echo.
echo    2. Start Next.js frontend (in another terminal):
echo       cd bureau-wonders ^&^& npm run dev
echo.
echo    3. Access your applications:
echo       - Frontend: http://localhost:3000
echo       - Strapi Admin: http://localhost:1337/admin
echo       - pgAdmin (optional): http://localhost:5050
echo.
echo To stop: docker-compose down
echo.
pause
