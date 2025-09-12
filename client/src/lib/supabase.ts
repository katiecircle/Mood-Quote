import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Use Vite env on client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | undefined;

export function getSupabaseClient(): SupabaseClient | undefined {
  if (!supabaseUrl || !supabaseAnonKey) {
    return undefined;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}


