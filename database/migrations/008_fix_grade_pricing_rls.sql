-- Fix RLS policies and ensure grade_subject_pricing table is properly configured

-- First, disable all existing policies on grade_subject_pricing
ALTER TABLE public.grade_subject_pricing DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can view all pricing" ON public.grade_subject_pricing;
DROP POLICY IF EXISTS "Admins can update pricing" ON public.grade_subject_pricing;
DROP POLICY IF EXISTS "Admins can insert pricing" ON public.grade_subject_pricing;
DROP POLICY IF EXISTS "Admins can delete pricing" ON public.grade_subject_pricing;

-- Re-enable RLS
ALTER TABLE public.grade_subject_pricing ENABLE ROW LEVEL SECURITY;

-- Create simple admin-only policies (allow admins, deny everyone else)
CREATE POLICY "admin_view_pricing" 
  ON public.grade_subject_pricing FOR SELECT
  USING (auth.jwt() ->> 'user_type' = 'admin' OR 
         EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_type = 'admin'));

CREATE POLICY "admin_update_pricing" 
  ON public.grade_subject_pricing FOR UPDATE
  USING (auth.jwt() ->> 'user_type' = 'admin' OR 
         EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_type = 'admin'));

CREATE POLICY "admin_insert_pricing" 
  ON public.grade_subject_pricing FOR INSERT
  WITH CHECK (auth.jwt() ->> 'user_type' = 'admin' OR 
             EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_type = 'admin'));

CREATE POLICY "admin_delete_pricing" 
  ON public.grade_subject_pricing FOR DELETE
  USING (auth.jwt() ->> 'user_type' = 'admin' OR 
         EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.user_type = 'admin'));

-- Ensure data is properly formatted
-- Verify the table has data
SELECT COUNT(*) as pricing_count FROM public.grade_subject_pricing;
