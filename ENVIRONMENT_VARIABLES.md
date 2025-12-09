# Environment Variables Reference

Complete reference for all environment variables used in Bureau of Wonders project.

## Frontend (Next.js)

### Development (.env.local)

```bash
# Strapi CMS URL (local development)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Strapi API Token (get from Strapi admin)
STRAPI_API_TOKEN=your-dev-api-token

# Site URL (for canonical URLs and sitemap)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Vercel Environment Variables)

```bash
# Strapi CMS URL (production backend)
NEXT_PUBLIC_STRAPI_URL=https://your-backend.railway.app

# Strapi API Token (production read-only token)
STRAPI_API_TOKEN=your-production-api-token

# Site URL (your production domain)
NEXT_PUBLIC_SITE_URL=https://bureauofwonders.com
```

### Variable Details

#### NEXT_PUBLIC_STRAPI_URL
- **Required**: Yes
- **Type**: String (URL)
- **Description**: Base URL of your Strapi CMS backend
- **Public**: Yes (exposed to browser)
- **Example**: `https://api.bureauofwonders.com`
- **Notes**: Must be accessible from browser. Include protocol (http/https), no trailing slash.

#### STRAPI_API_TOKEN
- **Required**: Yes
- **Type**: String (JWT token)
- **Description**: API token for authenticating with Strapi
- **Public**: No (server-side only)
- **Example**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
- **Notes**: Generate in Strapi admin (Settings → API Tokens). Use read-only token for security.

#### NEXT_PUBLIC_SITE_URL
- **Required**: Yes
- **Type**: String (URL)
- **Description**: Canonical URL of your website
- **Public**: Yes (exposed to browser)
- **Example**: `https://bureauofwonders.com`
- **Notes**: Used for SEO metadata, sitemap, canonical URLs. No trailing slash.

---

## Backend (Strapi CMS)

### Development (.env)

```bash
# Server Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# Database - PostgreSQL
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=bureau_wonders_cms
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false

# Secrets (use different values in production!)
APP_KEYS=dev-app-keys-here
API_TOKEN_SALT=dev-api-token-salt
ADMIN_JWT_SECRET=dev-admin-jwt-secret
TRANSFER_TOKEN_SALT=dev-transfer-token-salt
JWT_SECRET=dev-jwt-secret
ENCRYPTION_KEY=dev-encryption-key

# Email Configuration (optional for development)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=your-mailtrap-username
SMTP_PASSWORD=your-mailtrap-password
SMTP_SECURE=false
SMTP_DEFAULT_FROM=dev@bureauofwonders.com
SMTP_DEFAULT_REPLY_TO=dev@bureauofwonders.com

# Contact Form
CONTACT_FORM_RECIPIENT=dev@bureauofwonders.com
```

### Production (Railway/Render Environment Variables)

```bash
# Server Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Database - PostgreSQL
# Option 1: Use DATABASE_URL (Railway/Render provides this)
DATABASE_URL=postgresql://user:password@host:port/database

# Option 2: Use individual parameters
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host.railway.app
DATABASE_PORT=5432
DATABASE_NAME=railway
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=secure-password
DATABASE_SSL=false

# Secrets (GENERATE NEW VALUES FOR PRODUCTION!)
APP_KEYS=production-app-keys-here
API_TOKEN_SALT=production-api-token-salt
ADMIN_JWT_SECRET=production-admin-jwt-secret
TRANSFER_TOKEN_SALT=production-transfer-token-salt
JWT_SECRET=production-jwt-secret
ENCRYPTION_KEY=production-encryption-key

# Email Configuration (Production SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_SECURE=false
SMTP_DEFAULT_FROM=noreply@bureauofwonders.com
SMTP_DEFAULT_REPLY_TO=info@bureauofwonders.com

# Contact Form
CONTACT_FORM_RECIPIENT=contact@bureauofwonders.com

# Frontend URL (for CORS)
FRONTEND_URL=https://bureauofwonders.com
```

### Variable Details

#### Server Configuration

