# Fix Job Listings Permissions

## Issue
The job listings API is returning 403 Forbidden error because the public permissions are not properly set.

## Manual Fix Steps

### 1. Access Strapi Admin
1. Open your browser and go to: `http://localhost:1337/admin`
2. Log in with your admin credentials

### 2. Navigate to Permissions
1. In the left sidebar, click on **Settings** (gear icon)
2. Under "Users & Permissions Plugin", click on **Roles**
3. Click on the **Public** role

### 3. Set Job Listing Permissions
1. Scroll down to find **Job-listing** in the permissions list
2. Check the following boxes:
   - ✅ **find** (allows fetching all job listings)
   - ✅ **findOne** (allows fetching individual job listings)
3. Click **Save** button at the top right

### 4. Verify Permissions
After saving, test the API endpoint:
```bash
curl http://localhost:1337/api/job-listings
```

You should see a JSON response with job listings data instead of a 403 error.

## Alternative: Restart CMS
If the permissions are still not working:
1. Stop the CMS development server
2. Restart it with `npm run develop`
3. The bootstrap function should automatically set the permissions

## Expected Result
Once permissions are fixed, the careers page should display all job listings with proper formatting:
- Job cards showing department, type, and location
- Clickable cards opening detailed modal views
- Proper markdown formatting in job descriptions
- Working filter functionality

## Troubleshooting
If you still see "$3" in the job details:
1. Clear your browser cache
2. Refresh the careers page
3. The updated `formatContent` function should now properly display headers

---

**Note**: The job listings have been successfully seeded into the database. The only issue is the API permissions for public access.