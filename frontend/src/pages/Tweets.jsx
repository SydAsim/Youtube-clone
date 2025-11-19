/*
 * TWEETS PAGE - Community Posts
 * Create and manage tweets
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllTweets, createTweet, updateTweet, deleteTweet } from '../services/tweetService';
import { toggleTweetLike } from '../services/likeService';
import { MessageSquare, ThumbsUp, Edit2, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Tweets = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState('');
  const [editingTweetId, setEditingTweetId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      const response = await getAllTweets();
      setTweets(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTweet = async (e) => {
    e.preventDefault();
    if (!newTweet.trim()) return;

    try {
      await createTweet(newTweet);
      fetchTweets(); // Refresh to show new tweet in the list
      setNewTweet('');
    } catch (error) {
      console.error('Failed to create tweet:', error);
      alert('Failed to post tweet');
    }
  };

  const handleUpdateTweet = async (tweetId) => {
    try {
      await updateTweet(tweetId, editContent);
      setTweets(tweets.map(t =>
        t._id === tweetId ? { ...t, content: editContent } : t
      ));
      setEditingTweetId(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to update tweet:', error);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!confirm('Delete this tweet?')) return;

    try {
      await deleteTweet(tweetId);
      setTweets(tweets.filter(t => t._id !== tweetId));
    } catch (error) {
      console.error('Failed to delete tweet:', error);
    }
  };

  const handleLikeTweet = async (tweetId) => {
    try {
      await toggleTweetLike(tweetId);
      fetchTweets(); // Refresh to get updated like count and status
    } catch (error) {
      console.error('Failed to like tweet:', error);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Community Tweets</h1>

      {/* Create tweet form */}
      <form onSubmit={handleCreateTweet} className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex gap-3">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-dark border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none"
              rows="3"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!newTweet.trim()}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tweet
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Tweets list */}
      <div className="space-y-4">
        {tweets.length > 0 ? (
          tweets.map((tweet) => (
            <div key={tweet._id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex gap-3">
                <img
                  src={tweet.owner?.avatar}
                  alt={tweet.owner?.username}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div className="flex-1">
                  {editingTweetId === tweet._id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-dark border border-gray-700 rounded p-3 focus:outline-none focus:border-blue-500 resize-none"
                        rows="3"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateTweet(tweet._id)}
                          className="px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingTweetId(null);
                            setEditContent('');
                          }}
                          className="px-4 py-1 border border-gray-700 hover:bg-gray-700 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{tweet.owner?.fullname}</span>
                        <span className="text-sm text-gray-400">
                          @{tweet.owner?.username}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-400">
                          {new Date(tweet.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="whitespace-pre-wrap text-gray-200">
                        {tweet.content}
                      </p>

                      <div className="flex items-center gap-6 mt-4">
                        <button
                          onClick={() => handleLikeTweet(tweet._id)}
                          className={`flex items-center gap-2 hover:text-blue-500 ${tweet.isLiked ? 'text-blue-500' : 'text-gray-400'}`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${tweet.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm">{tweet.likesCount || 0}</span>
                        </button>

                        {user?._id === tweet.owner?._id && (
                          <>
                            <button
                              onClick={() => {
                                setEditingTweetId(tweet._id);
                                setEditContent(tweet.content);
                              }}
                              className="flex items-center gap-2 text-gray-400 hover:text-white"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span className="text-sm">Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteTweet(tweet._id)}
                              className="flex items-center gap-2 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-sm">Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-12">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No tweets yet</p>
            <p className="text-sm mt-2">Share your thoughts with your followers</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tweets;
