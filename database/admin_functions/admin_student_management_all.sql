-- =============================================
-- ADMIN STUDENT MANAGEMENT FUNCTIONS
-- Run this file to create all admin functions for student management
-- =============================================

-- Drop existing functions if they exist (including old naming)
DROP FUNCTION IF EXISTS get_students_with_classrooms();
DROP FUNCTION IF EXISTS update_student_status(uuid, character varying);
DROP FUNCTION IF EXISTS admin_get_students_with_classrooms();
DROP FUNCTION IF EXISTS admin_update_student_status(uuid, character varying);
DROP FUNCTION IF EXISTS admin_remove_student_from_classroom(uuid, character varying);
DROP FUNCTION IF EXISTS admin_enroll_student_in_classroom(uuid, character varying, character varying);
DROP FUNCTION IF EXISTS admin_reactivate_student_enrollment(uuid, character varying);

-- =============================================
-- Function 1: Get all students with their classroom assignments
-- =============================================
CREATE OR REPLACE FUNCTION admin_get_students_with_classrooms()
RETURNS TABLE (
    student_id uuid, student_identifier character varying, student_name text,
    email character varying, phone character varying, grade_level integer,
    board character varying, school_name character varying, parent_contact text,
    emergency_contact_name character varying, emergency_contact_phone character varying,
    student_status character varying, total_enrollments bigint, active_enrollments bigint, classrooms jsonb
) AS $$
DECLARE v_user_type user_type;
BEGIN
    SELECT user_type INTO v_user_type FROM users WHERE id = auth.uid();
    IF v_user_type != 'admin' THEN RAISE EXCEPTION 'Unauthorized: Admin access required'; END IF;
    RETURN QUERY
    SELECT s.id, s.student_id, (u.first_name || ' ' || u.last_name), u.email, u.phone,
           s.grade_level, s.board, s.school_name, s.parent_contact, s.emergency_contact_name,
           s.emergency_contact_phone, s.status, COUNT(se.id), COUNT(se.id) FILTER (WHERE se.status = 'active'),
           COALESCE(jsonb_agg(jsonb_build_object('classroom_id', c.id, 'classroom_name', c.name, 'subject', c.subject,
                   'grade_level', c.grade_level, 'enrollment_status', se.status, 'enrollment_date', se.enrollment_date,
                   'end_date', se.end_date) ORDER BY se.enrollment_date DESC) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb)
    FROM students s JOIN users u ON s.user_id = u.id
    LEFT JOIN student_enrollments se ON s.id = se.student_id LEFT JOIN classrooms c ON se.classroom_id = c.id
    GROUP BY s.id, s.student_id, u.first_name, u.last_name, u.email, u.phone, s.grade_level, s.board,
             s.school_name, s.parent_contact, s.emergency_contact_name, s.emergency_contact_phone, s.status
    ORDER BY s.created_at DESC;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Function 2: Update student status (active/inactive)
