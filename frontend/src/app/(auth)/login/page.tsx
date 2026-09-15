'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.name);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleDemoLogin = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl border border-white/50">
        <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-gray-900">
          Welcome Back
        </h2>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 animate-pulse">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-gray-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/40 active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 border-t border-gray-200/60 pt-6">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
            Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              onClick={() => handleDemoLogin('admin@creditsea.com', 'admin')}
              className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 active:bg-gray-300"
            >
              Admin
            </button>
            <button
              onClick={() => handleDemoLogin('sales@creditsea.com', 'password123')}
              className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 active:bg-blue-200"
            >
              Sales
            </button>
            <button
              onClick={() => handleDemoLogin('sanction@creditsea.com', 'password123')}
              className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 active:bg-indigo-200"
            >
              Sanction
            </button>
            <button
              onClick={() => handleDemoLogin('disbursement@creditsea.com', 'password123')}
              className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 active:bg-green-200"
            >
              Disbursement
            </button>
            <button
              onClick={() => handleDemoLogin('collection@creditsea.com', 'password123')}
              className="rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 active:bg-orange-200"
            >
              Collection
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col items-center justify-center space-y-4 pt-4 text-sm font-medium text-gray-600 border-t border-gray-200/60">
          <p>Don't have an account?</p>
          <button
            onClick={() => router.push('/register')}
            className="w-full rounded-xl border-2 border-blue-600 bg-white px-4 py-3 font-bold text-blue-600 shadow-sm transition-all hover:bg-blue-50 active:scale-[0.98]"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
