-- Create grade_subject_pricing table for dynamic pricing management
CREATE TABLE IF NOT EXISTS public.grade_subject_pricing (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  grade_level character varying NOT NULL,
  subject character varying NOT NULL DEFAULT 'All',
  duration_per_month integer NOT NULL,
  fee_per_month numeric NOT NULL,
  fee_per_hour numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT grade_subject_pricing_pkey PRIMARY KEY (id),
  CONSTRAINT unique_grade_subject UNIQUE (grade_level, subject)
);

-- Insert initial pricing data from the provided sheet
INSERT INTO public.grade_subject_pricing (grade_level, subject, duration_per_month, fee_per_month, fee_per_hour, is_active)
VALUES
  ('2,3,4', 'All', 8, 1400, 175, true),
  ('5,6', 'All', 8, 1500, 187.5, true),
  ('7,8', 'All', 8, 1600, 200, true),
  ('9,10', 'All', 12, 1800, 150, true),
  ('11,12', 'All', 12, 2500, 208.33, true)
ON CONFLICT (grade_level, subject) 
DO UPDATE SET 
  duration_per_month = EXCLUDED.duration_per_month,
  fee_per_month = EXCLUDED.fee_per_month,
  fee_per_hour = EXCLUDED.fee_per_hour,
  updated_at = now();

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
