import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://nazfoqogumrzayzktxbw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hemZvcW9ndW1yemF5emt0eGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3Nzc2MzcsImV4cCI6MjA0ODM1MzYzN30.9ru5PRknAAfwMbwVduSODZUrY0BlloYmbcLa5xJW1Lg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'estimado-pro@1.0.0'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export const handleSupabaseError = (error: any): never => {
  console.error('[Supabase Error]:', error);
  
  const errorMessage = error?.message || 'An unexpected error occurred';
  const errorCode = error?.code || 'UNKNOWN_ERROR';
  
  throw {
    message: errorMessage,
    code: errorCode,
    details: error?.details || error,
    hint: error?.hint || ''
  };
};