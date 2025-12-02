-- Simple function to get all students with their classroom assignments (Admin only)
CREATE OR REPLACE FUNCTION get_students_with_classrooms()
RETURNS TABLE (
    student_id uuid,
    student_identifier character varying,
    student_name text,
    email character varying,
    phone character varying,
    grade_level integer,
    board character varying,
    school_name character varying,
    parent_contact text,
    emergency_contact_name character varying,
    emergency_contact_phone character varying,
    student_status character varying,
    total_enrollments bigint,
    active_enrollments bigint,
    classrooms jsonb
) AS $$
DECLARE
    v_user_type user_type;
BEGIN
    -- Check if user is admin
    SELECT user_type INTO v_user_type 
    FROM users 
    WHERE id = auth.uid();
    
    IF v_user_type != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;

    RETURN QUERY
    SELECT 
        s.id,
        s.student_id,
        (u.first_name || ' ' || u.last_name) as student_name,
        u.email,
        u.phone,
        s.grade_level,
        s.board,
        s.school_name,
        s.parent_contact,
        s.emergency_contact_name,
        s.emergency_contact_phone,
        s.status,
        COUNT(se.id) as total_enrollments,
        COUNT(se.id) FILTER (WHERE se.status = 'active') as active_enrollments,
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'classroom_id', c.id,
                    'classroom_name', c.name,
                    'subject', c.subject,
                    'grade_level', c.grade_level,
                    'enrollment_status', se.status,
                    'enrollment_date', se.enrollment_date,
                    'end_date', se.end_date
                ) ORDER BY se.enrollment_date DESC
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'::jsonb
        ) as classrooms
    FROM students s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN student_enrollments se ON s.id = se.student_id
    LEFT JOIN classrooms c ON se.classroom_id = c.id
    GROUP BY s.id, s.student_id, u.first_name, u.last_name, u.email, u.phone, 
             s.grade_level, s.board, s.school_name, s.parent_contact,
             s.emergency_contact_name, s.emergency_contact_phone, s.status
    ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission only to authenticated users (admin check is inside function)
GRANT EXECUTE ON FUNCTION get_students_with_classrooms() TO authenticated;

-- Function to update student status and handle classroom dropouts (Admin only)
CREATE OR REPLACE FUNCTION update_student_status(
    p_student_id uuid,
    p_status character varying
)
RETURNS jsonb AS $$
DECLARE
    v_user_type user_type;
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
        RETURN jsonb_build_object('success', false, 'error', 'Invalid status. Use active or inactive');
    END IF;
    
    -- If setting to inactive, cancel all active enrollments
    IF p_status = 'inactive' THEN
        UPDATE student_enrollments 
        SET status = 'cancelled', 
            updated_at = now()
        WHERE student_id = p_student_id 
          AND status = 'active';
    END IF;
    
    -- Update student status
    UPDATE students 
    SET status = p_status, 
        updated_at = now()
    WHERE id = p_student_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Student not found');
    END IF;
    
    RETURN jsonb_build_object('success', true, 'message', 'Student status updated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION update_student_status(uuid, character varying) TO authenticated;

-- Function to enroll student in classroom (Admin only)
CREATE OR REPLACE FUNCTION admin_enroll_student(
    p_student_id uuid,
    p_classroom_id character varying,
    p_payment_plan_id character varying
)
RETURNS jsonb AS $$
DECLARE
    v_user_type user_type;
    v_enrollment_id uuid;
BEGIN
    -- Check if user is admin
    SELECT user_type INTO v_user_type FROM users WHERE id = auth.uid();
    IF v_user_type != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    -- Check if already enrolled
    IF EXISTS (SELECT 1 FROM student_enrollments WHERE student_id = p_student_id AND classroom_id = p_classroom_id AND status = 'active') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Student already enrolled in this classroom');
    END IF;
    
    -- Create enrollment
    INSERT INTO student_enrollments (student_id, classroom_id, payment_plan_id, status, enrollment_date, start_date)
    VALUES (p_student_id, p_classroom_id, p_payment_plan_id, 'active', now(), now())
    RETURNING id INTO v_enrollment_id;
    
    -- Update classroom count
    UPDATE classrooms SET current_students = current_students + 1 WHERE id = p_classroom_id;
    
    RETURN jsonb_build_object('success', true, 'message', 'Student enrolled successfully', 'enrollment_id', v_enrollment_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION admin_enroll_student(uuid, character varying, character varying) TO authenticated;

-- Function to remove student from classroom (Admin only)
CREATE OR REPLACE FUNCTION admin_remove_student_from_classroom(
    p_student_id uuid,
    p_classroom_id character varying
)
RETURNS jsonb AS $$
DECLARE
    v_user_type user_type;
BEGIN
    -- Check if user is admin
    SELECT user_type INTO v_user_type FROM users WHERE id = auth.uid();
    IF v_user_type != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    -- Update enrollment status to cancelled
    UPDATE student_enrollments 
    SET status = 'cancelled', updated_at = now()
    WHERE student_id = p_student_id AND classroom_id = p_classroom_id AND status = 'active';
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Active enrollment not found');
    END IF;
    
    -- Update classroom count
    UPDATE classrooms SET current_students = GREATEST(current_students - 1, 0) WHERE id = p_classroom_id;
    
    RETURN jsonb_build_object('success', true, 'message', 'Student removed from classroom');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION admin_remove_student_from_classroom(uuid, character varying) TO authenticated;
