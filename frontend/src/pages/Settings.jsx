/*
 * SETTINGS PAGE
 * User profile settings and password change
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  updateAccountDetails, 
  changePassword, 
  updateUserAvatar, 
  updateUserCoverImage 
} from '../services/userService';
import { Upload } from 'lucide-react';

const Settings = () => {
  const { user, updateUser } = useAuth();

  const [accountData, setAccountData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsUpdating(true);

    try {
      const response = await updateAccountDetails(accountData);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Account updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update account' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setIsUpdating(true);

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUpdating(true);
    try {
      const response = await updateUserAvatar(file);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Avatar updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update avatar' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUpdating(true);
    try {
      const response = await updateUserCoverImage(file);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Cover image updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update cover image' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Message display */}
      {message.text && (
        <div className={`mb-6 px-4 py-3 rounded ${
          message.type === 'success' 
            ? 'bg-green-500 bg-opacity-10 border border-green-500 text-green-500'
            : 'bg-red-500 bg-opacity-10 border border-red-500 text-red-500'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Images */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Images</h2>
        
        <div className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium mb-2">Avatar</label>
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Change Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium mb-2">Cover Image</label>
            <div className="space-y-3">
              {user?.coverImage && (
                <img
                  src={user.coverImage}
                  alt="Cover"
                  className="w-full h-32 object-cover rounded"
                />
              )}
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Change Cover Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>
        
        <form onSubmit={handleAccountUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={user?.username || ''}
              disabled
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Username cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={accountData.fullname}
              onChange={(e) => setAccountData({ ...accountData, fullname: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={accountData.email}
              onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Update Account'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
