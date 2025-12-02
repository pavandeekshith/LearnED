// =============================================
// ADMIN CONSTANTS
// Centralized constants for the admin application
// =============================================

// Education boards supported by LearnED
export const EDUCATION_BOARDS = [
  { value: 'CBSE', label: 'CBSE' },
  { value: 'ICSE', label: 'ICSE' },
  { value: 'IGCSE', label: 'IGCSE' },
];

// Grade levels supported by LearnED  
export const GRADE_LEVELS = [
  { value: 1, label: 'Grade 1' },
  { value: 2, label: 'Grade 2' },
  { value: 3, label: 'Grade 3' },
  { value: 4, label: 'Grade 4' },
  { value: 5, label: 'Grade 5' },
  { value: 6, label: 'Grade 6' },
  { value: 7, label: 'Grade 7' },
  { value: 8, label: 'Grade 8' },
  { value: 9, label: 'Grade 9' },
  { value: 10, label: 'Grade 10' },
  { value: 11, label: 'Grade 11' },
  { value: 12, label: 'Grade 12' }
];

// Common subjects
export const SUBJECTS = [
  'Mathematics',
  'Physics', 
  'Chemistry',
  'Biology',
];

// Payment plan types
export const PAYMENT_PLANS = [
  { id: 'monthly', name: 'Monthly Plan', cycle: 'monthly' },
  { id: 'quarterly', name: 'Quarterly Plan', cycle: 'quarterly' },
  { id: 'yearly', name: 'Yearly Plan', cycle: 'yearly' }
];

// Admin roles and permissions
export const USER_TYPES = {
  STUDENT: 'student',
  TEACHER: 'teacher', 
  PARENT: 'parent',
  ADMIN: 'admin'
};

// Helper functions to get options for dropdowns
export const getBoardOptions = () => EDUCATION_BOARDS;
export const getGradeOptions = () => GRADE_LEVELS;
export const getSubjectOptions = () => SUBJECTS.map(subject => ({ value: subject, label: subject }));

const constants = {
  EDUCATION_BOARDS,
  GRADE_LEVELS,
  SUBJECTS,
  PAYMENT_PLANS,
  USER_TYPES,
  getBoardOptions,
  getGradeOptions,
  getSubjectOptions
};

export default constants;
