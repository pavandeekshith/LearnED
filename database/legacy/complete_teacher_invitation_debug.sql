-- ================================================================
-- COMPLETE TEACHER INVITATION DEBUGGING AND FIX SCRIPT
-- Run this in Supabase SQL Editor to diagnose and fix all issues
-- ================================================================

-- Step 1: Check if trigger_logs table exists (for debugging)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'trigger_logs') THEN
        CREATE TABLE public.trigger_logs (
            id BIGSERIAL PRIMARY KEY,
            message TEXT,
            error_message TEXT,
            metadata JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created trigger_logs table';
    ELSE
        -- Add created_at column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'trigger_logs' 
            AND column_name = 'created_at'
        ) THEN
            ALTER TABLE public.trigger_logs ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            RAISE NOTICE 'Added created_at column to trigger_logs table';
        END IF;
        RAISE NOTICE 'trigger_logs table already exists';
    END IF;
END $$;

-- Step 2: Check recent trigger logs to see what's failing
SELECT 
    id,
    message,
    error_message,
    metadata
FROM public.trigger_logs 
ORDER BY id DESC 
LIMIT 10;

-- Step 3: Check if teacher_invitations table exists and has data
SELECT 
    'Teacher Invitations' as table_name,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'pending' AND expires_at > NOW()) as valid_pending_count
FROM public.teacher_invitations;

-- Step 4: Show recent teacher invitations
SELECT 
    id,
    email,
    first_name,
    last_name,
    status,
    expires_at,
    created_at,
    CASE 
        WHEN status = 'pending' AND expires_at > NOW() THEN 'VALID ✅'
        WHEN status = 'pending' AND expires_at <= NOW() THEN 'EXPIRED ⏰'
        ELSE status
    END as invitation_status
FROM public.teacher_invitations
ORDER BY created_at DESC
LIMIT 5;

-- Step 5: Fix the trigger function to allow teacher invitations
CREATE OR REPLACE FUNCTION handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
    user_type_val text;
    student_id_val text;
    teacher_id_val text;
    has_valid_invitation boolean;
BEGIN
    -- Log the trigger execution
    INSERT INTO public.trigger_logs (message, metadata)
    VALUES ('handle_new_user_signup triggered', jsonb_build_object('user_id', NEW.id, 'email', NEW.email));

    -- Get user type from raw_user_meta_data
    user_type_val := COALESCE(NEW.raw_user_meta_data->>'user_type', 'student');
    
    -- Check if this is a teacher with a valid invitation
    IF user_type_val = 'teacher' THEN
        -- Check for valid pending invitation
        SELECT EXISTS (
            SELECT 1 FROM public.teacher_invitations 
            WHERE email = NEW.email 
            AND status = 'pending' 
            AND expires_at > now()
        ) INTO has_valid_invitation;
        
        -- Only block if there's NO valid invitation
        IF NOT has_valid_invitation THEN
            INSERT INTO public.trigger_logs (message, error_message, metadata)
            VALUES ('Teacher registration blocked', 'No valid invitation found', jsonb_build_object('user_id', NEW.id, 'email', NEW.email));
            
            RAISE EXCEPTION 'Teacher registration requires a valid invitation. Teachers must be invited by an administrator.';
        END IF;
        
        -- Log that teacher registration is allowed due to valid invitation
        INSERT INTO public.trigger_logs (message, metadata)
        VALUES ('Teacher registration allowed - valid invitation found', jsonb_build_object('user_id', NEW.id, 'email', NEW.email));
    END IF;

    -- Update users table with proper user_type
    UPDATE auth.users 
    SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('user_type', user_type_val)
    WHERE id = NEW.id;

    -- Insert into public.users table ONLY for non-teachers
    -- Teachers will be created by complete_teacher_onboarding function
    IF user_type_val != 'teacher' THEN
        INSERT INTO public.users (
            id, email, user_type, first_name, last_name, 
            email_confirmed_at, created_at, updated_at
        ) VALUES (
            NEW.id,
            NEW.email,
            user_type_val::public.user_type,
            COALESCE(NEW.raw_user_meta_data->>'first_name', 'Unknown'),
            COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
            NEW.email_confirmed_at,
            NEW.created_at,
            NEW.updated_at
        );
    ELSE
        -- For teachers, just log that we're skipping public.users insert
        INSERT INTO public.trigger_logs (message, metadata)
        VALUES ('Skipping public.users insert for teacher - will be created during onboarding', jsonb_build_object('user_id', NEW.id, 'email', NEW.email));
    END IF;

    -- Create student record if user_type is student
    IF user_type_val = 'student' THEN
        student_id_val := 'STU' || to_char(now(), 'YYYYMMDD') || substr(NEW.id::text, 1, 6);
        
        INSERT INTO public.students (
            user_id, 
            student_id, 
            grade_level,
            board,
            status,
            created_at, 
            updated_at
        ) VALUES (
            NEW.id, 
            student_id_val, 
            (NEW.raw_user_meta_data->>'grade_level')::integer,
            NEW.raw_user_meta_data->>'board',
            'active',
            now(), 
            now()
        );
        
        INSERT INTO public.trigger_logs (message, metadata)
        VALUES ('Student record created', jsonb_build_object('user_id', NEW.id, 'student_id', student_id_val));
    END IF;

    -- Log successful completion
    INSERT INTO public.trigger_logs (message, metadata)
    VALUES ('User signup completed successfully', jsonb_build_object('user_id', NEW.id, 'user_type', user_type_val));

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO public.trigger_logs (message, error_message, metadata)
        VALUES ('Error in handle_new_user_signup', SQLERRM, jsonb_build_object('user_id', NEW.id, 'email', NEW.email));
        RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Verify the trigger is active
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Step 7: Check if any users were created with teacher type
SELECT 
    au.id,
    au.email,
    au.created_at,
    au.raw_user_meta_data->>'user_type' as user_type,
    au.confirmed_at
FROM auth.users au
WHERE au.raw_user_meta_data->>'user_type' = 'teacher'
ORDER BY au.created_at DESC
LIMIT 5;

-- Step 8: Final summary
SELECT 
    '✅ Script completed!' as status,
    'Check the results above for any issues' as next_step;
