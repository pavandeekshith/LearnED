-- ================================================================
-- TEACHER INVITATIONS RLS POLICIES
-- ================================================================
-- Purpose: Secure teacher_invitations table
-- Who can access:
--   1. Admins - Full access (create, read, update invitations)
--   2. Authenticated users - Read invitations sent to their email (for onboarding)
-- ================================================================

-- Enable RLS on teacher_invitations table
ALTER TABLE public.teacher_invitations ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "invitations_admin_all" ON public.teacher_invitations;
DROP POLICY IF EXISTS "invitations_own_select" ON public.teacher_invitations;
DROP POLICY IF EXISTS "Teachers can view their own pending invitations" ON public.teacher_invitations;
DROP POLICY IF EXISTS "Invited teachers can view their own pending invitations" ON public.teacher_invitations;
DROP POLICY IF EXISTS "teachers_invitations_select" ON public.teacher_invitations;
DROP POLICY IF EXISTS "teachers_invitations_admin_all" ON public.teacher_invitations;

-- ================================================================
-- POLICY 1: Admins have full access
-- ================================================================
CREATE POLICY "invitations_admin_all" ON public.teacher_invitations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- ================================================================
-- POLICY 2: Authenticated users can view invitations sent to their email
-- This allows the teacher onboarding page to find the invitation
-- Uses auth.jwt() to get email directly from JWT token (no table lookup needed)
-- ================================================================
CREATE POLICY "invitations_own_select" ON public.teacher_invitations
    FOR SELECT 
    USING (
        -- Match the invitation email with the authenticated user's email from JWT
        email = auth.jwt()->>'email'
    );

-- ================================================================
-- Verify policies were created
-- ================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd AS command,
    qual AS using_expression,
    with_check AS with_check_expression
FROM pg_policies 
WHERE tablename = 'teacher_invitations'
ORDER BY policyname;
