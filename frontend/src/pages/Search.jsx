/*
 * SEARCH PAGE - LEARNING NOTES
 * ============================
 * 
 * This page handles video search functionality:
 * 1. GET SEARCH QUERY: Extract from URL query parameters
 * 2. FETCH RESULTS: Call search API with the query
 * 3. DISPLAY RESULTS: Show video cards in a grid
 * 4. HANDLE EMPTY: Show message when no results found
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchVideos } from '../services/videoService';
import VideoCard from '../components/VideoCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);

  /**
   * Fetch search results when query changes
   */
  useEffect(() => {
    if (query) {
      fetchSearchResults();
    } else {
      setVideos([]);
      setIsLoading(false);
    }
  }, [query]); // Re-run when query changes

  /**
   * Fetch search results from API
   */
  const fetchSearchResults = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Searching for:', query);
      
      const response = await searchVideos(query);
      console.log('Search results:', response);
      
      setVideos(response.data.videos || []);
      setPagination(response.data.pagination || null);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search videos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  // No query provided
  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <SearchIcon className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-400 mb-2">Start Searching</h2>
        <p className="text-gray-500">Enter a search term in the search bar above</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchSearchResults}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Search Results for "{query}"
        </h1>
        {pagination && (
          <p className="text-gray-400">
            Found {pagination.totalResults} result{pagination.totalResults !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Results */}
      {videos.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-xl mb-2">No videos found</p>
          <p>Try searching with different keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {/* Pagination could be added here if needed */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 text-center text-gray-400">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
      )}
    </div>
  );
};

export default Search;
