'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import { useAuthStore } from '@/store/useAuthStore';
import { TELEGRAM_URL } from '@/lib/constants';
import { Shield, Lock, Key, AlertTriangle, MessageCircle } from 'lucide-react';

export default function BuyLoginsPage() {
  const { isLoggedIn } = useAuthStore();
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-text text-emerald-400">
            Buy Logins
          </h1>
          <p className="text-gray-400">
            Direct account access information
          </p>
        </div>

        <div className="space-y-6">
          <GlassCard className="text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-400" size={40} />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Service Currently Unavailable</h2>
            
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We currently don't offer direct login credentials for exchange accounts.
            </p>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Shield className="text-yellow-400" />
              <span>Why Logins Are Not Available</span>
            </h3>
            
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <Lock className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold mb-1">Two-Factor Authentication (2FA)</div>
                  <p className="text-sm text-gray-400">
                    Most exchanges require SMS, authenticator apps, or email verification for every login
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Key className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold mb-1">Hardware Security Keys</div>
                  <p className="text-sm text-gray-400">
                    Many users enable YubiKey, FIDO2, or other physical authentication devices
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold mb-1">Passkeys & Biometrics</div>
                  <p className="text-sm text-gray-400">
                    Modern passkey technology and fingerprint/face recognition make account access nearly impossible
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-emerald-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <div className="font-semibold mb-1">Behavioral Detection</div>
                  <p className="text-sm text-gray-400">
                    Advanced AI systems detect unusual login patterns, device changes, and location anomalies
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/30">
            <div className="text-center">
              <MessageCircle className="text-emerald-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold mb-3">Have a Workaround?</h3>
              <p className="text-gray-300 mb-6">
                If you have a specific target and a potential method to bypass these security measures, 
                contact our admin directly to discuss possibilities.
              </p>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition"
              >
                <MessageCircle size={20} />
                <span>Contact Admin on Telegram</span>
              </a>
            </div>
          </GlassCard>

          <GlassCard className="bg-blue-500/10 border-blue-500/30">
            <h3 className="font-bold mb-3 text-blue-400">💡 Alternative: Buy Cookies Instead</h3>
            <p className="text-sm text-gray-300 mb-4">
              Session cookies provide access to accounts without needing login credentials. 
              They bypass 2FA and other authentication methods since the session is already authenticated.
            </p>
            <button
              onClick={() => router.push('/buy-cookies')}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
            >
              View Cookie Options
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
