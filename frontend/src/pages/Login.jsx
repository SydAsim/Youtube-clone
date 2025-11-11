/*
 * LOGIN PAGE - LEARNING NOTES
 * ============================
 * 
 * Concepts demonstrated:
 * 1. FORM HANDLING: Managing form state and submission
 * 2. VALIDATION: Client-side form validation
 * 3. ERROR HANDLING: Displaying API errors
 * 4. NAVIGATION: Redirect after successful login
 * 5. CONTROLLED COMPONENTS: Input values controlled by React state
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Video } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state - storing input values
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  // UI state - loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle input changes
   * Updates state when user types
   * 
   * The [e.target.name] syntax is called "computed property name"
   * It uses the input's name attribute to update the correct field
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,  // Keep all existing fields
      [e.target.name]: e.target.value,  // Update the changed field
    });
  };

  /**
   * Handle form submission
   * Validates and sends login request
   */
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    setError('');  // Clear previous errors

    // Client-side validation
    if (!formData.usernameOrEmail || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Call login function from auth context
      const result = await login({
        username: formData.usernameOrEmail,
        email: formData.usernameOrEmail,
        password: formData.password,
      });

      if (result.success) {
        // Success! Redirect to home page
        navigate('/');
      } else {
        // Show error message
        setError(result.error);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and title */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Video className="w-12 h-12 text-primary" />
            <span className="text-2xl font-bold">YouTube Clone</span>
          </Link>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Username or Email input */}
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium mb-2">
                Username or Email
              </label>
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                required
                value={formData.usernameOrEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your username or email"
              />
            </div>

            {/* Password input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Link to register page */}
          <p className="text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
