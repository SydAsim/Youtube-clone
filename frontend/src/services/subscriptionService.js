/*
 * SUBSCRIPTION SERVICE - LEARNING NOTES
 * ======================================
 * 
 * Manages channel subscriptions:
 * - Subscribe/unsubscribe to channels
 * - Get list of subscribed channels
 * - Get channel's subscribers
 */

import api from './api';

/**
 * Toggle subscription to a channel
 * @param {string} channelId - Channel/User ID
 * @returns {Promise} Subscription status
 */
export const toggleSubscription = async (channelId) => {
  const response = await api.post(`/subscriptions/c/${channelId}`);
  return response.data;
};

/**
 * Get all channels a user has subscribed to
 * @param {string} subscriberId - User ID
 * @returns {Promise} List of subscribed channels
 */
export const getSubscribedChannels = async (subscriberId) => {
  const response = await api.get(`/subscriptions/subscribed/${subscriberId}`);
  return response.data;
};

/**
 * Get all subscribers of a channel
 * @param {string} channelId - Channel/User ID
 * @returns {Promise} List of subscribers
 */
export const getUserChannelSubscribers = async (channelId) => {
  const response = await api.get(`/subscriptions/u/${channelId}`);
  return response.data;
};
