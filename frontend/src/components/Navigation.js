import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';
import { AdminContext } from '../contexts/AdminContext';
import LoginModal from './LoginModal';
import EditableText from './EditableText';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const { isAdmin, logout } = useContext(AdminContext);

  const navItems = [
    { name: 'Home', path: '/', key: 'nav_home' },
    { name: 'Academics', path: '/academics', key: 'nav_academics' },
    { name: 'Our Team', path: '/team', key: 'nav_our_team' },
    { name: 'Contact Us', path: '/contact', key: 'nav_contact_us' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-red-600"
            >
              <EditableText
                tag="span"
                defaultText="LearnED"
                className=""
                contentKey="site_brand_name"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-red-600'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                <EditableText
                  tag="span"
                  defaultText={item.name}
                  className=""
                  contentKey={item.key}
                />
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            
            {/* Right side links */}
            <div className="flex items-center space-x-6">
              <Link
                to="/refund-policy"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === '/refund-policy'
                    ? 'text-red-600'
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                Refund Policy
              </Link>
              
              {isAdmin && (
                <div className="flex items-center space-x-3">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                    Admin Mode
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pb-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <EditableText
                  tag="span"
                  defaultText={item.name}
                  className=""
                  contentKey={item.key}
                />
              </Link>
            ))}
            
            <Link
              to="/refund-policy"
              className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                location.pathname === '/refund-policy'
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Refund Policy
            </Link>
            
            {isAdmin && (
              <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                    Admin Mode
                  </span>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </nav>
  );
};

export default Navigation;