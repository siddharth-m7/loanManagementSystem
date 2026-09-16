'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Navbar from '@/components/Navbar';

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
    <div className="flex flex-col min-h-screen bg-white selection:bg-orange-500 selection:text-white">
      {/* Global Grid Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40" 
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundPosition: 'center top'
        }}
      />
      
      <Navbar />
      
      <div className="relative z-10 flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-[420px] rounded-lg bg-white p-8 border-2 border-[#0f0f0f] shadow-[8px_8px_0_0_rgba(15,15,15,1)]">
        <h2 className="mb-8 text-center text-3xl font-black tracking-tighter text-[#0f0f0f]">
          Create Account
        </h2>
        
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-md bg-white p-4 text-sm font-bold text-red-600 border-2 border-red-500 shadow-[4px_4px_0_0_rgba(239,68,68,1)] animate-pulse">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#0f0f0f]">Full Name</label>
            <input
              type="text"
              required
              className="w-full rounded border-2 border-[#0f0f0f] bg-white py-3 px-4 text-sm font-bold text-[#0f0f0f] transition-all placeholder:text-gray-400 focus:border-[#d97706] focus:outline-none focus:ring-0 shadow-[2px_2px_0_0_rgba(15,15,15,1)]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#0f0f0f]">Email Address</label>
            <input
              type="email"
              required
              className="w-full rounded border-2 border-[#0f0f0f] bg-white py-3 px-4 text-sm font-bold text-[#0f0f0f] transition-all placeholder:text-gray-400 focus:border-[#d97706] focus:outline-none focus:ring-0 shadow-[2px_2px_0_0_rgba(15,15,15,1)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#0f0f0f]">Password</label>
            <input
              type="password"
              required
              className="w-full rounded border-2 border-[#0f0f0f] bg-white py-3 px-4 text-sm font-bold text-[#0f0f0f] transition-all placeholder:text-gray-400 focus:border-[#d97706] focus:outline-none focus:ring-0 shadow-[2px_2px_0_0_rgba(15,15,15,1)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#0f0f0f] px-4 py-3.5 text-sm font-bold tracking-widest text-white transition-all hover:bg-black hover:-translate-y-0.5 active:translate-y-0 shadow-[4px_4px_0_0_rgba(217,119,6,0.3)]"
          >
            CREATE ACCOUNT &rarr;
          </button>
        </form>
        
        <div className="mt-8 flex items-center justify-center gap-2 rounded bg-white p-4 text-xs font-bold text-[#0f0f0f] border-2 border-[#0f0f0f]/10">
          <span>Already have an account?</span>
          <button
            onClick={() => router.push('/login')}
            type="button"
            className="font-black text-[#d97706] hover:underline uppercase tracking-widest"
          >
            Login here
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
