import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://juiffgxububozvqzvhih.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aWZmZ3h1YnVib3p2cXp2aGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzI1NzUsImV4cCI6MjA2NzQwODU3NX0.jFiEFFw98GmRrNb09lApUmEYZ0JHnfP6SmE1mYzG9kw';

export const getSupabaseClient = () => createClient(supabaseUrl, supabaseAnonKey);

// Utility function to get user profile
export const getUserProfile = async (userId: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) {
    throw new Error(`Error fetching profile: ${error.message}`);
  }
  return data;
};

// Utility function to update user profile
export const updateUserProfile = async (userId: string, updates: any) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single();
  if (error) {
    throw new Error(`Update profile error: ${error.message}`);
  }
  return data;
};
