'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import SalesDashboard from '@/components/SalesDashboard';
import SanctionDashboard from '@/components/SanctionDashboard';
import DisbursementDashboard from '@/components/DisbursementDashboard';
import CollectionDashboard from '@/components/CollectionDashboard';
import BorrowerDashboard from '@/components/BorrowerDashboard';
import DashboardLayout from '@/components/DashboardLayout';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      router.push('/');
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
      case 'ADMIN': {
        const tab = searchParams.get('tab') || 'sales';
        if (tab === 'sanction') return <SanctionDashboard />;
        if (tab === 'disbursement') return <DisbursementDashboard />;
        if (tab === 'collection') return <CollectionDashboard />;
        return <SalesDashboard />;
      }
      default:
        return <div>Invalid Role</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-in fade-in duration-500 ease-out">
        {renderDashboard()}
      </div>
    </DashboardLayout>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
