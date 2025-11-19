import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/users/forgot-password', { email });
      setMessage(response.data.message || 'Password reset link sent to your email');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yt-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-yt-text-secondary hover:text-yt-text mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to login</span>
        </Link>

        {/* Card */}
        <div className="bg-yt-dark rounded-xl p-8 border border-yt-lighter">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yt-lighter rounded-full mb-4">
              <Mail className="w-8 h-8 text-yt-blue" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Forgot Password?</h1>
            <p className="text-yt-text-secondary text-sm">
              No worries, we'll send you reset instructions
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-yt-black border border-yt-lighter rounded-lg px-4 py-3 focus:outline-none focus:border-yt-blue"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* Success message */}
            {message && (
              <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 rounded-lg p-3 text-sm">
                {message}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yt-blue hover:bg-opacity-90 text-white font-medium py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-yt-blue hover:underline">
              Remember your password? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
