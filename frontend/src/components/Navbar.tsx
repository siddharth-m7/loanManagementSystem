'use client';

import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  
  return (
    <nav className="sticky top-0 z-50 border-b-2 border-[#0f0f0f] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => router.push('/')}>
          <span className="text-2xl font-black tracking-widest uppercase text-[#0f0f0f]">
            LMS
          </span>
          <span className="border-2 border-[#0f0f0f] bg-[#d97706] px-2 py-0.5 text-[10px] font-black uppercase text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
            v1.0
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="rounded border-2 border-[#0f0f0f] bg-white px-5 py-2 text-xs font-black uppercase tracking-widest text-[#0f0f0f] shadow-[4px_4px_0_0_rgba(15,15,15,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
          >
            LOGIN
          </button>
          <button
            onClick={() => router.push('/register')}
            className="rounded border-2 border-[#0f0f0f] bg-[#0f0f0f] px-5 py-2 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_rgba(217,119,6,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
          >
            GET STARTED
          </button>
        </div>
      </div>
    </nav>
  );
}
