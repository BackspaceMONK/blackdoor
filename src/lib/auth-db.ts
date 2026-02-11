// Database-backed authentication using Supabase
import { supabase } from './supabase';

export const generateRecoveryCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 10 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
};

export interface User {
  id?: string;
  username: string;
  password: string;
  recovery_code: string;
  created_at?: string;
}

// Save user to database
export const saveUser = async (user: Omit<User, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        username: user.username,
        password: user.password,
        recovery_code: user.recovery_code
      }])
      .select();

    if (error) {
      console.error('Error saving user:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Exception saving user:', error);
    return { success: false, error: 'Failed to save user' };
  }
};

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching users:', error);
    return [];
  }
};

// Find user by username
export const findUser = async (username: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error finding user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception finding user:', error);
    return null;
  }
};

// Validate login
export const validateLogin = async (username: string, password: string): Promise<boolean> => {
  const user = await findUser(username);
  return user ? user.password === password : false;
};

// Reset password by recovery code
export const resetPasswordByCode = async (
  recoveryCode: string, 
  newPassword: string
): Promise<{ success: boolean; username?: string }> => {
  try {
    const normalizedCode = recoveryCode.toUpperCase().trim();
    
    // Find user by recovery code
    const { data: users, error: findError } = await supabase
      .from('users')
      .select('*')
      .ilike('recovery_code', normalizedCode);

    if (findError || !users || users.length === 0) {
      return { success: false };
    }

    const user = users[0];

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return { success: false };
    }

    return { success: true, username: user.username };
  } catch (error) {
    console.error('Exception resetting password:', error);
    return { success: false };
  }
};

// Update user password (admin function)
export const updateUserPassword = async (username: string, newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('username', username);

    if (error) {
      console.error('Error updating password:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating password:', error);
    return false;
  }
};

// Delete user (admin function)
export const deleteUser = async (username: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('username', username);

    if (error) {
      console.error('Error deleting user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception deleting user:', error);
    return false;
  }
};
