/*
 * PROTECTED ROUTE COMPONENT - LEARNING NOTES
 * ===========================================
 * 
 * Concept: Route Guards
 * Prevents unauthorized access to protected pages
 * 
 * How it works:
 * 1. Check if user is authenticated
 * 2. If yes: render the child components
 * 3. If no: redirect to login page
 * 
 * Usage:
 * <ProtectedRoute>
 *   <MyProtectedComponent />
 * </ProtectedRoute>
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  // If not authenticated, redirect to login
  // The Navigate component from react-router-dom handles redirection
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
