import { supabase } from '../supabase';
import type { Database } from '../../types/supabase';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export async function getClients(userId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Client[];
}

export async function getClient(clientId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (error) throw error;
  return data as Client;
}

export async function createClient(client: ClientInsert) {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single();

  if (error) throw error;
  return data as Client;
}

export async function updateClient(clientId: string, client: ClientUpdate) {
  const { data, error } = await supabase
    .from('clients')
    .update(client)
    .eq('id', clientId)
    .select()
    .single();

  if (error) throw error;
  return data as Client;
}

export async function deleteClient(clientId: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId);

  if (error) throw error;
}