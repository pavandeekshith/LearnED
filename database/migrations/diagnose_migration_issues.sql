-- =============================================
-- DIAGNOSIS: Check migration data integrity
-- Run this to identify what went wrong
-- =============================================

-- 1. Check if classrooms table has UUIDs
SELECT 'Classrooms table' as table_name, id, name, teacher_id 
FROM classrooms 
LIMIT 5;

-- 2. Check if student_enrollments has matching UUIDs
SELECT 'Student enrollments' as table_name, 
    se.id, 
    se.student_id, 
    se.classroom_id,
    se.status,
    c.name as classroom_name
FROM student_enrollments se
LEFT JOIN classrooms c ON c.id = se.classroom_id
LIMIT 10;

-- 3. Check for orphaned enrollments (enrollments without matching classroom)
SELECT 'Orphaned enrollments' as issue,
    COUNT(*) as count
FROM student_enrollments se
LEFT JOIN classrooms c ON c.id = se.classroom_id
WHERE c.id IS NULL;

-- 4. Check classroom_id_mapping table
SELECT 'ID Mapping table' as table_name,
    old_id,
    new_id
FROM classroom_id_mapping
LIMIT 10;

-- 5. Check if any enrollments have NULL classroom_id
SELECT 'NULL classroom_id enrollments' as issue,
    COUNT(*) as count
FROM student_enrollments
WHERE classroom_id IS NULL;

-- 6. Check RLS policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename IN ('student_enrollments', 'classrooms', 'class_sessions', 'assignments', 'learning_materials')
ORDER BY tablename, policyname;

-- 7. Check if admin user exists and has correct type
SELECT 'Admin users' as table_name,
    id,
    email,
    user_type
FROM users
WHERE user_type = 'admin'
LIMIT 5;

-- 8. Check data types after migration
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name IN ('classrooms', 'student_enrollments', 'classroom_pricing', 'class_sessions')
  AND column_name IN ('id', 'classroom_id')
ORDER BY table_name, column_name;
