'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import LoanDetailModal from './LoanDetailModal';

export default function SanctionDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [viewLoanId, setViewLoanId] = useState<string | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const data = await fetchApi('/dashboard/sanction/loans');
      setLoans(data.loans || []);
    } catch (error) {
      console.error('Failed to fetch sanction loans', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: string) => {
    if (status === 'REJECTED' && !rejectionReason) {
      alert('Please provide a rejection reason');
      return;
    }
    
    try {
      await fetchApi(`/dashboard/sanction/loans/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status, rejectionReason: status === 'REJECTED' ? rejectionReason : undefined })
      });
      alert(`Loan ${status} successfully`);
      setSelectedLoan(null);
      setRejectionReason('');
      fetchLoans();
    } catch (error: any) {
      alert(error.message || 'Review failed');
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
        <h2 className="text-xl font-bold text-gray-900">Sanction Dashboard - Pending Loans</h2>
        <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
          {loans.length} Pending Review
        </span>
      </div>
      
      {loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl bg-gray-50 border border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">All caught up!</h3>
          <p className="mt-1 text-sm text-gray-500">No pending loan applications to review at this time.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loans.map((loan) => (
            <div key={loan._id} className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-gray-50 bg-white p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{loan.borrowerId?.name || 'Unknown Borrower'}</span>
                    <span className="text-xs text-gray-400 font-mono mt-0.5">ID: {loan._id.slice(-6)}</span>
                  </div>
                  {loan.salarySlipUrl && (
                    <a href={loan.salarySlipUrl} target="_blank" className="text-blue-600 text-xs font-bold hover:text-blue-700 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      Slip
                    </a>
                  )}
                </div>
                
                <h3 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">₹{loan.amount.toLocaleString()}</h3>
                <div className="space-y-2 mt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-semibold">Tenure</span>
                    <span className="font-bold text-gray-900">{loan.tenure} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-semibold">Repayment</span>
                    <span className="font-bold text-gray-900">₹{loan.totalRepayment.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setViewLoanId(loan._id)}
                  className="w-full mb-4 rounded-full bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  View Details
                </button>
                <div className="flex gap-3">
                <button 
                  onClick={() => handleReview(loan._id, 'APPROVED')}
                  className="flex-1 rounded-full bg-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-green-700 hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  Approve
                </button>
                <button 
                  onClick={() => setSelectedLoan(loan._id)}
                  className="flex-1 rounded-full bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  Reject
                </button>
              </div>
              </div>
              
              {selectedLoan === loan._id && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 p-6 flex flex-col justify-center border-2 border-red-500 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Rejection Reason</h4>
                  <input 
                    type="text" 
                    autoFocus
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 mb-4"
                    placeholder="Why is this rejected?"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleReview(loan._id, 'REJECTED')}
                      className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => { setSelectedLoan(null); setRejectionReason(''); }}
                      className="flex-1 rounded-xl bg-gray-100 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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
