# Strapi Permissions Configuration

This document describes the public role permissions that have been configured for the Bureau of Wonders CMS.

## Automatic Configuration

The permissions are automatically configured when Strapi starts via the bootstrap function in `src/index.ts`. This ensures consistent permissions across all environments.

## Public Role Permissions

The following permissions are enabled for unauthenticated (public) users:

### Page Content Type
- ✅ `find` - List all pages
- ✅ `findOne` - Get a single page by ID or slug

### Blog Post Content Type
- ✅ `find` - List all blog posts
- ✅ `findOne` - Get a single blog post by ID or slug

### Case Study Content Type
- ✅ `find` - List all case studies
- ✅ `findOne` - Get a single case study by ID or slug

### Job Listing Content Type
- ✅ `find` - List all job listings
- ✅ `findOne` - Get a single job listing by ID

### Site Settings (Single Type)
- ✅ `find` - Get site settings

### Contact Inquiry Content Type
- ✅ `create` - Submit a new contact inquiry

## Restricted Permissions

The following actions are **NOT** available to public users and require authentication:

- ❌ `update` - Modify existing content
- ❌ `delete` - Delete content
- ❌ `create` - Create new content (except contact inquiries)

## Verifying Permissions

### Via Strapi Admin Panel

1. Log in to the Strapi admin panel at `http://localhost:1337/admin`
2. Navigate to **Settings** → **Users & Permissions Plugin** → **Roles**
3. Click on **Public**
4. Verify that the permissions listed above are enabled

### Via API Testing

You can test the public API endpoints without authentication:

```bash
# Get all blog posts
curl http://localhost:1337/api/blog-posts

# Get a specific blog post
curl http://localhost:1337/api/blog-posts/1

# Get all case studies
curl http://localhost:1337/api/case-studies

# Get site settings
curl http://localhost:1337/api/site-setting

# Submit a contact inquiry
curl -X POST http://localhost:1337/api/contact-inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Test User",
      "company": "Test Company",
      "email": "test@example.com",
      "message": "This is a test message"
    }
  }'
```

## Troubleshooting

### Permissions not working

If the permissions are not working as expected:

1. **Restart Strapi:** The bootstrap function runs on startup
   ```bash
   npm run develop
   ```

2. **Check logs:** Look for permission configuration messages in the console:
   ```
   ✓ Enabled public permission: page.find
   ✓ Enabled public permission: page.findOne
   ...
   Public role permissions configured successfully
   ```

3. **Manual configuration:** If automatic configuration fails, you can manually enable permissions in the admin panel

### 403 Forbidden errors

If you receive 403 errors when accessing public endpoints:

1. Verify the content is published (not in draft state)
2. Check that the permission is enabled for the public role
3. Ensure you're using the correct API endpoint format

## Security Considerations

### Rate Limiting

Consider implementing rate limiting for the contact form endpoint to prevent spam:

```typescript
// In src/api/contact-inquiry/routes/contact-inquiry.ts
{
  method: 'POST',
  path: '/contact-inquiries',
  handler: 'contact-inquiry.create',
  config: {
    policies: [],
    middlewares: ['plugin::users-permissions.rateLimit'],
  },
}
```

### Input Validation

The contact inquiry content type includes validation rules. Ensure these are properly configured in the schema.

### CORS Configuration

For production, configure CORS in `config/middlewares.ts` to only allow requests from your frontend domain.

## Next Steps

1. ✅ Public permissions configured
2. ✅ Email notifications configured
3. ⏭️ Test contact form submission
4. ⏭️ Verify email delivery
5. ⏭️ Configure production SMTP settings
