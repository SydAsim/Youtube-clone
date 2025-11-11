/*
 * LOADING SPINNER COMPONENT - LEARNING NOTES
 * ===========================================
 * 
 * Simple reusable loading indicator
 * Used when fetching data from API
 */

import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
