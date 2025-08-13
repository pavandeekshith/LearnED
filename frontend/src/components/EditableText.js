import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Save, X } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const EditableText = ({ 
  tag: Tag = 'div', 
  defaultText, 
  className = '', 
  contentKey,
  ...props 
}) => {
  const { isAdmin, isEditMode, updateContent, getContent } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(defaultText);
  const [tempContent, setTempContent] = useState(defaultText);
  const [isLoading, setIsLoading] = useState(false);

  // Load content from backend on mount
  useEffect(() => {
    const loadContent = async () => {
      if (contentKey) {
        const allContent = await getContent();
        if (allContent[contentKey]) {
          setContent(allContent[contentKey]);
          setTempContent(allContent[contentKey]);
        }
      }
    };
    loadContent();
  }, [contentKey, getContent]);

  const handleEdit = () => {
    if (isAdmin && isEditMode) {
      setTempContent(content);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!contentKey) return;
    
    setIsLoading(true);
    const success = await updateContent(contentKey, tempContent);
    
    if (success) {
      setContent(tempContent);
      setIsEditing(false);
    } else {
      alert('Failed to save changes. Please try again.');
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setTempContent(content);
    setIsEditing(false);
  };

  const renderContent = () => {
    // If content contains HTML tags, render as HTML
    if (content.includes('<') && content.includes('>')) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    // Otherwise render as plain text
    return content;
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative group"
      >
        <div className="relative">
          {content.includes('<') && content.includes('>') ? (
            <textarea
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              className={`${className} w-full p-2 border-2 border-red-300 rounded-lg focus:border-red-500 focus:outline-none min-h-[100px] font-mono text-sm`}
              rows={6}
            />
          ) : (
            <input
              type="text"
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              className={`${className} w-full p-2 border-2 border-red-300 rounded-lg focus:border-red-500 focus:outline-none`}
              autoFocus
            />
          )}
          
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
              ) : (
                <Save size={12} />
              )}
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              <X size={12} />
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative group ${isAdmin && isEditMode ? 'cursor-pointer' : ''}`}
      onClick={handleEdit}
      whileHover={isAdmin && isEditMode ? { scale: 1.02 } : {}}
    >
      <Tag className={className} {...props}>
        {renderContent()}
      </Tag>
      
      {isAdmin && isEditMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit3 size={12} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default EditableText;