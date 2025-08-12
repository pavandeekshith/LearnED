import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import FloatingDemoButton from './components/FloatingDemoButton';
import Home from './pages/Home';
import Team from './pages/Team';
import Academics from './pages/Academics';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
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
          </Routes>
        </motion.main>
        <Footer />
        <FloatingDemoButton />
      </div>
    </Router>
  );
}
// function App() {
//   return (
//     <Router>
//       <ScrollToTop /> {/* 👈 always runs on route change */}
//       <Navigation />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/academics" element={<Academics />} />
//         <Route path="/team" element={<Team />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>
//     </Router>
//   );
// }

export default App;