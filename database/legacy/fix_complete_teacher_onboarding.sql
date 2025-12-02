-- ================================================================
-- FIX: complete_teacher_onboarding function
-- Handle case where user record might already exist
-- Accept ALL form fields
-- ================================================================

-- Drop the old function first (parameter names changed)
DROP FUNCTION IF EXISTS complete_teacher_onboarding(text,text,text,text,text,text,integer,text[],text);

CREATE OR REPLACE FUNCTION complete_teacher_onboarding(
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_profile_image_url TEXT DEFAULT NULL,
    p_bio TEXT DEFAULT NULL,
    p_qualifications TEXT DEFAULT NULL,
    p_experience_years INTEGER DEFAULT NULL,
    p_specializations TEXT[] DEFAULT NULL,
    p_availability_timezone TEXT DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
    invitation_rec RECORD;
    teacher_id UUID;
    generated_teacher_id TEXT;
    current_user_id UUID;
    current_user_email TEXT;
    final_specializations TEXT[];
BEGIN
    -- Get current user from JWT context
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Get user email from auth.users
    SELECT email INTO current_user_email FROM auth.users WHERE id = current_user_id;
    
    IF current_user_email IS NULL THEN
        RAISE EXCEPTION 'Invalid user session';
    END IF;
    
    -- Find valid invitation for this email
    SELECT * INTO invitation_rec FROM teacher_invitations 
    WHERE email = current_user_email 
    AND status = 'pending' 
    AND expires_at > now();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No valid invitation found for email: %', current_user_email;
    END IF;
    
    -- Generate teacher ID
    generated_teacher_id := 'TEA' || to_char(now(), 'YYYYMMDD') || substr(current_user_id::text, 1, 6);
    
    -- Update auth.users metadata with the updated name
    UPDATE auth.users
    SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object(
        'first_name', COALESCE(p_first_name, invitation_rec.first_name),
        'last_name', COALESCE(p_last_name, invitation_rec.last_name),
        'user_type', 'teacher'
    )
    WHERE id = current_user_id;
    
    -- Create or update user record in public.users table
    -- Use form values if provided, otherwise fall back to invitation values
    INSERT INTO users (
        id, email, user_type, first_name, last_name, phone,
        profile_image_url, is_active, email_verified, created_at, updated_at
    ) VALUES (
        current_user_id, 
        current_user_email, 
        'teacher'::user_type,
        COALESCE(p_first_name, invitation_rec.first_name),
        COALESCE(p_last_name, invitation_rec.last_name),
        p_phone,
        p_profile_image_url,
        true, 
        true, 
        now(), 
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        first_name = COALESCE(p_first_name, invitation_rec.first_name),
        last_name = COALESCE(p_last_name, invitation_rec.last_name),
        phone = EXCLUDED.phone,
        profile_image_url = EXCLUDED.profile_image_url,
        user_type = 'teacher'::user_type,
        is_active = true,
        email_verified = true,
        updated_at = now();
    
    -- Combine invitation subject with form specializations
    final_specializations := CASE 
        WHEN invitation_rec.subject IS NOT NULL THEN ARRAY[invitation_rec.subject]
        ELSE ARRAY[]::TEXT[]
    END;
    
    IF p_specializations IS NOT NULL AND array_length(p_specializations, 1) > 0 THEN
        final_specializations := final_specializations || p_specializations;
    END IF;
    
    -- Create or update teacher record with ALL fields
    INSERT INTO teachers (
        user_id, teacher_id, specializations, bio,
        qualifications, experience_years, availability_timezone,
        status, is_verified, created_at, updated_at
    ) VALUES (
        current_user_id, 
        generated_teacher_id, 
        final_specializations,
        p_bio,
        p_qualifications,
        p_experience_years,
        p_availability_timezone,
        'active', 
        true, 
        now(), 
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        teacher_id = EXCLUDED.teacher_id,
        specializations = EXCLUDED.specializations,
        bio = EXCLUDED.bio,
        qualifications = EXCLUDED.qualifications,
        experience_years = EXCLUDED.experience_years,
        availability_timezone = EXCLUDED.availability_timezone,
        status = 'active',
        is_verified = true,
        updated_at = now()
    RETURNING id INTO teacher_id;
    
    -- Mark invitation as accepted
    UPDATE teacher_invitations 
    SET status = 'accepted', accepted_at = now(), updated_at = now()
    WHERE id = invitation_rec.id;
    
    RETURN jsonb_build_object(
        'success', true,
        'teacher_id', generated_teacher_id,
        'user_id', current_user_id,
        'email', current_user_email,
        'message', 'Teacher onboarding completed successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
