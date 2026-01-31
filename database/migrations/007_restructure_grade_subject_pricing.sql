-- Restructure grade_subject_pricing table to support individual grades and boards
-- Drop the old table and create new one with board column

-- Drop old table (if exists)
DROP TABLE IF EXISTS public.grade_subject_pricing CASCADE;

-- Create new restructured table
CREATE TABLE public.grade_subject_pricing (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  grade_level integer NOT NULL,  -- Single grade: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
  board varchar NOT NULL,         -- ICSE, CBSE, IB, etc.
  subject varchar NOT NULL DEFAULT 'All',
  duration_per_month integer NOT NULL,
  fee_per_month numeric NOT NULL,
  fee_per_hour numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT grade_subject_pricing_pkey PRIMARY KEY (id),
  CONSTRAINT unique_grade_board_subject UNIQUE (grade_level, board, subject)
);

-- Insert comprehensive pricing data for all grades and boards
-- Base pricing from the original sheet (per grade):
-- Grades 2-4: ₹1400/month, 8 hrs/month, ₹175/hr
-- Grades 5-6: ₹1500/month, 8 hrs/month, ₹187.5/hr
-- Grades 7-8: ₹1600/month, 8 hrs/month, ₹200/hr
-- Grades 9-10: ₹1800/month, 12 hrs/month, ₹150/hr
-- Grades 11-12: ₹2500/month, 12 hrs/month, ₹208.33/hr

-- Grades 2-4 with all boards
INSERT INTO public.grade_subject_pricing (grade_level, board, subject, duration_per_month, fee_per_month, fee_per_hour, is_active)
VALUES
  (2, 'ICSE', 'All', 8, 1400, 175, true),
  (2, 'CBSE', 'All', 8, 1400, 175, true),
  (2, 'IB', 'All', 8, 1400, 175, true),
  (3, 'ICSE', 'All', 8, 1400, 175, true),
  (3, 'CBSE', 'All', 8, 1400, 175, true),
  (3, 'IB', 'All', 8, 1400, 175, true),
  (4, 'ICSE', 'All', 8, 1400, 175, true),
  (4, 'CBSE', 'All', 8, 1400, 175, true),
  (4, 'IB', 'All', 8, 1400, 175, true),
  
  -- Grades 5-6
  (5, 'ICSE', 'All', 8, 1500, 187.5, true),
  (5, 'CBSE', 'All', 8, 1500, 187.5, true),
  (5, 'IB', 'All', 8, 1500, 187.5, true),
  (6, 'ICSE', 'All', 8, 1500, 187.5, true),
  (6, 'CBSE', 'All', 8, 1500, 187.5, true),
  (6, 'IB', 'All', 8, 1500, 187.5, true),
  
  -- Grades 7-8
  (7, 'ICSE', 'All', 8, 1600, 200, true),
  (7, 'CBSE', 'All', 8, 1600, 200, true),
  (7, 'IB', 'All', 8, 1600, 200, true),
  (8, 'ICSE', 'All', 8, 1600, 200, true),
  (8, 'CBSE', 'All', 8, 1600, 200, true),
  (8, 'IB', 'All', 8, 1600, 200, true),
  
  -- Grades 9-10
  (9, 'ICSE', 'All', 12, 1800, 150, true),
  (9, 'CBSE', 'All', 12, 1800, 150, true),
  (9, 'IB', 'All', 12, 1800, 150, true),
  (10, 'ICSE', 'All', 12, 1800, 150, true),
  (10, 'CBSE', 'All', 12, 1800, 150, true),
  (10, 'IB', 'All', 12, 1800, 150, true),
  
  -- Grades 11-12
  (11, 'ICSE', 'All', 12, 2500, 208.33, true),
  (11, 'CBSE', 'All', 12, 2500, 208.33, true),
  (11, 'IB', 'All', 12, 2500, 208.33, true),
  (12, 'ICSE', 'All', 12, 2500, 208.33, true),
  (12, 'CBSE', 'All', 12, 2500, 208.33, true),
  (12, 'IB', 'All', 12, 2500, 208.33, true);

-- Create RLS policy for grade_subject_pricing
ALTER TABLE public.grade_subject_pricing ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view all pricing
CREATE POLICY "Admins can view all pricing"
  ON public.grade_subject_pricing
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'::user_type
    )
  );

-- Policy for admins to update pricing
CREATE POLICY "Admins can update pricing"
  ON public.grade_subject_pricing
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'::user_type
    )
  );

-- Policy for admins to insert pricing
CREATE POLICY "Admins can insert pricing"
  ON public.grade_subject_pricing
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'::user_type
    )
  );

-- Policy for admins to delete pricing
CREATE POLICY "Admins can delete pricing"
  ON public.grade_subject_pricing
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'admin'::user_type
    )
  );
