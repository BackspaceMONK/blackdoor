'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { useAuthStore } from '@/store/useAuthStore';
import { validateLogin, findUser } from '@/lib/auth-db';
import { Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt for username:', username);
    
    const isValid = await validateLogin(username, password);
    console.log('Login validation result:', isValid);
    
    if (isValid) {
      const user = await findUser(username);
      console.log('Found user:', user ? 'Yes' : 'No');
      
      if (user) {
        console.log('Login successful');
        login(username, user.recovery_code);
        router.push('/dashboard');
      } else {
        setError('User not found');
      }
    } else {
      console.log('Login failed - invalid credentials');
      setError('Invalid username or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold neon-text text-emerald-400 mb-2">
            BlackDoor
          </h1>
          <p className="text-gray-400">Access the underground marketplace</p>
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link href="/forgot-password" className="block text-sm text-emerald-400 hover:text-emerald-300">
            Forgot password?
          </Link>
          <div className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/signup" className="text-emerald-400 hover:text-emerald-300">
              Sign up
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
