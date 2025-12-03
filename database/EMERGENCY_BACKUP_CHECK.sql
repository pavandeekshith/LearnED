-- ============================================================================
-- EMERGENCY RLS POLICY BACKUP AND RESTORE SCRIPT
-- ============================================================================
-- This script will help recover your RLS policies
-- ============================================================================

-- FIRST: Export ALL current policies (run this to see what's left)
SELECT 
    tablename,
    policyname,
    cmd,
    qual as using_clause,
    with_check as with_check_clause,
    -- Reconstruct the CREATE POLICY statement
    'CREATE POLICY "' || policyname || '" ON ' || tablename || 
    ' FOR ' || cmd || 
    CASE 
        WHEN cmd = 'ALL' THEN ' USING (' || COALESCE(qual, 'true') || ')'
        ELSE ' USING (' || COALESCE(qual, 'true') || ')' ||
             CASE WHEN with_check IS NOT NULL THEN ' WITH CHECK (' || with_check || ')' ELSE '' END
    END || ';' as restore_statement
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Show which tables still have RLS enabled
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
