#!/bin/bash

# Bureau of Wonders - Development Startup Script
# This script starts all services needed for local development

echo "🚀 Starting Bureau of Wonders Development Environment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start PostgreSQL
echo "📦 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if PostgreSQL is healthy
if docker-compose ps postgres | grep -q "healthy"; then
    echo "✅ PostgreSQL is ready!"
else
    echo "⚠️  PostgreSQL is starting... (this may take a few more seconds)"
    sleep 5
fi

echo ""
echo "✅ Database is running at localhost:5432"
echo ""
echo "📝 Next steps:"
echo "   1. Start Strapi backend:"
echo "      cd bureau-wonders-cms && npm run develop"
echo ""
echo "   2. Start Next.js frontend (in another terminal):"
echo "      cd bureau-wonders && npm run dev"
echo ""
echo "   3. Access your applications:"
echo "      - Frontend: http://localhost:3000"
echo "      - Strapi Admin: http://localhost:1337/admin"
echo "      - pgAdmin (optional): http://localhost:5050"
echo ""
echo "💡 To stop: docker-compose down"
echo ""
