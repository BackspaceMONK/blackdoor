'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import { useAuthStore } from '@/store/useAuthStore';
import { useCryptoPrices } from '@/hooks/useCryptoPrices';
import { Bitcoin, TrendingUp, ShoppingBag, CreditCard, LogIn, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { username, isLoggedIn } = useAuthStore();
  const { prices, changes, loading } = useCryptoPrices();
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
            Welcome back, <span className="neon-text text-emerald-400">{username}</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400">Access premium crypto accounts and services</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-12">
          <GlassCard className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <Bitcoin className="text-orange-400" size={24} />
              <div className={`flex items-center space-x-1 text-xs ${changes.BTC >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <TrendingUp size={12} />
                <span>{changes.BTC >= 0 ? '+' : ''}{changes.BTC.toFixed(2)}%</span>
              </div>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
              ${loading ? '...' : prices.BTC.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Bitcoin (BTC)</div>
          </GlassCard>

          <GlassCard className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <img src="/ethereum.svg" alt="Ethereum" className="w-6 h-6" />
              <div className={`flex items-center space-x-1 text-xs ${changes.ETH >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <TrendingUp size={12} />
                <span>{changes.ETH >= 0 ? '+' : ''}{changes.ETH.toFixed(2)}%</span>
              </div>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
              ${loading ? '...' : prices.ETH.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Ethereum (ETH)</div>
          </GlassCard>

          <GlassCard className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <img src="/bnb.svg" alt="BNB" className="w-6 h-6" />
              <div className={`flex items-center space-x-1 text-xs ${changes.BNB >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <TrendingUp size={12} />
                <span>{changes.BNB >= 0 ? '+' : ''}{changes.BNB.toFixed(2)}%</span>
              </div>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
              ${loading ? '...' : prices.BNB.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">BNB</div>
          </GlassCard>

          <GlassCard className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <DollarSign className="text-emerald-400" size={24} />
              <div className={`flex items-center space-x-1 text-xs ${changes.USDT >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <TrendingUp size={12} />
                <span>{changes.USDT >= 0 ? '+' : ''}{changes.USDT.toFixed(2)}%</span>
              </div>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">
              ${loading ? '...' : prices.USDT.toFixed(2)}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Tether (USDT)</div>
          </GlassCard>
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link href="/buy-cookies">
              <GlassCard hover className="h-full p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <ShoppingBag className="text-emerald-400" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Buy Cookies</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                    Get Binance, OKX, Bitget cookies with loaded balance
                  </p>
                  <div className="text-emerald-400 font-semibold text-sm">Starting at $50</div>
                </div>
              </GlassCard>
            </Link>

            <Link href="/request-card">
              <GlassCard hover className="h-full p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <CreditCard className="text-blue-400" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Request Card Load</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                    Custom card with your desired balance loaded
                  </p>
                  <div className="text-blue-400 font-semibold text-sm">$20 + 10% fee</div>
                </div>
              </GlassCard>
            </Link>

            <Link href="/buy-logins" className="sm:col-span-2 lg:col-span-1">
              <GlassCard hover className="h-full p-4 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <LogIn className="text-purple-400" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Buy Logins</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                    Direct account access (limited availability)
                  </p>
                  <div className="text-purple-400 font-semibold text-sm">Contact Admin</div>
                </div>
              </GlassCard>
            </Link>
          </div>
        </div>

        <GlassCard className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-gray-400 text-sm">Contact our support team on Telegram for assistance</p>
            </div>
            <a
              href="https://t.me/backspacemonkey1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition text-sm whitespace-nowrap"
            >
              Contact Support
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
