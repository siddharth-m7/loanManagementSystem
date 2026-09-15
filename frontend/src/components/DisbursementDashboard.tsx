'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import LoanDetailModal from './LoanDetailModal';

export default function DisbursementDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewLoanId, setViewLoanId] = useState<string | null>(null);

  useEffect(() => {
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
      alert('Loan disbursed successfully');
      fetchLoans();
    } catch (error: any) {
      alert(error.message || 'Disbursement failed');
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
    <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Disbursement Dashboard</h2>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {loans.length} Ready for Transfer
        </span>
      </div>
      
      {loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl bg-gray-50 border border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No disbursements pending</h3>
          <p className="mt-1 text-sm text-gray-500">Approved loans waiting for funds will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loans.map((loan) => (
            <div key={loan._id} className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-gray-50 bg-white p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 relative">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{loan.borrowerId?.name || 'Unknown Borrower'}</span>
                    <span className="text-xs text-gray-400 font-mono mt-0.5">ID: {loan._id.slice(-6)}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(loan.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 font-medium mb-1">Transfer Amount</p>
                <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">₹{loan.amount.toLocaleString()}</h3>
                
                <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Repayment Target</span>
                    <span className="font-semibold text-gray-900">₹{loan.totalRepayment.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setViewLoanId(loan._id)}
                  className="w-full mb-3 rounded-full bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleDisburse(loan._id)}
                  className="w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Initiate Transfer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewLoanId && (
        <LoanDetailModal loanId={viewLoanId} onClose={() => setViewLoanId(null)} />
      )}
    </div>
  );
}
