import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Eye, Settings, Save, RefreshCw } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const AdminPanel = () => {
  const { isAdmin, isEditMode, toggleEditMode } = useAdmin();

  if (!isAdmin) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Admin Panel</h3>
              <p className="text-xs text-gray-600">Content Management</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          <div className="space-y-3">
            <button
              onClick={toggleEditMode}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isEditMode
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isEditMode ? <Edit size={16} /> : <Eye size={16} />}
              <span>{isEditMode ? 'Exit Edit Mode' : 'Enable Edit Mode'}</span>
            </button>

            {isEditMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 rounded-xl p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Settings size={14} className="text-red-600" />
                  <span className="text-sm font-medium text-red-800">Edit Mode Active</span>
                </div>
                <p className="text-xs text-red-700">
                  Click on any text element to edit it. Changes are saved automatically to the database.
                </p>
              </motion.div>
            )}

            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Status: Online</span>
                <div className="flex items-center gap-1">
                  <RefreshCw size={10} />
                  <span>Auto-sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminPanel;