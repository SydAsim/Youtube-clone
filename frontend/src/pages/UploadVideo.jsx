/*
 * UPLOAD VIDEO PAGE - LEARNING NOTES
 * ===================================
 * 
 * Concepts demonstrated:
 * 1. FILE UPLOAD: Handling large video files
 * 2. PROGRESS TRACKING: Show upload progress
 * 3. FORM VALIDATION: Ensure required fields
 * 4. PROTECTED ROUTE: Only authenticated users can access
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publishVideo } from '../services/videoService';
import { Upload, Video as VideoIcon } from 'lucide-react';

const UploadVideo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    videoFile: null,
    thumbnail: null,
    title: '',
    description: '',
  });

  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    if (file) {
      setFormData({
        ...formData,
        [fieldName]: file,
      });

      // Create preview
      const url = URL.createObjectURL(file);
      if (fieldName === 'videoFile') {
        setVideoPreview(url);
      } else {
        setThumbnailPreview(url);
      }
    }
  };

  const validateForm = () => {
    if (!formData.videoFile) return 'Please select a video file';
    if (!formData.thumbnail) return 'Please select a thumbnail image';
    if (!formData.title.trim()) return 'Please enter a title';
    if (!formData.description.trim()) return 'Please enter a description';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Debug logging
    console.log('Starting video upload...');
    console.log('Video file:', formData.videoFile);
    console.log('Thumbnail:', formData.thumbnail);
    console.log('Title:', formData.title);
    console.log('Description:', formData.description);

    try {
      // Simulate upload progress (in real app, use axios onUploadProgress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      console.log('Calling publishVideo API...');
      const response = await publishVideo(formData);
      console.log('Upload response:', response);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      alert('Video uploaded successfully!');
      navigate('/my-videos');
    } catch (err) {
      console.error('Upload failed:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || 'Upload failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Upload Video</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Video file upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Video File *
          </label>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8">
            {videoPreview ? (
              <div className="space-y-4">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-64 rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setVideoPreview('');
                    setFormData({ ...formData, videoFile: null });
                  }}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Remove video
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <VideoIcon className="w-16 h-16 text-gray-400 mb-4" />
                <span className="text-lg font-medium mb-2">
                  Select video to upload
                </span>
                <span className="text-sm text-gray-400">
                  MP4, AVI, MOV or other video formats
                </span>
                <input
                  type="file"
                  name="videoFile"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>
        </div>

        {/* Thumbnail upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Thumbnail *
          </label>
          <div className="flex items-center gap-4">
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-40 h-24 object-cover rounded"
              />
            )}
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer">
              <Upload className="w-5 h-5" />
              <span>Choose Thumbnail</span>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter video title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Tell viewers about your video"
            required
          />
        </div>

        {/* Upload progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-3 border border-gray-700 hover:bg-gray-700 rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVideo;
