/*
 * SAVE TO PLAYLIST BUTTON
 * Allows users to add/remove videos from their playlists
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPlaylists, addVideoToPlaylist, removeVideoFromPlaylist } from '../services/playlistService';
import { ListPlus, Check } from 'lucide-react';

const SaveToPlaylistButton = ({ videoId }) => {
  const { user, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [videoInPlaylists, setVideoInPlaylists] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showModal && user?._id) {
      fetchPlaylists();
    }
  }, [showModal, user]);

  const fetchPlaylists = async () => {
    try {
      const response = await getUserPlaylists(user._id);
      const playlistsData = response.data || [];
      setPlaylists(playlistsData);

      // Check which playlists contain this video
      const inPlaylists = new Set();
      playlistsData.forEach(playlist => {
        if (playlist.videos?.some(v => v._id === videoId || v === videoId)) {
          inPlaylists.add(playlist._id);
        }
      });
      setVideoInPlaylists(inPlaylists);
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    }
  };

  const handleTogglePlaylist = async (playlistId) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const isInPlaylist = videoInPlaylists.has(playlistId);

      if (isInPlaylist) {
        // Remove from playlist
        await removeVideoFromPlaylist(videoId, playlistId);
        setVideoInPlaylists(prev => {
          const newSet = new Set(prev);
          newSet.delete(playlistId);
          return newSet;
        });
      } else {
        // Add to playlist
        await addVideoToPlaylist(videoId, playlistId);
        setVideoInPlaylists(prev => new Set(prev).add(playlistId));
      }
    } catch (error) {
      console.error('Failed to toggle playlist:', error);
      alert('Failed to update playlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      alert('Please login to save videos to playlists');
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
      >
        <ListPlus className="w-5 h-5" />
        <span className="hidden sm:inline">Save</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Save to Playlist</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {playlists.length > 0 ? (
              <div className="space-y-2">
                {playlists.map((playlist) => {
                  const isInPlaylist = videoInPlaylists.has(playlist._id);
                  return (
                    <button
                      key={playlist._id}
                      onClick={() => handleTogglePlaylist(playlist._id)}
                      disabled={isLoading}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg transition
                        ${isInPlaylist 
                          ? 'bg-blue-500 bg-opacity-20 border border-blue-500' 
                          : 'bg-gray-700 hover:bg-gray-600'
                        }
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <div className={`
                        w-5 h-5 rounded flex items-center justify-center border-2
                        ${isInPlaylist ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}
                      `}>
                        {isInPlaylist && <Check className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{playlist.name}</p>
                        <p className="text-sm text-gray-400">
                          {playlist.videos?.length || 0} videos
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No playlists yet</p>
                <a
                  href="/playlists"
                  className="text-blue-500 hover:text-blue-400"
                  onClick={() => setShowModal(false)}
                >
                  Create your first playlist
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SaveToPlaylistButton;
