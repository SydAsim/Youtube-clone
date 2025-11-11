/*
 * LIKE SERVICE - LEARNING NOTES
 * ==============================
 * 
 * Handles likes/dislikes for:
 * - Videos
 * - Comments
 * - Tweets
 * 
 * Toggle means: if liked -> unlike, if not liked -> like
 */

import api from './api';

/**
 * Toggle like on a video
 * @param {string} videoId - Video ID
 * @returns {Promise} Updated like status
 */
export const toggleVideoLike = async (videoId) => {
  const response = await api.post(`/likes/toggle/v/${videoId}`);
  return response.data;
};

/**
 * Toggle like on a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise} Updated like status
 */
export const toggleCommentLike = async (commentId) => {
  const response = await api.post(`/likes/toggle/c/${commentId}`);
  return response.data;
};

/**
 * Toggle like on a tweet
 * @param {string} tweetId - Tweet ID
 * @returns {Promise} Updated like status
 */
export const toggleTweetLike = async (tweetId) => {
  const response = await api.post(`/likes/toggle/t/${tweetId}`);
  return response.data;
};

/**
 * Get all videos liked by current user
 * @returns {Promise} List of liked videos
 */
export const getLikedVideos = async () => {
  const response = await api.get('/likes/videos');
  return response.data;
};
