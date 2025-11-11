/*
 * PLAYLIST DETAIL PAGE
 * View and manage videos in a specific playlist
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getPlaylistById, 
  updatePlaylist, 
  deletePlaylist,
  removeVideoFromPlaylist 
} from '../services/playlistService';
import { Play, Trash2, Edit2, Lock, Globe, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  const fetchPlaylist = async () => {
    try {
      const response = await getPlaylistById(playlistId);
      setPlaylist(response.data);
      setEditData({
        name: response.data.name,
        description: response.data.description || '',
      });
    } catch (error) {
      console.error('Failed to fetch playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePlaylist(playlistId, editData);
      setPlaylist({ ...playlist, ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update playlist:', error);
      alert('Failed to update playlist');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this entire playlist? This cannot be undone.')) return;

    try {
      await deletePlaylist(playlistId);
      navigate('/playlists');
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      alert('Failed to delete playlist');
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (!confirm('Remove this video from playlist?')) return;

    try {
      await removeVideoFromPlaylist(videoId, playlistId);
      setPlaylist({
        ...playlist,
        videos: playlist.videos.filter(v => v._id !== videoId),
      });
    } catch (error) {
      console.error('Failed to remove video:', error);
      alert('Failed to remove video');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (!playlist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Playlist not found</p>
          <Link to="/playlists" className="text-blue-500 hover:text-blue-400">
            Back to Playlists
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?._id === playlist.owner?._id;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Playlist Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded text-2xl font-bold"
                  required
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded resize-none"
                  rows="2"
                  placeholder="Add description..."
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-700 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
                {playlist.description && (
                  <p className="text-gray-400 mb-4">{playlist.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    {playlist.isPublic ? (
                      <>
                        <Globe className="w-4 h-4" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Private
                      </>
                    )}
                  </span>
                  <span>•</span>
                  <span>{playlist.videos?.length || 0} videos</span>
                  <span>•</span>
                  <span>Updated {formatDate(playlist.updatedAt)}</span>
                </div>
              </>
            )}
          </div>

          {/* Actions - only show if owner */}
          {isOwner && !isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-700 rounded"
                title="Edit playlist"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-gray-700 text-red-500 rounded"
                title="Delete playlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Videos List */}
      {playlist.videos && playlist.videos.length > 0 ? (
        <div className="space-y-4">
          {playlist.videos.map((video, index) => {
            // Handle both ObjectId string and populated video object
            const videoId = typeof video === 'string' ? video : video._id;
            const videoData = typeof video === 'string' ? null : video;
            
            // Skip if video is just an ID (not populated)
            if (!videoData) {
              return null;
            }

            return (
              <div
                key={videoId || `video-${index}`}
                className="bg-gray-800 rounded-lg p-4 flex gap-4 hover:bg-gray-750 transition"
              >
                {/* Index */}
                <div className="flex items-center justify-center w-8 text-gray-400">
                  {index + 1}
                </div>

                {/* Thumbnail */}
                <Link to={`/watch/${videoId}`} className="flex-shrink-0">
                  <div className="relative w-40 h-24 bg-gray-700 rounded overflow-hidden group">
                    <img
                      src={videoData.thumbnail}
                      alt={videoData.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition">
                      <Play className="w-8 h-8 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    {/* Duration */}
                    <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-xs px-1 rounded">
                      {formatDuration(videoData.duration)}
                    </span>
                  </div>
                </Link>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/watch/${videoId}`}>
                    <h3 className="font-medium hover:text-blue-400 line-clamp-2">
                      {videoData.title}
                    </h3>
                  </Link>
                  <Link
                    to={`/channel/${videoData.owner?.username}`}
                    className="text-sm text-gray-400 hover:text-gray-300 mt-1 block"
                  >
                    {videoData.owner?.username}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {videoData.views || 0} views • {formatDate(videoData.createdAt)}
                  </p>
                </div>

                {/* Remove button - only show if owner */}
                {isOwner && (
                  <button
                    onClick={() => handleRemoveVideo(videoId)}
                    className="flex-shrink-0 p-2 hover:bg-gray-700 text-gray-400 hover:text-red-500 rounded"
                    title="Remove from playlist"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-gray-400 mb-4">No videos in this playlist yet</p>
          {isOwner && (
            <p className="text-sm text-gray-500">
              Add videos by clicking "Save to Playlist" on any video
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
