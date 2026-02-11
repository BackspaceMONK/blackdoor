'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { calculateCookiePrice, getCookieTiers, CookieTier } from '@/lib/tiers';
import { EXCHANGES, Exchange } from '@/lib/constants';
import { ShoppingCart, DollarSign } from 'lucide-react';

export default function BuyCookiesPage() {
  const { isLoggedIn } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  
  const [selectedExchange, setSelectedExchange] = useState<Exchange>('Binance');
  const [balance, setBalance] = useState<number>(100);
  const [price, setPrice] = useState<number>(0);
  const [tiers, setTiers] = useState<CookieTier[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push('/login');
    }
  }, [mounted, isLoggedIn, router]);

  useEffect(() => {
    const loadTiers = async () => {
      const tiersData = await getCookieTiers();
      setTiers(tiersData);
    };
    loadTiers();
  }, []);

  useEffect(() => {
    const updatePrice = async () => {
      const newPrice = await calculateCookiePrice(balance);
      setPrice(newPrice);
    };
    updatePrice();
  }, [balance]);

  const handleAddToCart = () => {
    if (price === 0) {
      alert('Please enter a valid balance amount');
      return;
    }

    addItem({
      id: Date.now().toString(),
      type: 'cookie',
      exchange: selectedExchange,
      balance,
      price,
    });

    router.push('/cart');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-text text-emerald-400">
            Buy Cookies
          </h1>
          <p className="text-gray-400">
            Get exchange cookies with loaded balance - with or without email access
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-xl font-bold mb-4">Select Exchange</h2>
              <div className="grid grid-cols-3 gap-4">
                {EXCHANGES.map((exchange) => (
                  <button
                    key={exchange}
                    onClick={() => setSelectedExchange(exchange)}
                    className={`p-4 rounded-lg border-2 transition ${
                      selectedExchange === exchange
                        ? 'border-emerald-500 bg-emerald-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold">{exchange}</div>
                  </button>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="text-xl font-bold mb-4">Balance Amount</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Desired Balance (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      value={balance}
                      onChange={(e) => setBalance(Number(e.target.value))}
                      min={100}
                      max={10000}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Range: $100 - $10,000</span>
                  <input
                    type="range"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    min={100}
                    max={10000}
                    step={100}
                    className="w-1/2"
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="text-xl font-bold mb-4">Pricing Tiers</h2>
              <div className="space-y-2 text-sm">
                {tiers.map((tier, index) => (
                  <div
                    key={index}
                    className={`flex justify-between p-3 rounded-lg ${
                      balance >= tier.min && balance <= tier.max
                        ? 'bg-emerald-500/20 border border-emerald-500'
                        : 'bg-white/5'
                    }`}
                  >
                    <span className="text-gray-400">
                      ${tier.min.toLocaleString()} - ${tier.max.toLocaleString()}
                    </span>
                    <span className="font-semibold text-emerald-400">
                      ${tier.price}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div>
            <GlassCard className="sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Exchange</span>
                  <span className="font-semibold">{selectedExchange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Balance</span>
                  <span className="font-semibold">${balance.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-xl">
                    <span className="font-bold">Total Price</span>
                    <span className="font-bold text-emerald-400">
                      ${price}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={price === 0}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-400">
                  ℹ️ Cookies include session data with or without email access. 
                  Contact support for specific requirements.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
