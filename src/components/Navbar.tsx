'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, LogOut, Home, ShoppingBag, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { username, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="text-xl sm:text-2xl font-bold neon-text text-emerald-400">
              BlackDoor
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="flex items-center space-x-2 hover:text-emerald-400 transition text-sm">
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 hover:text-emerald-400 transition text-sm">
                <ShoppingBag size={18} />
                <span>Shop</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 glass rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/buy-cookies" className="block px-4 py-2 hover:bg-white/10 rounded-t-lg text-sm">
                  Buy Cookies
                </Link>
                <Link href="/request-card" className="block px-4 py-2 hover:bg-white/10 text-sm">
                  Request Card Load
                </Link>
                <Link href="/buy-logins" className="block px-4 py-2 hover:bg-white/10 rounded-b-lg text-sm">
                  Buy Logins
                </Link>
              </div>
            </div>

            <Link href="/cart" className="relative flex items-center space-x-2 hover:text-emerald-400 transition">
              <ShoppingCart size={18} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>

            <div className="flex items-center space-x-3 pl-6 border-l border-white/10">
              <span className="text-sm text-gray-400">{username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:text-red-400 transition"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex md:hidden items-center space-x-3">
            <Link href="/cart" className="relative">
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-lg transition"
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>

            <div className="border-t border-white/10 my-2"></div>
            
            <div className="text-xs text-gray-400 px-3 py-1 font-semibold">SHOP</div>
            
            <Link
              href="/buy-cookies"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-lg transition"
            >
              <ShoppingBag size={20} />
              <span>Buy Cookies</span>
            </Link>

            <Link
              href="/request-card"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-lg transition"
            >
              <ShoppingBag size={20} />
              <span>Request Card Load</span>
            </Link>

            <Link
              href="/buy-logins"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-lg transition"
            >
              <ShoppingBag size={20} />
              <span>Buy Logins</span>
            </Link>

            <div className="border-t border-white/10 my-2"></div>

            <div className="px-3 py-2 text-sm text-gray-400">
              Logged in as: <span className="text-white font-semibold">{username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-red-500/20 text-red-400 rounded-lg transition w-full"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
