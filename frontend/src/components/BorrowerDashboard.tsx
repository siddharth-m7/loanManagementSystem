'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import LoanDetailModal from './LoanDetailModal';

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
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Projects / <span className="text-gray-400 font-normal">Applications</span>
          </h2>
        </div>
        <a href="/apply" className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2">
          <span>+</span> New Application
        </a>
      </div>
      
      {loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">No applications</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't applied for any loans yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan._id} onClick={() => setSelectedLoanId(loan._id)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-50 hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.1)] transition-all cursor-pointer">
              
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    ₹{loan.amount.toLocaleString()} Loan Application
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
                    <span>#{loan._id.slice(-6).toUpperCase()}</span>
                    <span>•</span>
                    <span>Applied on {new Date(loan.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    
                    <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                      loan.status === 'APPROVED' ? 'bg-green-50 text-green-700' :
                      loan.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                      loan.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {loan.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 pl-14 sm:pl-0">
                <div className="hidden md:block text-xs">
                  <p className="text-gray-400 font-medium mb-0.5">Tenure</p>
                  <p className="font-semibold text-gray-700 flex items-center gap-1">
                    <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {loan.tenure} days
                  </p>
                </div>

                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400 font-medium mb-0.5">Repayment</p>
                  <p className="font-semibold text-gray-700">₹{loan.totalRepayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                    <svg className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Interest: {loan.interestRate}%
                  </span>
                  
                  <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                  
                  <button onClick={() => setSelectedLoanId(loan._id)} className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedLoanId && (
        <LoanDetailModal loanId={selectedLoanId} onClose={() => setSelectedLoanId(null)} />
      )}
    </div>
  );
}
