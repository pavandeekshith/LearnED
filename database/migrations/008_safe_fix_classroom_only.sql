-- =============================================
-- SAFE FIX: Only fix problematic classroom policies
-- Don't touch users or other working policies!
-- =============================================

-- Step 1: Only drop and recreate the problematic classroom policies
DROP POLICY IF EXISTS "classrooms_admin_all" ON classrooms;
DROP POLICY IF EXISTS "classrooms_teacher_select" ON classrooms;

-- Recreate classroom policies using is_admin() (no recursion)
CREATE POLICY "classrooms_admin_all" ON classrooms 
    FOR ALL 
    TO authenticated 
    USING (is_admin());

CREATE POLICY "classrooms_teacher_select" ON classrooms 
    FOR SELECT 
    TO authenticated 
    USING (teacher_id = auth.uid());

-- Step 2: Add missing classroom_pricing policies (needed for joins)
DROP POLICY IF EXISTS "classroom_pricing_admin_all" ON classroom_pricing;
DROP POLICY IF EXISTS "classroom_pricing_select_all" ON classroom_pricing;

CREATE POLICY "classroom_pricing_admin_all" ON classroom_pricing 
    FOR ALL 
    TO authenticated 
    USING (is_admin());

CREATE POLICY "classroom_pricing_select_all" ON classroom_pricing 
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Enable RLS on classroom_pricing if not already
ALTER TABLE classroom_pricing ENABLE ROW LEVEL SECURITY;

SELECT 'Fixed classroom policies safely - users policies untouched!' as status;
