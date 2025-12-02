import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          
          // Admin app only allows admin users
          if (data?.user_type === 'admin') {
            setUser({ ...user, ...data });
          } else {
            await supabase.auth.signOut();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    const setupAuthListener = () => {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN') {
          await checkUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });
      return () => data.subscription.unsubscribe();
    };

    checkUser();
    const cleanup = setupAuthListener();
    return cleanup;
  }, []);

  const login = async (email, password) => {
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

    // Only allow admin users in admin app
    if (userData.user_type !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Access denied. Admin privileges required.');
    }

    setUser({ ...data.user, ...userData });
    return { ...data.user, ...userData };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
