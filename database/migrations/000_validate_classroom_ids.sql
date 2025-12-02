-- =============================================
-- VALIDATION: Check if classroom IDs are valid UUIDs
-- Run this BEFORE the migration to identify any issues
-- =============================================

-- Check classroom.id for invalid UUID format
SELECT 
    'classrooms' as table_name,
    id as invalid_id,
    'Not a valid UUID format' as issue
FROM classrooms
WHERE id IS NOT NULL
  AND id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- Check student_enrollments.classroom_id for invalid UUID format
SELECT 
    'student_enrollments' as table_name,
    classroom_id as invalid_id,
    'Not a valid UUID format' as issue
FROM student_enrollments
WHERE classroom_id IS NOT NULL
  AND classroom_id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- Check classroom_pricing.classroom_id for invalid UUID format
SELECT 
    'classroom_pricing' as table_name,
    classroom_id as invalid_id,
    'Not a valid UUID format' as issue
FROM classroom_pricing
WHERE classroom_id IS NOT NULL
  AND classroom_id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- Check class_sessions.classroom_id for invalid UUID format
SELECT 
    'class_sessions' as table_name,
    classroom_id as invalid_id,
    'Not a valid UUID format' as issue
FROM class_sessions
WHERE classroom_id IS NOT NULL
  AND classroom_id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- Check learning_materials.classroom_id for invalid UUID format
SELECT 
    'learning_materials' as table_name,
    classroom_id as invalid_id,
    'Not a valid UUID format' as issue
FROM learning_materials
WHERE classroom_id IS NOT NULL
  AND classroom_id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- Check student_progress.classroom_id for invalid UUID format
SELECT 
    'student_progress' as table_name,
    classroom_id as invalid_id,
    'Not a valid UUID format' as issue
FROM student_progress
WHERE classroom_id IS NOT NULL
  AND classroom_id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- Check assignments.classroom_id for invalid UUID format
SELECT 
    'assignments' as table_name,
    classroom_id as invalid_id,
    'Not a valid UUID format' as issue
FROM assignments
WHERE classroom_id IS NOT NULL
  AND classroom_id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- Check recurring_sessions.classroom_id for invalid UUID format
SELECT 
    'recurring_sessions' as table_name,
    classroom_id as invalid_id,
    'Not a valid UUID format' as issue
FROM recurring_sessions
WHERE classroom_id IS NOT NULL
  AND classroom_id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- Check payments.classroom_id for invalid UUID format
SELECT 
    'payments' as table_name,
    classroom_id as invalid_id,
    'Not a valid UUID format' as issue
FROM payments
WHERE classroom_id IS NOT NULL
  AND classroom_id !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

-- If all queries return 0 rows, your data is valid and you can proceed with Option 1 (Direct Method)
-- If any queries return rows, you need to fix those specific rows before migration
