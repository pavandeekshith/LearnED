-- Fix infinite recursion by simplifying enrollments_teacher_select policy
-- Current policy queries classrooms table, which creates circular dependency
-- New policy checks teachers table directly

BEGIN;

-- Drop the problematic policy
DROP POLICY IF EXISTS "enrollments_teacher_select" ON student_enrollments;

-- Create simplified policy that avoids classrooms table
-- Teachers can see enrollments where they are the teacher (check via teachers table)
CREATE POLICY "enrollments_teacher_select" 
ON student_enrollments 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 
        FROM teachers t
        JOIN classrooms c ON c.teacher_id = t.id
        WHERE c.id = student_enrollments.classroom_id
        AND t.id = auth.uid()
    )
);

COMMIT;

-- Verify the policy was created
SELECT 
    tablename,
    policyname,
    cmd as operation,
    SUBSTRING(qual FROM 1 FOR 200) as using_clause_preview
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'student_enrollments'
AND policyname = 'enrollments_teacher_select';
