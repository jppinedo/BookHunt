/**
 * supabaseClient.js — Phase E1: real Supabase client.
 *
 * Configured purely from Vite env vars (see .env.example):
 *   VITE_SUPABASE_URL       — the project URL
 *   VITE_SUPABASE_ANON_KEY  — the project's anon / publishable key
 *                             (a public client identifier; Row Level
 *                             Security is what protects the data)
 *
 * When either var is missing, `supabase` is null and the service layer
 * (BookFirestore.js) + AuthContext fall back to the in-memory mock
 * backend, so the demo/preview still runs with zero setup.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
