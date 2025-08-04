import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Send, Phone, Mail, User, MessageCircle } from 'lucide-react';

const FloatingDemoButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => {
        setShowForm(false);
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-full shadow-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <BookOpen size={24} className="group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
          FREE
        </div>
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Book Free Demo Session
        </div>
      </motion.button>

      {/* Demo Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    Book Free Demo
                  </h3>
                  <p className="text-gray-600 text-sm">Start your learning journey today!</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {submitStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-green-600 mb-2">Request Submitted!</h4>
                  <p className="text-gray-600">
                    Thank you for your interest! Our team will contact you within 24 hours to schedule your free demo session.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User size={16} className="inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} className="inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail size={16} className="inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
                      placeholder="Enter your email (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageCircle size={16} className="inline mr-2" />
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors resize-vertical"
                      placeholder="Tell us about your learning goals (optional)"
                    ></textarea>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm">
                      🎉 <strong>What you'll get:</strong> 30-minute personalized demo session, curriculum overview, and learning assessment - completely FREE!
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-800 transform hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Book My Free Demo Session
                      </>
                    )}
                  </button>

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg"
                    >
                      Something went wrong. Please try again or contact us directly.
                    </motion.div>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingDemoButton;