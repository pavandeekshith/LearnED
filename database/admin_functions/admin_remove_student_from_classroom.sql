-- Admin function to remove a student from a specific classroom
-- Cancels the enrollment and updates classroom student count

CREATE OR REPLACE FUNCTION admin_remove_student_from_classroom(
    p_student_id uuid,
    p_classroom_id character varying
)
RETURNS jsonb AS $$
DECLARE
    v_user_type user_type;
    v_enrollment_id uuid;
BEGIN
    -- Check if user is admin
    SELECT user_type INTO v_user_type 
    FROM users 
    WHERE id = auth.uid();
    
    IF v_user_type != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    -- Update enrollment status to cancelled
    UPDATE student_enrollments 
    SET status = 'cancelled', 
        updated_at = now()
    WHERE student_id = p_student_id 
      AND classroom_id = p_classroom_id 
      AND status = 'active'
    RETURNING id INTO v_enrollment_id;
    
    IF v_enrollment_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Active enrollment not found for this student in this classroom'
        );
    END IF;
    
    -- Update classroom student count
    UPDATE classrooms 
    SET current_students = GREATEST(current_students - 1, 0),
        updated_at = now()
    WHERE id = p_classroom_id;
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Student removed from classroom successfully',
        'enrollment_id', v_enrollment_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission
GRANT EXECUTE ON FUNCTION admin_remove_student_from_classroom(uuid, character varying) TO authenticated;
