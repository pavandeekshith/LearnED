import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    setupAuthListener();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data?.user_type === 'admin') {
          setUser({ ...user, ...data });
        } else {
          await supabase.auth.signOut();
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

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    }

    // Fetch user from users table to get user_type and other info
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError || !userData) {
      console.error('User table fetch error:', userError);
      throw new Error('User not found in database');
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
