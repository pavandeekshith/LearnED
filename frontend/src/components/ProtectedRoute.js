import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useEffect } from 'react';
import AdminLogin from './AdminLogin';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { loadAdminData, dataLoading } = useAdmin();

  // Load admin data when user is authenticated as admin
  useEffect(() => {
    if (user && user.user_type === 'admin') {
      loadAdminData();
    }
  }, [user, loadAdminData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || user.user_type !== 'admin') {
    // Show admin login form instead of redirecting
    return <AdminLogin />;
  }

  // Show loading screen while initial admin data is being fetched
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-700 mb-4">Loading Admin Dashboard</div>
          <div className="text-gray-500">Fetching classrooms, teachers, and students data...</div>
          <div className="mt-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
