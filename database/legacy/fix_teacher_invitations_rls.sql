-- ================================================================
-- FIX: Teacher Invitations RLS Policy
-- Allow teachers to read their own pending invitations
-- ================================================================

-- Drop the old policy if it exists
DROP POLICY IF EXISTS "Invited teachers can view their own pending invitations" ON public.teacher_invitations;
DROP POLICY IF EXISTS "Teachers can view their own pending invitations" ON public.teacher_invitations;

-- Create new policy that allows authenticated users to view their own invitations
CREATE POLICY "Teachers can view their own pending invitations" ON public.teacher_invitations
    FOR SELECT 
    USING (
        -- Match email from auth.users with invitation email
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND status = 'pending'
    );

-- Verify the policy was created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'teacher_invitations'
ORDER BY policyname;

-- Test: Check if current user can see their invitation
-- (Run this after the policy is created and you're authenticated)
SELECT 
    id,
    email,
    first_name,
    last_name,
    status,
    expires_at,
    created_at
FROM public.teacher_invitations
WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
AND status = 'pending'
LIMIT 1;
