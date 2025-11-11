/*
 * WATCH HISTORY PAGE
 * Shows user's watch history
 */

import React, { useState, useEffect } from 'react';
import { getUserWatchHistory } from '../services/userService';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';

const History = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getUserWatchHistory();
      setVideos(response.data || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Watch History</h1>

      {videos.length > 0 ? (
        <div className="space-y-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} layout="list" />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <p>No watch history</p>
        </div>
      )}
    </div>
  );
};

export default History;
