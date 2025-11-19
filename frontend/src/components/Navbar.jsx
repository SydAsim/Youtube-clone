/*
 * NAVBAR COMPONENT - LEARNING NOTES
 * ==================================
 * 
 * Concepts demonstrated:
 * 1. CONDITIONAL RENDERING: Show different UI based on auth state
 * 2. REACT ROUTER HOOKS: useNavigate for programmatic navigation
 * 3. EVENT HANDLING: onClick handlers for buttons
 * 4. STATE: useState for managing search and menu visibility
 * 
 * Component structure:
 * - Logo and branding
 * - Search bar
 * - User menu (when logged in) or Login/Register buttons
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { 
  Search, 
  Video, 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  History,
  ThumbsUp,
  List,
  ArrowLeft
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  
  // Local state for search and dropdown
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  /**
   * Handle search form submission
   * Navigate to search results page with query
   */
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent page reload
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowMobileSearch(false); // Close mobile search
      setSearchQuery(''); // Clear search
    }
  };

  /**
   * Handle logout
   * Call logout from auth context and redirect to home
   */
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-yt-black px-2 sm:px-4 h-14 flex items-center justify-between">
      {/* Left section - Logo */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-[100px] sm:min-w-[180px]">
        {/* Hamburger menu */}
        <button 
          onClick={toggleSidebar}
          className="hover:bg-yt-lighter p-2 rounded-full transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <Link to="/" className="flex items-center gap-1">
          <Video className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          <span className="text-lg sm:text-xl font-semibold tracking-tight hidden sm:inline">YouTube</span>
        </Link>
      </div>

      {/* Center section - Search (hidden on mobile) */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[600px] mx-2 sm:mx-4">
        <div className="flex items-center w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-[#121212] border border-[#303030] rounded-l-full px-4 py-2 text-sm focus:outline-none focus:border-yt-blue placeholder-yt-text-secondary"
          />
          <button
            type="submit"
            className="bg-[#222222] border border-[#303030] border-l-0 rounded-r-full px-4 sm:px-6 py-2 hover:bg-[#2a2a2a]"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Mobile search button */}
      <button
        onClick={() => setShowMobileSearch(true)}
        className="md:hidden hover:bg-yt-lighter p-2 rounded-full"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Mobile search modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-yt-black z-50 md:hidden">
          <div className="flex items-center gap-2 p-2 h-14">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="hover:bg-yt-lighter p-2 rounded-full"
              aria-label="Close search"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <form onSubmit={handleSearch} className="flex-1">
              <div className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  autoFocus
                  className="flex-1 bg-[#121212] border border-[#303030] rounded-l-full px-4 py-2 text-sm focus:outline-none focus:border-yt-blue placeholder-yt-text-secondary"
                />
                <button
                  type="submit"
                  className="bg-[#222222] border border-[#303030] border-l-0 rounded-r-full px-4 py-2 hover:bg-[#2a2a2a]"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Right section - User menu or Auth buttons */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-[60px] sm:min-w-[120px] justify-end">
        {isAuthenticated ? (
          <>
            {/* Upload video button */}
            <Link 
              to="/upload"
              className="hidden lg:flex items-center gap-2 p-2 rounded-full hover:bg-yt-lighter"
              title="Create"
            >
              <Video className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>

            {/* User menu dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-yt-lighter"
              >
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.username}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-[#282828] rounded-xl shadow-2xl py-2 border border-[#3f3f3f]">
                  <Link
                    to={`/channel/${user?.username}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Your Channel</span>
                  </Link>
                  
                  <Link
                    to="/history"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <History className="w-5 h-5" />
                    <span>Watch History</span>
                  </Link>

                  <Link
                    to="/liked-videos"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>Liked Videos</span>
                  </Link>

                  <Link
                    to="/playlists"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <List className="w-5 h-5" />
                    <span>Playlists</span>
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>

                  <hr className="my-2 border-gray-700" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 border border-yt-lighter rounded-full hover:bg-yt-blue hover:bg-opacity-10 text-yt-blue text-xs sm:text-sm font-medium"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Sign in</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
