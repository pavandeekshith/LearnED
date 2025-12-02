-- Admin function to update student status (active/inactive)
-- When set to inactive, automatically cancels all active enrollments

CREATE OR REPLACE FUNCTION admin_update_student_status(
    p_student_id uuid,
    p_status character varying
)
RETURNS jsonb AS $$
DECLARE
    v_user_type user_type;
    v_cancelled_count integer;
BEGIN
    -- Check if user is admin
    SELECT user_type INTO v_user_type 
    FROM users 
    WHERE id = auth.uid();
    
    IF v_user_type != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    -- Validate status
    IF p_status NOT IN ('active', 'inactive') THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Invalid status. Use active or inactive'
        );
    END IF;
    
    -- If setting to inactive, cancel all active enrollments
    IF p_status = 'inactive' THEN
        WITH updated AS (
            UPDATE student_enrollments 
            SET status = 'cancelled', 
                updated_at = now()
            WHERE student_id = p_student_id 
              AND status = 'active'
            RETURNING id
        )
        SELECT COUNT(*) INTO v_cancelled_count FROM updated;
        
        -- Update classroom counts
        UPDATE classrooms c
        SET current_students = GREATEST(current_students - 1, 0),
            updated_at = now()
        WHERE id IN (
            SELECT classroom_id 
            FROM student_enrollments 
            WHERE student_id = p_student_id 
              AND status = 'cancelled'
        );
    END IF;
    
    -- Update student status
    UPDATE students 
    SET status = p_status, 
        updated_at = now()
    WHERE id = p_student_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Student not found'
        );
    END IF;
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Student status updated to ' || p_status,
        'enrollments_cancelled', COALESCE(v_cancelled_count, 0)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission
GRANT EXECUTE ON FUNCTION admin_update_student_status(uuid, character varying) TO authenticated;
