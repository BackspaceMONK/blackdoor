'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Exchange } from '@/lib/constants';

export interface CartItem {
  id: string;
  type: 'cookie' | 'card';
  exchange?: Exchange;
  balance?: number;
  cardName?: string;
  loadAmount?: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => 
        set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) => 
        set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      getTotal: () => 
        get().items.reduce((sum, item) => sum + item.price, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
