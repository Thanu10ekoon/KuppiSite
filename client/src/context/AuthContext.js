import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
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
        const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/me`;
        console.log('Making request to:', apiUrl);
        
        const res = await axios.get(apiUrl, {
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
  }, [token]);  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('Sending registration request to API:', `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`);
      
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`, userData);
      
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
  };  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login with email:', email);
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/login`;
      console.log('Making login request to:', apiUrl);
      
      const res = await axios.post(apiUrl, { email, password });
      
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
      setError(err.response?.data?.message || 'Invalid credentials');
      setLoading(false);
      return { success: false, error: err.response?.data?.message || 'Invalid credentials' };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/logout`);
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