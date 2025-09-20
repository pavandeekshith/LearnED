import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClassroomList from '../components/ClassroomList';

const AdminDashboard = () => {
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
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
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
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 space-y-8 bg-white">
            <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
            {/* Classroom Management */}
            <section>
              <h3 className="text-xl font-bold mb-2">Classroom Management</h3>
              <div className="flex gap-4 mb-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Classroom</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">Delete Classroom</button>
              </div>
              <ClassroomList boardFilter={boardFilter} gradeFilter={gradeFilter} />
            </section>

            {/* Teacher Management */}
            <section>
              <h3 className="text-xl font-bold mb-2">Teacher Management</h3>
              <div className="flex gap-4 mb-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded">Add Teacher</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">Delete Teacher</button>
              </div>
              {/* List teachers and assign to classrooms UI will go here */}
            </section>

            {/* Student & Teacher Viewing/Filtering */}
            <section>
              <h3 className="text-xl font-bold mb-2">View & Filter Users</h3>
              <div className="flex gap-4 mb-2">
                <button className="bg-gray-700 text-white px-4 py-2 rounded">View All Students</button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded">View All Teachers</button>
              </div>
              {/* Filtering UI for students by board, teachers by subject/board will go here */}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
