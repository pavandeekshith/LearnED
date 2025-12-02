import React, { createContext, useState, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  // Admin data state
  const [adminData, setAdminData] = useState({
    classrooms: [],
    teachers: [],
    students: [],
    recentActivity: [],
    stats: {
      totalClassrooms: 0,
      totalTeachers: 0,
      totalStudents: 0,
      activeSessions: 0
    }
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load all admin data
  const loadAdminData = async () => {
    if (dataLoaded || dataLoading) return; // Prevent duplicate calls
    
    try {
      setDataLoading(true);

      // Fetch all data in parallel
      const [classroomsResult, teachersResult, studentsResult, activityResult] = await Promise.all([
        // Fetch classrooms with pricing and teacher info - try to get ALL including inactive
        supabase
          .from('classrooms')
          .select(`
            *, 
            classroom_pricing(price, payment_plan_id, id, payment_plans(id, name, billing_cycle)),
            teachers(user_id, users(first_name, last_name))
          `)
          .order('created_at', { ascending: false }), // Add explicit ordering to help with RLS
        
        // Fetch teachers with user details - GET ALL TEACHERS (active and inactive)
        supabase
          .from('teachers')
          .select(`
            *,
            users(first_name, last_name, email, phone)
          `),
        
        // Fetch students with user details
        supabase
          .from('students')
          .select(`
            *,
            users(first_name, last_name, email, phone)
          `)
          .eq('status', 'active'),
        
        // Fetch recent activity
        supabase
          .from('audit_logs')
          .select(`
            id,
            action_type,
            table_name,
            description,
            created_at,
            users(first_name, last_name)
          `)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      // Handle results and errors
      const classrooms = classroomsResult.data || [];
      const teachers = teachersResult.data || [];
      const students = studentsResult.data || [];
      const recentActivity = activityResult.data || [];

      // Log errors only
      if (classroomsResult.error) console.error('Error fetching classrooms:', classroomsResult.error);
      if (teachersResult.error) console.error('Error fetching teachers:', teachersResult.error);
      if (studentsResult.error) console.error('Error fetching students:', studentsResult.error);
      if (activityResult.error) console.error('Error fetching activity:', activityResult.error);

      // Calculate stats
      const stats = {
        totalClassrooms: classrooms.filter(c => c.is_active).length,
        totalTeachers: teachers.filter(t => t.status === 'active').length,
        totalStudents: students.length,
        activeSessions: 0 // We'll implement this later
      };

      // Update state
      setAdminData({
        classrooms,
        teachers,
        students,
        recentActivity,
        stats
      });

      setDataLoaded(true);

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Refresh specific data type
  const refreshData = async (dataType) => {
    try {
      
      switch (dataType) {
        case 'classrooms':
          const { data: classrooms } = await supabase
            .from('classrooms')
            .select(`
              *, 
              classroom_pricing(price, payment_plan_id, id, payment_plans(id, name, billing_cycle)),
              teachers(user_id, users(first_name, last_name))
            `);
          setAdminData(prev => ({ ...prev, classrooms: classrooms || [] }));
          break;
          
        case 'teachers':
          const { data: teachers } = await supabase
            .from('teachers')
            .select(`*, users(first_name, last_name, email, phone)`)
            .eq('status', 'active');
          setAdminData(prev => ({ ...prev, teachers: teachers || [] }));
          break;
          
        case 'students':
          const { data: students } = await supabase
            .from('students')
            .select(`*, users(first_name, last_name, email, phone)`)
            .eq('status', 'active');
          setAdminData(prev => ({ ...prev, students: students || [] }));
          break;
          
        default:
          await loadAdminData();
      }
    } catch (error) {
      console.error(`Error refreshing ${dataType}:`, error);
    }
  };

  const value = {
    // Admin data management
    adminData,
    dataLoading,
    dataLoaded,
    loadAdminData,
    refreshData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext };
