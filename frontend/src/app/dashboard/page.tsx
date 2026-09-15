'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SalesDashboard from '@/components/SalesDashboard';
import SanctionDashboard from '@/components/SanctionDashboard';
import DisbursementDashboard from '@/components/DisbursementDashboard';
import CollectionDashboard from '@/components/CollectionDashboard';
import BorrowerDashboard from '@/components/BorrowerDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      router.push('/login');
    } else {
      setRole(userRole);
    }
  }, [router]);

  if (!role) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  const renderDashboard = () => {
    switch (role) {
      case 'SALES':
        return <SalesDashboard />;
      case 'SANCTION':
        return <SanctionDashboard />;
      case 'DISBURSEMENT':
        return <DisbursementDashboard />;
      case 'COLLECTION':
        return <CollectionDashboard />;
      case 'BORROWER':
        return <BorrowerDashboard />;
      case 'ADMIN':
        return (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Admin Overview</h1>
            <SalesDashboard />
            <SanctionDashboard />
            <DisbursementDashboard />
            <CollectionDashboard />
          </div>
        );
      default:
        return <div>Invalid Role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-extrabold text-blue-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
              Role: {role}
            </span>
            <button
              onClick={() => {
                localStorage.clear();
                router.push('/login');
              }}
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        
        {renderDashboard()}
      </div>
    </div>
  );
}
