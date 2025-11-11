/*
 * DASHBOARD SERVICE - LEARNING NOTES
 * ===================================
 * 
 * Dashboard and analytics features:
 * - Get home feed (public, no auth required)
 * - Get channel statistics
 * - Get channel videos
 */

import api from './api';

/**
 * Get home feed (all public videos)
 * No authentication required
 * @returns {Promise} List of videos for home page
 */
export const getHomeFeed = async () => {
  const response = await api.get('/dashboard/home');
  return response.data;
};

/**
 * Get channel statistics
 * Requires authentication - shows stats for current user's channel
 * @returns {Promise} Channel stats (views, subscribers, videos count)
 */
export const getChannelStats = async () => {
  const response = await api.get('/dashboard/status');
  return response.data;
};

/**
 * Get all videos of current user's channel
 * @returns {Promise} List of channel videos
 */
export const getChannelVideos = async () => {
  const response = await api.get('/dashboard/video');
  return response.data;
};
