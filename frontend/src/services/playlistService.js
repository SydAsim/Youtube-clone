/*
 * PLAYLIST SERVICE - LEARNING NOTES
 * ==================================
 * 
 * Manages playlists:
 * - Create, update, delete playlists
 * - Add/remove videos from playlists
 * - Get playlist details
 */

import api from './api';

/**
 * Create a new playlist
 * @param {Object} playlistData - Playlist details
 * @returns {Promise} Created playlist
 */
export const createPlaylist = async (playlistData) => {
  const response = await api.post('/playlist', playlistData);
  return response.data;
};

/**
 * Get playlist by ID
 * @param {string} playlistId - Playlist ID
 * @returns {Promise} Playlist details with videos
 */
export const getPlaylistById = async (playlistId) => {
  const response = await api.get(`/playlist/${playlistId}`);
  return response.data;
};

/**
 * Get all playlists of a user
 * @param {string} userId - User ID
 * @returns {Promise} List of playlists
 */
export const getUserPlaylists = async (userId) => {
  const response = await api.get(`/playlist/user/${userId}`);
  return response.data;
};

/**
 * Update playlist details
 * @param {string} playlistId - Playlist ID
 * @param {Object} updates - Updated data
 * @returns {Promise} Updated playlist
 */
export const updatePlaylist = async (playlistId, updates) => {
  const response = await api.patch(`/playlist/${playlistId}`, updates);
  return response.data;
};

/**
 * Delete a playlist
 * @param {string} playlistId - Playlist ID
 * @returns {Promise} Success message
 */
export const deletePlaylist = async (playlistId) => {
  const response = await api.delete(`/playlist/${playlistId}`);
  return response.data;
};

/**
 * Add video to playlist
 * @param {string} videoId - Video ID
 * @param {string} playlistId - Playlist ID
 * @returns {Promise} Updated playlist
 */
export const addVideoToPlaylist = async (videoId, playlistId) => {
  const response = await api.patch(`/playlist/add/${videoId}/${playlistId}`);
  return response.data;
};

/**
 * Remove video from playlist
 * @param {string} videoId - Video ID
 * @param {string} playlistId - Playlist ID
 * @returns {Promise} Updated playlist
 */
export const removeVideoFromPlaylist = async (videoId, playlistId) => {
  const response = await api.patch(`/playlist/remove/${videoId}/${playlistId}`);
  return response.data;
};
