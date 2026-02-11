'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  username: string | null;
  recoveryCode: string | null;
  isLoggedIn: boolean;
  login: (username: string, recoveryCode: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: null,
      recoveryCode: null,
      isLoggedIn: false,
      login: (username, recoveryCode) => 
        set({ username, recoveryCode, isLoggedIn: true }),
      logout: () => 
        set({ username: null, recoveryCode: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
