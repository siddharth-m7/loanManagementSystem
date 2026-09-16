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
    <div className="flex min-h-screen flex-col bg-[#F4F7FB] font-sans">
      {/* Top Navbar */}
      <header className="flex h-16 shrink-0 items-center justify-between bg-white px-6 shadow-sm z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors mr-2"
            title="Go Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700">
            <div className="h-4 w-4 rounded-full bg-blue-400"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">LMS</span>
        </div>
        

        <div className="flex items-center gap-5">

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-700 leading-tight">{userName}</p>
              <p className="text-xs text-gray-400">{role.charAt(0) + role.slice(1).toLowerCase()}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 font-bold uppercase">
              {userName.charAt(0)}
            </div>
          </div>
          <button
            onClick={() => { localStorage.clear(); router.push('/'); }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Sign Out"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[240px] shrink-0 bg-white border-r border-gray-100 flex flex-col pt-6">
          <nav className="flex-1 space-y-1 px-3">
            {navItems.map((item) => {
              const tab = searchParams.get('tab');
              const isActive = tab ? item.path.includes(`tab=${tab}`) : pathname === item.path && !item.path.includes('?');
              return (
                <button
                  key={item.label}
                  onClick={() => item.path !== '#' && router.push(item.path)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#EEF2FF] text-[#4F46E5]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
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
