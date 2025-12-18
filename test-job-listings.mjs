import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

async function testJobListings() {
  try {
    console.log('Testing job listings API...\n');
    
    const response = await axios.get(`${API_URL}/job-listings`);
    
    console.log(`✅ Found ${response.data.data.length} job listings:\n`);
    
    response.data.data.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   Department: ${job.department}`);
      console.log(`   Type: ${job.type}`);
      console.log(`   Location: ${job.location}`);
      console.log(`   Description length: ${job.description.length} characters`);
      console.log(`   Requirements length: ${job.requirements.length} characters`);
      console.log('');
    });
    
    // Test a specific job listing detail
    if (response.data.data.length > 0) {
      const firstJob = response.data.data[0];
      console.log('📋 Sample job description preview:');
      console.log(firstJob.description.substring(0, 200) + '...\n');
      
      console.log('📋 Sample requirements preview:');
      console.log(firstJob.requirements.substring(0, 200) + '...\n');
    }
    
  } catch (error) {
    console.error('❌ Error testing job listings:', error.message);
  }
}

testJobListings();