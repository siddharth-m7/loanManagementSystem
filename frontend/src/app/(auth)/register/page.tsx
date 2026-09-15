'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Register the account
      await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      
      // Immediately log them in
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.name);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="w-full max-w-md rounded-2xl bg-white/70 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl border border-white/50">
        <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-gray-900">
          Create Account
        </h2>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 animate-pulse">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
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
              className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm font-medium text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 transition-colors hover:text-indigo-700 hover:underline">
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}
