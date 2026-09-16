'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState<string>('User');
  const [role, setRole] = useState<string>('BORROWER');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole') || 'BORROWER';
    if (name) setUserName(name);
    setRole(userRole);
  }, []);

  const getNavItems = () => {
    const items = [];

    if (role !== 'ADMIN') {
      items.push({
        label: 'My Dashboard',
        path: '/dashboard',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
      });
    }

    if (role === 'BORROWER') {
      items.push({
        label: 'Apply for a Loan',
        path: '/apply',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
      });
    }

    if (role === 'ADMIN') {
      items.push(
        {
          label: 'Sales',
          path: '/dashboard?tab=sales',
          icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        },
        {
          label: 'Sanction',
          path: '/dashboard?tab=sanction',
          icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
          label: 'Disbursement',
          path: '/dashboard?tab=disbursement',
          icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
          label: 'Collection',
          path: '/dashboard?tab=collection',
          icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        }
      );
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans selection:bg-orange-500 selection:text-white">
      {/* Global Grid Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40" 
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundPosition: 'center top'
        }}
      />
      
      {/* Top Navbar */}
      <header className="flex h-16 shrink-0 items-center justify-between bg-white px-6 shadow-[0_4px_0_0_rgba(15,15,15,1)] z-20 border-b-2 border-[#0f0f0f] relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="flex h-8 w-8 items-center justify-center rounded bg-white text-[#0f0f0f] border-2 border-[#0f0f0f] hover:bg-[#0f0f0f] hover:text-white transition-colors mr-2 shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px]"
            title="Go Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2 rounded px-2 py-1 border-2 border-[#0f0f0f] bg-white">
            <span className="h-2 w-2 rounded-full bg-[#10b981]"></span>
            <span className="text-xs font-black tracking-widest text-[#0f0f0f] uppercase">
              LMS
            </span>
          </div>
        </div>
        

        <div className="flex items-center gap-5">

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-[#0f0f0f] uppercase tracking-widest leading-tight">{userName}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase">{role}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded border-2 border-[#0f0f0f] bg-white text-[#0f0f0f] font-black uppercase">
              {userName.charAt(0)}
            </div>
          </div>
          <button
            onClick={() => { localStorage.clear(); router.push('/'); }}
            className="flex items-center gap-2 rounded border-2 border-[#0f0f0f] px-3 py-1.5 text-xs font-black uppercase tracking-widest text-[#0f0f0f] hover:bg-[#0f0f0f] hover:text-white transition-colors shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px]"
            title="Sign Out"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar */}
        <aside className="w-[240px] shrink-0 bg-white border-r-2 border-[#0f0f0f] flex flex-col pt-6 z-10 relative">
          <nav className="flex-1 space-y-3 px-4">
            {navItems.map((item) => {
              const tab = searchParams.get('tab');
              const isActive = tab ? item.path.includes(`tab=${tab}`) : pathname === item.path && !item.path.includes('?');
              return (
                <button
                  key={item.label}
                  onClick={() => item.path !== '#' && router.push(item.path)}
                  className={`flex w-full items-center gap-3 rounded border-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-[#0f0f0f] text-white border-[#0f0f0f] shadow-[2px_2px_0_0_rgba(217,119,6,1)]'
                      : 'bg-white text-[#0f0f0f] border-transparent hover:border-[#0f0f0f] hover:shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:-translate-y-0.5'
                  }`}
                >
                  <span className={isActive ? 'text-[#d97706]' : ''}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-[1200px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading layout...</div>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
