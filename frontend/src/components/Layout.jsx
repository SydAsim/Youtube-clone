/*
 * LAYOUT COMPONENT - LEARNING NOTES
 * ==================================
 * 
 * This is a wrapper component that provides:
 * - Navbar at the top
 * - Sidebar on the left
 * - Main content area with proper spacing
 * 
 * Concept: Layout Components
 * Used to avoid repeating nav/sidebar in every page
 */

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useSidebar } from '../context/SidebarContext';

const Layout = ({ children }) => {
  const { isSidebarOpen } = useSidebar();
  
  return (
    <div className="min-h-screen bg-dark">
      {/* Fixed navbar at top */}
      <Navbar />
      
      <div className="flex pt-16"> {/* pt-16 to account for fixed navbar */}
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content area - adjust margin based on sidebar state */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
