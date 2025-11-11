/*
 * SIDEBAR CONTEXT - LEARNING NOTES
 * =================================
 * 
 * Purpose: Share sidebar open/closed state between Navbar and Sidebar
 * 
 * Why Context?
 * - Navbar has hamburger button to toggle sidebar
 * - Sidebar needs to know if it's open or closed
 * - Without context, we'd need to pass props through Layout
 * - Context provides direct access from any component
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const SidebarContext = createContext(null);

/**
 * SidebarProvider Component
 * Wraps the app and provides sidebar state
 */
export const SidebarProvider = ({ children }) => {
  // State: is sidebar open?
  // Default: true on desktop, false on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Check screen size on initial load
    return window.innerWidth >= 1024; // lg breakpoint
  });

  // Toggle function
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Handle window resize - only auto-close on mobile
  useEffect(() => {
    const handleResize = () => {
      // Only auto-close on mobile, don't force open on desktop
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
      // Removed: Don't auto-open on desktop - let user control it
    };

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const value = {
    isSidebarOpen,
    toggleSidebar,
    setIsSidebarOpen,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * Custom hook to use sidebar context
 * Makes it easy to access sidebar state
 */
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  
  return context;
};
