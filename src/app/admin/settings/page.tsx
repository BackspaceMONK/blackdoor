'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import GlassCard from '@/components/GlassCard';
import { useAdminStore } from '@/store/useAdminStore';
import { getSettings, saveSettings, Settings } from '@/lib/admin-db';
import { Save, Bitcoin, MessageCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const { isAdminLoggedIn } = useAdminStore();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAdminLoggedIn) {
      router.push('/admin/login');
    } else if (mounted && isAdminLoggedIn) {
      loadSettings();
    }
  }, [mounted, isAdminLoggedIn, router]);

  const loadSettings = async () => {
    const settingsData = await getSettings();
    setSettings(settingsData);
  };

  const handleSave = async () => {
    if (settings) {
      const success = await saveSettings(settings);
      if (success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert('Failed to save settings');
      }
    }
  };

  if (!mounted || !isAdminLoggedIn || !settings) return null;

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-red-400">
            System Settings
          </h1>
          <p className="text-gray-400">Configure payment and contact information</p>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <div className="flex items-center space-x-3 mb-6">
              <Bitcoin className="text-orange-400" size={32} />
              <h2 className="text-2xl font-bold">Bitcoin Wallet</h2>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">BTC Wallet Address</label>
              <input
                type="text"
                value={settings.btc_wallet}
                onChange={(e) => setSettings({ ...settings, btc_wallet: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition font-mono text-sm"
                placeholder="bc1q..."
              />
              <p className="text-xs text-gray-400 mt-2">
                This wallet address will be shown to users during checkout
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center space-x-3 mb-6">
              <MessageCircle className="text-blue-400" size={32} />
              <h2 className="text-2xl font-bold">Telegram Contact</h2>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telegram URL</label>
              <input
                type="text"
                value={settings.telegram_url}
                onChange={(e) => setSettings({ ...settings, telegram_url: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition"
                placeholder="https://t.me/username"
              />
              <p className="text-xs text-gray-400 mt-2">
                Users will be directed to this Telegram account for support
              </p>
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Save Changes</h3>
                <p className="text-gray-400 text-sm">
                  Changes will take effect immediately across the site
                </p>
              </div>
              <button
                onClick={handleSave}
                className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition flex items-center space-x-2"
              >
                <Save size={20} />
                <span>{saved ? 'Saved!' : 'Save Settings'}</span>
              </button>
            </div>
          </GlassCard>

          <GlassCard className="bg-yellow-500/10 border-yellow-500/30">
            <h3 className="font-bold mb-3 text-yellow-400">⚠️ Important Notes</h3>
            <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
              <li>All settings are stored in Supabase database</li>
              <li>Changes affect all users immediately</li>
              <li>Make sure to test payment flows after changing wallet address</li>
              <li>Verify Telegram URL is correct before saving</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
