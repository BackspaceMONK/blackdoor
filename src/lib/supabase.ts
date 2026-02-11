import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id?: string;
  username: string;
  password: string;
  recovery_code: string;
  created_at?: string;
}

export interface Order {
  id?: string;
  username: string;
  items: any;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface Settings {
  id?: string;
  cookie_tiers: any;
  card_fee: number;
  card_load_percentage: number;
  btc_wallet: string;
  telegram_url: string;
  updated_at?: string;
}
