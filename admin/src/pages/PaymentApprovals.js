import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { supabase } from '../lib/supabaseClient';

const PaymentApprovals = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { adminData, refreshData } = useAdmin(); // Use AdminContext for cached payments
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [loadingScreenshot, setLoadingScreenshot] = useState(false);
  
  // Use cached payments from AdminContext - instant loading like Students page!
  const payments = useMemo(() => adminData.payments || [], [adminData.payments]);
  
  // Show loading only if payments are empty (first time load)
  const loading = payments.length === 0;

  // Filter payments based on status and search term
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const statusMatch = statusFilter === '' || payment.status === statusFilter;
      const searchMatch = searchTerm === '' || 
        payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.classroom_name.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [payments, statusFilter, searchTerm]);

  const handleViewDetails = async (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
    setScreenshotUrl('');
    setLoadingScreenshot(false);

    // Load screenshot if payment has a proof path
    if (payment.screenshot_url) {
      setLoadingScreenshot(true);
      try {
        // Create a signed URL that respects RLS policies
        // Path format: student_id/timestamp/filename
        const { data, error } = await supabase.storage
          .from('payment-proofs')
          .createSignedUrl(payment.screenshot_url, 3600); // URL valid for 1 hour (regenerated on each View click)

        if (error) {
          console.error('Error creating signed URL:', error);
          console.error('Screenshot path:', payment.screenshot_url);
        } else if (data?.signedUrl) {
          setScreenshotUrl(data.signedUrl);
        }
      } catch (error) {
        console.error('Exception loading screenshot:', error);
        console.error('Screenshot path attempted:', payment.screenshot_url);
      } finally {
        setLoadingScreenshot(false);
      }
    }
  };

  const handleApproveClick = (payment) => {
    setSelectedPayment(payment);
    // Calculate default expiry date (current date + selected time period)
    const today = new Date();
    const expiryDateObj = new Date(today.getFullYear(), today.getMonth() + payment.time_period_months, today.getDate());
    setExpiryDate(expiryDateObj.toISOString().split('T')[0]);
    setShowApprovalModal(true);
  };

  const handleDeclineClick = (payment) => {
    setSelectedPayment(payment);
    setDeclineReason('');
    setShowDeclineModal(true);
  };

  const handleApprovePayment = async () => {
    if (!expiryDate) {
      alert('Please select an expiry date');
      return;
    }

    try {
      // Update payment in database
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          expire_at: expiryDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPayment.id);

      if (error) {
        console.error('Error approving payment:', error);
        alert('Failed to approve payment: ' + error.message);
        return;
      }

      alert('Payment approved successfully!');
      setShowApprovalModal(false);
      setExpiryDate('');
      
      // Refresh payments from AdminContext
      refreshData('payments');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while approving the payment');
    }
  };

  const handleDeclinePayment = async () => {
    if (!declineReason.trim()) {
      alert('Please provide a reason for declining');
      return;
    }

    try {
      // Update payment in database
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'declined',
          remarks: declineReason,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPayment.id);

      if (error) {
        console.error('Error declining payment:', error);
        alert('Failed to decline payment: ' + error.message);
        return;
      }

      alert('Payment declined!');
      setShowDetailModal(false);
      setShowDeclineModal(false);
      setDeclineReason('');
      
      // Refresh payments from AdminContext
      refreshData('payments');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while declining the payment');
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'approved':
      case 'completed':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
      case 'declined':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Declined</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Payment Approvals</h1>
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
                className="border-b-2 border-blue-500 text-blue-600 px-3 py-2 font-medium text-sm"
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Student name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            {/* Summary Stats */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Summary</div>
              <div className="mt-2 text-2xl font-bold text-blue-600">
                {filteredPayments.length}
              </div>
              <div className="text-xs text-gray-600">Total Payments</div>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              statusFilter === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({payments.filter(p => p.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              statusFilter === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Approved ({payments.filter(p => p.status === 'completed').length})
          </button>
          <button
            onClick={() => setStatusFilter('declined')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              statusFilter === 'declined'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Declined ({payments.filter(p => p.status === 'declined').length})
          </button>
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              statusFilter === ''
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
        </div>

        {/* Payments Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading payment requests...</div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No payment requests found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classroom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">More Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.student_name}</div>
                          <div className="text-sm text-gray-500">{payment.student_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {payment.student_phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.classroom_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {payment.classroom_grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">₹{payment.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{payment.currency}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.time_period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(payment.uploaded_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowDetailsModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100"
                        >
                          View IDs
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.status === 'pending' ? (
                          <div className="space-x-2">
                            <button
                              onClick={() => handleViewDetails(payment)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleApproveClick(payment)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100"
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setDeclineReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Student Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Student Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600">Name</div>
                    <div className="text-sm font-medium text-gray-900">{selectedPayment.student_name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Email</div>
                    <div className="text-sm font-medium text-gray-900">{selectedPayment.student_email}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Student ID</div>
                    <div className="text-sm font-medium text-gray-900">{selectedPayment.student_id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Classroom</div>
                    <div className="text-sm font-medium text-gray-900">{selectedPayment.classroom_name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Grade</div>
                    <div className="text-sm font-medium text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {selectedPayment.classroom_grade}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600">Amount</div>
                    <div className="text-sm font-medium text-gray-900">₹{selectedPayment.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Time Period</div>
                    <div className="text-sm font-medium text-gray-900">{selectedPayment.time_period}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Payment Method</div>
                    <div className="text-sm font-medium text-gray-900">{selectedPayment.payment_method}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Transaction ID</div>
                    <div className="text-sm font-medium text-gray-900">{selectedPayment.transaction_id}</div>
                  </div>
                </div>
              </div>

              {/* Screenshot Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Screenshot</h3>
                {loadingScreenshot ? (
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <div className="animate-spin text-2xl mb-2">⟳</div>
                      <p className="text-sm">Loading screenshot...</p>
                    </div>
                  </div>
                ) : screenshotUrl ? (
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={screenshotUrl}
                      alt="Payment proof"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                    <a
                      href={screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-2 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 border-t border-gray-200"
                    >
                      View Full Size ↗
                    </a>
                  </div>
                ) : (
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <div className="text-lg font-medium mb-2">📷</div>
                      <div className="text-sm">No screenshot available</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Uploaded Date */}
              <div className="text-sm text-gray-600">
                Uploaded on: {formatDate(selectedPayment.uploaded_at)}
              </div>

              {/* Remarks */}
              {selectedPayment.remarks && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Remarks</h3>
                  <p className="text-sm text-blue-800">{selectedPayment.remarks}</p>
                </div>
              )}

              {/* Decline Reason (if declined) */}
              {selectedPayment.status === 'declined' && selectedPayment.decline_reason && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-red-900 mb-2">Decline Reason</h3>
                  <p className="text-sm text-red-800">{selectedPayment.decline_reason}</p>
                </div>
              )}

              {/* Approval Info (if approved) */}
              {selectedPayment.status === 'approved' && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-green-900 mb-2">Approval Information</h3>
                  <div className="text-sm text-green-800 space-y-1">
                    <div>Approved by: {selectedPayment.approved_by}</div>
                    <div>Approved on: {formatDate(selectedPayment.approved_at)}</div>
                    <div>Expires on: {formatDate(selectedPayment.expire_at)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {selectedPayment.status === 'pending' && (
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setDeclineReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleDeclineClick(selectedPayment);
                  }}
                  className="px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleApproveClick(selectedPayment);
                  }}
                  className="px-4 py-2 bg-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            )}

            {selectedPayment.status !== 'pending' && (
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setDeclineReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Details Modal - Show IDs */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold text-white">Payment Details IDs</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:text-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Student ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm font-mono text-gray-900 break-all">{selectedPayment.student_id}</p>
                </div>
              </div>

              {/* Classroom ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Classroom ID</label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm font-mono text-gray-900 break-all">{selectedPayment.classroom_id}</p>
                </div>
              </div>

              {/* Payment ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment ID</label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-sm font-mono text-gray-900 break-all">{selectedPayment.payment_id}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-lg">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium text-white hover:bg-purple-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold text-gray-900">Approve Payment</h2>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setExpiryDate('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Payment Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">Payment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-800">Student:</span>
                    <span className="font-medium text-blue-900">{selectedPayment.student_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Classroom:</span>
                    <span className="font-medium text-blue-900">{selectedPayment.classroom_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Amount:</span>
                    <span className="font-medium text-blue-900">₹{selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800">Time Period:</span>
                    <span className="font-medium text-blue-900">{selectedPayment.time_period}</span>
                  </div>
                </div>
              </div>

              {/* Expiry Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Set Expiry Date <span className="text-red-600">*</span>
                </label>
                
                {/* Calendar View */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                  {/* Month/Year Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                      className="p-2 hover:bg-white rounded-lg transition"
                    >
                      ◀
                    </button>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {calendarMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                      className="p-2 hover:bg-white rounded-lg transition"
                    >
                      ▶
                    </button>
                  </div>

                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const year = calendarMonth.getFullYear();
                      const month = calendarMonth.getMonth();
                      const firstDay = new Date(year, month, 1);
                      const lastDay = new Date(year, month + 1, 0);
                      const daysInMonth = lastDay.getDate();
                      const startingDayOfWeek = firstDay.getDay();
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      const days = [];

                      // Empty cells before first day
                      for (let i = 0; i < startingDayOfWeek; i++) {
                        days.push(
                          <div key={`empty-${i}`} className="text-center py-2"></div>
                        );
                      }

                      // Days of month
                      for (let day = 1; day <= daysInMonth; day++) {
                        const date = new Date(year, month, day);
                        const dateStr = date.toISOString().split('T')[0];
                        const isPast = date < today;
                        const isSelected = expiryDate === dateStr;

                        days.push(
                          <button
                            key={day}
                            onClick={() => !isPast && setExpiryDate(dateStr)}
                            disabled={isPast}
                            className={`py-2 rounded text-sm font-medium transition ${
                              isPast
                                ? 'text-gray-300 cursor-not-allowed'
                                : isSelected
                                ? 'bg-green-600 text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:bg-green-100 border border-gray-200'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      }

                      return days;
                    })()}
                  </div>
                </div>

                {/* Selected Date Display */}
                {expiryDate && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">Selected:</span> {new Date(expiryDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                )}

                <p className="mt-2 text-xs text-gray-600">
                  ℹ️ Select the date when this student's access should expire
                </p>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Note:</span> Once approved, the student will get access to the classroom for the selected time period.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setExpiryDate('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprovePayment}
                className="px-4 py-2 bg-green-600 rounded-lg text-sm font-medium text-white hover:bg-green-700"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold text-gray-900">Decline Payment</h2>
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setDeclineReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Payment Summary */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-red-900 mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-800">Student:</span>
                    <span className="font-medium text-red-900">{selectedPayment.student_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-800">Classroom:</span>
                    <span className="font-medium text-red-900">{selectedPayment.classroom_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-800">Amount:</span>
                    <span className="font-medium text-red-900">₹{selectedPayment.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Decline Reason Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Declining <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g., Screenshot is unclear, Transaction ID not visible, Amount mismatch, etc."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
                <p className="mt-2 text-xs text-gray-600">
                  Provide a clear reason so the student can resubmit with correct information
                </p>
              </div>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Note:</span> The student will be notified of the decline and can resubmit their payment.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setDeclineReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclinePayment}
                className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentApprovals;
