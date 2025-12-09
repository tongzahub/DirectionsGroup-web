# Strapi CMS Setup Checklist

Use this checklist to verify your Strapi CMS setup is complete and ready for development.

## ✅ Prerequisites

- [ ] Node.js 18.x or higher installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL 12 or higher installed (`psql --version`)
- [ ] PostgreSQL service is running

## ✅ Database Setup

- [ ] PostgreSQL database `bureau_wonders_cms` created
- [ ] Database credentials configured in `.env` file
- [ ] Can connect to database using psql: `psql -U postgres -d bureau_wonders_cms`

## ✅ Strapi Configuration

- [ ] Dependencies installed (`npm install` completed successfully)
- [ ] `.env` file exists with correct values:
  - [ ] `DATABASE_CLIENT=postgres`
  - [ ] `DATABASE_HOST` set correctly
  - [ ] `DATABASE_PORT` set correctly (default: 5432)
  - [ ] `DATABASE_NAME=bureau_wonders_cms`
  - [ ] `DATABASE_USERNAME` set correctly
  - [ ] `DATABASE_PASSWORD` set correctly
  - [ ] `APP_KEYS` and other secrets are present

## ✅ First Run

- [ ] Strapi starts successfully (`npm run develop`)
- [ ] No database connection errors in console
- [ ] Admin panel accessible at http://localhost:1337/admin
- [ ] Admin user account created
- [ ] Can log into admin panel

## ✅ Verification Steps

Run these commands to verify setup:

```bash
# Check Node.js version (should be 18+)
node --version

# Check PostgreSQL is running
pg_isready

# Check database exists
psql -U postgres -l | grep bureau_wonders_cms

# Test database connection
psql -U postgres -d bureau_wonders_cms -c "SELECT version();"

# Install dependencies
cd bureau-wonders-cms
npm install

# Start Strapi
npm run develop
```

## ✅ Post-Setup Tasks

After successful setup, proceed with:

- [ ] Task 3: Create Strapi content types
- [ ] Task 4: Configure Strapi permissions and email
- [ ] Configure CORS for frontend domain
- [ ] Set up API tokens for frontend access

## 🔧 Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL status
# Windows: Check Services app
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Restart PostgreSQL if needed
# Mac: brew services restart postgresql
# Linux: sudo systemctl restart postgresql
```

### Port 1337 Already in Use
Change the port in `.env`:
```env
PORT=1338
```

### Permission Denied
```bash
# Grant permissions to PostgreSQL user
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE bureau_wonders_cms TO postgres;"
```

## 📚 Next Steps

1. Review the content types to be created (see design.md)
2. Plan content structure
3. Configure API permissions
4. Set up email notifications
5. Create test content

## 🆘 Getting Help

- Strapi Documentation: https://docs.strapi.io/
- Strapi Discord: https://discord.strapi.io/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Project Issues: Check the project repository

---

**Status**: Task 2 - Set up Strapi CMS backend
**Requirements**: 8.1, 8.2, 8.3, 8.4, 8.5
