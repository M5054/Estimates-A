import { supabase } from '../supabase';
import type { Database } from '../../types/supabase';
import { uploadLogo, deleteLogo } from './storage';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(userId: string, profile: ProfileUpdate, logoFile?: File | null) {
  try {
    let logoUrl = profile.business_logo;

    // Handle logo upload if a new file is provided
    if (logoFile) {
      logoUrl = await uploadLogo(logoFile, userId);
    }

    // If there's an existing logo and we're either removing it or replacing it
    if (profile.business_logo && (logoFile || profile.business_logo === null)) {
      await deleteLogo(profile.business_logo);
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...profile, business_logo: logoUrl })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}