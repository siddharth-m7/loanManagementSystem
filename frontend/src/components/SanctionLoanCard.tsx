import React, { useState } from 'react';
import { SERVER_URL } from '@/lib/api';

interface SanctionLoanCardProps {
  loan: any;
  onViewDetails: () => void;
  onReview: (status: string, reason?: string) => Promise<void>;
}

export default function SanctionLoanCard({ loan, onViewDetails, onReview }: SanctionLoanCardProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [rejectionError, setRejectionError] = useState('');

  const handleConfirmReject = () => {
    if (!rejectionReason) {
      setRejectionError('Please provide a rejection reason');
      return;
    }
    setRejectionError('');
    onReview('REJECTED', rejectionReason);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded border-2 border-[#0f0f0f] bg-white p-8 shadow-[4px_4px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] transition-all duration-300">
      <div className="absolute top-0 left-0 h-1.5 w-full bg-[#d97706]"></div>
      
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase tracking-widest text-[#0f0f0f]">{loan.borrowerId?.name || 'Unknown Borrower'}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">ID: {loan._id.slice(-6)}</span>
          </div>
          {loan.salarySlipUrl && (
            <a href={loan.salarySlipUrl.startsWith('http') ? loan.salarySlipUrl : `${SERVER_URL}${loan.salarySlipUrl}`} target="_blank" rel="noreferrer" className="text-[#0f0f0f] text-[10px] font-black hover:bg-[#0f0f0f] hover:text-white uppercase tracking-widest flex items-center gap-1 border-2 border-[#0f0f0f] bg-white px-2 py-1 rounded shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:shadow-none transition-all">
              Slip
            </a>
          )}
        </div>
        
        <h3 className="text-3xl font-black text-[#0f0f0f] mb-2">₹{loan.amount.toLocaleString()}</h3>
        <div className="space-y-2 mt-6">
          <div className="flex justify-between text-xs font-black uppercase tracking-widest border-b-2 border-[#0f0f0f]/10 pb-2">
            <span className="text-gray-500">Tenure</span>
            <span className="text-[#0f0f0f]">{loan.tenure} days</span>
          </div>
          <div className="flex justify-between text-xs font-black uppercase tracking-widest pt-1">
            <span className="text-gray-500">Repayment</span>
            <span className="text-[#0f0f0f]">₹{loan.totalRepayment.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t-2 border-[#0f0f0f]/10">
        <button
          onClick={onViewDetails}
          className="w-full mb-4 rounded border-2 border-[#0f0f0f] bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:bg-[#0f0f0f] hover:text-white hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
        >
          View Details
        </button>
        <div className="flex gap-3">
        <button 
          onClick={() => onReview('APPROVED')}
          className="flex-1 rounded border-2 border-[#0f0f0f] bg-[#0f0f0f] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-[2px_2px_0_0_rgba(217,119,6,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all flex items-center justify-center gap-2"
        >
          APPROVE
        </button>
        <button 
          onClick={() => setIsRejecting(true)}
          className="flex-1 rounded border-2 border-[#0f0f0f] bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:bg-red-50 hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all flex items-center justify-center gap-2"
        >
          REJECT
        </button>
      </div>
      </div>
      
      {isRejecting && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 p-6 flex flex-col justify-center border-4 border-[#0f0f0f] animate-in fade-in zoom-in-95 duration-200">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] mb-2">Rejection Reason</h4>
          <input 
            type="text" 
            autoFocus
            value={rejectionReason}
            onChange={(e) => { setRejectionReason(e.target.value); setRejectionError(''); }}
            className="block w-full rounded border-2 border-[#0f0f0f] bg-white px-3 py-2 text-sm font-bold text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] focus:outline-none mb-2"
            placeholder="Why is this rejected?"
          />
          {rejectionError && (
            <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-4">{rejectionError}</p>
          )}
          <div className="flex gap-2">
            <button 
              onClick={handleConfirmReject}
              className="flex-1 rounded border-2 border-[#0f0f0f] bg-[#0f0f0f] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-[2px_2px_0_0_rgba(217,119,6,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
            >
              Confirm
            </button>
            <button 
              onClick={() => { setIsRejecting(false); setRejectionReason(''); }}
              className="flex-1 rounded border-2 border-[#0f0f0f] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
