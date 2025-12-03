-- =============================================
-- FIX CLASSROOM STUDENT COUNT
-- Recalculates current_students based on actual active enrollments
-- Creates trigger to auto-maintain counts
-- 
-- Compatible with existing RLS policies:
-- - student_enrollments: enrollments_admin_all (admins have ALL access)
-- - classrooms: classrooms_admin_update (admins can UPDATE)
-- Trigger runs with SECURITY DEFINER to bypass RLS
-- =============================================

-- Step 1: Check current discrepancies
SELECT 
    c.id,
    c.name,
    c.current_students as stored_count,
    COUNT(se.id) FILTER (WHERE se.status = 'active') as actual_count,
    c.current_students - COUNT(se.id) FILTER (WHERE se.status = 'active') as difference
FROM classrooms c
LEFT JOIN student_enrollments se ON c.id = se.classroom_id
GROUP BY c.id, c.name, c.current_students
HAVING c.current_students != COUNT(se.id) FILTER (WHERE se.status = 'active')
ORDER BY c.name;

-- Step 2: Update all classroom counts to match actual active enrollments
UPDATE classrooms c
SET current_students = subquery.actual_count,
    updated_at = now()
FROM (
    SELECT 
        classroom_id,
        COUNT(*) FILTER (WHERE status = 'active') as actual_count
    FROM student_enrollments
    GROUP BY classroom_id
) AS subquery
WHERE c.id = subquery.classroom_id;

-- Step 3: Set count to 0 for classrooms with no enrollments
UPDATE classrooms
SET current_students = 0,
    updated_at = now()
WHERE id NOT IN (
    SELECT DISTINCT classroom_id 
    FROM student_enrollments 
    WHERE status = 'active'
)
AND current_students != 0;

-- Step 4: Verify the fix
SELECT 
    c.id,
    c.name,
    c.subject,
    c.grade_level,
    c.board,
    c.current_students as student_count,
    c.max_students,
    ROUND((c.current_students::numeric / c.max_students::numeric) * 100, 1) as capacity_percentage
FROM classrooms c
ORDER BY c.current_students DESC, c.name;

-- Step 5: Create a trigger to auto-update current_students (OPTIONAL - for future prevention)
CREATE OR REPLACE FUNCTION update_classroom_student_count()
RETURNS TRIGGER 
SECURITY DEFINER -- This allows the trigger to bypass RLS policies
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        -- Increment count on new active enrollment
        UPDATE classrooms 
        SET current_students = current_students + 1,
            updated_at = now()
        WHERE id = NEW.classroom_id;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes
        IF OLD.status != 'active' AND NEW.status = 'active' THEN
            -- Reactivated enrollment
            UPDATE classrooms 
            SET current_students = current_students + 1,
                updated_at = now()
            WHERE id = NEW.classroom_id;
        ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
            -- Deactivated enrollment
            UPDATE classrooms 
            SET current_students = GREATEST(current_students - 1, 0),
                updated_at = now()
            WHERE id = NEW.classroom_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
        -- Decrement count on deletion of active enrollment
        UPDATE classrooms 
        SET current_students = GREATEST(current_students - 1, 0),
            updated_at = now()
        WHERE id = OLD.classroom_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_classroom_student_count ON student_enrollments;

-- Create trigger on student_enrollments table
CREATE TRIGGER trigger_update_classroom_student_count
    AFTER INSERT OR UPDATE OR DELETE ON student_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_classroom_student_count();

SELECT 'Classroom student counts fixed and auto-update trigger created!' as status;
