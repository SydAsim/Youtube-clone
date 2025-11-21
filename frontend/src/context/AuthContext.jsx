/*
 * AUTH CONTEXT - LEARNING NOTES
 * ==============================
 * 
 * React Context API is used for state management across the app.
 * 
 * Key concepts:
 * 1. CONTEXT: Allows sharing state without passing props down manually
 * 2. PROVIDER: Component that provides the context value to children
 * 3. CUSTOM HOOK: useAuth() hook to easily access auth context
 * 
 * Why use Context?
 * - Avoid "prop drilling" (passing props through many levels)
 * - Share global state (user, theme, language, etc.)
 * - Cleaner code and better organization
 * 
 * This context manages:
 * - User authentication state
 * - Login/Logout functions
 * - Current user data
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser as loginUserAPI, logoutUser as logoutUserAPI, getCurrentUser } from '../services/userService';
import Cookies from 'js-cookie';

// Create Context
// This creates a "container" for our authentication state
const AuthContext = createContext(null);

/**
 * Custom hook to use auth context
 * This is a convenient way to access auth state in any component
 * 
 * Usage in components:
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * AuthProvider Component
 * Wraps the entire app to provide authentication state
 * 
 * Props:
 * - children: All child components that need access to auth
 */
export const AuthProvider = ({ children }) => {
  // STATE: Store user data and loading state
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * useEffect Hook - Runs on component mount
   * Check if user is already logged in (has valid token)
   * 
   * Dependency array [] means this runs once when component mounts
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated
   * Called on app load to restore login state
   * 
   * Note: We can't read httpOnly cookies with JavaScript (security feature)
   * Instead, we try to fetch current user - if it succeeds, user is logged in
   */
  const checkAuth = async () => {
    try {
      // Try to fetch current user
      // If httpOnly cookie exists, backend will authenticate the request
      const response = await getCurrentUser();
      setUser(response.data);
      setIsAuthenticated(true);
      localStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      // If request fails (401), user is not authenticated
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('isLoggedIn');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login function
   * @param {Object} credentials - { username/email, password }
   */
  const login = async (credentials) => {
    try {
      const response = await loginUserAPI(credentials);
      
      // Backend sends tokens in cookies automatically
      // Just update the user state
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      // Store auth flag in localStorage for persistence
      localStorage.setItem('isLoggedIn', 'true');
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  /**
   * Logout function
   * Clear user state and cookies
   * 
   * Note: httpOnly cookies are cleared by the backend
   * We just need to clear local state
   */
  const logout = async () => {
    try {
      await logoutUserAPI();
      
      // Clear local state
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear localStorage
      localStorage.removeItem('isLoggedIn');
      
      // Note: httpOnly cookies are cleared by backend
      // No need to manually remove them here
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('isLoggedIn');
    }
  };

  /**
   * Update user data
   * Called after profile updates
   */
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Value object contains all data and functions to share
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    checkAuth,
  };

  // Provider makes the value available to all children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
