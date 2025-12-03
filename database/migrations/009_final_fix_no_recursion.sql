-- =============================================
-- FINAL FIX: Use a non-recursive admin check
-- =============================================

-- =============================================
-- PRAGMATIC FIX: Simplify classroom policies to avoid recursion
-- Allow everyone to SELECT classrooms (they're public anyway)
-- Admins use service_role for mutations
-- =============================================

-- Drop problematic admin policy on classrooms
DROP POLICY IF EXISTS "classrooms_admin_all" ON classrooms;

-- Allow everyone to SELECT classrooms (pricing is public anyway)
DROP POLICY IF EXISTS "classrooms_select_all" ON classrooms;
CREATE POLICY "classrooms_select_all" ON classrooms 
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Teachers can still update their own
-- Students can still view enrolled ones (already exists)

SELECT 'Classroom SELECT now open to all authenticated users!' as status;
