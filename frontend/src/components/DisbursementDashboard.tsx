'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { fetchApi } from '@/lib/api';
import LoanDetailModal from './LoanDetailModal';
import DisbursementLoanCard from './DisbursementLoanCard';

export default function DisbursementDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewLoanId, setViewLoanId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [mounted, setMounted] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    setMounted(true);
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const data = await fetchApi('/dashboard/disbursement/loans');
      setLoans(data.loans || []);
    } catch (error) {
      console.error('Failed to fetch disbursement loans', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisburse = async (id: string) => {
    try {
      await fetchApi(`/dashboard/disbursement/loans/${id}/disburse`, {
        method: 'PATCH'
      });
      fetchLoans();
      showToast('Loan disbursed successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Disbursement failed', 'error');
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 text-gray-500">
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
      </div>
    </div>
  );

  return (
    <div className="rounded bg-white p-6 sm:p-8 border-2 border-[#0f0f0f] shadow-[8px_8px_0_0_rgba(15,15,15,1)] relative">
      {mounted && toast && createPortal(
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 rounded border-2 border-[#0f0f0f] px-5 py-3 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0_0_rgba(15,15,15,1)] animate-in slide-in-from-top-4 fade-in duration-300 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>,
        document.body
      )}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#0f0f0f] uppercase tracking-widest">Disbursement Dashboard</h2>
        <span className="rounded border-2 border-[#0f0f0f] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)]">
          {loans.length} Ready
        </span>
      </div>
      
      {loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded bg-white border-2 border-[#0f0f0f]">
          <svg className="mx-auto h-12 w-12 text-[#0f0f0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 className="mt-2 text-sm font-black uppercase tracking-widest text-[#0f0f0f]">No disbursements</h3>
          <p className="mt-1 text-xs font-bold text-gray-500">Approved loans waiting for funds will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loans.map((loan) => (
            <DisbursementLoanCard
              key={loan._id}
              loan={loan}
              onViewDetails={() => setViewLoanId(loan._id)}
              onDisburse={() => handleDisburse(loan._id)}
            />
          ))}
        </div>
      )}

      {viewLoanId && (
        <LoanDetailModal loanId={viewLoanId} onClose={() => setViewLoanId(null)} />
      )}
    </div>
  );
}
