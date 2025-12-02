-- Admin function to enroll a student in a classroom
-- Creates enrollment and updates classroom student count

CREATE OR REPLACE FUNCTION admin_enroll_student_in_classroom(
    p_student_id uuid,
    p_classroom_id character varying,
    p_payment_plan_id character varying
)
RETURNS jsonb AS $$
DECLARE
    v_user_type user_type;
    v_enrollment_id uuid;
    v_student_status character varying;
    v_classroom_name character varying;
    v_end_date timestamp with time zone;
    v_billing_cycle character varying;
    v_next_billing_date timestamp with time zone;
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
    
    IF v_student_status IS NULL THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Student not found'
        );
    END IF;
    
    IF v_student_status != 'active' THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Student is not active. Please activate the student first.'
        );
    END IF;
    
    -- Check if already enrolled
    IF EXISTS (
        SELECT 1 
        FROM student_enrollments 
        WHERE student_id = p_student_id 
          AND classroom_id = p_classroom_id 
          AND status = 'active'
    ) THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Student is already enrolled in this classroom'
        );
    END IF;
    
    -- Get classroom name for response
    SELECT name INTO v_classroom_name 
    FROM classrooms 
    WHERE id = p_classroom_id;
    
    IF v_classroom_name IS NULL THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Classroom not found'
        );
    END IF;
    
    -- Get billing cycle from payment plan
    SELECT billing_cycle INTO v_billing_cycle 
    FROM payment_plans 
    WHERE id = p_payment_plan_id;
    
    -- Calculate end_date and next_billing_date based on billing cycle
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
    
    -- Create enrollment
    INSERT INTO student_enrollments (
        student_id, 
        classroom_id, 
        payment_plan_id, 
        status, 
        enrollment_date, 
        start_date,
        end_date,
        next_billing_date,
        created_at,
        updated_at
    ) VALUES (
        p_student_id, 
        p_classroom_id, 
        p_payment_plan_id, 
        'active', 
        now(), 
        now(),
        v_end_date,
        v_next_billing_date,
        now(),
        now()
    ) RETURNING id INTO v_enrollment_id;
    
    -- Update classroom student count
    UPDATE classrooms 
    SET current_students = current_students + 1,
        updated_at = now()
    WHERE id = p_classroom_id;
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Student enrolled in ' || v_classroom_name || ' successfully',
        'enrollment_id', v_enrollment_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission
GRANT EXECUTE ON FUNCTION admin_enroll_student_in_classroom(uuid, character varying, character varying) TO authenticated;
