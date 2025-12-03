-- =============================================
-- UPDATE ADMIN FUNCTIONS TO USE UUID FOR CLASSROOM_ID
-- Fix parameter types to match current schema
-- Works with existing RLS policies (enrollments_admin_all, classrooms_admin_*)
-- =============================================

-- Drop old functions with wrong parameter types
DROP FUNCTION IF EXISTS admin_remove_student_from_classroom(uuid, character varying);
DROP FUNCTION IF EXISTS admin_enroll_student_in_classroom(uuid, character varying, character varying);
DROP FUNCTION IF EXISTS admin_reactivate_student_enrollment(uuid, character varying);

-- Note: These functions work because:
-- 1. student_enrollments has "enrollments_admin_all" policy (admins can do ALL operations)
-- 2. classrooms has "classrooms_admin_update" policy (admins can UPDATE)
-- 3. Functions use SECURITY DEFINER so they bypass RLS when needed

-- =============================================
-- Function 1: Remove student from classroom (UUID version)
-- =============================================
CREATE OR REPLACE FUNCTION admin_remove_student_from_classroom(
    p_student_id uuid, 
    p_classroom_id uuid
)
RETURNS jsonb AS $$
DECLARE 
    v_user_type user_type; 
    v_enrollment_id uuid;
BEGIN
    -- Check admin authorization
    SELECT user_type INTO v_user_type FROM users WHERE id = auth.uid();
    IF v_user_type != 'admin' THEN 
        RAISE EXCEPTION 'Unauthorized: Admin access required'; 
    END IF;
    
    -- Cancel the enrollment (trigger will handle count update)
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
    
    -- Note: current_students count is updated automatically by trigger
    -- Do NOT update manually here to avoid double-decrement
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Student removed from classroom successfully', 
        'enrollment_id', v_enrollment_id
    );
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Function 2: Enroll student in classroom (UUID version)
-- =============================================
CREATE OR REPLACE FUNCTION admin_enroll_student_in_classroom(
    p_student_id uuid, 
    p_classroom_id uuid, 
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
    -- Check admin authorization
    SELECT user_type INTO v_user_type FROM users WHERE id = auth.uid();
    IF v_user_type != 'admin' THEN 
        RAISE EXCEPTION 'Unauthorized: Admin access required'; 
    END IF;
    
    -- Check if student is active
    SELECT status INTO v_student_status FROM students WHERE id = p_student_id;
    IF v_student_status IS NULL THEN 
        RETURN jsonb_build_object('success', false, 'error', 'Student not found'); 
    END IF;
    IF v_student_status != 'active' THEN 
        RETURN jsonb_build_object('success', false, 'error', 'Student is not active. Please activate the student first.'); 
    END IF;
    
    -- Check if already enrolled
    IF EXISTS (
        SELECT 1 FROM student_enrollments 
        WHERE student_id = p_student_id 
          AND classroom_id = p_classroom_id 
          AND status = 'active'
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Student is already enrolled in this classroom');
    END IF;
    
    -- Get classroom name
    SELECT name INTO v_classroom_name FROM classrooms WHERE id = p_classroom_id;
    IF v_classroom_name IS NULL THEN 
        RETURN jsonb_build_object('success', false, 'error', 'Classroom not found'); 
    END IF;
    
    -- Get billing cycle and calculate dates
    SELECT billing_cycle INTO v_billing_cycle FROM payment_plans WHERE id = p_payment_plan_id;
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
        student_id, classroom_id, payment_plan_id, status, 
        enrollment_date, start_date, end_date, next_billing_date, 
        created_at, updated_at
    )
    VALUES (
        p_student_id, p_classroom_id, p_payment_plan_id, 'active', 
        now(), now(), v_end_date, v_next_billing_date, 
        now(), now()
    )
    RETURNING id INTO v_enrollment_id;
    
    -- Note: current_students count is updated automatically by trigger
    -- Do NOT update manually here to avoid double-increment
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Student enrolled in ' || v_classroom_name || ' successfully', 
        'enrollment_id', v_enrollment_id
    );
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Function 3: Reactivate student enrollment (UUID version)
-- =============================================
CREATE OR REPLACE FUNCTION admin_reactivate_student_enrollment(
    p_student_id uuid, 
    p_classroom_id uuid
)
RETURNS jsonb AS $$
DECLARE 
    v_user_type user_type; 
    v_enrollment_id uuid; 
    v_billing_cycle character varying;
    v_end_date timestamp with time zone;
    v_next_billing_date timestamp with time zone;
BEGIN
    -- Check admin authorization
    SELECT user_type INTO v_user_type FROM users WHERE id = auth.uid();
    IF v_user_type != 'admin' THEN 
        RAISE EXCEPTION 'Unauthorized: Admin access required'; 
    END IF;
    
    -- Get billing cycle from existing enrollment
    SELECT pp.billing_cycle INTO v_billing_cycle
    FROM student_enrollments se
    JOIN payment_plans pp ON se.payment_plan_id = pp.id
    WHERE se.student_id = p_student_id 
      AND se.classroom_id = p_classroom_id 
      AND se.status = 'cancelled';
    
    IF v_billing_cycle IS NULL THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'No cancelled enrollment found for this student in this classroom'
        );
    END IF;
    
    -- Calculate new dates
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
    
    -- Reactivate enrollment
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
    
    -- Note: current_students count is updated automatically by trigger
    -- Do NOT update manually here to avoid double-increment
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Student enrollment reactivated successfully', 
        'enrollment_id', v_enrollment_id
    );
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Grant permissions
-- =============================================
GRANT EXECUTE ON FUNCTION admin_remove_student_from_classroom(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_enroll_student_in_classroom(uuid, uuid, character varying) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_reactivate_student_enrollment(uuid, uuid) TO authenticated;

SELECT 'Admin functions updated to use UUID classroom_id!' as status;
