import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import FloatingDemoButton from './components/FloatingDemoButton';
import Home from './pages/Home';
import Team from './pages/Team';
import Academics from './pages/Academics';
import Contact from './pages/Contact';
import RefundPolicy from './pages/RefundPolicy';
import AdminDashboard from './pages/AdminDashboard';
import AdminClassrooms from './pages/AdminClassrooms';
import AdminTeachers from './pages/AdminTeachers';
import AdminStudents from './pages/AdminStudents';
import TeacherOnboarding from './pages/TeacherOnboarding';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isTeacherOnboarding = location.pathname === '/teacher/onboard';

  return (
    <div className="App">
      {!isAdminRoute && !isTeacherOnboarding && <Navigation />}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          {/* Public Routes - NOT wrapped in AuthProvider */}
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/teacher/onboard" element={<TeacherOnboarding />} />
          
          {/* Admin Routes - Wrapped in AuthProvider */}
          <Route 
            path="/admin/*" 
            element={
              <AuthProvider>
                <AdminProvider>
                  <Routes>
                    <Route 
                      path="dashboard" 
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      } 
                    />
                    <Route 
                      path="classrooms" 
                      element={
                        <AdminRoute>
                          <AdminClassrooms />
                        </AdminRoute>
                      } 
                    />
                    <Route 
                      path="teachers" 
                      element={
                        <AdminRoute>
                          <AdminTeachers />
                        </AdminRoute>
                      } 
                    />
                    <Route 
                      path="students" 
                      element={
                        <AdminRoute>
                          <AdminStudents />
                        </AdminRoute>
                      } 
                    />
                  </Routes>
                </AdminProvider>
              </AuthProvider>
            } 
          />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
      {!isAdminRoute && !isTeacherOnboarding && <Footer />}
      {!isAdminRoute && !isTeacherOnboarding && <FloatingDemoButton />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;