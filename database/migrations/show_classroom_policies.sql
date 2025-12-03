-- Show ALL policies to identify the circular reference
SELECT 
    tablename,
    policyname,
    cmd as operation,
    SUBSTRING(qual FROM 1 FOR 200) as using_clause_preview
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('classrooms', 'teachers', 'users', 'students', 'student_enrollments')
ORDER BY tablename, policyname;
