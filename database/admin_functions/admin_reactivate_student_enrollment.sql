-- Admin function to reactivate a cancelled student enrollment
-- Changes status from cancelled back to active

CREATE OR REPLACE FUNCTION admin_reactivate_student_enrollment(
    p_student_id uuid,
    p_classroom_id character varying
)
RETURNS jsonb AS $$
DECLARE
    v_user_type user_type;
    v_enrollment_id uuid;
    v_student_status character varying;
    v_billing_cycle character varying;
    v_end_date timestamp with time zone;
    v_next_billing_date timestamp with time zone;
    v_payment_plan_id character varying;
BEGIN
    -- Check if user is admin
    SELECT user_type INTO v_user_type 
    FROM users 
    WHERE id = auth.uid();
    
    IF v_user_type != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    -- Check if student is active
    SELECT status INTO v_student_status 
    FROM students 
    WHERE id = p_student_id;
    
    IF v_student_status != 'active' THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Student must be active to reactivate enrollment'
        );
    END IF;
    
    -- Get payment plan billing cycle
    SELECT payment_plan_id INTO v_payment_plan_id
    FROM student_enrollments
    WHERE student_id = p_student_id AND classroom_id = p_classroom_id AND status = 'cancelled';
    
    SELECT billing_cycle INTO v_billing_cycle 
    FROM payment_plans 
    WHERE id = v_payment_plan_id;
    
    -- Calculate billing dates based on cycle
    CASE v_billing_cycle
        WHEN 'monthly' THEN
            v_end_date := now() + INTERVAL '1 month';
            v_next_billing_date := now() + INTERVAL '1 month';
        WHEN 'quarterly' THEN
            v_end_date := now() + INTERVAL '3 months';
            v_next_billing_date := now() + INTERVAL '3 months';
        WHEN 'yearly' THEN
            v_end_date := now() + INTERVAL '1 year';
            v_next_billing_date := now() + INTERVAL '1 year';
        ELSE
            v_end_date := now() + INTERVAL '1 month';
            v_next_billing_date := now() + INTERVAL '1 month';
    END CASE;
    
    -- Update enrollment status to active
    UPDATE student_enrollments 
    SET status = 'active', 
        updated_at = now(),
        end_date = v_end_date,
        next_billing_date = v_next_billing_date
    WHERE student_id = p_student_id 
      AND classroom_id = p_classroom_id 
      AND status = 'cancelled'
    RETURNING id INTO v_enrollment_id;
    
    IF v_enrollment_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'No cancelled enrollment found for this student in this classroom'
        );
    END IF;
    
    -- Update classroom student count
    UPDATE classrooms 
    SET current_students = current_students + 1,
        updated_at = now()
    WHERE id = p_classroom_id;
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Student enrollment reactivated successfully',
        'enrollment_id', v_enrollment_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission
GRANT EXECUTE ON FUNCTION admin_reactivate_student_enrollment(uuid, character varying) TO authenticated;
