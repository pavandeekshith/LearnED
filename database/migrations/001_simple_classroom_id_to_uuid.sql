-- =============================================
-- SIMPLE MIGRATION: Change classroom ID from varchar to uuid
-- This approach deletes data first, then changes the schema
-- BACKUP YOUR DATA BEFORE RUNNING THIS!
-- =============================================

-- Step 1: Delete all data from tables with foreign key references to classrooms
-- (in reverse order of dependencies)
DELETE FROM payments;
DELETE FROM recurring_sessions;
DELETE FROM assignments;
DELETE FROM student_progress;
DELETE FROM learning_materials;
DELETE FROM class_sessions;
DELETE FROM classroom_pricing;
DELETE FROM student_enrollments;
DELETE FROM classrooms;

-- Step 2: Drop all foreign key constraints
ALTER TABLE student_enrollments DROP CONSTRAINT IF EXISTS student_enrollments_classroom_id_fkey;
ALTER TABLE classroom_pricing DROP CONSTRAINT IF EXISTS classroom_pricing_classroom_id_fkey;
ALTER TABLE class_sessions DROP CONSTRAINT IF EXISTS class_sessions_classroom_id_fkey;
ALTER TABLE learning_materials DROP CONSTRAINT IF EXISTS learning_materials_classroom_id_fkey;
ALTER TABLE student_progress DROP CONSTRAINT IF EXISTS student_progress_classroom_id_fkey;
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_classroom_id_fkey;
ALTER TABLE recurring_sessions DROP CONSTRAINT IF EXISTS recurring_sessions_classroom_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_classroom_id_fkey;

-- Step 3: Change classroom.id from varchar to uuid
ALTER TABLE classrooms DROP CONSTRAINT IF EXISTS classrooms_pkey;
ALTER TABLE classrooms ALTER COLUMN id TYPE uuid USING gen_random_uuid();
ALTER TABLE classrooms ADD PRIMARY KEY (id);
ALTER TABLE classrooms ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Step 4: Change classroom_id in all related tables to uuid
ALTER TABLE student_enrollments ALTER COLUMN classroom_id TYPE uuid USING NULL::uuid;
ALTER TABLE classroom_pricing ALTER COLUMN classroom_id TYPE uuid USING NULL::uuid;
ALTER TABLE class_sessions ALTER COLUMN classroom_id TYPE uuid USING NULL::uuid;
ALTER TABLE learning_materials ALTER COLUMN classroom_id TYPE uuid USING NULL::uuid;
ALTER TABLE student_progress ALTER COLUMN classroom_id TYPE uuid USING NULL::uuid;
ALTER TABLE assignments ALTER COLUMN classroom_id TYPE uuid USING NULL::uuid;
ALTER TABLE recurring_sessions ALTER COLUMN classroom_id TYPE uuid USING NULL::uuid;
ALTER TABLE payments ALTER COLUMN classroom_id TYPE uuid USING NULL::uuid;

-- Step 5: Recreate foreign key constraints
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

SELECT 'Migration completed! classroom.id is now uuid. You can add your data back.' as status;
