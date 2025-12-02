import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { checkSupabaseConnection } from '../utils/debug';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const { login } = useAuth();

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
      // If login is successful, the user state will update and AdminRoute will show the dashboard
      console.log('Login successful, admin dashboard will load');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid admin credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h2>
          <p className="text-gray-600">Enter your admin credentials to continue</p>
        </div>

        {/* Connection Test */}
        <div className="mb-6">
          <button
            onClick={testConnection}
            className="w-full text-sm text-blue-600 hover:text-blue-800 underline mb-2"
          >
            Test Database Connection
          </button>
          {connectionStatus && (
            <p className="text-xs text-center p-2 bg-gray-100 rounded">{connectionStatus}</p>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="admin@learned.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In to Admin Panel
              </>
            )}
          </motion.button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            🔒 This is a secure admin area. Only authorized administrators can access this panel.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
