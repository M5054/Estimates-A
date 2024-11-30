import { supabase } from '../supabase';
import { handleSupabaseError } from '../supabase';
import { RetryOptions, QueryOptions } from '../types/api';

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  attempts: 3,
  delay: 1000,
  backoff: 2
};

export const fetchWithRetry = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  options: Partial<RetryOptions> = {}
): Promise<T> => {
  const { attempts, delay, backoff } = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError;
  
  for (let i = 0; i < attempts; i++) {
    try {
      const { data, error } = await operation();
      if (error) throw error;
      if (!data) throw new Error('No data returned from operation');
      return data;
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      
      if (i < attempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(backoff, i)));
      }
    }
  }
  
  return handleSupabaseError(lastError);
};

export const executeQuery = async <T>(
  tableName: string,
  query: any,
  options: QueryOptions,
  match?: Record<string, any>
): Promise<T> => {
  const { context, errorMessage } = options;
  
  try {
    let finalQuery = query;
    
    // Apply match conditions if provided
    if (match) {
      Object.entries(match).forEach(([key, value]) => {
        finalQuery = finalQuery.eq(key, value);
      });
    }
    
    const { data, error } = await finalQuery;
    
    if (error) {
      console.error(`[${context}] Database error:`, error);
      throw error;
    }
    
    // For delete operations, consider success even without returned data
    if (!data && context.includes('delete')) {
      return true as T;
    }
    
    if (!data) {
      console.error(`[${context}] No data returned`);
      throw new Error(errorMessage || 'No data returned from query');
    }
    
    return data as T;
  } catch (error) {
    console.error(`[${context}] Operation failed:`, error);
    return handleSupabaseError(error);
  }
};

export const supabaseClient = {
  select: async <T>(
    tableName: string,
    query: string,
    context: string,
    match?: Record<string, any>
  ): Promise<T> => {
    return executeQuery<T>(
      tableName,
      supabase.from(tableName).select(query),
      { context, errorMessage: `Failed to select from ${tableName}` },
      match
    );
  },
  
  insert: async <T>(
    tableName: string,
    data: any,
    context: string
  ): Promise<T> => {
    return executeQuery<T>(
      tableName,
      supabase.from(tableName).insert(data).select(),
      { context, errorMessage: `Failed to insert into ${tableName}` }
    );
  },
  
  update: async <T>(
    tableName: string,
    match: Record<string, any>,
    data: any,
    context: string
  ): Promise<T> => {
    return executeQuery<T>(
      tableName,
      supabase.from(tableName).update(data).match(match).select(),
      { context, errorMessage: `Failed to update ${tableName}` }
    );
  },
  
  delete: async <T>(
    tableName: string,
    match: Record<string, any>,
    context: string
  ): Promise<T> => {
    return executeQuery<T>(
      tableName,
      supabase.from(tableName).delete(),
      { context, errorMessage: `Failed to delete from ${tableName}` },
      match
    );
  }
};