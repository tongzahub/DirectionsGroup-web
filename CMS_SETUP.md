# Bureau of Wonders CMS Setup Guide

This guide will walk you through setting up the Strapi CMS backend for the Bureau of Wonders website.

## Step 1: Install PostgreSQL

### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is 5432

### macOS
Using Homebrew:
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 2: Create Database

### Option 1: Using psql command line
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE bureau_wonders_cms;

# Exit psql
\q
```

### Option 2: Using createdb command
```bash
createdb -U postgres bureau_wonders_cms
```

### Option 3: Using pgAdmin (GUI)
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" > "Database"
4. Name it `bureau_wonders_cms`
5. Click "Save"

## Step 3: Configure Strapi

1. Navigate to the CMS directory:
   ```bash
   cd bureau-wonders-cms
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Update `.env` file with your database credentials:
   ```env
   DATABASE_CLIENT=postgres
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=bureau_wonders_cms
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_postgres_password
   ```

## Step 4: Start Strapi

1. Run Strapi in development mode:
   ```bash
   npm run develop
   ```

2. Wait for Strapi to start (this may take a minute on first run)

3. You should see output like:
   ```
   ┌────────────────────────────────────────────────────┐
   │ Strapi is running at http://localhost:1337/admin  │
   └────────────────────────────────────────────────────┘
   ```

## Step 5: Create Admin User

1. Open your browser and navigate to http://localhost:1337/admin

2. You'll see the admin registration page

3. Fill in the form:
   - First name
   - Last name
   - Email
   - Password (minimum 8 characters)

4. Click "Let's start"

5. You're now logged into the Strapi admin panel!

## Step 6: Verify Setup

1. Check that you can access the admin panel
2. Verify the database connection is working
3. You should see the Content-Type Builder in the left sidebar

## Troubleshooting

### Database Connection Issues

**Error: "Connection refused"**
- Ensure PostgreSQL is running: `pg_isready` (Linux/Mac) or check Services (Windows)
- Verify the port (default 5432) is correct
- Check if firewall is blocking the connection

**Error: "Authentication failed"**
- Verify username and password in `.env`
- Check PostgreSQL user permissions
- Try connecting with psql: `psql -U postgres -d bureau_wonders_cms`

**Error: "Database does not exist"**
- Create the database using one of the methods in Step 2
- Verify database name matches `.env` configuration

### Port Already in Use

If port 1337 is already in use, change it in `.env`:
```env
PORT=1338
```

### Node Version Issues

Strapi requires Node.js 18.x or higher. Check your version:
```bash
node --version
```

If needed, update Node.js or use nvm to switch versions.

## Next Steps

After successful setup:
1. Configure content types (see tasks 3.x in implementation plan)
2. Set up permissions (see task 4.1)
3. Configure email plugin (see task 4.2)
4. Create test content

## Useful Commands

```bash
# Start development server
npm run develop

# Build admin panel
npm run build

# Start production server
npm run start

# Display all Strapi commands
npm run strapi
```

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Strapi Discord Community](https://discord.strapi.io/)
