/*
 * USER SERVICE - LEARNING NOTES
 * ==============================
 * 
 * This service handles all user-related API calls.
 * Each function is an async operation that returns a Promise.
 * 
 * Key concepts:
 * 1. FORMDATA: Used for file uploads (avatar, cover image)
 * 2. ASYNC/AWAIT: Modern way to handle promises
 * 3. ERROR HANDLING: Try-catch blocks for API errors
 * 4. RESPONSE DATA: axios automatically parses JSON responses
 */

import api from './api';

// ==================== AUTHENTICATION ====================

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {File} userData.avatar - Avatar image file
 * @param {File} userData.coverImage - Cover image file (optional)
 * @returns {Promise} User data and tokens
 */
export const registerUser = async (userData) => {
  // FormData is used to send files and text data together
  // It's the web API for sending multipart/form-data
  const formData = new FormData();
  
  formData.append('username', userData.username);
  formData.append('email', userData.email);
  formData.append('fullname', userData.fullname);
  formData.append('password', userData.password);
  formData.append('avatar', userData.avatar);
  
  if (userData.coverImage) {
    formData.append('coverImage', userData.coverImage);
  }
  
  const response = await api.post('/users/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 1 minute for registration with images
  });
  
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Promise} User data and tokens
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

/**
 * Logout user
 * @returns {Promise} Success message
 */
export const logoutUser = async () => {
  const response = await api.post('/users/logout');
  return response.data;
};

/**
 * Refresh access token using refresh token
 * @returns {Promise} New access token
 */
export const refreshAccessToken = async () => {
  const response = await api.post('/users/accessrefreshtoken');
  return response.data;
};

// ==================== USER PROFILE ====================

/**
 * Get current logged-in user details
 * @returns {Promise} Current user data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/users/getCurrentUser');
  return response.data;
};

/**
 * Get user channel profile by username
 * @param {string} username - Channel username
 * @returns {Promise} Channel profile data
 */
export const getUserChannelProfile = async (username) => {
  const response = await api.get(`/users/c/${username}`);
  return response.data;
};

/**
 * Get user watch history
 * @returns {Promise} Array of watched videos
 */
export const getUserWatchHistory = async () => {
  const response = await api.get('/users/history');
  return response.data;
};

// ==================== UPDATE PROFILE ====================

/**
 * Update user account details (name, email)
 * @param {Object} details - Updated account details
 * @returns {Promise} Updated user data
 */
export const updateAccountDetails = async (details) => {
  const response = await api.patch('/users/updateAccountDetails', details);
  return response.data;
};

/**
 * Change user password
 * @param {Object} passwords - Old and new passwords
 * @returns {Promise} Success message
 */
export const changePassword = async (passwords) => {
  const response = await api.post('/users/changepassword', passwords);
  return response.data;
};

/**
 * Update user avatar
 * @param {File} avatar - New avatar image
 * @returns {Promise} Updated avatar URL
 */
export const updateUserAvatar = async (avatar) => {
  const formData = new FormData();
  formData.append('avatar', avatar);
  
  const response = await api.patch('/users/updateUserAvatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 1 minute for image upload
  });
  
  return response.data;
};

/**
 * Update user cover image
 * @param {File} coverImage - New cover image
 * @returns {Promise} Updated cover URL
 */
export const updateUserCoverImage = async (coverImage) => {
  const formData = new FormData();
  formData.append('coverImage', coverImage);
  
  const response = await api.patch('/users/updateUsercoverImage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 1 minute for image upload
  });
  
  return response.data;
};
