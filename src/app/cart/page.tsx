'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { isLoggedIn } = useAuthStore();
  const { items, removeItem, getTotal } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/login');
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted || !isLoggedIn) return null;

  const total = getTotal();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-text text-emerald-400">
            Shopping Cart
          </h1>
          <p className="text-gray-400">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <GlassCard className="text-center py-12">
            <ShoppingCart className="text-gray-400 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some items to get started</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition"
            >
              Browse Services
            </button>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {items.map((item) => (
                <GlassCard key={item.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">
                        {item.type === 'cookie' ? 'Cookie Purchase' : 'Card Load Request'}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-400">
                        {item.type === 'cookie' ? (
                          <>
                            <div>Exchange: <span className="text-white">{item.exchange}</span></div>
                            <div>Balance: <span className="text-white">${item.balance?.toLocaleString()}</span></div>
                          </>
                        ) : (
                          <>
                            <div>Card Name: <span className="text-white">{item.cardName}</span></div>
                            <div>Load Amount: <span className="text-white">${item.loadAmount?.toLocaleString()}</span></div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400">
                          ${item.price}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            <GlassCard className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-400 mb-1">Total Amount</div>
                  <div className="text-3xl font-bold text-emerald-400">
                    ${total}
                  </div>
                </div>
                <button
                  onClick={() => router.push('/checkout')}
                  className="flex items-center space-x-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
