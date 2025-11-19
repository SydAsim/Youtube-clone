/*
 * SIDEBAR COMPONENT - LEARNING NOTES
 * ===================================
 * 
 * Concepts demonstrated:
 * 1. NAVIGATION: Links to different sections
 * 2. ACTIVE STATE: Highlight current page
 * 3. ICONS: Using lucide-react icon library
 * 4. CONDITIONAL RENDERING: Show subscriptions only when logged in
 */

import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import {
  Home,
  TrendingUp,
  Users,
  History,
  ThumbsUp,
  List,
  Video,
  MessageSquare,
} from 'lucide-react';

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const location = useLocation();

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, setIsSidebarOpen]);

  /**
   * Helper function to determine if link is active
   * Compares current path with link path
   */
  const isActive = (path) => location.pathname === path;

  /**
   * Navigation link component with active state
   */
  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`flex items-center gap-4 px-3 py-2.5 mx-3 rounded-lg hover:bg-yt-lighter transition text-sm ${
        isActive(to) ? 'bg-yt-lighter font-medium' : ''
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">{children}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile overlay - click to close sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-14 bottom-0 w-64 bg-yt-black overflow-y-auto z-40
          transition-transform duration-300 ease-in-out
          sidebar-scrollbar
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="py-3">
          {/* Main navigation */}
          <div className="mb-2">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/trending" icon={TrendingUp}>Trending</NavLink>
            <NavLink to="/subscriptions" icon={Users}>Subscriptions</NavLink>
          </div>

          <hr className="border-yt-lighter my-2" />

          {/* User-specific links */}
          {isAuthenticated && (
            <>
              <div className="py-2">
                <NavLink to="/history" icon={History}>History</NavLink>
                <NavLink to="/liked-videos" icon={ThumbsUp}>Liked videos</NavLink>
                <NavLink to="/playlists" icon={List}>Playlists</NavLink>
                <NavLink to="/my-videos" icon={Video}>Your videos</NavLink>
                <NavLink to="/tweets" icon={MessageSquare}>Tweets</NavLink>
              </div>

              <hr className="border-yt-lighter my-2" />
            </>
          )}

          {/* Footer */}
          <div className="px-3 sm:px-6 py-4 text-xs text-yt-text-secondary">
            <p className="truncate">YouTube Clone</p>
            <p className="mt-1 truncate">© 2024 Built with React</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
