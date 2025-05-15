const axios = require('axios');

const testVideosAPI = async () => {
  try {
    console.log('===== Testing Videos API =====');
    
    // First login to get a token
    console.log('1. Logging in to get authentication token...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',  // Replace with an existing user
      password: 'admin123'         // Replace with correct password
    });
    
    if (!loginResponse.data.success) {
      throw new Error('Login failed: ' + loginResponse.data.message);
    }
    
    const token = loginResponse.data.token;
    console.log('Login successful! Token acquired.');
    
    // Now fetch videos using the token
    console.log('\n2. Fetching videos with authentication token...');
    const videosResponse = await axios.get('http://localhost:5000/api/videos', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('API Response Status:', videosResponse.status);
    console.log('Success:', videosResponse.data.success);
    console.log('Total videos found:', videosResponse.data.count);
    
    if (videosResponse.data.data && videosResponse.data.data.length > 0) {
      console.log('\nSample of videos found:');
      videosResponse.data.data.slice(0, 3).forEach((video, index) => {
        console.log(`\nVideo ${index + 1}:`);
        console.log(`ID: ${video._id}`);
        console.log(`Title: ${video.title}`);
        console.log(`YouTube ID: ${video.youtubeId}`);
      });
    } else {
      console.log('No videos found in the database.');
    }
    
    console.log('\n===== Test completed successfully =====');
  } catch (error) {
    console.error('ERROR during test:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error message:', error.message);
    }
  }
};

testVideosAPI();
