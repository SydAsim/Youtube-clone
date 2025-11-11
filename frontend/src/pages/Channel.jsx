/*
 * CHANNEL PAGE - LEARNING NOTES
 * ==============================
 * 
 * Displays user channel with:
 * - Channel header (cover, avatar, subscribe button)
 * - Tabs (Videos, Tweets, Playlists, About)
 * - Content based on selected tab
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserChannelProfile } from '../services/userService';
import { getAllVideos } from '../services/videoService';
import { getUserTweets } from '../services/tweetService';
import { toggleSubscription } from '../services/subscriptionService';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Channel = () => {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (username && username !== 'undefined') {
      fetchChannelData();
    } else {
      console.error('Username is undefined or invalid:', username);
      setIsLoading(false);
    }
  }, [username]);

  const fetchChannelData = async () => {
    try {
      console.log('Fetching channel for username:', username);
      const response = await getUserChannelProfile(username);
      console.log('Channel data received:', response.data);
      setChannel(response.data);
      setIsSubscribed(response.data?.isSubscribed || false);

      // Fetch videos and tweets
      if (response.data?._id) {
        fetchVideos(response.data._id);
        fetchTweets(response.data._id);
      }
    } catch (error) {
      console.error('Failed to fetch channel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideos = async (userId) => {
    try {
      const response = await getAllVideos({ userId });
      setVideos(response.data || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const fetchTweets = async (userId) => {
    try {
      const response = await getUserTweets(userId);
      setTweets(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      alert('Please login to subscribe');
      return;
    }

    try {
      await toggleSubscription(channel._id);
      setIsSubscribed(!isSubscribed);
      
      // Update subscriber count
      setChannel({
        ...channel,
        subscribersCount: isSubscribed 
          ? channel.subscribersCount - 1 
          : channel.subscribersCount + 1
      });
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  const isOwnChannel = currentUser?._id === channel?._id;

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (!channel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Channel not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Channel header */}
      <div className="relative">
        {/* Cover image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-900 to-purple-900">
          {channel.coverImage && (
            <img
              src={channel.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Channel info */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 md:-mt-20">
            <img
              src={channel.avatar}
              alt={channel.username}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dark object-cover"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold">{channel.fullname}</h1>
              <p className="text-gray-400 mt-1">@{channel.username}</p>
              
              <div className="flex items-center gap-4 mt-2 text-gray-400">
                <span>{channel.subscriberCount || 0} subscribers</span>
                <span>•</span>
                <span>{videos.length} videos</span>
              </div>

              {!isOwnChannel && (
                <button
                  onClick={handleSubscribe}
                  className={`mt-4 px-8 py-2 rounded-full font-medium ${
                    isSubscribed
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-8 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('videos')}
              className={`pb-3 font-medium ${
                activeTab === 'videos'
                  ? 'border-b-2 border-white'
                  : 'text-gray-400'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('tweets')}
              className={`pb-3 font-medium ${
                activeTab === 'tweets'
                  ? 'border-b-2 border-white'
                  : 'text-gray-400'
              }`}
            >
              Tweets
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 font-medium ${
                activeTab === 'about'
                  ? 'border-b-2 border-white'
                  : 'text-gray-400'
              }`}
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.length > 0 ? (
              videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center py-12">
                No videos uploaded yet
              </p>
            )}
          </div>
        )}

        {activeTab === 'tweets' && (
          <div className="max-w-2xl mx-auto space-y-4">
            {tweets.length > 0 ? (
              tweets.map((tweet) => (
                <div key={tweet._id} className="bg-gray-800 rounded-lg p-6">
                  <p className="whitespace-pre-wrap">{tweet.content}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                    <span>{new Date(tweet.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-12">
                No tweets posted yet
              </p>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="text-gray-400">Email:</span> {channel.email}
                </p>
                <p>
                  <span className="text-gray-400">Username:</span> @{channel.username}
                </p>
                <p>
                  <span className="text-gray-400">Joined:</span>{' '}
                  {new Date(channel.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
