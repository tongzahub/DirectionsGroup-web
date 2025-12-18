import axios from 'axios';

const API_URL = 'http://localhost:1337/api';
const ADMIN_URL = 'http://localhost:1337/admin';

// You'll need to get this token from the admin panel
// Go to Settings > API Tokens > Create new API Token with full access
const ADMIN_TOKEN = 'your-admin-token-here';

async function fixJobListingPermissions() {
  try {
    console.log('Attempting to fix job listing permissions...\n');
    
    // First, let's check if we can access the admin API
    const response = await axios.get(`${ADMIN_URL}/users-permissions/roles`);
    console.log('Available roles:', response.data);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\n📝 Manual steps to fix permissions:');
    console.log('1. Go to http://localhost:1337/admin');
    console.log('2. Navigate to Settings > Users & Permissions Plugin > Roles');
    console.log('3. Click on "Public" role');
    console.log('4. Find "Job-listing" in the permissions list');
    console.log('5. Check the boxes for "find" and "findOne" actions');
    console.log('6. Click "Save"');
  }
}

fixJobListingPermissions();