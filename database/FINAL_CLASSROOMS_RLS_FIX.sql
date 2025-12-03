-- =============================================
-- FINAL CLASSROOMS RLS POLICY FIX
-- Based on actual current schema with UUID classroom_id
-- Drops existing 4 policies and replaces with fixed versions
-- =============================================

-- Step 1: Drop the 4 existing policies on classrooms table
DROP POLICY IF EXISTS "classrooms_admin_all" ON public.classrooms;
DROP POLICY IF EXISTS "classrooms_student_select" ON public.classrooms;
DROP POLICY IF EXISTS "classrooms_teacher_select" ON public.classrooms;
DROP POLICY IF EXISTS "classrooms_teacher_update" ON public.classrooms;

-- Step 2: Create simple, non-recursive policies for classrooms

-- Policy 1: Allow public to browse active classrooms (for student enrollment page)
CREATE POLICY "classrooms_public_read" ON public.classrooms
    FOR SELECT 
    USING (is_active = true);

-- Policy 2: Allow admins to view all classrooms (for admin dashboard)
-- Using direct user_type check instead of subquery to avoid recursion
CREATE POLICY "classrooms_admin_read" ON public.classrooms
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 
            FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- Policy 3: Allow admins to insert classrooms
CREATE POLICY "classrooms_admin_insert" ON public.classrooms
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- Policy 4: Allow admins to update classrooms
CREATE POLICY "classrooms_admin_update" ON public.classrooms
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 
            FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- Policy 5: Allow admins to delete classrooms
CREATE POLICY "classrooms_admin_delete" ON public.classrooms
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 
            FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- Policy 6: Allow teachers to view their assigned classrooms
CREATE POLICY "classrooms_teacher_read" ON public.classrooms
    FOR SELECT 
    USING (
        teacher_id IN (
            SELECT id FROM public.teachers WHERE user_id = auth.uid()
        )
    );

-- Policy 7: Allow teachers to update their assigned classrooms
CREATE POLICY "classrooms_teacher_update" ON public.classrooms
    FOR UPDATE 
    USING (
        teacher_id IN (
            SELECT id FROM public.teachers WHERE user_id = auth.uid()
        )
    );

-- Step 3: Grant necessary permissions
GRANT SELECT ON public.classrooms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classrooms TO authenticated;

-- Step 4: Verify policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'classrooms'
ORDER BY policyname;

-- Step 5: Test query (run this to verify it works)
-- SELECT id, name, subject, grade_level, board, teacher_id, is_active FROM public.classrooms;

SELECT 'Classrooms RLS policies fixed successfully!' as status;
