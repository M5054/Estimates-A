import { supabase } from '../supabase';
import type { Database } from '../../types/supabase';

type Estimate = Database['public']['Tables']['estimates']['Row'];
type EstimateInsert = Database['public']['Tables']['estimates']['Insert'];
type EstimateUpdate = Database['public']['Tables']['estimates']['Update'];

export async function getEstimates(userId: string) {
  const { data, error } = await supabase
    .from('estimates')
    .select(`
      *,
      client:clients (
        id,
        name,
        company,
        email,
        phone
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching estimates:', error);
    throw error;
  }

  return data.map(estimate => ({
    ...estimate,
    items: typeof estimate.items === 'string' ? JSON.parse(estimate.items) : estimate.items
  }));
}

export async function getEstimate(estimateId: string) {
  const { data, error } = await supabase
    .from('estimates')
    .select(`
      *,
      client:clients (
        id,
        name,
        company,
        email,
        phone
      )
    `)
    .eq('id', estimateId)
    .single();

  if (error) {
    console.error('Error fetching estimate:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Estimate not found');
  }

  return {
    ...data,
    items: typeof data.items === 'string' ? JSON.parse(data.items) : data.items
  };
}

export async function createEstimate(estimate: EstimateInsert) {
  const { data, error } = await supabase
    .from('estimates')
    .insert({
      ...estimate,
      items: typeof estimate.items === 'string' 
        ? estimate.items 
        : JSON.stringify(estimate.items)
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating estimate:', error);
    throw error;
  }

  return data;
}

export async function updateEstimate(estimateId: string, estimate: EstimateUpdate) {
  const { client, ...updateData } = estimate;

  const { data, error } = await supabase
    .from('estimates')
    .update({
      ...updateData,
      items: typeof updateData.items === 'string'
        ? updateData.items
        : JSON.stringify(updateData.items)
    })
    .eq('id', estimateId)
    .select()
    .single();

  if (error) {
    console.error('Error updating estimate:', error);
    throw error;
  }

  return data;
}

export async function updateEstimateStatus(
  estimateId: string, 
  status: 'draft' | 'pending' | 'approved' | 'rejected'
) {
  const { data, error } = await supabase
    .from('estimates')
    .update({ status })
    .eq('id', estimateId)
    .select()
    .single();

  if (error) {
    console.error('Error updating estimate status:', error);
    throw error;
  }

  return data;
}

export async function deleteEstimate(estimateId: string) {
  const { error } = await supabase
    .from('estimates')
    .delete()
    .eq('id', estimateId);

  if (error) {
    console.error('Error deleting estimate:', error);
    throw error;
  }

  return true;
}