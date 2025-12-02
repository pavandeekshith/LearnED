import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminTeachers = () => {
  const { user, logout } = useAuth();
  const { adminData } = useAdmin();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const teachers = adminData.teachers || [];

  // Filter teachers based on search and subject
  const filteredTeachers = teachers.filter(teacher => {
    const fullName = `${teacher.users?.first_name || ''} ${teacher.users?.last_name || ''}`.toLowerCase();
    const email = teacher.users?.email?.toLowerCase() || '';
    const searchMatch = searchTerm === '' || 
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());
    
    const subjectMatch = subjectFilter === '' || 
      (teacher.specializations && teacher.specializations.includes(subjectFilter));
    
    return searchMatch && subjectMatch;
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
            <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
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
                className="border-b-2 border-blue-500 text-blue-600 px-3 py-2 font-medium text-sm"
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
              <h2 className="text-2xl font-semibold mb-4">Manage Teachers</h2>
              <div className="flex gap-4 mb-4">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                  Add New Teacher
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  Assign to Classroom
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                  Remove Teacher
                </button>
              </div>
              
              {/* Search and Filters */}
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                />
                
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Languages">Languages</option>
                </select>
              </div>
            </div>

            {/* Teachers Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qualifications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
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
                  {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {teacher.users?.first_name} {teacher.users?.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {teacher.users?.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {teacher.qualifications || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {teacher.experience_years || 0} years
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {teacher.rating ? `${teacher.rating}/5` : 'No rating'} ({teacher.total_reviews || 0} reviews)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            teacher.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {teacher.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Remove</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        {teachers.length === 0 ? 'No teachers found' : 'No teachers match your search criteria'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTeachers;
