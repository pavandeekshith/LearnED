import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { checkSupabaseConnection } from '../utils/debug';

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const testConnection = async () => {
    setConnectionStatus('Testing connection...');
    try {
      const result = await checkSupabaseConnection();
      setConnectionStatus(result.connected 
        ? '✅ Connected to Supabase!' 
        : `❌ Connection failed: ${result.error}`);
    } catch (err) {
      setConnectionStatus(`❌ Error: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
  await login(email, password);
  // If login is successful, these lines will execute
  console.log('Login successful, navigating to /admin/dashboard');
  navigate('/admin/dashboard');
  onClose();
    } catch (err) {
      console.error('Login error:', err);
      // Show the actual error message from the auth system
      setError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="relative text-center mb-6">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-700 rounded-full p-1.5 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            Admin Login
          </h3>
          <p className="text-gray-600 text-sm mt-1">Access content management system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-black"
              placeholder="Enter admin email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock size={16} className="inline mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-black"
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
            >
              {error}
            </motion.div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm">
              🔐 <strong>Admin Access:</strong> Login to enable content editing mode and manage all website content in real-time.
            </p>
            <p className="text-red-500 text-sm mt-2">{error}</p>
            
            {/* Debug Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Connection Status:</span>
                <button
                  type="button"
                  onClick={testConnection}
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                >
                  Test Connection
                </button>
              </div>
              {connectionStatus && (
                <div className="text-xs mt-2 p-2 bg-gray-100 rounded">
                  {connectionStatus}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-800 transform hover:scale-105'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Authenticating...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Login to Admin Panel
              </>
            )}
          </button>
        </form>

      </motion.div>
    </motion.div>
  );
};

export default LoginModal;