-- =============================================
CREATE OR REPLACE FUNCTION admin_update_student_status(p_student_id uuid, p_status character varying)
RETURNS jsonb AS $$
DECLARE v_user_type user_type; v_cancelled_count integer;
BEGIN
    SELECT user_type INTO v_user_type FROM users WHERE id = auth.uid();
    IF v_user_type != 'admin' THEN RAISE EXCEPTION 'Unauthorized: Admin access required'; END IF;
    IF p_status NOT IN ('active', 'inactive') THEN 
        RETURN jsonb_build_object('success', false, 'error', 'Invalid status. Use active or inactive'); 
    END IF;
    IF p_status = 'inactive' THEN
        WITH updated AS (
            UPDATE student_enrollments SET status = 'cancelled', updated_at = now()
            WHERE student_id = p_student_id AND status = 'active' RETURNING id
        ) SELECT COUNT(*) INTO v_cancelled_count FROM updated;
        UPDATE classrooms c SET current_students = GREATEST(current_students - 1, 0), updated_at = now()
        WHERE id IN (SELECT classroom_id FROM student_enrollments WHERE student_id = p_student_id AND status = 'cancelled');
    END IF;
    UPDATE students SET status = p_status, updated_at = now() WHERE id = p_student_id;
    IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'Student not found'); END IF;
    RETURN jsonb_build_object('success', true, 'message', 'Student status updated to ' || p_status, 'enrollments_cancelled', COALESCE(v_cancelled_count, 0));
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Function 3: Remove student from classroom
-- =============================================
CREATE OR REPLACE FUNCTION admin_remove_student_from_classroom(p_student_id uuid, p_classroom_id character varying)
RETURNS jsonb AS $$
DECLARE v_user_type user_type; v_enrollment_id uuid;
BEGIN
    SELECT user_type INTO v_user_type FROM users WHERE id = auth.uid();
    IF v_user_type != 'admin' THEN RAISE EXCEPTION 'Unauthorized: Admin access required'; END IF;
    UPDATE student_enrollments SET status = 'cancelled', updated_at = now()
    WHERE student_id = p_student_id AND classroom_id = p_classroom_id AND status = 'active'
    RETURNING id INTO v_enrollment_id;
    IF v_enrollment_id IS NULL THEN 
        RETURN jsonb_build_object('success', false, 'error', 'Active enrollment not found for this student in this classroom'); 
    END IF;
    UPDATE classrooms SET current_students = GREATEST(current_students - 1, 0), updated_at = now() WHERE id = p_classroom_id;
    RETURN jsonb_build_object('success', true, 'message', 'Student removed from classroom successfully', 'enrollment_id', v_enrollment_id);
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Function 4: Enroll student in classroom (with billing dates)
-- =============================================
CREATE OR REPLACE FUNCTION admin_enroll_student_in_classroom(p_student_id uuid, p_classroom_id character varying, p_payment_plan_id character varying)
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
    IF v_student_status != 'active' THEN RETURN jsonb_build_object('success', false, 'error', 'Student is not active. Please activate the student first.'); END IF;
    IF EXISTS (SELECT 1 FROM student_enrollments WHERE student_id = p_student_id AND classroom_id = p_classroom_id AND status = 'active') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Student is already enrolled in this classroom');
    END IF;
    SELECT name INTO v_classroom_name FROM classrooms WHERE id = p_classroom_id;
    IF v_classroom_name IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'Classroom not found'); END IF;
    
    -- Get billing cycle and calculate dates
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
    RETURN jsonb_build_object('success', true, 'message', 'Student enrolled in ' || v_classroom_name || ' successfully', 'enrollment_id', v_enrollment_id);
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Function 5: Reactivate cancelled enrollment (with billing dates)
-- =============================================
CREATE OR REPLACE FUNCTION admin_reactivate_student_enrollment(p_student_id uuid, p_classroom_id character varying)
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
        RETURN jsonb_build_object('success', false, 'error', 'Student must be active to reactivate enrollment'); 
    END IF;
    
    -- Get payment plan and calculate billing dates
    SELECT payment_plan_id INTO v_payment_plan_id FROM student_enrollments WHERE student_id = p_student_id AND classroom_id = p_classroom_id AND status = 'cancelled';
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
        RETURN jsonb_build_object('success', false, 'error', 'No cancelled enrollment found for this student in this classroom'); 
    END IF;
    UPDATE classrooms SET current_students = current_students + 1, updated_at = now() WHERE id = p_classroom_id;
    RETURN jsonb_build_object('success', true, 'message', 'Student enrollment reactivated successfully', 'enrollment_id', v_enrollment_id);
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Grant permissions
-- =============================================
GRANT EXECUTE ON FUNCTION admin_get_students_with_classrooms() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_student_status(uuid, character varying) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_remove_student_from_classroom(uuid, character varying) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_enroll_student_in_classroom(uuid, character varying, character varying) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_reactivate_student_enrollment(uuid, character varying) TO authenticated;

SELECT 'Admin student management functions created successfully!' as status;
