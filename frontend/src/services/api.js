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

// Create axios instance with default config
// baseURL: All API calls will be prefixed with backend URL
// withCredentials: Include cookies in cross-origin requests (needed for authentication)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // Important: Sends httpOnly cookies automatically with every request
  timeout: 15000,  // Increased to 15 seconds for network delays
  headers: {
    'Content-Type': 'application/json',
  },
});

/* 
 * REQUEST INTERCEPTOR
 * Runs BEFORE every API request is sent
 * Note: We don't need to manually add Authorization header because
 * httpOnly cookies are sent automatically by the browser
 */
api.interceptors.request.use(
  (config) => {
    // Browser automatically sends httpOnly cookies with withCredentials: true
    // No need to manually read or set Authorization header
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

    // Retry on timeout or network errors (up to 3 times)
    if ((error.code === 'ECONNABORTED' || error.code === 'ECONNRESET' || error.message.includes('Network Error')) && !originalRequest._retryCount) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount <= 3) {
        // Exponential backoff: wait 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest._retryCount));
        return api(originalRequest);
      }
    }

    // If error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the access token
        // Refresh token is sent automatically via httpOnly cookie
        await api.post('/users/accessrefreshtoken');

        // Retry the original request
        return api(originalRequest);
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
