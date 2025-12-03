-- ============================================================================
-- COMPLETE RLS RESTORATION SCRIPT
-- ============================================================================
-- This restores ALL RLS policies to the working state from migration 005
-- Based on your original complete_schema_with_functions.sql
-- ============================================================================

BEGIN;

-- First, run the emergency check to see current state
SELECT 'CURRENT STATE BEFORE RESTORATION:' as status;
SELECT tablename, COUNT(*) as policy_count 
FROM pg_policies 
WHERE schemaname = 'public' 
GROUP BY tablename 
ORDER BY tablename;

-- ============================================================================
-- STEP 1: Create is_admin() helper function if it doesn't exist
-- ============================================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users 
        WHERE id = auth.uid() 
        AND user_type = 'admin'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- STEP 2: CLASSROOMS - Complete policies
-- ============================================================================

-- Drop existing classroom policies
DROP POLICY IF EXISTS "classrooms_admin_all" ON classrooms;
DROP POLICY IF EXISTS "classrooms_teacher_select" ON classrooms;
DROP POLICY IF EXISTS "classrooms_teacher_update" ON classrooms;
DROP POLICY IF EXISTS "classrooms_student_select" ON classrooms;
DROP POLICY IF EXISTS "classrooms_select_all" ON classrooms;

-- Admin can do everything
CREATE POLICY "classrooms_admin_all" ON classrooms
FOR ALL
TO authenticated
USING (is_admin());

-- Teachers can see and update their own classrooms
CREATE POLICY "classrooms_teacher_select" ON classrooms
FOR SELECT
TO authenticated
USING (teacher_id = auth.uid());

CREATE POLICY "classrooms_teacher_update" ON classrooms
FOR UPDATE
TO authenticated
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

-- Students can see classrooms they're enrolled in
CREATE POLICY "classrooms_student_select" ON classrooms
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM student_enrollments 
        WHERE student_enrollments.classroom_id = classrooms.id 
        AND student_enrollments.student_id = auth.uid() 
        AND student_enrollments.status = 'active'
    )
);

-- ============================================================================
-- STEP 3: STUDENT_ENROLLMENTS - Complete policies
-- ============================================================================

DROP POLICY IF EXISTS "enrollments_admin_all" ON student_enrollments;
DROP POLICY IF EXISTS "enrollments_student_select" ON student_enrollments;
DROP POLICY IF EXISTS "enrollments_teacher_select" ON student_enrollments;

-- Admin can do everything
CREATE POLICY "enrollments_admin_all" ON student_enrollments
FOR ALL
TO authenticated
USING (is_admin());

-- Students can see their own enrollments
CREATE POLICY "enrollments_student_select" ON student_enrollments
FOR SELECT
TO authenticated
USING (student_id = auth.uid());

-- Teachers can see enrollments for their classrooms
CREATE POLICY "enrollments_teacher_select" ON student_enrollments
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM classrooms 
        WHERE classrooms.id = student_enrollments.classroom_id 
        AND classrooms.teacher_id = auth.uid()
    )
);

-- ============================================================================
-- STEP 4: STUDENTS - Complete policies
-- ============================================================================

DROP POLICY IF EXISTS "students_admin_all" ON students;
DROP POLICY IF EXISTS "students_own_select" ON students;
DROP POLICY IF EXISTS "students_own_update" ON students;

-- Admin can do everything
CREATE POLICY "students_admin_all" ON students
FOR ALL
TO authenticated
USING (is_admin());

-- Students can see their own record
CREATE POLICY "students_own_select" ON students
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Students can update their own record
CREATE POLICY "students_own_update" ON students
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ============================================================================
-- STEP 5: TEACHERS - Complete policies
-- ============================================================================

DROP POLICY IF EXISTS "teachers_admin_all" ON teachers;
DROP POLICY IF EXISTS "teachers_own_select" ON teachers;
DROP POLICY IF EXISTS "teachers_own_update" ON teachers;

-- Admin can do everything
CREATE POLICY "teachers_admin_all" ON teachers
FOR ALL
TO authenticated
USING (is_admin());

-- Teachers can see their own record
CREATE POLICY "teachers_own_select" ON teachers
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Teachers can update their own record
CREATE POLICY "teachers_own_update" ON teachers
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ============================================================================
-- STEP 6: USERS - Complete policies
-- ============================================================================

DROP POLICY IF EXISTS "users_select_all" ON users;
DROP POLICY IF EXISTS "users_own_select" ON users;
DROP POLICY IF EXISTS "users_own_update" ON users;
DROP POLICY IF EXISTS "users_admin_select_all" ON users;

-- Users can see their own record
CREATE POLICY "users_own_select" ON users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Admin can see all users
CREATE POLICY "users_admin_select_all" ON users
FOR SELECT
TO authenticated
USING (is_admin());

-- Users can update their own record
CREATE POLICY "users_own_update" ON users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ============================================================================
-- STEP 7: CLASS_SESSIONS - Complete policies
-- ============================================================================

DROP POLICY IF EXISTS "sessions_admin_select" ON class_sessions;
DROP POLICY IF EXISTS "sessions_teacher_all" ON class_sessions;
DROP POLICY IF EXISTS "sessions_student_select" ON class_sessions;

