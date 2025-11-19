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
      className={`flex items-center gap-4 px-6 py-3 hover:bg-gray-700 transition ${
        isActive(to) ? 'bg-gray-700' : ''
      }`}
    >
      <Icon className="w-6 h-6" />
      <span>{children}</span>
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
          fixed left-0 top-16 bottom-0 w-64 bg-secondary overflow-y-auto z-40
          transition-transform duration-300 ease-in-out
          sidebar-scrollbar
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="py-4">
          {/* Main navigation */}
          <div className="mb-4">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/trending" icon={TrendingUp}>Trending</NavLink>
            <NavLink to="/subscriptions" icon={Users}>Subscriptions</NavLink>
          </div>

          <hr className="border-gray-700" />

          {/* User-specific links - only show when authenticated */}
          {isAuthenticated && (
            <>
              <div className="py-4">
                <NavLink to="/history" icon={History}>Watch History</NavLink>
                <NavLink to="/liked-videos" icon={ThumbsUp}>Liked Videos</NavLink>
                <NavLink to="/playlists" icon={List}>Playlists</NavLink>
                <NavLink to="/my-videos" icon={Video}>Your Videos</NavLink>
                <NavLink to="/tweets" icon={MessageSquare}>Tweets</NavLink>
              </div>

              <hr className="border-gray-700" />
            </>
          )}

          {/* Footer info */}
          <div className="px-6 py-4 text-sm text-gray-400">
            <p>YouTube Clone Project</p>
            <p className="mt-2">© 2024 Built with React.js</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
