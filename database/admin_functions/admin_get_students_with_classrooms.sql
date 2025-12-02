-- Admin function to get all students with their classroom assignments
-- Returns complete student information including enrollments and contact details

CREATE OR REPLACE FUNCTION admin_get_students_with_classrooms()
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

-- Grant permission
GRANT EXECUTE ON FUNCTION admin_get_students_with_classrooms() TO authenticated;
