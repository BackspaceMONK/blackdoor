'use client';

import Link from 'next/link';
import { useAdminStore } from '@/store/useAdminStore';
import { LogOut, Shield, Users, Settings, ShoppingCart, DollarSign, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminNavbar() {
  const { adminLogout } = useAdminStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    setMobileMenuOpen(false);
    router.push('/admin/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <Shield className="text-red-400" size={20} />
            <div className="text-lg sm:text-2xl font-bold text-red-400">
              Admin Panel
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/admin/dashboard" className="flex items-center space-x-2 hover:text-red-400 transition text-sm">
              <ShoppingCart size={18} />
              <span>Orders</span>
            </Link>
            
            <Link href="/admin/users" className="flex items-center space-x-2 hover:text-red-400 transition text-sm">
              <Users size={18} />
              <span>Users</span>
            </Link>

            <Link href="/admin/pricing" className="flex items-center space-x-2 hover:text-red-400 transition text-sm">
              <DollarSign size={18} />
              <span>Pricing</span>
            </Link>

            <Link href="/admin/settings" className="flex items-center space-x-2 hover:text-red-400 transition text-sm">
              <Settings size={18} />
              <span>Settings</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:text-red-400 transition pl-6 border-l border-white/10"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-red-500/20">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/admin/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-lg transition"
            >
              <ShoppingCart size={20} />
              <span>Orders</span>
            </Link>

            <Link
              href="/admin/users"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-lg transition"
            >
              <Users size={20} />
              <span>Users</span>
            </Link>

            <Link
              href="/admin/pricing"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-lg transition"
            >
              <DollarSign size={20} />
              <span>Pricing</span>
            </Link>

            <Link
              href="/admin/settings"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-lg transition"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>

            <div className="border-t border-white/10 my-2"></div>

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
