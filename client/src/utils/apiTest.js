import axios from 'axios';

// Set up default base URL for API requests
axios.defaults.baseURL = 'http://localhost:5000/api';

// Function to test registration
async function testRegistration() {
  try {
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    
    console.log('Testing registration with data:', userData);
    
    const response = await axios.post('/auth/register', userData);
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response) {
      console.error('Error data:', error.response.data);
    }
    throw error;
  }
}

// Export the test function
export { testRegistration };
