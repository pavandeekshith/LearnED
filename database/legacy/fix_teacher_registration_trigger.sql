-- Fix the handle_new_user_signup trigger to allow teacher invitations
-- This modifies the trigger to check for valid teacher invitations before blocking

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

-- Verify the trigger is still active
-- No need to recreate trigger, just updating the function
