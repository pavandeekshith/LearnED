-- ============================================================================
-- COMPREHENSIVE RLS DIAGNOSTIC SCRIPT
-- ============================================================================
-- This script provides a complete view of ALL RLS policies across all tables
-- that the admin panel queries, helping identify circular dependencies
-- ============================================================================

-- Section 1: Show ALL policies with their full definitions
SELECT 
    '=== POLICIES BY TABLE ===' as section,
    '' as data;

SELECT 
    schemaname as schema,
    tablename as table,
    policyname as policy_name,
    cmd as operation,
    permissive as is_permissive,
    roles as applies_to_roles,
    qual as using_clause,
    with_check as with_check_clause
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Section 2: Identify tables with RLS enabled
SELECT 
    '' as blank_line,
    '=== RLS ENABLED STATUS ===' as section;

SELECT 
    schemaname as schema,
    tablename as table,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'classrooms', 'teachers', 'users', 'students', 'student_enrollments',
    'classroom_pricing', 'payment_plans', 'audit_logs', 'class_sessions',
    'learning_materials', 'student_progress', 'assignments', 'recurring_sessions', 'payments'
)
ORDER BY tablename;

-- Section 3: Show function definitions that may be called by policies
SELECT 
    '' as blank_line,
    '=== POLICY HELPER FUNCTIONS ===' as section;

SELECT 
    n.nspname as schema,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('is_admin', 'get_user_type')
ORDER BY p.proname;

-- Section 4: Count policies per table
SELECT 
    '' as blank_line,
    '=== POLICY COUNT BY TABLE ===' as section;

SELECT 
    tablename as table,
    COUNT(*) as policy_count,
    COUNT(CASE WHEN cmd = 'SELECT' THEN 1 END) as select_policies,
    COUNT(CASE WHEN cmd = 'INSERT' THEN 1 END) as insert_policies,
    COUNT(CASE WHEN cmd = 'UPDATE' THEN 1 END) as update_policies,
    COUNT(CASE WHEN cmd = 'DELETE' THEN 1 END) as delete_policies,
    COUNT(CASE WHEN cmd = 'ALL' THEN 1 END) as all_policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY policy_count DESC;

-- Section 5: Identify potential circular dependencies
SELECT 
    '' as blank_line,
    '=== POTENTIAL CIRCULAR DEPENDENCIES ===' as section;

-- Policies that reference other tables (potential recursion points)
SELECT 
    tablename as policy_table,
    policyname as policy_name,
    cmd as operation,
    CASE 
        WHEN qual LIKE '%classrooms%' THEN 'References: classrooms'
        WHEN qual LIKE '%teachers%' THEN 'References: teachers'
        WHEN qual LIKE '%users%' THEN 'References: users'
        WHEN qual LIKE '%students%' THEN 'References: students'
        WHEN qual LIKE '%student_enrollments%' THEN 'References: student_enrollments'
        WHEN qual LIKE '%is_admin()%' THEN 'Calls: is_admin() (checks users table)'
        ELSE 'Simple policy'
    END as references,
    SUBSTRING(qual FROM 1 FOR 150) as policy_logic_preview
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('classrooms', 'teachers', 'users', 'students', 'student_enrollments', 'audit_logs')
ORDER BY tablename, policyname;

-- Section 6: Admin-specific query paths (what admin panel actually queries)
SELECT 
    '' as blank_line,
    '=== ADMIN PANEL QUERY ANALYSIS ===' as section;

SELECT 'Admin Dashboard queries these tables in this order:' as info
UNION ALL
SELECT '1. classrooms → classroom_pricing → payment_plans → teachers → users'
UNION ALL
SELECT '2. teachers → users'
UNION ALL
SELECT '3. students → users'
UNION ALL
SELECT '4. audit_logs → users'
UNION ALL
SELECT ''
UNION ALL
SELECT 'Potential recursion chains:'
UNION ALL
SELECT '- classrooms policies calling is_admin() → checks users → users policies calling is_admin() → LOOP'
UNION ALL
SELECT '- student_enrollments policies checking classrooms → classrooms policies checking enrollments → LOOP'
UNION ALL
SELECT '- audit_logs has no SELECT policy for admin → causes 403 Forbidden';
