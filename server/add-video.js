const axios = require('axios');

const addVideo = async () => {
  try {
    console.log('Adding YouTube video to database...');
    
    const videoData = {
      title: 'Astronomy video',
      description: 'A beautiful astronomy video about space and stars.',
      youtubeId: 'WyqsOAVmurw',
      category: 'Astronomy'
    };
    
    console.log('Video data:', videoData);
    
    // First, let's get an admin token by logging in
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',  // Replace with your admin email
      password: 'admin123'         // Replace with your admin password
    });
    
    if (!loginRes.data.token) {
      console.error('Failed to login as admin');
      return;
    }
    
    console.log('Admin login successful');
    
    // Use the token to add the video
    const response = await axios.post(
      'http://localhost:5000/api/videos',
      videoData,
      {
        headers: {
          Authorization: `Bearer ${loginRes.data.token}`
        }
      }
    );
    
    console.log('Video added successfully:', response.data);
  } catch (error) {
    console.error('Error adding video:');
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

addVideo();
