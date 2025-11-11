/*
 * LIKED VIDEOS PAGE
 * Shows videos liked by user
 */

import React, { useState, useEffect } from 'react';
import { getLikedVideos } from '../services/likeService';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  const fetchLikedVideos = async () => {
    try {
      console.log('Fetching liked videos...');
      const response = await getLikedVideos();
      console.log('Liked videos response:', response);
      
      // Backend returns array of Like objects, each with a 'video' field
      // Extract the actual video objects
      const likedVideosData = response.data || [];
      const videosList = likedVideosData.map(like => like.video).filter(video => video); // Filter out null videos
      
      console.log('Extracted videos:', videosList);
      setVideos(videosList);
    } catch (error) {
      console.error('Failed to fetch liked videos:', error);
      console.error('Error details:', error.response);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <p>No liked videos</p>
        </div>
      )}
    </div>
  );
};

export default LikedVideos;
