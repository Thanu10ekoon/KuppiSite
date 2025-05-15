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
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Import axios
import axios from 'axios';
