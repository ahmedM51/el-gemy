import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback to provided credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ogmngsymbqlyayhdscuf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbW5nc3ltYnFseWF5aGRzY3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNTg1MDcsImV4cCI6MjEwNjgzNDUwN30.gi-YVLH9VjM5R1XLmzKccxqxSTbcAjtoaNQBtwtDp4w';

/**
 * Public client for client-side queries complying with RLS
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
