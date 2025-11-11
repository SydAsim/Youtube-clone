/*
 * SUBSCRIPTIONS PAGE
 * Shows videos from subscribed channels
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSubscribedChannels } from '../services/subscriptionService';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const Subscriptions = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    try {
      const response = await getSubscribedChannels(user._id);
      setChannels(response.data || []);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

      {channels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {channels.map((channel) => (
            <Link
              key={channel._id}
              to={`/channel/${channel.username}`}
              className="flex flex-col items-center p-4 hover:bg-gray-800 rounded-lg transition"
            >
              <img
                src={channel.avatar}
                alt={channel.username}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
              <h3 className="font-medium text-center">{channel.fullname}</h3>
              <p className="text-sm text-gray-400">@{channel.username}</p>
              <p className="text-sm text-gray-400 mt-1">
                {channel.subscribersCount || 0} subscribers
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <p>No subscriptions yet</p>
          <p className="mt-2 text-sm">Subscribe to channels to see them here</p>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
