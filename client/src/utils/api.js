/**
 * API configuration utility
 * This file centralizes the API URL configuration to make it easier to manage
 */

// Import axios
import axios from 'axios';

// Base API URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  ME: `${API_BASE_URL}/auth/me`,
};

// Video endpoints
export const VIDEO_ENDPOINTS = {
  LIST: `${API_BASE_URL}/videos`,
  DETAIL: (id) => `${API_BASE_URL}/videos/${id}`,
  CREATE: `${API_BASE_URL}/videos`,
  UPDATE: (id) => `${API_BASE_URL}/videos/${id}`,
  DELETE: (id) => `${API_BASE_URL}/videos/${id}`,
};

// Helper function to set auth token in axios
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    console.log('Token set in axios headers');
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    console.log('Token removed from axios headers');
  }
};

// Custom axios instance with interceptors for error handling
export const axiosWithAuth = axios.create({
  baseURL: API_BASE_URL
});

// Add request interceptor
axiosWithAuth.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
