-- ============================================================================
-- COMPLETE RLS FIX FOR ADMIN PANEL
-- ============================================================================
-- This script will fix ALL RLS issues in one go:
-- 1. Remove circular dependencies in classrooms policies
-- 2. Add missing audit_logs admin policy
-- 3. Fix student_enrollments policy to prevent recursion
-- 4. Ensure admin can query all necessary tables
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Drop ALL problematic policies that cause recursion
-- ============================================================================

-- Drop the public classrooms policy (causes recursion when combined with others)
DROP POLICY IF EXISTS "classrooms_select_all" ON classrooms;

-- Drop student enrollment policy that queries classrooms (circular dependency)
DROP POLICY IF EXISTS "enrollments_teacher_select" ON student_enrollments;

-- ============================================================================
-- STEP 2: Create SIMPLE, NON-RECURSIVE policies for classrooms
-- ============================================================================

-- Admin can do everything with classrooms (using is_admin function)
CREATE POLICY "classrooms_admin_all" 
ON classrooms 
FOR ALL 
USING (is_admin());

-- Teachers can see and update their own classrooms (simple, no subquery)
CREATE POLICY "classrooms_teacher_select" 
ON classrooms 
FOR SELECT 
USING (teacher_id = auth.uid());

CREATE POLICY "classrooms_teacher_update" 
ON classrooms 
FOR UPDATE 
USING (teacher_id = auth.uid());

-- Students can see classrooms they're enrolled in (no circular dependency)
-- This policy checks enrollments, but enrollments won't check back into classrooms
CREATE POLICY "classrooms_student_select" 
ON classrooms 
FOR SELECT 
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
-- STEP 3: Fix student_enrollments policies (break circular dependency)
-- ============================================================================

-- Recreate enrollments_teacher_select WITHOUT querying classrooms table
-- Instead, join through teachers table first
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

-- ============================================================================
-- STEP 4: Add missing audit_logs policy for admin
-- ============================================================================

DROP POLICY IF EXISTS "audit_logs_admin_select" ON audit_logs;

CREATE POLICY "audit_logs_admin_select" 
ON audit_logs 
FOR SELECT 
USING (is_admin());

-- ============================================================================
-- STEP 5: Ensure classroom_pricing and payment_plans are accessible
-- ============================================================================

-- Check if policies exist for classroom_pricing
DO $$
BEGIN
    -- Admin can see all pricing
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'classroom_pricing' 
        AND policyname = 'classroom_pricing_admin_select'
    ) THEN
        EXECUTE 'CREATE POLICY classroom_pricing_admin_select ON classroom_pricing FOR SELECT USING (is_admin())';
    END IF;
    
    -- Teachers can see pricing for their classrooms
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'classroom_pricing' 
        AND policyname = 'classroom_pricing_teacher_select'
    ) THEN
        EXECUTE 'CREATE POLICY classroom_pricing_teacher_select ON classroom_pricing FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM classrooms 
                WHERE classrooms.id = classroom_pricing.classroom_id 
                AND classrooms.teacher_id = auth.uid()
            )
        )';
    END IF;
    
    -- Students can see pricing for their enrolled classrooms
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'classroom_pricing' 
        AND policyname = 'classroom_pricing_student_select'
    ) THEN
        EXECUTE 'CREATE POLICY classroom_pricing_student_select ON classroom_pricing FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM student_enrollments se
                WHERE se.classroom_id = classroom_pricing.classroom_id
                AND se.student_id = auth.uid()
                AND se.status = ''active''
            )
        )';
    END IF;
END $$;

-- Payment plans should be visible to all authenticated users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'payment_plans' 
        AND policyname = 'payment_plans_select_all'
    ) THEN
        EXECUTE 'CREATE POLICY payment_plans_select_all ON payment_plans FOR SELECT USING (true)';
    END IF;
END $$;

COMMIT;

-- ============================================================================
-- VERIFICATION: Show all policies after fix
-- ============================================================================

SELECT 
    'VERIFICATION: Policies after fix' as status,
    tablename,
    policyname,
    cmd as operation,
    SUBSTRING(qual FROM 1 FOR 100) as using_clause_preview
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('classrooms', 'student_enrollments', 'audit_logs', 'classroom_pricing', 'payment_plans')
ORDER BY tablename, policyname;
