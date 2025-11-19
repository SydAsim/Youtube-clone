/*
 * WATCH VIDEO PAGE - LEARNING NOTES
 * ==================================
 * 
 * Concepts demonstrated:
 * 1. URL PARAMETERS: Getting videoId from URL
 * 2. VIDEO PLAYER: HTML5 video element
 * 3. LIKE/SUBSCRIBE: Toggle actions
 * 4. RELATED VIDEOS: Sidebar with suggestions
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getVideoById } from '../services/videoService';
import { getAllVideos } from '../services/videoService';
import { toggleVideoLike } from '../services/likeService';
import { toggleSubscription } from '../services/subscriptionService';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import SaveToPlaylistButton from '../components/SaveToPlaylistButton';
import { ThumbsUp, ThumbsDown, Share2, Download } from 'lucide-react';

/**
 * Format view count and date
 */
import ShareModal from '../components/ShareModal';

/**
 * Format view count and date
 */
const formatViews = (views) => {
  // Handle undefined, null, or invalid values
  if (!views && views !== 0) return '0';

  const viewCount = Number(views);
  if (isNaN(viewCount)) return '0';

  if (viewCount >= 1000000) return (viewCount / 1000000).toFixed(1) + 'M';
  if (viewCount >= 1000) return (viewCount / 1000).toFixed(1) + 'K';
  return viewCount.toString();
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDuration = (seconds) => {
  if (!seconds) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const Watch = () => {
  // Get videoId from URL parameters
  // URL: /watch/:videoId
  const { videoId } = useParams();

  const { user, isAuthenticated } = useAuth();

  // State
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (videoId) {
      // Scroll to top when video changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      fetchVideo();
      fetchRelatedVideos();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getVideoById(videoId);

      setVideo(response.data);
    } catch (error) {
      console.error('Failed to fetch video:', error);
      setError(error.response?.data?.message || 'Failed to load video');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const response = await getAllVideos({ limit: 10 });
      setRelatedVideos(response.data || []);
    } catch (error) {
      console.error('Failed to fetch related videos:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like videos');
      return;
    }

    try {
      await toggleVideoLike(videoId);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like video:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      alert('Please login to subscribe');
      return;
    }

    try {
      await toggleSubscription(video.owner._id);
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl mb-4">⚠️ Error Loading Video</p>
        <p className="text-gray-400">{error}</p>
        <button
          onClick={fetchVideo}
          className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-400 text-xl">Video not found</p>
        <p className="text-sm text-gray-500 mt-2">Video ID: {videoId}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main video section */}
        <div className="flex-1">
          {/* Video player */}
          <div className="bg-black rounded-lg overflow-hidden">
            <video
              key={videoId}
              controls
              autoPlay
              className="w-full aspect-video"
              src={video.videoFile}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{video.title}</h1>

            {/* Views and date */}
            <div className="flex items-center gap-2 text-gray-400 mt-2">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatDate(video.createdAt)}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pb-4 border-b border-gray-700">
              {/* Channel info */}
              <div className="flex items-center gap-4">
                <Link to={`/channel/${video.owner?.username}`} className="flex-shrink-0">
                  <img
                    src={video.owner?.avatar}
                    alt={video.owner?.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <Link to={`/channel/${video.owner?.username}`}>
                    <p className="font-medium hover:text-blue-400 truncate">
                      {video.owner?.fullname}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-400 truncate">
                    {video.owner?.subscribersCount || 0} subscribers
                  </p>
                </div>
                <button
                  onClick={handleSubscribe}
                  className={`px-6 py-2 rounded-full font-medium whitespace-nowrap ${isSubscribed
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>

              {/* Like, Share, Save buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors whitespace-nowrap ${isLiked ? 'bg-blue-800 text-white' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{isLiked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full whitespace-nowrap"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>

                <SaveToPlaylistButton videoId={videoId} />
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <p className={`whitespace-pre-wrap ${showFullDescription ? '' : 'line-clamp-3'}`}>
                {video.description}
              </p>
              {video.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-gray-400 hover:text-white mt-2 font-medium"
                >
                  {showFullDescription ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>

            {/* Comments */}
            <CommentSection videoId={videoId} />
          </div>
        </div>

        {/* Related videos sidebar */}
        <div className="lg:w-[400px]">
          <h3 className="font-semibold mb-4">Related Videos</h3>
          <div className="space-y-3">
            {relatedVideos.map((relatedVideo) => (
              <Link
                key={relatedVideo._id}
                to={`/watch/${relatedVideo._id}`}
                className="flex gap-2 hover:bg-gray-800 rounded p-2 group"
              >
                <div className="relative w-40 h-24 flex-shrink-0">
                  <img
                    src={relatedVideo.thumbnail}
                    alt={relatedVideo.title}
                    className="w-full h-full object-cover rounded"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {formatDuration(relatedVideo.duration)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {relatedVideo.title}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1 truncate">
                    {relatedVideo.owner?.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatViews(relatedVideo.views)} views
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        videoUrl={window.location.href}
        title={video.title}
      />
    </div>
  );
};

export default Watch;
