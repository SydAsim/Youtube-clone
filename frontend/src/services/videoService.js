/*
 * VIDEO SERVICE - LEARNING NOTES
 * ===============================
 * 
 * Handles all video-related operations:
 * - Fetching videos (all, by ID)
 * - Publishing/uploading videos
 * - Updating and deleting videos
 * - Toggle publish status
 * 
 * Query parameters are used for filtering and pagination
 */

import api from './api';

/**
 * Get all videos with optional filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortType - 'asc' or 'desc'
 * @param {string} params.query - Search query
 * @returns {Promise} List of videos
 */
export const getAllVideos = async (params = {}) => {
  const response = await api.get('/videos', { params });
  return response.data;
};

/**
 * Get video by ID
 * @param {string} videoId - Video ID
 * @returns {Promise} Video details
 */
export const getVideoById = async (videoId) => {
  const response = await api.get(`/videos/${videoId}`);
  return response.data;
};

/**
 * Publish/Upload a new video
 * @param {Object} videoData - Video data
 * @param {File} videoData.videoFile - Video file
 * @param {File} videoData.thumbnail - Thumbnail image
 * @param {string} videoData.title - Video title
 * @param {string} videoData.description - Video description
 * @returns {Promise} Published video data
 */
export const publishVideo = async (videoData) => {
  const formData = new FormData();
  
  formData.append('videoFile', videoData.videoFile);
  formData.append('thumbnail', videoData.thumbnail);
  formData.append('title', videoData.title);
  formData.append('description', videoData.description);
  
  const response = await api.post('/videos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Update video details
 * @param {string} videoId - Video ID
 * @param {Object} updates - Updated data
 * @param {File} updates.thumbnail - New thumbnail (optional)
 * @returns {Promise} Updated video data
 */
export const updateVideo = async (videoId, updates) => {
  const formData = new FormData();
  
  if (updates.title) formData.append('title', updates.title);
  if (updates.description) formData.append('description', updates.description);
  if (updates.thumbnail) formData.append('thumbnail', updates.thumbnail);
  
  const response = await api.patch(`/videos/${videoId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Delete a video
 * @param {string} videoId - Video ID
 * @returns {Promise} Success message
 */
export const deleteVideo = async (videoId) => {
  const response = await api.delete(`/videos/${videoId}`);
  return response.data;
};

/**
 * Toggle video publish status (public/private)
 * @param {string} videoId - Video ID
 * @returns {Promise} Updated video status
 */
export const togglePublishStatus = async (videoId) => {
  const response = await api.patch(`/videos/toggle/publish/${videoId}`);
  return response.data;
};

/**
 * Search videos by query
 * @param {string} query - Search query string
 * @param {Object} params - Additional parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Results per page (default: 20)
 * @returns {Promise} Search results with pagination
 */
export const searchVideos = async (query, params = {}) => {
  const response = await api.get('/videos/search', {
    params: { query, ...params }
  });
  return response.data;
};
