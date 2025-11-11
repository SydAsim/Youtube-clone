/*
 * COMMENT SERVICE - LEARNING NOTES
 * =================================
 * 
 * Manages video comments:
 * - GET comments for a video
 * - POST new comment
 * - PATCH (update) existing comment
 * - DELETE comment
 */

import api from './api';

/**
 * Get all comments for a video
 * @param {string} videoId - Video ID
 * @param {Object} params - Query params (page, limit)
 * @returns {Promise} List of comments
 */
export const getVideoComments = async (videoId, params = {}) => {
  const response = await api.get(`/comments/${videoId}`, { params });
  return response.data;
};

/**
 * Add a comment to a video
 * @param {string} videoId - Video ID
 * @param {string} content - Comment text
 * @returns {Promise} Created comment
 */
export const addComment = async (videoId, content) => {
  const response = await api.post(`/comments/${videoId}`, { content });
  return response.data;
};

/**
 * Update a comment
 * @param {string} commentId - Comment ID
 * @param {string} content - Updated text
 * @returns {Promise} Updated comment
 */
export const updateComment = async (commentId, content) => {
  const response = await api.patch(`/comments/c/${commentId}`, { content });
  return response.data;
};

/**
 * Delete a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise} Success message
 */
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/c/${commentId}`);
  return response.data;
};
