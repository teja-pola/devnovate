
import { Database } from '@/integrations/supabase/types';

// Extend the Database types to include our custom tables
export interface ExtendedDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          user_type: 'candidate' | 'recruiter';
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          user_type?: 'candidate' | 'recruiter';
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          user_type?: 'candidate' | 'recruiter';
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          registered_at: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          registered_at?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          registered_at?: string | null;
        };
      };
    };
  };
}

// Create a helper type to get all valid table names
export type TableNames = keyof ExtendedDatabase['public']['Tables'];
