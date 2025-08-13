import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin,
  MessageCircle,
  BookOpen,
  Users,
  GraduationCap,
  Globe,
  User
} from 'lucide-react';
import { AdminContext } from '../contexts/AdminContext';
import LoginModal from './LoginModal';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showLogin, setShowLogin] = useState(false);
  const { isAdmin } = useContext(AdminContext);

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Team', path: '/team' },
    { name: 'Academics', path: '/academics' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'CBSE Curriculum',
    'ICSE Curriculum',
    'IGCSE Curriculum'
  ];

  const globalLocations = [
    'India (All Regions)',
    'United Arab Emirates',
    'Australia',
    'Thailand',
    'Canada',
    'Brazil'
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30}}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 pt-0 md:pt-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="w-8 h-8 text-red-500" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
                LearnED
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering every student to confidently think, analyze, and learn through our innovative blend of traditional and modern teaching methods.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/learned.edtech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-700 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com/learned.classes/?igshid=MzRlODBiNWFlZA%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-700 p-2 rounded-full hover:bg-pink-600 transition-colors duration-300"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/company/crack-tech/?viewAsMember=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-700 p-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 pt-0 md:pt-6"
          >
            <h4 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-red-500" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-red-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-red-500 rounded-full group-hover:w-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Subjects & Curriculum */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 pt-0 md:pt-6"
          >
            <h4 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <GraduationCap className="w-5 h-5 text-red-500" />
              What We Teach
            </h4>
            <ul className="space-y-3">
              {subjects.map((subject, index) => (
                <li key={index} className="text-gray-300 flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                  {subject}
                </li>
              ))}
            </ul>
            <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 p-3 rounded-lg border border-red-800/50 mt-4">
              <p className="text-red-200 text-sm font-medium">Classes 2 - 12</p>
              <p className="text-red-300 text-xs">Comprehensive curriculum coverage</p>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4 pt-0 md:pt-6"
          >
            <h4 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Phone className="w-5 h-5 text-red-500" />
              Get In Touch
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    M-2/111, Phase-2, Kabir Nagar<br />
                    Raipur, Chhattisgarh, India<br />
                    Pincode: 492099
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <a href="tel:+919773197838" className="text-gray-300 hover:text-red-400 transition-colors">
                    +91-9773197838
                  </a>
                  <br />
                  <a href="tel:+916385904860" className="text-gray-300 hover:text-red-400 transition-colors">
                    +91-6385904860
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                <a 
                  href="mailto:learned.edtech@gmail.com" 
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm"
                >
                  learned.edtech@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Global Presence */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold flex items-center justify-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-red-500" />
              Our Global Student Community
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {globalLocations.map((location, index) => (
              <div 
                key={index}
                className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors duration-300"
              >
                <p className="text-gray-300 text-sm">{location}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-700 text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} LearnED. All rights reserved. Transforming education, one student at a time.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">Terms of Service</a>
              <Link to="/refund-policy" className="text-gray-400 hover:text-red-400 transition-colors">Refund Policy</Link>
              {!isAdmin && (
                <button 
                  onClick={() => setShowLogin(true)}
                  className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <User size={14} />
                  Login
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>


    </footer>
  );
};

export default Footer;