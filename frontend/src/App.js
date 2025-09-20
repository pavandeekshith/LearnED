import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="App">
            <Navigation />
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/team" element={<Team />} />
                <Route path="/academics" element={<Academics />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                
                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.main>
            <Footer />
            <FloatingDemoButton />
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;