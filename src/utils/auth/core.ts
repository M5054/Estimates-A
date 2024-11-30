import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { AuthError, UserProfile } from './types';
import { handleAuthError } from './errors';

export const getCurrentSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    return handleAuthError(error as AuthError);
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    return handleAuthError(error as AuthError);
  }
};

export const signUpWithPassword = async (
  email: string, 
  password: string, 
  userData: Partial<UserProfile>
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    return handleAuthError(error as AuthError);
  }
};

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    return handleAuthError(error as AuthError);
  }
};

export const createUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profile,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    return handleAuthError(error as AuthError);
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
};