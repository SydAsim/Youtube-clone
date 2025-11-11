/*
 * VIDEO CARD COMPONENT - LEARNING NOTES
 * ======================================
 * 
 * Concepts demonstrated:
 * 1. PROPS: Receive data from parent component
 * 2. PROP DESTRUCTURING: Extract props in function parameters
 * 3. HELPER FUNCTIONS: Format dates and numbers for display
 * 4. REACT ROUTER LINK: Navigate without page reload
 * 
 * This component displays a video thumbnail with metadata
 */

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Format view count for display
 * Examples: 1500 -> "1.5K", 1500000 -> "1.5M"
 */
const formatViews = (views) => {
  // Handle undefined, null, or invalid values
  if (!views && views !== 0) {
    return '0';
  }
  
  const viewCount = Number(views);
  if (isNaN(viewCount)) {
    return '0';
  }
  
  if (viewCount >= 1000000) {
    return (viewCount / 1000000).toFixed(1) + 'M';
  }
  if (viewCount >= 1000) {
    return (viewCount / 1000).toFixed(1) + 'K';
  }
  return viewCount.toString();
};

/**
 * Format date for display
 * Shows relative time: "2 days ago", "3 months ago"
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

/**
 * Format video duration
 * Converts seconds to MM:SS format
 */
const formatDuration = (seconds) => {
  // Handle undefined, null, or invalid values
  if (!seconds || isNaN(seconds) || seconds <= 0) {
    return '0:00';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * VideoCard Component
 * 
 * Props:
 * - video: Video object with all data
 * - layout: 'grid' or 'list' (optional)
 */
const VideoCard = ({ video, layout = 'grid' }) => {
  const isListLayout = layout === 'list';

  return (
    <div className={`flex ${isListLayout ? 'flex-row gap-4' : 'flex-col'} group cursor-pointer`}>
      {/* Thumbnail */}
      <Link to={`/watch/${video._id}`} className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`${
            isListLayout ? 'w-64 h-36' : 'w-full aspect-video'
          } object-cover rounded-lg`}
        />
        
        {/* Duration badge - positioned absolutely over thumbnail */}
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </span>
      </Link>

      {/* Video info */}
      <div className={`flex gap-3 ${isListLayout ? 'flex-1' : 'mt-3'}`}>
        {/* Channel avatar */}
        <Link to={`/channel/${video.owner?.username}`}>
          <img
            src={video.owner?.avatar}
            alt={video.owner?.username}
            className="w-9 h-9 rounded-full object-cover"
          />
        </Link>

        {/* Title and metadata */}
        <div className="flex-1">
          <Link to={`/watch/${video._id}`}>
            <h3 className={`${
              isListLayout ? 'text-lg' : 'text-sm'
            } font-medium line-clamp-2 group-hover:text-blue-400`}>
              {video.title}
            </h3>
          </Link>

          <Link to={`/channel/${video.owner?.username}`}>
            <p className="text-sm text-gray-400 hover:text-white mt-1">
              {video.owner?.fullname}
            </p>
          </Link>

          <div className="text-sm text-gray-400 mt-1">
            <span>{formatViews(video.views)} views</span>
            <span className="mx-1">•</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>

          {/* Description for list layout */}
          {isListLayout && (
            <p className="text-sm text-gray-400 mt-2 line-clamp-2">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
