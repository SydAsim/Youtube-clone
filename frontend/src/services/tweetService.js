/*
 * TWEET SERVICE - LEARNING NOTES
 * ===============================
 * 
 * Handles community posts/tweets:
 * - Create tweets
 * - Get user's tweets
 * - Update and delete tweets
 */

import api from './api';

/**
 * Create a new tweet
 * @param {string} content - Tweet content
 * @returns {Promise} Created tweet
 */
export const createTweet = async (content) => {
  const response = await api.post('/tweets', { content });
  return response.data;
};

/**
 * Get all tweets of a user
 * @param {string} userId - User ID
 * @returns {Promise} List of tweets
 */
export const getUserTweets = async (userId) => {
  const response = await api.get(`/tweets/user/${userId}`);
  return response.data;
};

/**
 * Update a tweet
 * @param {string} tweetId - Tweet ID
 * @param {string} content - Updated content
 * @returns {Promise} Updated tweet
 */
export const updateTweet = async (tweetId, content) => {
  const response = await api.patch(`/tweets/${tweetId}`, { content });
  return response.data;
};

/**
 * Delete a tweet
 * @param {string} tweetId - Tweet ID
 * @returns {Promise} Success message
 */
export const deleteTweet = async (tweetId) => {
  const response = await api.delete(`/tweets/${tweetId}`);
  return response.data;
};
