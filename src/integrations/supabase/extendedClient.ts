
// Extended Supabase client with our custom table types
import { createClient } from '@supabase/supabase-js';
import type { ExtendedDatabase } from '@/types/supabase';

const SUPABASE_URL = "https://hbqkifzzchpxftogjyuf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicWtpZnp6Y2hweGZ0b2dqeXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTg1OTcsImV4cCI6MjA1Nzk5NDU5N30.pYsWWsAqHQpFXL1x59DvMJO1idPbVP89PKOoEeomPA4";

export const supabaseExtended = createClient<ExtendedDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase-auth',
  }
});
