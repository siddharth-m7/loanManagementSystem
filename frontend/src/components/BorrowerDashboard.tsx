'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import LoanDetailModal from './LoanDetailModal';
import BorrowerLoanCard from './BorrowerLoanCard';

export default function BorrowerDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await fetchApi('/loans/my-loans');
        setLoans(data.loans || []);
      } catch (error) {
        console.error('Failed to fetch loans', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex items-center space-x-2 text-gray-400">
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#0f0f0f] flex items-center gap-2 uppercase tracking-widest">
            Applications
          </h2>
        </div>
        <a href="/apply" className="rounded bg-[#0f0f0f] px-4 py-2 text-xs font-black tracking-widest uppercase text-white shadow-[2px_2px_0_0_rgba(217,119,6,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all flex items-center gap-2">
          <span>+</span> New
        </a>
      </div>
      
      {loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded bg-white border-2 border-[#0f0f0f]">
          <svg className="mx-auto h-10 w-10 text-[#0f0f0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-sm font-black uppercase tracking-widest text-[#0f0f0f]">No applications</h3>
          <p className="mt-1 text-xs font-bold text-gray-500">You haven't applied for any loans yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <BorrowerLoanCard
              key={loan._id}
              loan={loan}
              onClick={() => setSelectedLoanId(loan._id)}
            />
          ))}
        </div>
      )}

      {selectedLoanId && (
        <LoanDetailModal loanId={selectedLoanId} onClose={() => setSelectedLoanId(null)} />
      )}
    </div>
  );
}
