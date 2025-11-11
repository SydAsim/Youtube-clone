/*
 * APP.JSX - MAIN APPLICATION FILE - LEARNING NOTES
 * =================================================
 * 
 * This is the root component of our React application.
 * 
 * Key concepts demonstrated:
 * 1. REACT ROUTER: Client-side routing without page reloads
 * 2. ROUTE PROTECTION: Some routes require authentication
 * 3. NESTED ROUTES: Routes can have children
 * 4. LAYOUT: Shared layout across pages
 * 
 * React Router Components:
 * - BrowserRouter: Enables routing in the app
 * - Routes: Container for all Route components
 * - Route: Defines a path and what component to render
 * - Navigate: Redirects to another route
 * 
 * Route structure:
 * / -> Home page
 * /login -> Login page
 * /register -> Register page
 * /watch/:videoId -> Watch video page (dynamic route)
 * /channel/:username -> Channel page (dynamic route)
 * /upload -> Upload video (protected)
 * /settings -> Settings (protected)
 * etc.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';

// Layout
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Watch from './pages/Watch';
import Channel from './pages/Channel';
import UploadVideo from './pages/UploadVideo';
import History from './pages/History';
import LikedVideos from './pages/LikedVideos';
import Subscriptions from './pages/Subscriptions';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import Tweets from './pages/Tweets';
import Settings from './pages/Settings';
import MyVideos from './pages/MyVideos';

function App() {
  return (
    // AuthProvider wraps entire app to provide auth context
    <AuthProvider>
      {/* SidebarProvider manages sidebar open/close state */}
      <SidebarProvider>
        {/* BrowserRouter enables client-side routing */}
        <BrowserRouter>
          <Routes>
          {/* Public routes - No authentication required */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes with Layout (Navbar + Sidebar) */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/search" element={<Layout><Search /></Layout>} />
          <Route path="/watch/:videoId" element={<Layout><Watch /></Layout>} />
          <Route path="/channel/:username" element={<Layout><Channel /></Layout>} />

          {/* Protected routes - Authentication required */}
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <Layout><UploadVideo /></Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <Layout><History /></Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/liked-videos" 
            element={
              <ProtectedRoute>
                <Layout><LikedVideos /></Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/subscriptions" 
            element={
              <ProtectedRoute>
                <Layout><Subscriptions /></Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/playlists" 
            element={
              <ProtectedRoute>
                <Layout><Playlists /></Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/playlist/:playlistId" 
            element={
              <ProtectedRoute>
                <Layout><PlaylistDetail /></Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/tweets" 
            element={
              <ProtectedRoute>
                <Layout><Tweets /></Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/my-videos" 
            element={
              <ProtectedRoute>
                <Layout><MyVideos /></Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Layout><Settings /></Layout>
              </ProtectedRoute>
            } 
          />

          {/* 404 - Catch all undefined routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
