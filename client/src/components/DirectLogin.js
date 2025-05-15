import React, { useState } from 'react';
import axios from 'axios';

const DirectLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleLoginWithTestUser = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Fixed credentials for the test user
      const email = 'test1747288616241@example.com';
      const password = 'password123';
      
      console.log(`Attempting direct login with ${email}...`);
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Set Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setSuccess(true);
        
        // Reload the page to apply the authentication
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error('Direct login error:', err);
      if (err.response) {
        setError(`Status ${err.response.status}: ${err.response.data.message || 'Login failed'}`);
      } else {
        setError('Network error, please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-secondary text-white">
        Quick Login (For Testing)
      </div>
      <div className="card-body">
        <p className="card-text">Click below to login with the test user account.</p>
        <button 
          className="btn btn-secondary" 
          onClick={handleLoginWithTestUser}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login as Test User'}
        </button>
        
        {error && (
          <div className="alert alert-danger mt-3">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mt-3">
            Login successful! Refreshing page...
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectLogin;
