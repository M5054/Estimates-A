import { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  name?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}