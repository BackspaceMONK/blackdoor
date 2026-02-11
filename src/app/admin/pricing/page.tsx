'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import GlassCard from '@/components/GlassCard';
import { useAdminStore } from '@/store/useAdminStore';
import { getSettings, saveSettings, Settings } from '@/lib/admin-db';
import { DollarSign, Plus, Trash2, Save } from 'lucide-react';

export default function AdminPricingPage() {
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

  const addTier = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      cookie_tiers: [
        ...settings.cookie_tiers,
        { min: 0, max: 0, price: 0 }
      ]
    });
  };

  const updateTier = (index: number, field: 'min' | 'max' | 'price', value: number) => {
    if (!settings) return;
    const newTiers = [...settings.cookie_tiers];
    newTiers[index][field] = value;
    setSettings({ ...settings, cookie_tiers: newTiers });
  };

  const deleteTier = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      cookie_tiers: settings.cookie_tiers.filter((_, i) => i !== index)
    });
  };

  if (!mounted || !isAdminLoggedIn || !settings) return null;

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-red-400">
            Pricing Management
          </h1>
          <p className="text-gray-400">Configure cookie tiers and card fees</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <GlassCard>
            <h3 className="text-lg font-bold mb-4">Card Base Fee</h3>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                value={settings.card_fee}
                onChange={(e) => setSettings({ ...settings, card_fee: Number(e.target.value) })}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-bold mb-4">Card Load Fee (%)</h3>
            <input
              type="number"
              value={settings.card_load_percentage}
              onChange={(e) => setSettings({ ...settings, card_load_percentage: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition"
            />
          </GlassCard>

          <GlassCard>
            <button
              onClick={handleSave}
              className="w-full h-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2"
            >
              <Save size={20} />
              <span>{saved ? 'Saved!' : 'Save All Changes'}</span>
            </button>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Cookie Pricing Tiers</h2>
            <button
              onClick={addTier}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Tier</span>
            </button>
          </div>

          <div className="space-y-4">
            {settings.cookie_tiers.map((tier, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium mb-2">Min Balance ($)</label>
                    <input
                      type="number"
                      value={tier.min}
                      onChange={(e) => updateTier(index, 'min', Number(e.target.value))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Balance ($)</label>
                    <input
                      type="number"
                      value={tier.max}
                      onChange={(e) => updateTier(index, 'max', Number(e.target.value))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => updateTier(index, 'price', Number(e.target.value))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition"
                    />
                  </div>
                  <button
                    onClick={() => deleteTier(index)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                  >
                    <Trash2 size={20} className="mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {settings.cookie_tiers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No pricing tiers configured. Click "Add Tier" to create one.
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
