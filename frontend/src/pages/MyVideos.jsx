/*
 * MY VIDEOS PAGE
 * Shows videos uploaded by current user
 * Allows editing and deleting videos
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getChannelVideos } from '../services/dashboardService';
import { deleteVideo, togglePublishStatus } from '../services/videoService';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const MyVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await getChannelVideos();
      setVideos(response.data || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePublish = async (videoId, currentStatus) => {
    try {
      await togglePublishStatus(videoId);
      setVideos(videos.map(v => 
        v._id === videoId ? { ...v, isPublished: !currentStatus } : v
      ));
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      alert('Failed to update video status');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteVideo(videoId);
      setVideos(videos.filter(v => v._id !== videoId));
    } catch (error) {
      console.error('Failed to delete video:', error);
      alert('Failed to delete video');
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Videos</h1>
        <Link
          to="/upload"
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium"
        >
          Upload Video
        </Link>
      </div>

      {videos.length > 0 ? (
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video._id} className="bg-gray-800 rounded-lg p-4 flex gap-4">
              {/* Thumbnail */}
              <Link to={`/watch/${video._id}`} className="flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-48 h-27 object-cover rounded"
                />
              </Link>

              {/* Video info */}
              <div className="flex-1">
                <Link to={`/watch/${video._id}`}>
                  <h3 className="text-lg font-medium hover:text-blue-400 line-clamp-2">
                    {video.title}
                  </h3>
                </Link>
                
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <span>{formatViews(video.views)} views</span>
                  <span>•</span>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className={video.isPublished ? 'text-green-500' : 'text-yellow-500'}>
                    {video.isPublished ? 'Published' : 'Private'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => handleTogglePublish(video._id, video.isPublished)}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    {video.isPublished ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span>Make Private</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/edit-video/${video._id}`}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <p className="text-xl mb-4">No videos uploaded yet</p>
          <Link
            to="/upload"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium text-white"
          >
            Upload Your First Video
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyVideos;
