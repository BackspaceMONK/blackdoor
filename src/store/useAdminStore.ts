'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAdminLoggedIn: boolean;
  adminLogin: () => void;
  adminLogout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdminLoggedIn: false,
      adminLogin: () => set({ isAdminLoggedIn: true }),
      adminLogout: () => set({ isAdminLoggedIn: false }),
    }),
    {
      name: 'admin-storage',
    }
  )
);
