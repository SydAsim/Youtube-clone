/*
 * HOME PAGE - LEARNING NOTES
 * ===========================
 * 
 * Concepts demonstrated:
 * 1. useEffect HOOK: Fetch data when component mounts
 * 2. LOADING STATES: Show spinner while fetching
 * 3. ERROR HANDLING: Display errors gracefully
 * 4. GRID LAYOUT: Responsive video grid
 * 5. COMPONENT REUSABILITY: Using VideoCard component
 */

import React, { useState, useEffect } from 'react';
import { getHomeFeed } from '../services/dashboardService';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  // State management
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * useEffect Hook
   * 
   * Runs after component renders
   * Empty dependency array [] means it runs once on mount
   * 
   * Perfect for:
   * - Fetching data
   * - Setting up subscriptions
   * - Adding event listeners
   */
  useEffect(() => {
    fetchVideos();
  }, []); // Only run once on mount

  /**
   * Fetch videos from API
   * Async function to get home feed
   */
  const fetchVideos = async () => {
    try {
      console.log('Fetching home feed...'); // Debug log
      const response = await getHomeFeed();
      console.log('Home feed response:', response); // Debug log
      setVideos(response.data || []);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      console.error('Error details:', err.response); // More details
      setError('Failed to load videos. Please try again.');
    } finally {
      // This runs whether try succeeds or catch fails
      setIsLoading(false);
    }
  };

  // Conditional rendering based on state
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchVideos}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Recommended Videos</h1>

      {videos.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <p>No videos available</p>
        </div>
      ) : (
        // Responsive grid layout
        // grid: Enable CSS Grid
        // grid-cols-1: 1 column on mobile
        // sm:grid-cols-2: 2 columns on small screens
        // lg:grid-cols-3: 3 columns on large screens
        // xl:grid-cols-4: 4 columns on extra large screens
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
