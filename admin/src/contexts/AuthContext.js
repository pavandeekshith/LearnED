import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const isLoggingIn = useRef(false);
  
  const ADMIN_VERIFIED_KEY = 'learned_admin_verified';
  const ADMIN_PROFILE_KEY = 'learned_admin_profile';

  // Verify if user is admin
  const verifyAdminStatus = async (sessionUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (error) {
        console.error('Error verifying admin:', error);
        return null;
      }

      if (data?.user_type === 'admin') {
        return data;
      }

      return null;
    } catch (err) {
      console.error('Admin verification error:', err);
      return null;
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Skip if login is in progress (handled by login function)
        if (isLoggingIn.current) {
          return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (!session?.user) {
          // No session - clear everything and show login
          localStorage.removeItem(ADMIN_VERIFIED_KEY);
          localStorage.removeItem(ADMIN_PROFILE_KEY);
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        // We have a session - check cached admin profile first
        const cachedProfileRaw = localStorage.getItem(ADMIN_PROFILE_KEY);
        if (cachedProfileRaw) {
          try {
            const cachedProfile = JSON.parse(cachedProfileRaw);
            if (cachedProfile?.user_type === 'admin' && cachedProfile?.id === session.user.id) {
              if (isMounted) {
                setUser({ ...session.user, ...cachedProfile });
                setLoading(false);
              }
              return;
            }
          } catch (e) {
            localStorage.removeItem(ADMIN_PROFILE_KEY);
          }
        }

        // No valid cache - verify admin status
        const adminData = await verifyAdminStatus(session.user);
        
        if (adminData) {
          localStorage.setItem(ADMIN_VERIFIED_KEY, 'true');
          localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(adminData));
          if (isMounted) {
            setUser({ ...session.user, ...adminData });
          }
        } else {
          // Not an admin - clear session
          localStorage.removeItem(ADMIN_VERIFIED_KEY);
          localStorage.removeItem(ADMIN_PROFILE_KEY);
          await supabase.auth.signOut();
          if (isMounted) {
            setUser(null);
            setAuthError('Access denied. Admin privileges required.');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setUser(null);
          setAuthError(error?.message || 'Authentication failed');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      // Skip if login is being handled by login function
      if (isLoggingIn.current) return;

      if (event === 'SIGNED_OUT') {
        localStorage.removeItem(ADMIN_VERIFIED_KEY);
        localStorage.removeItem(ADMIN_PROFILE_KEY);
        setUser(null);
        setAuthError(null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Just update the session user part, keep admin data
        setUser(prev => prev ? { ...prev, ...session.user } : null);
      }
      // Note: SIGNED_IN is handled by login function directly
    });

    // Initialize on mount
    initializeAuth();

    // Failsafe timeout
    const failsafe = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth loading timeout - showing login');
        setLoading(false);
      }
    }, 8000);

    return () => {
      isMounted = false;
      clearTimeout(failsafe);
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    // Mark that we're handling login
    isLoggingIn.current = true;
    
    // Clear any previous state
    localStorage.removeItem(ADMIN_VERIFIED_KEY);
    localStorage.removeItem(ADMIN_PROFILE_KEY);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error);
        throw new Error('Invalid email or password');
      }

      // Fetch user from users table to verify admin access
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError || !userData) {
        console.error('User table fetch error:', userError);
        await supabase.auth.signOut();
        throw new Error('User not found in database');
      }

      // Only allow admin users
      if (userData.user_type !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      // Success - store admin data
      localStorage.setItem(ADMIN_VERIFIED_KEY, 'true');
      localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(userData));
      setUser({ ...data.user, ...userData });
      
      return { ...data.user, ...userData };
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      isLoggingIn.current = false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
    localStorage.removeItem(ADMIN_VERIFIED_KEY);
    localStorage.removeItem(ADMIN_PROFILE_KEY);
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
