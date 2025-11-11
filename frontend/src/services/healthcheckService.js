/*
 * HEALTHCHECK SERVICE
 * ===================
 * 
 * Simple API to check if backend is running
 */

import api from './api';

/**
 * Check API health status
 * @returns {Promise} Health status
 */
export const healthcheck = async () => {
  const response = await api.get('/healthcheck');
  return response.data;
};
