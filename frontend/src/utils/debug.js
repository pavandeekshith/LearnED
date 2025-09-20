import { supabase } from '../lib/supabaseClient';

export const checkSupabaseConnection = async () => {
  try {
    console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
    console.log('Supabase Anon Key:', process.env.REACT_APP_SUPABASE_ANON_KEY ? '***' : 'Not set');
    
    // Test a simple query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return { connected: false, error: error.message };
    }
    
    console.log('Supabase connection successful!');
    return { connected: true };
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return { connected: false, error: error.message };
  }
};

// Run the check when this module is imported
checkSupabaseConnection();
