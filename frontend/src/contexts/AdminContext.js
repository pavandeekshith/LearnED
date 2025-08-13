import React, { createContext, useState, useContext, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const adminStatus = localStorage.getItem('is_admin') === 'true';
    
    if (token && adminStatus) {
      setAuthToken(token);
      setIsAdmin(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        setAuthToken(data.token);
        setIsAdmin(true);
        
        // Store in localStorage
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('is_admin', 'true');
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
    setAuthToken(null);
    
    // Clear localStorage
    localStorage.removeItem('admin_token');
    localStorage.removeItem('is_admin');
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const updateContent = async (key, value) => {
    if (!authToken) return false;

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/content/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ key, value }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to update content:', error);
      return false;
    }
  };

  const getContent = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/content`);
      if (response.ok) {
        return await response.json();
      }
      return {};
    } catch (error) {
      console.error('Failed to fetch content:', error);
      return {};
    }
  };

  const value = {
    isAdmin,
    isEditMode,
    authToken,
    login,
    logout,
    toggleEditMode,
    updateContent,
    getContent
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext };