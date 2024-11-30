import { supabase } from '../supabase';

export async function initializeDatabase() {
  // Create profiles table
  const { error: profilesError } = await supabase.rpc('create_profiles_table');
  if (profilesError) {
    console.error('Error creating profiles table:', profilesError);
    throw profilesError;
  }

  // Create clients table
  const { error: clientsError } = await supabase.rpc('create_clients_table');
  if (clientsError) {
    console.error('Error creating clients table:', clientsError);
    throw clientsError;
  }

  // Create estimates table
  const { error: estimatesError } = await supabase.rpc('create_estimates_table');
  if (estimatesError) {
    console.error('Error creating estimates table:', estimatesError);
    throw estimatesError;
  }
}