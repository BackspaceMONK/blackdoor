// Database-backed admin functions using Supabase
import { supabase } from './supabase';

// Admin credentials (hardcoded for demo)
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'BackspaceMonkey';

export const validateAdmin = (username: string, password: string): boolean => {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
};

// Order management
export interface Order {
  id?: string;
  username: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at?: string;
}

export const getOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching orders:', error);
    return [];
  }
};

export const saveOrder = async (order: Omit<Order, 'id' | 'created_at'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .insert([order]);

    if (error) {
      console.error('Error saving order:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception saving order:', error);
    return false;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating order status:', error);
    return false;
  }
};

export const deleteOrder = async (orderId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) {
      console.error('Error deleting order:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception deleting order:', error);
    return false;
  }
};

// Settings management
export interface Settings {
  id?: string;
  cookie_tiers: Array<{ min: number; max: number; price: number }>;
  card_fee: number;
  card_load_percentage: number;
  btc_wallet: string;
  telegram_url: string;
  updated_at?: string;
}

export const getSettings = async (): Promise<Settings> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      // Return default settings if none exist
      return {
        cookie_tiers: [
          { min: 100, max: 400, price: 50 },
          { min: 401, max: 700, price: 100 },
          { min: 701, max: 1000, price: 200 },
          { min: 1001, max: 2000, price: 400 },
          { min: 2001, max: 4000, price: 600 },
          { min: 4001, max: 7000, price: 800 },
          { min: 7001, max: 10000, price: 1000 },
        ],
        card_fee: 20,
        card_load_percentage: 10,
        btc_wallet: 'bc1qawl5lrjn0way4unxw89keyhgryyss9tkc2rya9',
        telegram_url: 'https://t.me/backspacemonkey1',
      };
    }

    return data;
  } catch (error) {
    console.error('Exception fetching settings:', error);
    // Return default settings on error
    return {
      cookie_tiers: [
        { min: 100, max: 400, price: 50 },
        { min: 401, max: 700, price: 100 },
        { min: 701, max: 1000, price: 200 },
        { min: 1001, max: 2000, price: 400 },
        { min: 2001, max: 4000, price: 600 },
        { min: 4001, max: 7000, price: 800 },
        { min: 7001, max: 10000, price: 1000 },
      ],
      card_fee: 20,
      card_load_percentage: 10,
      btc_wallet: 'bc1qawl5lrjn0way4unxw89keyhgryyss9tkc2rya9',
      telegram_url: 'https://t.me/backspacemonkey1',
    };
  }
};

export const saveSettings = async (settings: Omit<Settings, 'id' | 'updated_at'>): Promise<boolean> => {
  try {
    // Get existing settings
    const { data: existing } = await supabase
      .from('settings')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating settings:', error);
        return false;
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('settings')
        .insert([settings]);

      if (error) {
        console.error('Error inserting settings:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Exception saving settings:', error);
    return false;
  }
};
