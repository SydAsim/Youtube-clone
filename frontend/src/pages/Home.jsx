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
      const response = await getHomeFeed();
      setVideos(response.data || []);
    } catch (err) {
      setError('Failed to load videos. Please try again.');
    } finally {
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
    <div className="p-3 sm:p-4 md:p-6 max-w-[2000px] mx-auto">
      {videos.length === 0 ? (
        <div className="text-center text-yt-text-secondary py-12">
          <p>No videos available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
