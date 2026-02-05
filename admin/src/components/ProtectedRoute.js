import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import LoginModal from './LoginModal';

const ProtectedRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { loadAdminData, dataLoading, dataLoaded } = useAdmin();
  const hasLoadedData = useRef(false);

  useEffect(() => {
    // Only load admin data once when user is available
    if (user && !hasLoadedData.current && !dataLoaded) {
      hasLoadedData.current = true;
      loadAdminData().catch(err => {
        console.error('Failed to load admin data:', err);
      });
    }
    
    // Reset when user logs out
    if (!user) {
      hasLoadedData.current = false;
    }
  }, [user, loadAdminData, dataLoaded]);

  // Show a loading spinner while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If auth is done and there's no user, show login
  if (!user) {
    return <LoginModal />;
  }

  // If user is logged in but admin data is still loading, show a different spinner
  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Data...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and data is loaded, render the page
  return children;
};

export default ProtectedRoute;
