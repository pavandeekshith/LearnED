import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminStudents = () => {
  const { user, logout } = useAuth();
  const { adminData } = useAdmin();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [boardFilter, setBoardFilter] = useState('');

  const students = adminData.students || [];

  // Filter students based on search, grade, and board
  const filteredStudents = students.filter(student => {
    const fullName = `${student.users?.first_name || ''} ${student.users?.last_name || ''}`.toLowerCase();
    const email = student.users?.email?.toLowerCase() || '';
    const searchMatch = searchTerm === '' || 
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const gradeMatch = gradeFilter === '' || 
      String(student.grade_level) === String(gradeFilter);
    
    const boardMatch = boardFilter === '' || 
      student.board === boardFilter;
    
    return searchMatch && gradeMatch && boardMatch;
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
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
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
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
                className="border-b-2 border-blue-500 text-blue-600 px-3 py-2 font-medium text-sm"
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
              <h2 className="text-2xl font-semibold mb-4">Manage Students</h2>
              <div className="flex gap-4 mb-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  Add New Student
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                  Assign to Classroom
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">
                  Export List
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                  Remove Student
                </button>
              </div>
              
              {/* Search and Filters */}
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                />
                
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
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Board
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.student_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.users?.first_name} {student.users?.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.users?.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Grade {student.grade_level || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.board || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.school_name || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                          <button className="text-yellow-600 hover:text-yellow-900 mr-3">View</button>
                          <button className="text-red-600 hover:text-red-900">Remove</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        {students.length === 0 ? 'No students found' : 'No students match your search criteria'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing 1 to 2 of 50 students
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminStudents;
