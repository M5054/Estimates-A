import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { clearAuthState } from '../utils/auth/storage';
import { AUTH_EVENTS } from '../utils/auth/constants';
import { handleMobileAuthNavigation } from '../utils/auth/mobile';
import type { AuthError } from '../utils/auth/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('[Auth] Error checking auth session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      setUser(data.user);
    } catch (error) {
      console.error('[Auth] Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (signUpError) throw signUpError;
      if (!newUser) throw new Error('Failed to create user account');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.id,
          email,
          name,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        await supabase.auth.signOut();
        throw profileError;
      }

      setUser(newUser);
    } catch (error) {
      const authError = error as AuthError;
      await supabase.auth.signOut();
      console.error('[Auth] Error signing up:', authError);
      throw authError;
    }
  };

  const signOut = async () => {
    try {
      console.log(`[Auth] ${AUTH_EVENTS.SIGN_OUT_START}`);
      
      // Clear user state immediately
      setUser(null);
      
      // Clear auth state from storage
      clearAuthState();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Handle navigation with a small delay to ensure cleanup
      await handleMobileAuthNavigation(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
        window.location.replace('/');
      });
      
      console.log(`[Auth] ${AUTH_EVENTS.SIGN_OUT_SUCCESS}`);
    } catch (error) {
      console.error(`[Auth] ${AUTH_EVENTS.SIGN_OUT_ERROR}:`, error);
      // Ensure redirection even if there's an error
      window.location.replace('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};