'use client';

import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">L</span>
            <span className="text-gray-900">MS</span>
          </span>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600">v1.0</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push('/login')}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/register')}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition hover:scale-105 hover:shadow-blue-500/40"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
