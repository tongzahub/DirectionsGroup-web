# Generate Content Types in Strapi

Since we need to create the Service and Industry content types, follow these steps:

## Option 1: Use Strapi Admin UI (Recommended)

1. **Start Strapi in development mode:**
   ```bash
   cd bureau-wonders-cms
   npm run develop
   ```

2. **Login to Strapi Admin:** http://localhost:1337/admin

3. **Create Service Content Type:**
   - Go to Content-Type Builder
   - Click "Create new collection type"
   - Name: `service` (singular), `services` (plural)
   - Add fields:
     - `title` - Text (Short text, Required)
     - `slug` - UID (Attached to: title, Required)
     - `description` - Rich text (Required)
     - `icon` - Text (Short text)
     - `order` - Number (Integer, Default: 0)
     - `seoTitle` - Text (Short text, Max length: 60)
     - `metaDescription` - Text (Long text, Max length: 160)
   - Enable Draft & Publish
   - Save

4. **Create Industry Content Type:**
   - Click "Create new collection type"
   - Name: `industry` (singular), `industries` (plural)
   - Add fields:
     - `name` - Text (Short text, Required, Unique)
     - `slug` - UID (Attached to: name, Required)
     - `description` - Rich text
     - `icon` - Text (Short text)
     - `order` - Number (Integer, Default: 0)
   - Enable Draft & Publish
   - Save

5. **Set Permissions:**
   - Go to Settings → Roles → Public
   - Enable `find` and `findOne` for both Service and Industry
   - Save

6. **Run the seed script:**
   ```bash
   node seed-comprehensive.mjs
   ```

## Option 2: Use Strapi CLI Generator

If you prefer CLI, run these commands:

```bash
cd bureau-wonders-cms
npm run strapi generate
```

Then select:
1. Choose "api"
2. Enter name: "service"
3. Choose "content-type"
4. Add fields as described above

Repeat for "industry"

## After Generation

Once the content types are created, the files I created earlier will need to be removed since Strapi will generate its own:

```bash
# Remove the manually created files
rm -rf src/api/service
rm -rf src/api/industry
```

Then regenerate using Strapi CLI or Admin UI as described above.

## Verify

After creating the content types, verify they exist:
- Check `src/api/service/content-types/service/schema.json`
- Check `src/api/industry/content-types/industry/schema.json`

Then run the seed script to populate data.
