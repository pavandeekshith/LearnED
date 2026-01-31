import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const BOARDS = ['ICSE', 'CBSE', 'IB'];
const GRADE_LEVELS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const GradePricingManager = () => {
  const { user, logout } = useAuth();
  const { adminData, refreshData } = useAdmin();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [boardFilter, setBoardFilter] = useState('');

  const [formData, setFormData] = useState({
    grade_level: '',
    board: '',
    subject: 'All',
    fee_per_month: '',
    duration_per_month: '',
    fee_per_hour: ''
  });

  // Use cached pricing data from AdminContext (instant loading!)
  const pricingData = useMemo(() => adminData.pricingRates || [], [adminData.pricingRates]);
  const loading = pricingData.length === 0;

  const filteredPricingData = pricingData.filter(item => {
    const matchesGrade = !gradeFilter || item.grade_level.toString() === gradeFilter;
    const matchesBoard = !boardFilter || item.board === boardFilter;
    return matchesGrade && matchesBoard;
  });

  const handleEdit = (pricing) => {
    setEditing(pricing.id);
    setFormData({
      grade_level: pricing.grade_level.toString(),
      board: pricing.board,
      subject: pricing.subject,
      fee_per_month: pricing.fee_per_month,
      duration_per_month: pricing.duration_per_month,
      fee_per_hour: pricing.fee_per_hour
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setShowAddForm(false);
    setFormData({
      grade_level: '',
      board: '',
      subject: 'All',
      fee_per_month: '',
      duration_per_month: '',
      fee_per_hour: ''
    });
  };

  const handleSave = async () => {
    try {
      setError('');
      
      // Validation
      if (!formData.grade_level || !formData.board || !formData.fee_per_month || !formData.duration_per_month) {
        setError('Please fill in all required fields');
        return;
      }

      if (editing) {
        // Update existing
        const { error } = await supabase
          .from('grade_subject_pricing')
          .update({
            fee_per_month: parseFloat(formData.fee_per_month),
            duration_per_month: parseInt(formData.duration_per_month),
            fee_per_hour: parseFloat(formData.fee_per_hour),
            updated_at: new Date().toISOString()
          })
          .eq('id', editing);

        if (error) throw error;
        setSuccessMessage('Pricing updated successfully');
      } else {
        // Add new
        console.log('Adding new pricing entry:', formData);
        const { data, error } = await supabase
          .from('grade_subject_pricing')
          .insert({
            grade_level: parseInt(formData.grade_level),
            board: formData.board,
            subject: formData.subject,
            fee_per_month: parseFloat(formData.fee_per_month),
            duration_per_month: parseInt(formData.duration_per_month),
            fee_per_hour: parseFloat(formData.fee_per_hour),
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        console.log('New pricing entry created:', data);
        setSuccessMessage('Pricing added successfully');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
      handleCancel();
      await refreshData('pricing'); // Refresh cached pricing data
    } catch (error) {
      console.error('Error saving pricing:', error);
      setError(error.message || 'Failed to save pricing');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing entry?')) return;

    try {
      setError('');
      const { error } = await supabase
        .from('grade_subject_pricing')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Pricing deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      await refreshData('pricing'); // Refresh cached pricing data
    } catch (error) {
      console.error('Error deleting pricing:', error);
      setError('Failed to delete pricing entry');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Grade & Subject Pricing</h1>
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

          {/* Navigation Tabs */}
          <nav className="mt-6">
            <div className="flex space-x-8">
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm"
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
                className="border-b-2 border-blue-500 text-blue-600 px-3 py-2 font-medium text-sm"
              >
                Grade Pricing
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Add New Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Add New Pricing Entry
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Grade</label>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Grades</option>
                {GRADE_LEVELS.map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Board</label>
              <select
                value={boardFilter}
                onChange={(e) => setBoardFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Boards</option>
                {BOARDS.map(board => (
                  <option key={board} value={board}>{board}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(editing || showAddForm) && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editing ? 'Edit Pricing' : 'Add New Pricing Entry'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level *
                </label>
                <select
                  name="grade_level"
                  value={formData.grade_level}
                  onChange={handleInputChange}
                  disabled={!!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select Grade</option>
                  {GRADE_LEVELS.map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board *
                </label>
                <select
                  name="board"
                  value={formData.board}
                  onChange={handleInputChange}
                  disabled={!!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select Board</option>
                  {BOARDS.map(board => (
                    <option key={board} value={board}>{board}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., All"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee Per Month (₹) *
                </label>
                <input
                  type="number"
                  name="fee_per_month"
                  value={formData.fee_per_month}
                  onChange={handleInputChange}
                  placeholder="e.g., 1400"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration Per Month (hours) *
                </label>
                <input
                  type="number"
                  name="duration_per_month"
                  value={formData.duration_per_month}
                  onChange={handleInputChange}
                  placeholder="e.g., 8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee Per Hour (₹)
                </label>
                <input
                  type="number"
                  name="fee_per_hour"
                  value={formData.fee_per_hour}
                  onChange={handleInputChange}
                  placeholder="e.g., 175"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculated if left empty</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Pricing Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading pricing data...</div>
          ) : filteredPricingData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No pricing entries found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Board
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee/Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration (hrs)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee/Hour
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPricingData.map((pricing) => (
                    <tr key={pricing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Grade {pricing.grade_level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {pricing.board}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {pricing.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{pricing.fee_per_month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {pricing.duration_per_month} hrs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ₹{parseFloat(pricing.fee_per_hour).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(pricing)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pricing.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How Salary is Calculated</h3>
          <p className="text-sm text-blue-800">
            Teacher salary is based on the number of students in each classroom and the pricing for that grade level:
          </p>
          <ul className="mt-2 text-sm text-blue-800 space-y-1 ml-4">
            <li>• 1st Student: 75% of grade fee</li>
            <li>• 2nd Student: 50% of grade fee</li>
            <li>• 3rd Student: 25% of grade fee</li>
            <li>• 4th Student: 10% of grade fee</li>
            <li>• 5th+ Students: 5% of grade fee each</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default GradePricingManager;
