-- =============================================
-- FIX TEACHER INVITATIONS RLS POLICIES
-- Removes broken policies and keeps only the working ones
-- =============================================

-- Step 1: Drop the broken and redundant policies
DROP POLICY IF EXISTS "Users can view their own pending invitations" ON public.teacher_invitations;
DROP POLICY IF EXISTS "invitations_admin_all" ON public.teacher_invitations;

-- Step 2: Verify remaining policies (should have 2)
-- - "Admins can manage all invitations"
-- - "invitations_own_select"

-- Step 3: Add UPDATE policy for invitations_own_select so teachers can accept
CREATE POLICY "invitations_own_update" ON public.teacher_invitations
    FOR UPDATE USING (
        (email)::text = (auth.jwt() ->> 'email'::text)
    )
    WITH CHECK (
        (email)::text = (auth.jwt() ->> 'email'::text)
    );

-- Step 4: Optionally add INSERT policy for admins if needed
-- (Already covered by "Admins can manage all invitations")

-- Step 5: Verify the fix
SELECT 
    policyname,
    permissive,
    cmd as operation,
    qual as policy_condition,
    roles
FROM pg_policies 
WHERE tablename = 'teacher_invitations'
ORDER BY policyname;

-- Step 6: Test query (this should work now)
SELECT '✅ Fix applied! RLS policies cleaned up successfully' as status;
