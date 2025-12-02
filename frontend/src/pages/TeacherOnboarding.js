import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const TeacherOnboarding = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        profilePictureUrl: '',
        bio: '',
        qualifications: '',
        experience_years: '',
        specializations: '',
        availability_timezone: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState('');
    const [invitation, setInvitation] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('🔍 TeacherOnboarding mounted');
        console.log('📍 Current URL:', window.location.href);
        console.log('🔗 Hash:', window.location.hash);
        
        const handleAuthChange = async (event, session) => {
            console.log('🔐 Auth event:', event);
            console.log('👤 Session:', session);
            console.log('⏰ Auth loading state BEFORE:', authLoading);
            
            if (event === 'SIGNED_IN' && session?.user) {
                const user = session.user;
                console.log('✅ User authenticated:', user);
                console.log('📧 User email:', user.email);
                console.log('📝 User metadata:', user.user_metadata);
                
                setEmail(user.email);
                setFormData(prev => ({
                    ...prev,
                    firstName: user.user_metadata.first_name || '',
                    lastName: user.user_metadata.last_name || ''
                }));
                
                // Check for valid invitation
                try {
                    console.log('🔍 Checking for invitation...');
                    const { data: invitations, error: inviteError } = await supabase
                        .from('teacher_invitations')
                        .select('*')
                        .eq('email', user.email)
                        .eq('status', 'pending')
                        .gt('expires_at', new Date().toISOString())
                        .limit(1);
                    
                    console.log('📨 Invitation query result:', invitations);
                    
                    if (inviteError) {
                        console.error('❌ Invitation query error:', inviteError);
                        setError('Error checking invitation: ' + inviteError.message);
                        setAuthLoading(false);  // CRITICAL: Set loading to false even on error
                    } else if (!invitations || invitations.length === 0) {
                        console.warn('⚠️ No valid invitation found');
                        setError('No valid invitation found for ' + user.email);
                        setAuthLoading(false);  // CRITICAL: Set loading to false
                    } else {
                        console.log('✅ Valid invitation found:', invitations[0]);
                        setInvitation(invitations[0]);
                        setFormData(prev => ({
                            ...prev,
                            firstName: invitations[0].first_name || user.user_metadata.first_name || '',
                            lastName: invitations[0].last_name || user.user_metadata.last_name || ''
                        }));
                        setAuthLoading(false);  // CRITICAL: Set loading to false on success
                    }
                } catch (err) {
                    console.error('💥 Unexpected error:', err);
                    setError('Unexpected error: ' + err.message);
                }
                
                setAuthLoading(false);
            } else if (event === 'SIGNED_OUT') {
                console.log('🚪 User signed out');
                setAuthLoading(false);
            }
        };

        const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthChange);

        // Handle the case where the user is already signed in when the component mounts
        const checkSession = async () => {
            console.log('🔍 Checking existing session...');
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
                console.error('❌ Session error:', sessionError);
                setError('Authentication error: ' + sessionError.message);
                setAuthLoading(false);
                return;
            }
            
            if (session?.user) {
                console.log('✅ Existing session found');
                await handleAuthChange('SIGNED_IN', session);
            } else {
                console.log('⚠️ No existing session');
                setError('No authentication found. Please check your email and click the magic link again.');
                setAuthLoading(false);
            }
        };
        checkSession();

        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('📝 Starting teacher onboarding submission...');
            
            // 1. Update the user's password
            console.log('🔐 Updating password...');
            const { error: passwordError } = await supabase.auth.updateUser({
                password: formData.password
            });

            if (passwordError) {
                console.error('❌ Password update error:', passwordError);
                throw passwordError;
            }
            console.log('✅ Password updated successfully');

            // 2. Call the RPC to complete the onboarding process
            console.log('📞 Calling complete_teacher_onboarding RPC...');
            const { data: rpcData, error: rpcError } = await supabase.rpc('complete_teacher_onboarding', {
                p_first_name: formData.firstName || null,
                p_last_name: formData.lastName || null,
                p_phone: formData.phoneNumber || null,
                p_profile_image_url: formData.profilePictureUrl || null,
                p_bio: formData.bio || null,
                p_qualifications: formData.qualifications || null,
                p_experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
                p_specializations: formData.specializations 
                    ? formData.specializations.split(',').map(s => s.trim()).filter(Boolean) 
                    : null,
                p_availability_timezone: formData.availability_timezone || null
            });

            if (rpcError) {
                console.error('❌ RPC error:', rpcError);
                throw rpcError;
            }
            
            console.log('✅ Onboarding completed successfully:', rpcData);

            setLoading(false);
            alert('Onboarding complete! You have been successfully registered as a teacher. You can now login using the mobile app.');
            
            // Sign out to clear the session
            await supabase.auth.signOut();
            navigate('/'); // Redirect to home page

        } catch (error) {
            console.error('💥 Onboarding error:', error);
            setError(error.message || 'An unexpected error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Complete Your Teacher Profile</h2>
                
                {authLoading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-gray-600">Verifying your authentication...</p>
                    </div>
                )}
                
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                {!authLoading && !invitation && (
                    <div className="text-center py-4">
                        <p className="text-gray-600">Please check your email and click the magic link to continue.</p>
                    </div>
                )}

                {!authLoading && invitation && <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            disabled
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                     <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profilePictureUrl">
                            Profile Picture URL
                        </label>
                        <input
                            type="text"
                            name="profilePictureUrl"
                            id="profilePictureUrl"
                            value={formData.profilePictureUrl}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                            Bio / About Me
                        </label>
                        <textarea
                            name="bio"
                            id="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="4"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="qualifications">
                            Qualifications
                        </label>
                        <input
                            type="text"
                            name="qualifications"
                            id="qualifications"
                            value={formData.qualifications}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience_years">
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            name="experience_years"
                            id="experience_years"
                            value={formData.experience_years}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specializations">
                            Specializations (comma-separated)
                        </label>
                        <input
                            type="text"
                            name="specializations"
                            id="specializations"
                            value={formData.specializations}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="availability_timezone">
                            Timezone
                        </label>
                        <input
                            type="text"
                            name="availability_timezone"
                            id="availability_timezone"
                            value={formData.availability_timezone}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-gray-400"
                        >
                            {loading ? 'Submitting...' : 'Complete Registration'}
                        </button>
                    </div>
                </form>}
            </div>
        </div>
    );
};

export default TeacherOnboarding;