##### HOST
- **Required**: Yes
- **Type**: String (IP address)
- **Description**: Host address for Strapi server
- **Default**: `0.0.0.0`
- **Notes**: Use `0.0.0.0` to accept connections from any IP (required for deployment)

##### PORT
- **Required**: Yes
- **Type**: Number
- **Description**: Port number for Strapi server
- **Default**: `1337`
- **Railway**: Use `1337`
- **Render**: Use `10000`
- **Notes**: Railway and Render may override this

##### NODE_ENV
- **Required**: Yes
- **Type**: String (enum)
- **Description**: Node.js environment
- **Values**: `development`, `production`, `test`
- **Notes**: Affects logging, error handling, and performance optimizations

#### Database Configuration

##### DATABASE_URL
- **Required**: Yes (if not using individual parameters)
- **Type**: String (connection string)
- **Description**: PostgreSQL connection string
- **Example**: `postgresql://user:pass@host:5432/dbname`
- **Notes**: Railway and Render provide this automatically. Takes precedence over individual parameters.

##### DATABASE_CLIENT
- **Required**: Yes
- **Type**: String
- **Description**: Database client type
- **Value**: `postgres`
- **Notes**: Must be `postgres` for PostgreSQL

##### DATABASE_HOST
- **Required**: Yes (if not using DATABASE_URL)
- **Type**: String (hostname)
- **Description**: Database server hostname
- **Example**: `localhost`, `postgres.railway.internal`

##### DATABASE_PORT
- **Required**: Yes (if not using DATABASE_URL)
- **Type**: Number
- **Description**: Database server port
- **Default**: `5432`

##### DATABASE_NAME
- **Required**: Yes (if not using DATABASE_URL)
- **Type**: String
- **Description**: Database name
- **Example**: `bureau_wonders_cms`

##### DATABASE_USERNAME
- **Required**: Yes (if not using DATABASE_URL)
- **Type**: String
- **Description**: Database user
- **Example**: `postgres`

##### DATABASE_PASSWORD
- **Required**: Yes (if not using DATABASE_URL)
- **Type**: String
- **Description**: Database password
- **Security**: Keep secure, never commit to Git

##### DATABASE_SSL
- **Required**: No
- **Type**: Boolean
- **Description**: Enable SSL for database connection
- **Default**: `false`
- **Notes**: Set to `true` if your database requires SSL

#### Security Secrets

All secrets should be generated using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

##### APP_KEYS
- **Required**: Yes
- **Type**: String (base64)
- **Description**: Keys for session encryption
- **Security**: Generate unique value for each environment
- **Notes**: Critical for security, never reuse across environments

##### API_TOKEN_SALT
- **Required**: Yes
- **Type**: String (base64)
- **Description**: Salt for API token generation
- **Security**: Generate unique value for each environment

##### ADMIN_JWT_SECRET
- **Required**: Yes
- **Type**: String (base64)
- **Description**: Secret for admin JWT tokens
- **Security**: Generate unique value for each environment

##### TRANSFER_TOKEN_SALT
- **Required**: Yes
- **Type**: String (base64)
- **Description**: Salt for transfer token generation
- **Security**: Generate unique value for each environment

##### JWT_SECRET
- **Required**: Yes
- **Type**: String (base64)
- **Description**: Secret for JWT token generation
- **Security**: Generate unique value for each environment

##### ENCRYPTION_KEY
- **Required**: Yes
- **Type**: String (base64)
- **Description**: Key for data encryption
- **Security**: Generate unique value for each environment

#### Email Configuration

##### SMTP_HOST
- **Required**: Yes (for email functionality)
- **Type**: String (hostname)
- **Description**: SMTP server hostname
- **Examples**: 
  - SendGrid: `smtp.sendgrid.net`
  - Gmail: `smtp.gmail.com`
  - Mailgun: `smtp.mailgun.org`

##### SMTP_PORT
- **Required**: Yes (for email functionality)
- **Type**: Number
- **Description**: SMTP server port
- **Common Values**:
  - `587` - TLS (recommended)
  - `465` - SSL
  - `25` - Unencrypted (not recommended)

