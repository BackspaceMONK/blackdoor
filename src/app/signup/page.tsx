'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { useAuthStore } from '@/store/useAuthStore';
import { generateRecoveryCode, saveUser, findUser } from '@/lib/auth-db';
import { Lock, User, Copy, Check } from 'lucide-react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Check if username exists
    const existingUser = await findUser(username);
    if (existingUser) {
      setError('Username already exists');
      setLoading(false);
      return;
    }

    const code = generateRecoveryCode();
    const result = await saveUser({ username, password, recovery_code: code });
    
    if (result.success) {
      setRecoveryCode(code);
      setShowRecoveryModal(true);
    } else {
      setError(result.error || 'Failed to create account');
    }
    
    setLoading(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(recoveryCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    login(username, recoveryCode);
    router.push('/dashboard');
  };

  if (showRecoveryModal) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-emerald-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">
              Save Your Recovery Code
            </h2>
            <p className="text-gray-400 text-sm">
              This is your ONLY way to recover your account. Save it securely!
            </p>
          </div>

          <div className="bg-emerald-500/10 border-2 border-emerald-500 rounded-lg p-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-emerald-400 tracking-wider mb-4">
                {recoveryCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center space-x-2 mx-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm text-center">
              ⚠️ Without this code, you cannot reset your password!
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition"
          >
            I've Saved My Code - Continue
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold neon-text text-emerald-400 mb-2">
            Join BlackDoor
          </h1>
          <p className="text-gray-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-emerald-500 transition"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
              Sign in
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
