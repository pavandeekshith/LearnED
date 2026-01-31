-- Disable RLS on grade_subject_pricing table
-- This table is admin-only and accessed via authenticated admin API

-- First, drop all existing policies
DROP POLICY IF EXISTS "admin_view_pricing" ON public.grade_subject_pricing;
DROP POLICY IF EXISTS "admin_update_pricing" ON public.grade_subject_pricing;
DROP POLICY IF EXISTS "admin_insert_pricing" ON public.grade_subject_pricing;
DROP POLICY IF EXISTS "admin_delete_pricing" ON public.grade_subject_pricing;
DROP POLICY IF EXISTS "Admins can view all pricing" ON public.grade_subject_pricing;
DROP POLICY IF EXISTS "Admins can update pricing" ON public.grade_subject_pricing;
DROP POLICY IF EXISTS "Admins can insert pricing" ON public.grade_subject_pricing;
DROP POLICY IF EXISTS "Admins can delete pricing" ON public.grade_subject_pricing;

-- Disable RLS on the table
-- Access control is handled at the application level (ProtectedRoute)
ALTER TABLE public.grade_subject_pricing DISABLE ROW LEVEL SECURITY;

-- Verify the table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'grade_subject_pricing'
ORDER BY ordinal_position;

-- Verify data exists
SELECT COUNT(*) as total_pricing_entries, 
       COUNT(DISTINCT grade_level) as unique_grades,
       COUNT(DISTINCT board) as unique_boards
FROM public.grade_subject_pricing;

-- Show sample data
SELECT grade_level, board, subject, fee_per_month, duration_per_month
FROM public.grade_subject_pricing
ORDER BY grade_level, board
LIMIT 10;
