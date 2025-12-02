import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClassroomList from '../components/ClassroomList';

const AdminClassrooms = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [boardFilter, setBoardFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Classroom Management</h1>
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
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/admin/classrooms')}
                className="border-b-2 border-blue-500 text-blue-600 px-3 py-2 font-medium text-sm"
              >
                Classrooms
              </button>
              <button
                onClick={() => navigate('/admin/teachers')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Teachers
              </button>
              <button
                onClick={() => navigate('/admin/students')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
              >
                Students
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Manage Classrooms</h2>
              <div className="flex gap-4 mb-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  Add New Classroom
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                  Delete Selected
                </button>
              </div>
              
              {/* Filters */}
              <div className="flex gap-4 mb-4">
                <select
                  value={boardFilter}
                  onChange={(e) => setBoardFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All Boards</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="IGCSE">IGCSE</option>
                </select>
                
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All Grades</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                </select>
              </div>
            </div>

            {/* Classroom List Component */}
            <ClassroomList boardFilter={boardFilter} gradeFilter={gradeFilter} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminClassrooms;
