/*
 * PLAYLISTS PAGE
 * Manage and view user playlists
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserPlaylists, createPlaylist, deletePlaylist } from '../services/playlistService';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Lock, Globe } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (user?._id) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      const response = await getUserPlaylists(user._id);
      setPlaylists(response.data || []);
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    
    try {
      const response = await createPlaylist(newPlaylist);
      setPlaylists([...playlists, response.data]);
      setShowCreateModal(false);
      setNewPlaylist({ name: '', description: '' });
    } catch (error) {
      console.error('Failed to create playlist:', error);
      alert('Failed to create playlist');
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!confirm('Delete this playlist?')) return;

    try {
      await deletePlaylist(playlistId);
      setPlaylists(playlists.filter(p => p._id !== playlistId));
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Playlists</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Create Playlist</span>
        </button>
      </div>

      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="bg-gray-800 rounded-lg overflow-hidden group">
              <Link to={`/playlist/${playlist._id}`}>
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{playlist.videos?.length || 0}</p>
                    <p className="text-sm text-gray-300">videos</p>
                  </div>
                </div>
              </Link>
              
              <div className="p-4">
                <Link to={`/playlist/${playlist._id}`}>
                  <h3 className="font-medium group-hover:text-blue-400">
                    {playlist.name}
                  </h3>
                </Link>
                {playlist.description && (
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {playlist.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    {playlist.isPublic ? (
                      <>
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Private</span>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleDeletePlaylist(playlist._id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <p>No playlists created yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-blue-500 hover:text-blue-400"
          >
            Create your first playlist
          </button>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Playlist</h2>
            
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  value={newPlaylist.name}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter playlist name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newPlaylist.description}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                  className="w-full px-4 py-2 bg-dark border border-gray-700 rounded focus:outline-none focus:border-blue-500 resize-none"
                  rows="3"
                  placeholder="Describe your playlist"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPlaylist({ name: '', description: '' });
                  }}
                  className="flex-1 py-2 border border-gray-700 hover:bg-gray-700 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlists;
