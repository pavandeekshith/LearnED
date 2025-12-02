-- Fix for get_teacher_invitations function
-- The issue is ambiguous column reference "id"
-- This happens because the RETURNS TABLE defines "id" and we're selecting "ti.id"

-- Drop the old function first
DROP FUNCTION IF EXISTS get_teacher_invitations(UUID);

-- Create the new function with fixed return type
CREATE OR REPLACE FUNCTION get_teacher_invitations(
    p_admin_id UUID
) RETURNS TABLE (
    invitation_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    subject TEXT,
    grade_levels INTEGER[],
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Verify admin permissions
    IF NOT EXISTS (SELECT 1 FROM users u WHERE u.id = p_admin_id AND u.user_type = 'admin') THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    RETURN QUERY
    SELECT 
        ti.id AS invitation_id,
        ti.email,
        ti.first_name,
        ti.last_name,
        ti.subject,
        ti.grade_levels,
        ti.status,
        ti.created_at,
        ti.expires_at,
        ti.accepted_at
    FROM teacher_invitations ti
    WHERE ti.invited_by = p_admin_id
    ORDER BY ti.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
