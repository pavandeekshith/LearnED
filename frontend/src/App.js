import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminProvider } from './contexts/AdminContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import FloatingDemoButton from './components/FloatingDemoButton';
import AdminPanel from './components/AdminPanel';
import Home from './pages/Home';
import Team from './pages/Team';
import Academics from './pages/Academics';
import Contact from './pages/Contact';
import RefundPolicy from './pages/RefundPolicy';
import './App.css';

function App() {
  return (
    <AdminProvider>
      <Router>
        <div className="App">
          <Navigation />
          <AdminPanel />
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
            </Routes>
          </motion.main>
          <Footer />
          <FloatingDemoButton />
        </div>
      </Router>
    </AdminProvider>
  );
}

export default App;