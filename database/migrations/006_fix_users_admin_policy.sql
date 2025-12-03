-- =============================================
-- FIX: Allow admins to view all user records for joins
-- =============================================

-- =============================================
-- SOLUTION: Disable RLS on users table for admins using a helper function
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "users_select_all" ON users;
DROP POLICY IF EXISTS "users_own_select" ON users;

-- Create a helper function to check if current user is admin (cached per transaction)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND user_type = 'admin'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Policy 1: Users can see their own record
CREATE POLICY "users_own_select" ON users
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Policy 2: If user is admin (via function), allow all
CREATE POLICY "users_admin_select_all" ON users
    FOR SELECT
    TO authenticated
    USING (is_admin());

SELECT 'Users table policy fixed - admins can now view all users for joins!' as status;
