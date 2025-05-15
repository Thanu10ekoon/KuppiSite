const axios = require('axios');

const testGetVideos = async () => {
  try {
    console.log('Testing videos API with user account...');
      // First, login to get a token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test1747288616241@example.com',  // Use the email from the registration
      password: 'password123'                  // Use the password from the registration
    });
    
    if (!loginRes.data.token) {
      console.error('Failed to login as user');
      return;
    }
    
    const token = loginRes.data.token;
    console.log('User login successful, received token');
    
    // Now use the token to get videos
    const videosRes = await axios.get(
      'http://localhost:5000/api/videos',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('Videos API response:', videosRes.data);
    console.log('Total videos found:', videosRes.data.count);
    
    if (videosRes.data.data && videosRes.data.data.length > 0) {
      console.log('\nFirst video details:');
      const firstVideo = videosRes.data.data[0];
      console.log('ID:', firstVideo._id);
      console.log('Title:', firstVideo.title);
      console.log('YouTube ID:', firstVideo.youtubeId);
    }
  } catch (error) {
    console.error('Error testing videos API:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
};

// Run the test
testGetVideos();
