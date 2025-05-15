const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('Testing user registration...');
    
    // Generate a unique email to avoid conflicts
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    const userData = {
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123'
    };
    
    console.log(`Attempting to register user with email: ${uniqueEmail}`);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', userData);
    
    console.log('Registration response:', response.data);
    
    if (response.data.success) {
      console.log('Registration successful!');
      console.log('User token:', response.data.token);
      console.log('User data:', response.data.user);
    } else {
      console.log('Registration failed:', response.data.message);
    }
  } catch (error) {
    console.error('Error during registration test:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
};

testRegistration();
