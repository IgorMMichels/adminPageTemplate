import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Read environment variables at runtime
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Internal immutable cache for the real client (lazily created)
let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;
  if (!isConfigured()) {
    throw new Error(
      'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    );
  }
  _supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
  return _supabase;
}

// Lightweight Proxy that forwards all property accesses to the lazily-initialized client
export const supabase = new Proxy({} as any, {
  get(_target, prop) {
    const client = getSupabaseClient();
    // Bind functions to the client to preserve 'this' context if needed
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  }
}) as any;

// Explicit helper to check configuration state from the outside
export const isSupabaseConfigured = isConfigured;
