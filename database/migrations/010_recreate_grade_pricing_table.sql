-- Complete table recreation with proper permissions
-- Drop and recreate grade_subject_pricing table from scratch

DROP TABLE IF EXISTS public.grade_subject_pricing CASCADE;

-- Create table with proper structure
CREATE TABLE public.grade_subject_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_level integer NOT NULL,
  board varchar NOT NULL,
  subject varchar NOT NULL DEFAULT 'All',
  duration_per_month integer NOT NULL,
  fee_per_month numeric NOT NULL,
  fee_per_hour numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT unique_grade_board_subject UNIQUE (grade_level, board, subject)
);

-- Grant public access (Supabase PostgREST needs this)
GRANT ALL ON public.grade_subject_pricing TO public;
GRANT ALL ON public.grade_subject_pricing TO authenticated;

-- Insert all pricing data
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
  (5, 'ICSE', 'All', 8, 1500, 187.5, true),
  (5, 'CBSE', 'All', 8, 1500, 187.5, true),
  (5, 'IB', 'All', 8, 1500, 187.5, true),
  (6, 'ICSE', 'All', 8, 1500, 187.5, true),
  (6, 'CBSE', 'All', 8, 1500, 187.5, true),
  (6, 'IB', 'All', 8, 1500, 187.5, true),
  (7, 'ICSE', 'All', 8, 1600, 200, true),
  (7, 'CBSE', 'All', 8, 1600, 200, true),
  (7, 'IB', 'All', 8, 1600, 200, true),
  (8, 'ICSE', 'All', 8, 1600, 200, true),
  (8, 'CBSE', 'All', 8, 1600, 200, true),
  (8, 'IB', 'All', 8, 1600, 200, true),
  (9, 'ICSE', 'All', 12, 1800, 150, true),
  (9, 'CBSE', 'All', 12, 1800, 150, true),
  (9, 'IB', 'All', 12, 1800, 150, true),
  (10, 'ICSE', 'All', 12, 1800, 150, true),
  (10, 'CBSE', 'All', 12, 1800, 150, true),
  (10, 'IB', 'All', 12, 1800, 150, true),
  (11, 'ICSE', 'All', 12, 2500, 208.33, true),
  (11, 'CBSE', 'All', 12, 2500, 208.33, true),
  (11, 'IB', 'All', 12, 2500, 208.33, true),
  (12, 'ICSE', 'All', 12, 2500, 208.33, true),
  (12, 'CBSE', 'All', 12, 2500, 208.33, true),
  (12, 'IB', 'All', 12, 2500, 208.33, true)
ON CONFLICT (grade_level, board, subject) 
DO UPDATE SET 
  duration_per_month = EXCLUDED.duration_per_month,
  fee_per_month = EXCLUDED.fee_per_month,
  fee_per_hour = EXCLUDED.fee_per_hour,
  updated_at = now();

-- Verify table
SELECT COUNT(*) as total_rows FROM public.grade_subject_pricing;
SELECT * FROM public.grade_subject_pricing LIMIT 5;
