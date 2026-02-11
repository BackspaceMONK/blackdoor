'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { calculateCardPrice } from '@/lib/tiers';
import { CreditCard, DollarSign, User } from 'lucide-react';

export default function RequestCardPage() {
  const { isLoggedIn } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  
  const [cardName, setCardName] = useState('');
  const [loadAmount, setLoadAmount] = useState<number>(100);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [cardFee, setCardFee] = useState<number>(20);
  const [loadFeePercentage, setLoadFeePercentage] = useState<number>(10);
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
    const loadSettings = async () => {
      const { getSettings } = await import('@/lib/admin-db');
      const settings = await getSettings();
      setCardFee(settings.card_fee);
      setLoadFeePercentage(settings.card_load_percentage);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const updatePrice = async () => {
      const newPrice = await calculateCardPrice(loadAmount);
      setTotalPrice(newPrice);
    };
    updatePrice();
  }, [loadAmount]);

  const handleAddToCart = () => {
    if (!cardName.trim()) {
      alert('Please enter a card name');
      return;
    }

    if (loadAmount < 100) {
      alert('Minimum load amount is $100');
      return;
    }

    addItem({
      id: Date.now().toString(),
      type: 'card',
      cardName,
      loadAmount,
      price: totalPrice,
    });

    router.push('/cart');
  };

  if (!isLoggedIn) return null;

  const loadFee = Math.round(loadAmount * (loadFeePercentage / 100));

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-text text-emerald-400">
            Request Card Load
          </h1>
          <p className="text-gray-400">
            Get a custom card with your desired balance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-xl font-bold mb-4">Card Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Card Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe or random name"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Can be your real name or a random name
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Load Amount (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="number"
                      value={loadAmount}
                      onChange={(e) => setLoadAmount(Number(e.target.value))}
                      min={100}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Minimum: $100
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="bg-yellow-500/10 border-yellow-500/30">
              <h3 className="font-bold mb-2 text-yellow-400">⚠️ Important Notice</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  • You only pay the card fee (${cardFee}) + {loadFeePercentage}% processing fee here
                </p>
                <p>
                  • DO NOT send the load amount through this checkout
                </p>
                <p>
                  • After payment, contact Telegram admin with:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Payment screenshot</li>
                  <li>Card name</li>
                  <li>Load amount details</li>
                </ul>
                <p className="text-yellow-400 font-semibold mt-3">
                  This is for security purposes and faster processing
                </p>
              </div>
            </GlassCard>
          </div>

          <div>
            <GlassCard className="sticky top-24">
              <h2 className="text-xl font-bold mb-6">Price Breakdown</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Card Name</span>
                  <span className="font-semibold">{cardName || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Load Amount</span>
                  <span className="font-semibold">${loadAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Card Fee</span>
                    <span>${cardFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processing Fee ({loadFeePercentage}%)</span>
                    <span>${loadFee}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-xl">
                      <span className="font-bold">Total to Pay Now</span>
                      <span className="font-bold text-emerald-400">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!cardName.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition flex items-center justify-center space-x-2"
              >
                <CreditCard size={20} />
                <span>Proceed to Payment</span>
              </button>

              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400 font-semibold">
                  Remember: Share load amount details privately with admin on Telegram after payment
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
