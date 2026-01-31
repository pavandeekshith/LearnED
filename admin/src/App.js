import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminClassrooms from './pages/AdminClassrooms';
import AdminTeachers from './pages/AdminTeachers';
import AdminStudents from './pages/AdminStudents';
import PaymentApprovals from './pages/PaymentApprovals';
// import AdminTeacherSalary from './pages/AdminTeacherSalary'; // Temporarily disabled
import GradePricingManager from './pages/GradePricingManager';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/classrooms" 
                element={
                  <ProtectedRoute>
                    <AdminClassrooms />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teachers" 
                element={
                  <ProtectedRoute>
                    <AdminTeachers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/students" 
                element={
                  <ProtectedRoute>
                    <AdminStudents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment-approvals" 
                element={
                  <ProtectedRoute>
                    <PaymentApprovals />
                  </ProtectedRoute>
                } 
              />
              {/* Teacher Salary - Temporarily disabled */}
              {/* <Route 
                path="/teacher-salary" 
                element={
                  <ProtectedRoute>
                    <AdminTeacherSalary />
                  </ProtectedRoute>
                } 
              /> */}
              <Route 
                path="/grade-pricing" 
                element={
                  <ProtectedRoute>
                    <GradePricingManager />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect any unknown routes to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
