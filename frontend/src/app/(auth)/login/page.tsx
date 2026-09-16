'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import Navbar from '@/components/Navbar';

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

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
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
      setLoading(false);
    }
  };

  const handleDemoLogin = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
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
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black tracking-tighter text-[#0f0f0f]">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm font-semibold text-gray-500">Sign in to your LMS account</p>
        </div>
        
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-md bg-white p-4 text-sm font-bold text-red-600 border-2 border-red-500 shadow-[4px_4px_0_0_rgba(239,68,68,1)]">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-[#0f0f0f]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                className="w-full rounded border-2 border-[#0f0f0f] bg-white py-3 px-4 text-sm font-bold text-[#0f0f0f] transition-all placeholder:text-gray-400 focus:border-[#d97706] focus:outline-none focus:ring-0 shadow-[2px_2px_0_0_rgba(15,15,15,1)]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </div>
          </div>
          
          <div>
            <label className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-widest text-[#0f0f0f]">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                className="w-full rounded border-2 border-[#0f0f0f] bg-white py-3 px-4 text-sm font-bold text-[#0f0f0f] transition-all placeholder:text-gray-400 focus:border-[#d97706] focus:outline-none focus:ring-0 shadow-[2px_2px_0_0_rgba(15,15,15,1)]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#0f0f0f] px-4 py-3.5 text-sm font-bold tracking-widest text-white transition-all hover:bg-black hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:-translate-y-0 shadow-[4px_4px_0_0_rgba(217,119,6,0.3)]"
          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
            ) : (
              'SIGN IN →'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-[#0f0f0f]/10 text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white px-2">Or try a demo</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <button onClick={() => handleDemoLogin('amit@creditsea.com', 'password123')} className="rounded border-2 border-[#0f0f0f] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#d97706] transition hover:bg-[#0f0f0f] hover:text-white shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px]">Borrower</button>
          <button onClick={() => handleDemoLogin('admin@creditsea.com', 'password123')} className="rounded border-2 border-[#0f0f0f] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] transition hover:bg-[#0f0f0f] hover:text-white shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px]">Admin</button>
          <button onClick={() => handleDemoLogin('sales@creditsea.com', 'password123')} className="rounded border-2 border-[#0f0f0f] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] transition hover:bg-[#0f0f0f] hover:text-white shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px]">Sales</button>
          <button onClick={() => handleDemoLogin('sanction@creditsea.com', 'password123')} className="rounded border-2 border-[#0f0f0f] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] transition hover:bg-[#0f0f0f] hover:text-white shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px]">Sanction</button>
          <button onClick={() => handleDemoLogin('disbursement@creditsea.com', 'password123')} className="rounded border-2 border-[#0f0f0f] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] transition hover:bg-[#0f0f0f] hover:text-white shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px]">Disbursal</button>
          <button onClick={() => handleDemoLogin('collection@creditsea.com', 'password123')} className="rounded border-2 border-[#0f0f0f] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] transition hover:bg-[#0f0f0f] hover:text-white shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px]">Collection</button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 rounded bg-white p-4 text-xs font-bold text-[#0f0f0f] border-2 border-[#0f0f0f]/10">
          <span>New here?</span>
          <button
            onClick={() => router.push('/register')}
            className="font-black text-[#d97706] hover:underline uppercase tracking-widest"
          >
            Create an Account
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
