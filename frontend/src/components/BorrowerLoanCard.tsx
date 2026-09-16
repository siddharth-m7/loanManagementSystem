import React from 'react';

interface BorrowerLoanCardProps {
  loan: any;
  onClick: () => void;
}

export default function BorrowerLoanCard({ loan, onClick }: BorrowerLoanCardProps) {
  return (
    <div onClick={onClick} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded bg-white p-5 shadow-[4px_4px_0_0_rgba(15,15,15,1)] border-2 border-[#0f0f0f] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] transition-all cursor-pointer">
      
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border-2 border-[#0f0f0f] bg-white text-[#0f0f0f]">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <div>
          <h3 className="font-black text-[#0f0f0f] flex items-center gap-2">
            ₹{loan.amount.toLocaleString()} Loan Application
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>#{loan._id.slice(-6)}</span>
            <span>•</span>
            <span>Applied on {new Date(loan.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            
            <span className={`ml-2 inline-flex items-center rounded border-2 px-2 py-0.5 text-[9px] font-black tracking-widest uppercase ${
              loan.status === 'APPROVED' ? 'border-green-500 bg-green-50 text-green-700' :
              loan.status === 'REJECTED' ? 'border-red-500 bg-red-50 text-red-700' :
              loan.status === 'PENDING' ? 'border-[#d97706] bg-amber-50 text-[#d97706]' :
              'border-[#0f0f0f] bg-gray-50 text-[#0f0f0f]'
            }`}>
              {loan.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 pl-14 sm:pl-0">
        <div className="hidden md:block text-xs">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Tenure</p>
          <p className="font-bold text-[#0f0f0f] flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-[#d97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {loan.tenure} days
          </p>
        </div>

        <div className="hidden sm:block text-xs">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Repayment</p>
          <p className="font-bold text-[#0f0f0f]">₹{loan.totalRepayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded border-2 border-[#0f0f0f] bg-white px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)]">
            <svg className="mr-1 h-3.5 w-3.5 text-[#d97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Interest: {loan.interestRate}%
          </span>
          
          <div className="h-8 w-[2px] bg-[#0f0f0f]/10 hidden sm:block"></div>
          
          <button className="h-8 w-8 rounded flex items-center justify-center text-[#0f0f0f] border-2 border-transparent hover:border-[#0f0f0f] hover:bg-[#0f0f0f] hover:text-white transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
