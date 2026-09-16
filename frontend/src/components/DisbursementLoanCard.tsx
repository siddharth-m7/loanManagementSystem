import React from 'react';

interface DisbursementLoanCardProps {
  loan: any;
  onViewDetails: () => void;
  onDisburse: () => void;
}

export default function DisbursementLoanCard({ loan, onViewDetails, onDisburse }: DisbursementLoanCardProps) {
  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded border-2 border-[#0f0f0f] bg-white p-8 shadow-[4px_4px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] transition-all duration-300 relative">
      <div className="absolute top-0 left-0 h-1.5 w-full bg-[#0f0f0f]"></div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-sm font-black text-[#0f0f0f] uppercase tracking-widest">{loan.borrowerId?.name || 'Unknown Borrower'}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">ID: {loan._id.slice(-6)}</span>
          </div>
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
            {new Date(loan.updatedAt).toLocaleDateString()}
          </span>
        </div>
        
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Transfer Amount</p>
        <h3 className="text-3xl font-black text-[#0f0f0f] mb-4">₹{loan.amount.toLocaleString()}</h3>
        
        <div className="rounded bg-white p-3 border-2 border-[#0f0f0f]/10">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-gray-500">Repayment Target</span>
            <span className="text-[#0f0f0f]">₹{loan.totalRepayment.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t-2 border-[#0f0f0f]/10">
        <button
          onClick={onViewDetails}
          className="w-full mb-3 rounded border-2 border-[#0f0f0f] bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:bg-[#0f0f0f] hover:text-white hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
        >
          View Details
        </button>
        <button 
          onClick={onDisburse}
          className="w-full rounded border-2 border-[#0f0f0f] bg-[#0f0f0f] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-[2px_2px_0_0_rgba(217,119,6,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          INITIATE TRANSFER
        </button>
      </div>
    </div>
  );
}
