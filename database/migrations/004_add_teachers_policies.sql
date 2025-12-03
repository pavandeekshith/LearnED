-- =============================================
-- ADDITIONAL RLS POLICIES FOR TEACHERS TABLE
-- =============================================

-- Admins can view all teachers
CREATE POLICY "Admins can view all teachers" ON teachers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Admins can update teachers
CREATE POLICY "Admins can update teachers" ON teachers
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Admins can insert teachers
CREATE POLICY "Admins can insert teachers" ON teachers
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Admins can delete teachers
CREATE POLICY "Admins can delete teachers" ON teachers
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
        )
    );

-- Teachers can view their own record
CREATE POLICY "Teachers can view their own record" ON teachers
    FOR SELECT
    USING (id = auth.uid());

-- Teachers can update their own record
CREATE POLICY "Teachers can update their own record" ON teachers
    FOR UPDATE
    USING (id = auth.uid());

-- Enable RLS on teachers table
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

SELECT 'Teachers table policies added!' as status;
