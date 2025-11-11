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
  List
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  
  // Local state for search and dropdown
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  /**
   * Handle search form submission
   * Navigate to search results page with query
   */
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent page reload
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary px-4 py-3 flex items-center justify-between">
      {/* Left section - Logo */}
      <div className="flex items-center gap-4">
        {/* Hamburger menu - visible on all screen sizes */}
        <button 
          onClick={toggleSidebar}
          className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <Link to="/" className="flex items-center gap-2">
          <Video className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold hidden sm:inline">YouTube Clone</span>
        </Link>
      </div>

      {/* Center section - Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className="flex-1 bg-dark border border-gray-700 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-gray-700 border border-l-0 border-gray-700 rounded-r-full px-6 hover:bg-gray-600"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Right section - User menu or Auth buttons */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            {/* Upload video button */}
            <Link 
              to="/upload"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 hover:bg-gray-700"
            >
              <Video className="w-5 h-5" />
              <span>Upload</span>
            </Link>

            {/* User menu dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2"
              >
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.username}
                  className="w-9 h-9 rounded-full object-cover"
                />
              </button>

              {/* Dropdown menu - Conditional rendering based on showUserMenu state */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-secondary border border-gray-700 rounded-lg shadow-lg py-2">
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
          /* Not authenticated - Show login/register buttons */
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
