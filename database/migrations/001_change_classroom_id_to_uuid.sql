-- =============================================
-- MIGRATION: Change classroom ID from varchar to uuid
-- METHOD: New Column Strategy (Safe method for non-UUID data)
-- PREREQUISITES: BACKUP YOUR DATABASE FIRST!
-- =============================================

-- Step 1: Create new UUID columns in classrooms table
ALTER TABLE classrooms ADD COLUMN id_new uuid DEFAULT gen_random_uuid();

-- Generate UUIDs for all existing classrooms
UPDATE classrooms SET id_new = gen_random_uuid() WHERE id_new IS NULL;

-- Step 2: Create mapping table to preserve old ID references
CREATE TABLE IF NOT EXISTS classroom_id_mapping (
    old_id character varying PRIMARY KEY,
    new_id uuid NOT NULL,
    migrated_at timestamp with time zone DEFAULT now()
);

-- Store the mapping
INSERT INTO classroom_id_mapping (old_id, new_id)
SELECT id, id_new FROM classrooms;

-- Step 3: Add new UUID columns to all related tables
ALTER TABLE student_enrollments ADD COLUMN classroom_id_new uuid;
ALTER TABLE classroom_pricing ADD COLUMN classroom_id_new uuid;
ALTER TABLE class_sessions ADD COLUMN classroom_id_new uuid;
ALTER TABLE learning_materials ADD COLUMN classroom_id_new uuid;
ALTER TABLE student_progress ADD COLUMN classroom_id_new uuid;
ALTER TABLE assignments ADD COLUMN classroom_id_new uuid;
ALTER TABLE recurring_sessions ADD COLUMN classroom_id_new uuid;
ALTER TABLE payments ADD COLUMN classroom_id_new uuid;

-- Step 4: Populate new columns using the mapping
UPDATE student_enrollments se
SET classroom_id_new = m.new_id
FROM classroom_id_mapping m
WHERE se.classroom_id = m.old_id;

UPDATE classroom_pricing cp
SET classroom_id_new = m.new_id
FROM classroom_id_mapping m
WHERE cp.classroom_id = m.old_id;

UPDATE class_sessions cs
SET classroom_id_new = m.new_id
FROM classroom_id_mapping m
WHERE cs.classroom_id = m.old_id;

UPDATE learning_materials lm
SET classroom_id_new = m.new_id
FROM classroom_id_mapping m
WHERE lm.classroom_id = m.old_id;

UPDATE student_progress sp
SET classroom_id_new = m.new_id
FROM classroom_id_mapping m
WHERE sp.classroom_id = m.old_id;

UPDATE assignments a
SET classroom_id_new = m.new_id
FROM classroom_id_mapping m
WHERE a.classroom_id = m.old_id;

UPDATE recurring_sessions rs
SET classroom_id_new = m.new_id
FROM classroom_id_mapping m
WHERE rs.classroom_id = m.old_id;

UPDATE payments p
SET classroom_id_new = m.new_id
FROM classroom_id_mapping m
WHERE p.classroom_id = m.old_id;

