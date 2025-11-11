/*
 * REGISTER PAGE - LEARNING NOTES
 * ===============================
 * 
 * Concepts demonstrated:
 * 1. FILE UPLOAD: Handling file inputs for images
 * 2. FORM DATA: Sending multipart/form-data
 * 3. PREVIEW: Showing image preview before upload
 * 4. VALIDATION: More complex validation rules
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/userService';
import { Video, Upload } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    password: '',
    confirmPassword: '',
    avatar: null,
    coverImage: null,
  });

  // Preview URLs for images
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle text input changes
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle file input changes
   * Creates a preview URL for the selected image
   * 
   * FileReader API is used to read the file and create a data URL
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    if (file) {
      // Update form data
      setFormData({
        ...formData,
        [fieldName]: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldName === 'avatar') {
          setAvatarPreview(reader.result);
        } else {
          setCoverPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Validate form data
   * Returns error message if validation fails
   */
  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.fullname || !formData.password) {
      return 'Please fill in all required fields';
    }

    if (formData.username.length < 3) {
      return 'Username must be at least 3 characters';
    }

    if (!formData.email.includes('@')) {
      return 'Please enter a valid email';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    if (!formData.avatar) {
      return 'Please upload an avatar image';
    }

    return null;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Register user
      await registerUser(formData);

      // Success! Redirect to login
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Video className="w-12 h-12 text-primary" />
            <span className="text-2xl font-bold">YouTube Clone</span>
          </Link>
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="mt-2 text-gray-400">Join our community</p>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="johndoe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>

            {/* Full Name */}
            <div className="md:col-span-2">
              <label htmlFor="fullname" className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Avatar Image * (Profile Picture)
            </label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Choose Avatar</span>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Cover Image (Optional)
            </label>
            <div className="flex items-center gap-4">
              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-32 h-20 rounded object-cover"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer">
                <Upload className="w-5 h-5" />
                <span>Choose Cover</span>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          {/* Link to login */}
          <p className="text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
