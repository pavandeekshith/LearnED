import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import LoginModal from './LoginModal';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { loadAdminData, dataLoading } = useAdmin();

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user, loadAdminData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginModal />;
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
