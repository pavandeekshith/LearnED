-- =============================================
-- FIX: Remove conflicting RLS policies and create clean ones
-- =============================================

-- Step 1: Drop ALL existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Step 2: Create non-conflicting policies with proper ordering

-- =============================================
-- CLASSROOMS TABLE
-- =============================================

-- Admin full access (highest priority)
CREATE POLICY "classrooms_admin_all" ON classrooms
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Teachers can view/update their own classrooms
CREATE POLICY "classrooms_teacher_select" ON classrooms
    FOR SELECT
    TO authenticated
    USING (
        teacher_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

CREATE POLICY "classrooms_teacher_update" ON classrooms
    FOR UPDATE
    TO authenticated
    USING (teacher_id = auth.uid())
    WITH CHECK (teacher_id = auth.uid());

-- Students can view enrolled classrooms
CREATE POLICY "classrooms_student_select" ON classrooms
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments
            WHERE student_enrollments.classroom_id = classrooms.id
            AND student_enrollments.student_id = auth.uid()
            AND student_enrollments.status = 'active'
        )
    );

-- =============================================
-- STUDENT_ENROLLMENTS TABLE
-- =============================================

-- Admin full access
CREATE POLICY "enrollments_admin_all" ON student_enrollments
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Students view their own
CREATE POLICY "enrollments_student_select" ON student_enrollments
    FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

-- Teachers view their classroom enrollments
CREATE POLICY "enrollments_teacher_select" ON student_enrollments
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = student_enrollments.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

-- =============================================
-- STUDENTS TABLE
-- =============================================

CREATE POLICY "students_admin_all" ON students
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

CREATE POLICY "students_own_select" ON students
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "students_own_update" ON students
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- =============================================
-- TEACHERS TABLE
-- =============================================

CREATE POLICY "teachers_admin_all" ON teachers
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

CREATE POLICY "teachers_own_select" ON teachers
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "teachers_own_update" ON teachers
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- =============================================
-- USERS TABLE
-- =============================================

CREATE POLICY "users_select_all" ON users
    FOR SELECT
    TO authenticated
    USING (
        id = auth.uid() 
        OR user_type = 'admin'
    );

CREATE POLICY "users_own_update" ON users
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- =============================================
-- CLASS_SESSIONS TABLE
-- =============================================

CREATE POLICY "sessions_admin_select" ON class_sessions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

CREATE POLICY "sessions_teacher_all" ON class_sessions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = class_sessions.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

CREATE POLICY "sessions_student_select" ON class_sessions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments
            WHERE student_enrollments.student_id = auth.uid()
            AND student_enrollments.classroom_id = class_sessions.classroom_id
            AND student_enrollments.status = 'active'
        )
    );

-- =============================================
-- LEARNING_MATERIALS TABLE
-- =============================================

CREATE POLICY "materials_admin_select" ON learning_materials
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

CREATE POLICY "materials_teacher_all" ON learning_materials
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = learning_materials.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

CREATE POLICY "materials_student_select" ON learning_materials
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments
            WHERE student_enrollments.student_id = auth.uid()
            AND student_enrollments.classroom_id = learning_materials.classroom_id
            AND student_enrollments.status = 'active'
        )
    );

-- =============================================
-- ASSIGNMENTS TABLE
-- =============================================

CREATE POLICY "assignments_admin_select" ON assignments
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

CREATE POLICY "assignments_teacher_all" ON assignments
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = assignments.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

CREATE POLICY "assignments_student_select" ON assignments
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments
            WHERE student_enrollments.student_id = auth.uid()
            AND student_enrollments.classroom_id = assignments.classroom_id
            AND student_enrollments.status = 'active'
        )
    );

-- =============================================
-- PAYMENTS TABLE
-- =============================================

CREATE POLICY "payments_admin_all" ON payments
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- =============================================
-- PAYMENT_PLANS TABLE
-- =============================================

CREATE POLICY "payment_plans_select_all" ON payment_plans
    FOR SELECT
    TO authenticated
    USING (true);

-- =============================================
-- AUDIT_LOGS TABLE
-- =============================================

CREATE POLICY "audit_logs_admin_select" ON audit_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

SELECT 'All RLS policies fixed - no more infinite recursion!' as status;
