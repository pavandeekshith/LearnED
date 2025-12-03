-- =============================================
-- RESTORE ALL RLS POLICIES AFTER UUID MIGRATION
-- This recreates all necessary policies that were dropped
-- =============================================

-- =============================================
-- ADMIN POLICIES (Full access to everything)
-- =============================================

-- Admins can do everything on classrooms
CREATE POLICY "Admins have full access to classrooms" ON classrooms
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Admins can do everything on student_enrollments
CREATE POLICY "Admins have full access to enrollments" ON student_enrollments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Admins can do everything on students
CREATE POLICY "Admins have full access to students" ON students
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Admins can do everything on payments
CREATE POLICY "Admins have full access to payments" ON payments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Admins can view all class_sessions
CREATE POLICY "Admins can view all sessions" ON class_sessions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Admins can view all learning_materials
CREATE POLICY "Admins can view all materials" ON learning_materials
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Admins can view all assignments
CREATE POLICY "Admins can view all assignments" ON assignments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- =============================================
-- TEACHER POLICIES
-- =============================================

-- Teachers can view their own classrooms
CREATE POLICY "Teachers can view their classrooms" ON classrooms
    FOR SELECT
    USING (teacher_id = auth.uid());

-- Teachers can update their own classrooms
CREATE POLICY "Teachers can update their classrooms" ON classrooms
    FOR UPDATE
    USING (teacher_id = auth.uid());

-- Teachers can insert materials for their classrooms
CREATE POLICY "Teachers can insert materials for their classrooms" ON learning_materials
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = learning_materials.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

-- Teachers can view materials for their classrooms
CREATE POLICY "Teachers can view their classroom materials" ON learning_materials
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = learning_materials.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

-- Teachers can update materials for their classrooms
CREATE POLICY "Teachers can update materials for their classrooms" ON learning_materials
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = learning_materials.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

-- Teachers can delete materials for their classrooms
CREATE POLICY "Teachers can delete materials for their classrooms" ON learning_materials
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = learning_materials.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

-- Teachers can insert assignments for their classrooms
CREATE POLICY "Teachers can insert assignments for their classrooms" ON assignments
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = assignments.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

-- Teachers can update assignments for their classrooms
CREATE POLICY "Teachers can update assignments for their classrooms" ON assignments
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = assignments.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

-- Teachers can delete assignments for their classrooms
CREATE POLICY "Teachers can delete assignments for their classrooms" ON assignments
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = assignments.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

-- Teachers can view enrollments for their classrooms
CREATE POLICY "Teachers can view their classroom enrollments" ON student_enrollments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = student_enrollments.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

-- =============================================
-- STUDENT POLICIES
-- =============================================

-- Students can view their own enrollment records
CREATE POLICY "Students can view their enrollments" ON student_enrollments
    FOR SELECT
    USING (student_id = auth.uid());

-- Students can view classrooms they're enrolled in
CREATE POLICY "Students can view enrolled classrooms" ON classrooms
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments
            WHERE student_enrollments.classroom_id = classrooms.id
            AND student_enrollments.student_id = auth.uid()
            AND student_enrollments.status = 'active'
        )
    );

-- Students can view their own student record
CREATE POLICY "Students can view their own record" ON students
    FOR SELECT
    USING (id = auth.uid());

-- Students can update their own student record
CREATE POLICY "Students can update their own record" ON students
    FOR UPDATE
    USING (id = auth.uid());

-- =============================================
-- USER POLICIES
-- =============================================

-- Users can view their own record
CREATE POLICY "Users can view their own record" ON users
    FOR SELECT
    USING (id = auth.uid());

-- Users can update their own record
CREATE POLICY "Users can update their own record" ON users
    FOR UPDATE
    USING (id = auth.uid());

-- =============================================
-- PAYMENT PLAN POLICIES
-- =============================================

-- Everyone can view payment plans
CREATE POLICY "Anyone can view payment plans" ON payment_plans
    FOR SELECT
    USING (true);

-- =============================================
-- Enable RLS on all tables (if not already enabled)
-- =============================================

ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;

SELECT 'All RLS policies restored successfully!' as status;
