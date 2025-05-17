import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AUTH_ENDPOINTS, setAuthToken } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set axios default headers
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    } else {
      setAuthToken(null);
    }
  }, [token]);

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        console.log('Verifying token by loading user data...');
        console.log('Making request to:', AUTH_ENDPOINTS.ME);
        
        const res = await axios.get(AUTH_ENDPOINTS.ME, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Token verification successful, user loaded');
        setUser(res.data.data);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setError(err.response?.data?.message || 'Authentication failed');
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Sending registration request to API:', AUTH_ENDPOINTS.REGISTER);
      
      const res = await axios.post(AUTH_ENDPOINTS.REGISTER, userData);
      
      console.log('Registration API response:', res.data);
      
      const { token: newToken, user: userInfo } = res.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userInfo);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Registration error details:', err);
      
      if (err.response) {
        console.error('Error response:', err.response.status, err.response.data);
      } else if (err.request) {
        console.error('No response received from server');
      } else {
        console.error('Error setting up request:', err.message);
      }
      
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login with email:', email);
      console.log('Making login request to:', AUTH_ENDPOINTS.LOGIN);
      
      // Add timeout to avoid hanging forever
      const res = await axios.post(AUTH_ENDPOINTS.LOGIN, { email, password }, {
        timeout: 10000 // 10 second timeout
      });
      
      console.log('Login successful');
      const { token: newToken, user: userInfo } = res.data;
      
      // Store token in localStorage
      localStorage.setItem('token', newToken);
      console.log('Token stored in localStorage');
      
      // Update state
      setToken(newToken);
      setUser(userInfo);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      console.error('Login error details:', err);
      
      let errorMessage = 'Login failed';
      
      if (err.response) {
        // The server responded with an error status
        console.error('Error status:', err.response.status);
        console.error('Error data:', err.response.data);
        
        if (err.response.status === 500) {
          errorMessage = 'Server error. Database connection issue. Please try again later.';
        } else if (err.response.status === 401) {
          errorMessage = 'Invalid credentials. Please check your email and password.';
        } else {
          errorMessage = err.response.data?.message || 'Login failed';
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received from server');
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else {
        // Something happened in setting up the request
        console.error('Error setting up request:', err.message);
        errorMessage = 'An error occurred while trying to log in.';
      }
      
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.get(AUTH_ENDPOINTS.LOGOUT);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Clear errors
  const clearErrors = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;