-- Admin can see all sessions
CREATE POLICY "sessions_admin_select" ON class_sessions
FOR SELECT
TO authenticated
USING (is_admin());

-- Teachers can manage their classroom sessions
CREATE POLICY "sessions_teacher_all" ON class_sessions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM classrooms 
        WHERE classrooms.id = class_sessions.classroom_id 
        AND classrooms.teacher_id = auth.uid()
    )
);

-- Students can see sessions for enrolled classrooms
CREATE POLICY "sessions_student_select" ON class_sessions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM student_enrollments 
        WHERE student_enrollments.student_id = auth.uid() 
        AND student_enrollments.classroom_id = class_sessions.classroom_id 
        AND student_enrollments.status = 'active'
    )
);

-- ============================================================================
-- STEP 8: LEARNING_MATERIALS - Complete policies
-- ============================================================================

DROP POLICY IF EXISTS "materials_admin_select" ON learning_materials;
DROP POLICY IF EXISTS "materials_teacher_all" ON learning_materials;
DROP POLICY IF EXISTS "materials_student_select" ON learning_materials;

-- Admin can see all materials
CREATE POLICY "materials_admin_select" ON learning_materials
FOR SELECT
TO authenticated
USING (is_admin());

-- Teachers can manage their classroom materials
CREATE POLICY "materials_teacher_all" ON learning_materials
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM classrooms 
        WHERE classrooms.id = learning_materials.classroom_id 
        AND classrooms.teacher_id = auth.uid()
    )
);

-- Students can see materials for enrolled classrooms
CREATE POLICY "materials_student_select" ON learning_materials
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM student_enrollments 
        WHERE student_enrollments.student_id = auth.uid() 
        AND student_enrollments.classroom_id = learning_materials.classroom_id 
        AND student_enrollments.status = 'active'
    )
);

-- ============================================================================
-- STEP 9: ASSIGNMENTS - Complete policies
-- ============================================================================

DROP POLICY IF EXISTS "assignments_admin_select" ON assignments;
DROP POLICY IF EXISTS "assignments_teacher_all" ON assignments;
DROP POLICY IF EXISTS "assignments_student_select" ON assignments;

-- Admin can see all assignments
CREATE POLICY "assignments_admin_select" ON assignments
FOR SELECT
TO authenticated
USING (is_admin());

-- Teachers can manage their classroom assignments
CREATE POLICY "assignments_teacher_all" ON assignments
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM classrooms 
        WHERE classrooms.id = assignments.classroom_id 
        AND classrooms.teacher_id = auth.uid()
    )
);

-- Students can see assignments for enrolled classrooms
CREATE POLICY "assignments_student_select" ON assignments
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM student_enrollments 
        WHERE student_enrollments.student_id = auth.uid() 
        AND student_enrollments.classroom_id = assignments.classroom_id 
        AND student_enrollments.status = 'active'
    )
);

-- ============================================================================
-- STEP 10: PAYMENTS - Complete policies
-- ============================================================================

DROP POLICY IF EXISTS "payments_admin_all" ON payments;

-- Admin can do everything with payments
CREATE POLICY "payments_admin_all" ON payments
FOR ALL
TO authenticated
USING (is_admin());

-- ============================================================================
-- STEP 11: PAYMENT_PLANS - Complete policies
-- ============================================================================

DROP POLICY IF EXISTS "payment_plans_select_all" ON payment_plans;

-- Anyone can see payment plans
CREATE POLICY "payment_plans_select_all" ON payment_plans
FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- STEP 12: AUDIT_LOGS - Complete policies
-- ============================================================================

DROP POLICY IF EXISTS "audit_logs_admin_select" ON audit_logs;

-- Admin can see all audit logs
CREATE POLICY "audit_logs_admin_select" ON audit_logs
FOR SELECT
TO authenticated
USING (is_admin());

-- ============================================================================
-- STEP 13: CLASSROOM_PRICING - Complete policies
-- ============================================================================

DROP POLICY IF EXISTS "classroom_pricing_admin_all" ON classroom_pricing;
DROP POLICY IF EXISTS "classroom_pricing_select_all" ON classroom_pricing;

-- Admin can do everything with pricing
CREATE POLICY "classroom_pricing_admin_all" ON classroom_pricing
FOR ALL
TO authenticated
USING (is_admin());

-- Everyone can see pricing
CREATE POLICY "classroom_pricing_select_all" ON classroom_pricing
FOR SELECT
TO authenticated
USING (true);

COMMIT;

-- ============================================================================
-- VERIFICATION: Show restored policies
-- ============================================================================

SELECT 'RESTORATION COMPLETE - POLICY COUNT:' as status;
SELECT tablename, COUNT(*) as policy_count 
FROM pg_policies 
WHERE schemaname = 'public' 
GROUP BY tablename 
ORDER BY tablename;

SELECT 
    tablename,
    policyname,
    cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('classrooms', 'student_enrollments', 'teachers', 'users', 'students', 'audit_logs')
ORDER BY tablename, policyname;