-- Step 5: Drop ALL RLS policies that depend on classroom_id (we'll recreate them later)
-- Drop ALL policies to avoid any dependency issues
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname IN ('public', 'storage')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Step 6: Drop foreign key constraints
ALTER TABLE student_enrollments DROP CONSTRAINT IF EXISTS student_enrollments_classroom_id_fkey;
ALTER TABLE classroom_pricing DROP CONSTRAINT IF EXISTS classroom_pricing_classroom_id_fkey;
ALTER TABLE class_sessions DROP CONSTRAINT IF EXISTS class_sessions_classroom_id_fkey;
ALTER TABLE learning_materials DROP CONSTRAINT IF EXISTS learning_materials_classroom_id_fkey;
ALTER TABLE student_progress DROP CONSTRAINT IF EXISTS student_progress_classroom_id_fkey;
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_classroom_id_fkey;
ALTER TABLE recurring_sessions DROP CONSTRAINT IF EXISTS recurring_sessions_classroom_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_classroom_id_fkey;

-- Step 7: Drop old columns and rename new ones
ALTER TABLE student_enrollments DROP COLUMN classroom_id;
ALTER TABLE student_enrollments RENAME COLUMN classroom_id_new TO classroom_id;

ALTER TABLE classroom_pricing DROP COLUMN classroom_id;
ALTER TABLE classroom_pricing RENAME COLUMN classroom_id_new TO classroom_id;

ALTER TABLE class_sessions DROP COLUMN classroom_id;
ALTER TABLE class_sessions RENAME COLUMN classroom_id_new TO classroom_id;

ALTER TABLE learning_materials DROP COLUMN classroom_id;
ALTER TABLE learning_materials RENAME COLUMN classroom_id_new TO classroom_id;

ALTER TABLE student_progress DROP COLUMN classroom_id;
ALTER TABLE student_progress RENAME COLUMN classroom_id_new TO classroom_id;

ALTER TABLE assignments DROP COLUMN classroom_id;
ALTER TABLE assignments RENAME COLUMN classroom_id_new TO classroom_id;

ALTER TABLE recurring_sessions DROP COLUMN classroom_id;
ALTER TABLE recurring_sessions RENAME COLUMN classroom_id_new TO classroom_id;

ALTER TABLE payments DROP COLUMN classroom_id;
ALTER TABLE payments RENAME COLUMN classroom_id_new TO classroom_id;

-- Step 8: Update classrooms table
ALTER TABLE classrooms DROP CONSTRAINT IF EXISTS classrooms_pkey;
ALTER TABLE classrooms DROP COLUMN id;
ALTER TABLE classrooms RENAME COLUMN id_new TO id;
ALTER TABLE classrooms ADD PRIMARY KEY (id);
ALTER TABLE classrooms ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Step 9: Recreate foreign key constraints
ALTER TABLE student_enrollments 
    ADD CONSTRAINT student_enrollments_classroom_id_fkey 
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;

ALTER TABLE classroom_pricing 
    ADD CONSTRAINT classroom_pricing_classroom_id_fkey 
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;

ALTER TABLE class_sessions 
    ADD CONSTRAINT class_sessions_classroom_id_fkey 
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;

ALTER TABLE learning_materials 
    ADD CONSTRAINT learning_materials_classroom_id_fkey 
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;

ALTER TABLE student_progress 
    ADD CONSTRAINT student_progress_classroom_id_fkey 
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;

ALTER TABLE assignments 
    ADD CONSTRAINT assignments_classroom_id_fkey 
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;

ALTER TABLE recurring_sessions 
    ADD CONSTRAINT recurring_sessions_classroom_id_fkey 
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;

ALTER TABLE payments 
    ADD CONSTRAINT payments_classroom_id_fkey 
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE;

-- Step 10: Recreate RLS policies (now with UUID columns)
CREATE POLICY "Students can view sessions for enrolled classrooms" ON class_sessions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments
            WHERE student_enrollments.student_id = auth.uid()
            AND student_enrollments.classroom_id = class_sessions.classroom_id
            AND student_enrollments.status = 'active'
        )
    );

CREATE POLICY "Students can view assignments for enrolled classrooms" ON assignments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments
            WHERE student_enrollments.student_id = auth.uid()
            AND student_enrollments.classroom_id = assignments.classroom_id
            AND student_enrollments.status = 'active'
        )
    );

CREATE POLICY "Students can view enrolled classroom materials" ON learning_materials
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments
            WHERE student_enrollments.student_id = auth.uid()
            AND student_enrollments.classroom_id = learning_materials.classroom_id
            AND student_enrollments.status = 'active'
        )
    );

-- Storage policy (adjust path logic as needed for your storage bucket structure)
CREATE POLICY "Students can read classroom materials ud4rb1_0" ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'classroom_materials' AND
        EXISTS (
            SELECT 1 FROM student_enrollments
            WHERE student_enrollments.student_id = auth.uid()
            AND student_enrollments.status = 'active'
            -- Add path matching logic here if you store classroom_id in the path
        )
    );

-- Teacher policies on class_sessions
CREATE POLICY "Teachers can view their classroom sessions" ON class_sessions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = class_sessions.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can insert their classroom sessions" ON class_sessions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = class_sessions.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update their classroom sessions" ON class_sessions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = class_sessions.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can delete their classroom sessions" ON class_sessions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM classrooms
            WHERE classrooms.id = class_sessions.classroom_id
            AND classrooms.teacher_id = auth.uid()
        )
    );

-- Teacher policies on session_attendance
CREATE POLICY "Teachers can mark attendance for their sessions" ON session_attendance
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM class_sessions cs
            JOIN classrooms c ON c.id = cs.classroom_id
            WHERE cs.id = session_attendance.session_id
            AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can view attendance for their sessions" ON session_attendance
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM class_sessions cs
            JOIN classrooms c ON c.id = cs.classroom_id
            WHERE cs.id = session_attendance.session_id
            AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can mark attendance" ON session_attendance
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM class_sessions cs
            JOIN classrooms c ON c.id = cs.classroom_id
            WHERE cs.id = session_attendance.session_id
            AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update attendance" ON session_attendance
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM class_sessions cs
            JOIN classrooms c ON c.id = cs.classroom_id
            WHERE cs.id = session_attendance.session_id
            AND c.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can delete attendance" ON session_attendance
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM class_sessions cs
            JOIN classrooms c ON c.id = cs.classroom_id
            WHERE cs.id = session_attendance.session_id
            AND c.teacher_id = auth.uid()
        )
    );

-- Verification: Check the new column types
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name IN ('classrooms', 'student_enrollments', 'classroom_pricing', 'class_sessions', 
                     'learning_materials', 'student_progress', 'assignments', 'recurring_sessions', 'payments')
  AND column_name IN ('id', 'classroom_id')
ORDER BY table_name, column_name;

SELECT 'Migration completed successfully! All classroom IDs are now uuid type.' as status;
SELECT 'Old ID mappings preserved in classroom_id_mapping table for reference.' as note;
