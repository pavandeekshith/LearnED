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
  // Helper functions for payments
  const getTimePeriodLabel = (planId) => {
    const planMap = {
      'plan-1m': '1 month',
      'plan-3m': '3 months',
      'plan-6m': '6 months',
      'plan-12m': '12 months'
    };
    return planMap[planId] || 'N/A';
  };

  const getMonthsFromPlan = (planId) => {
    const planMap = {
      'plan-1m': 1,
      'plan-3m': 3,
      'plan-6m': 6,
      'plan-12m': 12
    };
    return planMap[planId] || 1;
  };

  // Admin data state
  const [adminData, setAdminData] = useState({
    classrooms: [],
    teachers: [],
    students: [],
    studentsWithClassrooms: [], // Detailed student data with enrollments
    payments: [], // Payment approvals data
    pricingRates: [], // Grade subject pricing data
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

  // Load all admin data with caching
  const loadAdminData = async (force = false) => {
    // Skip if already loaded and not forcing refresh
    if (!force && (dataLoaded || dataLoading)) return;
    
    try {
      setDataLoading(true);

      // Fetch all data in parallel
      const [classroomsResult, teachersResult, studentsResult, studentsDetailedResult, activityResult, paymentsResult, pricingResult] = await Promise.all([
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
        
        // Fetch students with user details (basic data)
        supabase
          .from('students')
          .select(`
            *,
            users(first_name, last_name, email, phone)
          `)
          .eq('status', 'active'),
        
        // Fetch detailed students with classroom enrollments (for Students page)
        supabase.rpc('admin_get_students_with_classrooms'),
        
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
          .limit(5),
        
        // Fetch payments for Payment Approvals page
        supabase
          .from('payments')
          .select(`
            id,
            amount,
            currency,
            payment_method,
            transaction_id,
            status,
            payment_proof_path,
            expire_at,
            remarks,
            created_at,
            updated_at,
            student_id,
            classroom_id,
            payment_plan_id,
            students(id, student_id, user_id, users(email, first_name, last_name, phone)),
            classrooms(id, name, subject, grade_level),
            payment_plans(id, name, billing_cycle)
          `)
          .order('created_at', { ascending: false }),
        
        // Fetch grade pricing rates
        supabase
          .from('grade_subject_pricing')
          .select('*')
          .order('grade_level', { ascending: true })
          .order('board', { ascending: true })
      ]);

      // Handle results and errors
      const classrooms = classroomsResult.data || [];
      const teachers = teachersResult.data || [];
      const students = studentsResult.data || [];
      const studentsWithClassrooms = studentsDetailedResult.data || [];
      const recentActivity = activityResult.data || [];
      const pricingRates = pricingResult.data || [];
      
      // Transform payments data to match PaymentApprovals component structure
      const paymentsRaw = paymentsResult.data || [];
      const payments = paymentsRaw.map(payment => ({
        id: payment.id,
        student_name: `${payment.students?.users?.first_name || ''} ${payment.students?.users?.last_name || ''}`.trim(),
        student_email: payment.students?.users?.email || '',
        student_id: payment.students?.student_id || '',
        student_phone: payment.students?.users?.phone || 'N/A',
        classroom_name: payment.classrooms?.name || '',
        classroom_grade: payment.classrooms?.grade_level || '',
        classroom_id: payment.classroom_id,
        payment_id: payment.id,
        amount: payment.amount,
        currency: payment.currency || 'INR',
        payment_method: payment.payment_method || 'UPI',
        transaction_id: payment.transaction_id,
        status: payment.status || 'pending',
        screenshot_url: payment.payment_proof_path || '',
        uploaded_at: payment.created_at,
        time_period: getTimePeriodLabel(payment.payment_plan_id),
        time_period_months: getMonthsFromPlan(payment.payment_plan_id),
        payment_plan_id: payment.payment_plan_id,
        remarks: payment.remarks || '',
        approved_at: payment.updated_at,
        approved_by: 'Admin',
        expire_at: payment.expire_at,
        declined_at: payment.updated_at,
        declined_by: 'Admin',
        decline_reason: ''
      }));

      // Log errors only
      if (classroomsResult.error) console.error('Error fetching classrooms:', classroomsResult.error);
      if (teachersResult.error) console.error('Error fetching teachers:', teachersResult.error);
      if (studentsResult.error) console.error('Error fetching students:', studentsResult.error);
      if (studentsDetailedResult.error) console.error('Error fetching detailed students:', studentsDetailedResult.error);
      if (activityResult.error) console.error('Error fetching activity:', activityResult.error);
      if (paymentsResult.error) console.error('Error fetching payments:', paymentsResult.error);
      if (pricingResult.error) console.error('Error fetching pricing rates:', pricingResult.error);

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
        studentsWithClassrooms,
        payments,
        pricingRates,
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
          const [studentsBasic, studentsDetailed] = await Promise.all([
            supabase
              .from('students')
              .select(`*, users(first_name, last_name, email, phone)`)
              .eq('status', 'active'),
            supabase.rpc('admin_get_students_with_classrooms')
          ]);
          setAdminData(prev => ({ 
            ...prev, 
            students: studentsBasic.data || [],
            studentsWithClassrooms: studentsDetailed.data || []
          }));
          break;
          
        case 'pricing':
          const { data: pricingRates } = await supabase
            .from('grade_subject_pricing')
            .select('*')
            .order('grade_level', { ascending: true })
            .order('board', { ascending: true });
          setAdminData(prev => ({ ...prev, pricingRates: pricingRates || [] }));
          break;
          
        default:
          await loadAdminData(true); // Force refresh by bypassing cache check
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
