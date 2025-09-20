-- =============================================
-- RLS POLICIES FOR ADMIN CLASSROOM MANAGEMENT
-- This file contains all RLS policies needed for admin to:
-- 1. Edit classrooms (name, board, grade, subject)
-- 2. Add/Edit/Delete pricing (weekly, monthly, yearly)
-- 3. Assign teachers to classrooms
-- =============================================

-- IMPORTANT: Make sure you have an admin user in your users table 
-- with user_type = 'admin' before running these policies!

-- =============================================
-- ENABLE RLS ON REQUIRED TABLES
-- =============================================

-- Enable RLS on tables that need admin protection
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CLASSROOMS TABLE POLICIES
-- =============================================

-- Allow everyone to view active classrooms (public browsing)
CREATE POLICY "Anyone can view active classrooms" ON public.classrooms
    FOR SELECT USING (is_active = true);

-- Only admins can update classrooms
CREATE POLICY "Admins can update classrooms" ON public.classrooms
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- Only admins can insert new classrooms
CREATE POLICY "Admins can insert classrooms" ON public.classrooms
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- Only admins can delete classrooms
CREATE POLICY "Admins can delete classrooms" ON public.classrooms
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- =============================================
-- CLASSROOM_PRICING TABLE POLICIES
-- =============================================

-- Allow everyone to view classroom pricing (public browsing)
CREATE POLICY "Anyone can view classroom pricing" ON public.classroom_pricing
    FOR SELECT USING (true);

-- Only admins can update classroom pricing
CREATE POLICY "Admins can update classroom pricing" ON public.classroom_pricing
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- Only admins can insert new classroom pricing
CREATE POLICY "Admins can insert classroom pricing" ON public.classroom_pricing
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- Only admins can delete classroom pricing
CREATE POLICY "Admins can delete classroom pricing" ON public.classroom_pricing
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- =============================================
-- PAYMENT_PLANS TABLE POLICIES
-- =============================================

-- Allow everyone to view active payment plans (public browsing)
CREATE POLICY "Anyone can view active payment plans" ON public.payment_plans
    FOR SELECT USING (is_active = true);

-- Only admins can update payment plans
CREATE POLICY "Admins can update payment plans" ON public.payment_plans
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- Only admins can insert new payment plans
CREATE POLICY "Admins can insert payment plans" ON public.payment_plans
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- Only admins can delete payment plans
CREATE POLICY "Admins can delete payment plans" ON public.payment_plans
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- =============================================
-- TEACHERS TABLE POLICIES (for teacher assignment)
-- =============================================

-- Allow everyone to view active teacher profiles (public browsing)
CREATE POLICY "Anyone can view active teacher profiles" ON public.teachers
    FOR SELECT USING (status = 'active' AND is_verified = true);

-- Only admins can update teacher records (for classroom assignment)
CREATE POLICY "Admins can update teachers" ON public.teachers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- Only admins can insert new teachers
CREATE POLICY "Admins can insert teachers" ON public.teachers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.user_type = 'admin'
            AND users.is_active = true
        )
    );

-- =============================================
-- GRANT PERMISSIONS FOR ANON/AUTHENTICATED USERS
-- =============================================

-- Grant SELECT permissions for public browsing (anon users)
GRANT SELECT ON public.classrooms TO anon;
GRANT SELECT ON public.classroom_pricing TO anon;
GRANT SELECT ON public.payment_plans TO anon;
GRANT SELECT ON public.teachers TO anon;
GRANT SELECT ON public.users TO anon; -- For teacher names

-- Grant full permissions to authenticated users (will be filtered by RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classrooms TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_pricing TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teachers TO authenticated;

-- =============================================
-- SAMPLE DATA FOR TESTING (Optional)
-- =============================================

-- Create sample payment plans if they don't exist
INSERT INTO public.payment_plans (id, name, description, billing_cycle, is_active) 
VALUES 
    ('weekly', 'Weekly Plan', 'Pay weekly for classes', 'weekly', true),
    ('monthly', 'Monthly Plan', 'Pay monthly for classes', 'monthly', true),
    ('yearly', 'Yearly Plan', 'Pay yearly for classes', 'yearly', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SAFETY CHECK QUERY
-- =============================================

-- Run this query to verify you have admin access BEFORE enabling these policies:
-- SELECT id, email, user_type, is_active FROM public.users WHERE user_type = 'admin' AND is_active = true;

-- If the above query returns your admin user, you're safe to run these policies.
-- If not, create an admin user first or you'll be locked out!

-- =============================================
-- VERIFICATION QUERIES (Run after applying policies)
-- =============================================

-- Test admin can view classrooms:
-- SELECT * FROM public.classrooms LIMIT 1;

-- Test admin can update classroom pricing:
-- UPDATE public.classroom_pricing SET price = price WHERE id = (SELECT id FROM public.classroom_pricing LIMIT 1);

-- Test non-admin users can still browse (you'll need to test this with a non-admin account)

SELECT 'RLS policies for admin classroom management applied successfully!' as status;
