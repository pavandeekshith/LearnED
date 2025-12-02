-- =============================================
-- UPDATED ADMIN FUNCTIONS FOR UUID CLASSROOM IDS
-- Run this AFTER completing the classroom ID migration
-- =============================================

-- Drop old functions with character varying parameters
DROP FUNCTION IF EXISTS admin_enroll_student_in_classroom(uuid, character varying, character varying);
DROP FUNCTION IF EXISTS admin_remove_student_from_classroom(uuid, character varying);
DROP FUNCTION IF EXISTS admin_reactivate_student_enrollment(uuid, character varying);

-- =============================================
-- Function 1: Enroll student (with UUID classroom_id)
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
    SELECT user_type INTO v_user_type FROM users WHERE id = auth.uid();
    IF v_user_type != 'admin' THEN RAISE EXCEPTION 'Unauthorized: Admin access required'; END IF;
    
    SELECT status INTO v_student_status FROM students WHERE id = p_student_id;
    IF v_student_status IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'Student not found'); END IF;
    IF v_student_status != 'active' THEN RETURN jsonb_build_object('success', false, 'error', 'Student is not active'); END IF;
    
    IF EXISTS (SELECT 1 FROM student_enrollments WHERE student_id = p_student_id AND classroom_id = p_classroom_id AND status = 'active') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Student already enrolled');
    END IF;
    
    SELECT name INTO v_classroom_name FROM classrooms WHERE id = p_classroom_id;
    IF v_classroom_name IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'Classroom not found'); END IF;
    
    SELECT billing_cycle INTO v_billing_cycle FROM payment_plans WHERE id = p_payment_plan_id;
    CASE v_billing_cycle
        WHEN 'monthly' THEN v_end_date := now() + INTERVAL '1 month'; v_next_billing_date := now() + INTERVAL '1 month';
        WHEN 'quarterly' THEN v_end_date := now() + INTERVAL '3 months'; v_next_billing_date := now() + INTERVAL '3 months';
        WHEN 'yearly' THEN v_end_date := now() + INTERVAL '1 year'; v_next_billing_date := now() + INTERVAL '1 year';
        ELSE v_end_date := now() + INTERVAL '1 month'; v_next_billing_date := now() + INTERVAL '1 month';
    END CASE;
    
    INSERT INTO student_enrollments (student_id, classroom_id, payment_plan_id, status, enrollment_date, start_date, end_date, next_billing_date, created_at, updated_at)
    VALUES (p_student_id, p_classroom_id, p_payment_plan_id, 'active', now(), now(), v_end_date, v_next_billing_date, now(), now())
    RETURNING id INTO v_enrollment_id;
    
    UPDATE classrooms SET current_students = current_students + 1, updated_at = now() WHERE id = p_classroom_id;
    
    RETURN jsonb_build_object('success', true, 'message', 'Student enrolled successfully', 'enrollment_id', v_enrollment_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Function 2: Remove student (with UUID classroom_id)
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
    SELECT user_type INTO v_user_type FROM users WHERE id = auth.uid();
    IF v_user_type != 'admin' THEN RAISE EXCEPTION 'Unauthorized: Admin access required'; END IF;
    
    UPDATE student_enrollments SET status = 'cancelled', updated_at = now()
    WHERE student_id = p_student_id AND classroom_id = p_classroom_id AND status = 'active'
    RETURNING id INTO v_enrollment_id;
    
    IF v_enrollment_id IS NULL THEN 
        RETURN jsonb_build_object('success', false, 'error', 'Active enrollment not found'); 
    END IF;
    
    UPDATE classrooms SET current_students = GREATEST(current_students - 1, 0), updated_at = now() WHERE id = p_classroom_id;
    
    RETURN jsonb_build_object('success', true, 'message', 'Student removed successfully', 'enrollment_id', v_enrollment_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Function 3: Reactivate enrollment (with UUID classroom_id)
-- =============================================
CREATE OR REPLACE FUNCTION admin_reactivate_student_enrollment(
    p_student_id uuid,
    p_classroom_id uuid
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
    SELECT user_type INTO v_user_type FROM users WHERE id = auth.uid();
    IF v_user_type != 'admin' THEN RAISE EXCEPTION 'Unauthorized: Admin access required'; END IF;
    
    SELECT status INTO v_student_status FROM students WHERE id = p_student_id;
    IF v_student_status != 'active' THEN 
        RETURN jsonb_build_object('success', false, 'error', 'Student must be active'); 
    END IF;
    
    SELECT payment_plan_id INTO v_payment_plan_id FROM student_enrollments 
    WHERE student_id = p_student_id AND classroom_id = p_classroom_id AND status = 'cancelled';
    
    SELECT billing_cycle INTO v_billing_cycle FROM payment_plans WHERE id = v_payment_plan_id;
    CASE v_billing_cycle
        WHEN 'monthly' THEN v_end_date := now() + INTERVAL '1 month'; v_next_billing_date := now() + INTERVAL '1 month';
        WHEN 'quarterly' THEN v_end_date := now() + INTERVAL '3 months'; v_next_billing_date := now() + INTERVAL '3 months';
        WHEN 'yearly' THEN v_end_date := now() + INTERVAL '1 year'; v_next_billing_date := now() + INTERVAL '1 year';
        ELSE v_end_date := now() + INTERVAL '1 month'; v_next_billing_date := now() + INTERVAL '1 month';
    END CASE;
    
    UPDATE student_enrollments SET status = 'active', updated_at = now(), end_date = v_end_date, next_billing_date = v_next_billing_date
    WHERE student_id = p_student_id AND classroom_id = p_classroom_id AND status = 'cancelled'
    RETURNING id INTO v_enrollment_id;
    
    IF v_enrollment_id IS NULL THEN 
        RETURN jsonb_build_object('success', false, 'error', 'No cancelled enrollment found'); 
    END IF;
    
    UPDATE classrooms SET current_students = current_students + 1, updated_at = now() WHERE id = p_classroom_id;
    
    RETURN jsonb_build_object('success', true, 'message', 'Enrollment reactivated', 'enrollment_id', v_enrollment_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION admin_enroll_student_in_classroom(uuid, uuid, character varying) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_remove_student_from_classroom(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_reactivate_student_enrollment(uuid, uuid) TO authenticated;

SELECT 'Admin functions updated for UUID classroom IDs!' as status;