##### SMTP_USERNAME
- **Required**: Yes (for email functionality)
- **Type**: String
- **Description**: SMTP authentication username
- **SendGrid**: Use `apikey` as username
- **Gmail**: Your email address

##### SMTP_PASSWORD
- **Required**: Yes (for email functionality)
- **Type**: String
- **Description**: SMTP authentication password
- **SendGrid**: Your API key
- **Gmail**: App password (not regular password)
- **Security**: Keep secure, never commit to Git

##### SMTP_SECURE
- **Required**: No
- **Type**: Boolean
- **Description**: Use SSL/TLS for SMTP
- **Default**: `false`
- **Notes**: Set to `true` for port 465, `false` for port 587

##### SMTP_DEFAULT_FROM
- **Required**: Yes (for email functionality)
- **Type**: String (email address)
- **Description**: Default sender email address
- **Example**: `noreply@bureauofwonders.com`
- **Notes**: Must be verified with your email provider

##### SMTP_DEFAULT_REPLY_TO
- **Required**: No
- **Type**: String (email address)
- **Description**: Default reply-to email address
- **Example**: `info@bureauofwonders.com`

##### CONTACT_FORM_RECIPIENT
- **Required**: Yes (for contact form)
- **Type**: String (email address)
- **Description**: Email address to receive contact form submissions
- **Example**: `contact@bureauofwonders.com`

#### Optional Configuration

##### FRONTEND_URL
- **Required**: No (recommended for CORS)
- **Type**: String (URL)
- **Description**: Frontend application URL
- **Example**: `https://bureauofwonders.com`
- **Notes**: Used for CORS configuration

---

## Security Best Practices

### Development
- Use weak secrets for local development
- Use test email services (Mailtrap, Mailhog)
- Keep `.env` in `.gitignore`

### Production
- Generate strong, unique secrets for each environment
- Use production email service (SendGrid, Mailgun)
- Store secrets in platform environment variables (Vercel, Railway, Render)
- Never commit production secrets to Git
- Rotate secrets regularly
- Use read-only API tokens where possible
- Enable SSL for database connections
- Restrict CORS to your domain only

---

## Troubleshooting

### Frontend Issues

**"Failed to fetch data from Strapi"**
- Check `NEXT_PUBLIC_STRAPI_URL` is correct
- Verify Strapi is running and accessible
- Check CORS settings in Strapi

**"Invalid API token"**
- Verify `STRAPI_API_TOKEN` is correct
- Check token hasn't expired
- Ensure token has correct permissions

### Backend Issues

**"Database connection failed"**
- Verify database credentials
- Check database is running
- Verify network connectivity
- Check SSL settings match database requirements

**"Email not sending"**
- Verify SMTP credentials
- Check SMTP port is not blocked
- Test with email provider's test tool
- Check email provider logs

**"Invalid secrets"**
- Regenerate all secrets
- Ensure secrets are base64 encoded
- Check for whitespace in secret values

---

## Quick Reference

### Generate Secrets
```bash
node scripts/generate-secrets.js
```

### Check Environment Variables

**Frontend (Next.js):**
```bash
cd bureau-wonders
npm run build  # Will fail if required vars are missing
```

**Backend (Strapi):**
```bash
cd bureau-wonders-cms
npm run build  # Will fail if required vars are missing
```

---

## Platform-Specific Notes

### Vercel
- Set environment variables in Project Settings → Environment Variables
- Variables are encrypted at rest
- Can set different values for Production, Preview, Development
- `NEXT_PUBLIC_*` variables are exposed to browser

### Railway
- Set environment variables in service settings
- Variables are encrypted
- Supports variable references: `${{Postgres.DATABASE_URL}}`
- Auto-generates `DATABASE_URL` for PostgreSQL service

### Render
- Set environment variables in service settings
- Variables are encrypted
- Can use "Generate Value" for secrets
- Auto-generates database connection strings

---

## Support

For issues with environment variables:
1. Check this reference document
2. Review deployment documentation
3. Check platform-specific documentation
4. Verify all required variables are set
5. Check for typos in variable names
6. Ensure values are properly formatted
