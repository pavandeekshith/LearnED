import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import RecentActivity from '../components/RecentActivity';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { adminData } = useAdmin();
  const navigate = useNavigate();

  const { stats } = adminData;

  const handleLogout = async () => {
    await logout();
    window.location.href = '/'; // Redirect to main website
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">LearnED Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
          
          {/* Admin Navigation Tabs */}
          <nav className="mt-6">
            <div className="flex space-x-8">
              <button
                onClick={() => navigate('/')}
                className="border-b-2 border-blue-500 text-blue-600 px-3 py-2 font-medium text-sm"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/classrooms')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Classrooms
              </button>
              <button
                onClick={() => navigate('/teachers')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Teachers
              </button>
              <button
                onClick={() => navigate('/students')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Students
              </button>
              <button
                onClick={() => navigate('/payment-approvals')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Payment Approvals
              </button>
              <button
                onClick={() => navigate('/grade-pricing')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Grade Pricing
              </button>
            </div>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">Overview</h2>
            
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Classrooms</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalClassrooms}
                </p>
                <p className="text-sm text-blue-600 mt-1">Active classrooms</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Total Teachers</h3>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalTeachers}
                </p>
                <p className="text-sm text-green-600 mt-1">Active teachers</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Total Students</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.totalStudents}
                </p>
                <p className="text-sm text-purple-600 mt-1">Enrolled students</p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Active Sessions</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.activeSessions}
                </p>
                <p className="text-sm text-yellow-600 mt-1">Live classes</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/classrooms')}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center"
                >
                  <div className="text-lg font-semibold">Manage</div>
                  <div className="text-sm">Classrooms</div>
                </button>
                
                <button
                  onClick={() => navigate('/teachers')}
                  className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center"
                >
                  <div className="text-lg font-semibold">Manage</div>
                  <div className="text-sm">Teachers</div>
                </button>
                
                <button
                  onClick={() => navigate('/students')}
                  className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center"
                >
                  <div className="text-lg font-semibold">Manage</div>
                  <div className="text-sm">Students</div>
                </button>
                
                <button className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-lg text-center">
                  <div className="text-lg font-semibold">View</div>
                  <div className="text-sm">Reports</div>
                </button>
              </div>
            </div>

            {/* Recent Activity - New Component */}
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
