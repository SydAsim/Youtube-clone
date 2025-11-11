/* 
 * API SERVICE LAYER - LEARNING NOTES
 * ===================================
 * 
 * This file creates a centralized API service using Axios.
 * Key concepts:
 * 
 * 1. AXIOS INSTANCE: A pre-configured axios instance with base URL and settings
 * 2. INTERCEPTORS: Middleware that runs before/after requests
 * 3. COOKIE HANDLING: Automatically include credentials (cookies) with requests
 * 
 * Why use interceptors?
 * - Add authentication tokens to every request automatically
 * - Handle errors globally (like 401 Unauthorized)
 * - Refresh expired tokens automatically
 * - Log requests/responses for debugging
 */

import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with default config
// baseURL: All API calls will be prefixed with '/api/v1'
// withCredentials: Include cookies in cross-origin requests (needed for authentication)
const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,  // Important: Sends cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

/* 
 * REQUEST INTERCEPTOR
 * Runs BEFORE every API request is sent
 * Use case: Add authorization token to headers
 */
api.interceptors.request.use(
  (config) => {
    // Get access token from cookies
    const token = Cookies.get('accessToken');
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* 
 * RESPONSE INTERCEPTOR
 * Runs AFTER every API response is received
 * Use case: Handle errors globally, refresh tokens
 */
api.interceptors.response.use(
  (response) => {
    // If response is successful, just return it
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the access token
        const refreshToken = Cookies.get('refreshToken');
        
        if (refreshToken) {
          await axios.post('/api/v1/users/accessrefreshtoken', {
            refreshToken
          }, { withCredentials: true });
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
