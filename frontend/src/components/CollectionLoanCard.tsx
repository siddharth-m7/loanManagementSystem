import React, { useState } from 'react';
import PaymentProgress from './PaymentProgress';

interface CollectionLoanCardProps {
  loan: any;
  isOpen: boolean;
  onTogglePanel: () => void;
  onViewDetails: () => void;
  onSubmitPayment: (amount: string, utr: string, date: string) => Promise<void>;
}

export default function CollectionLoanCard({
  loan,
  isOpen,
  onTogglePanel,
  onViewDetails,
  onSubmitPayment
}: CollectionLoanCardProps) {
  const [payAmount, setPayAmount] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState(false);

  const amountPaid = loan.amountPaid ?? 0;
  const remaining = Math.round(Math.max(loan.totalRepayment - amountPaid, 0));
  const isClosed = loan.status === 'CLOSED';

  const handleAddPayment = async () => {
    setSubmitting(true);
    try {
      await onSubmitPayment(payAmount, utrNumber, paymentDate);
      setPayAmount('');
      setUtrNumber('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`overflow-hidden rounded border-2 transition-all duration-300 relative ${
        isClosed
          ? 'border-[#0f0f0f] bg-green-50 shadow-[4px_4px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]'
          : isOpen
          ? 'border-[#0f0f0f] bg-white shadow-none translate-y-[4px] translate-x-[4px]'
          : 'border-[#0f0f0f] bg-white shadow-[4px_4px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]'
      }`}
    >
      {/* Status stripe */}
      <div className={`absolute top-0 left-0 h-1.5 w-full ${isClosed ? 'bg-green-500' : 'bg-[#0f0f0f]'}`} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black text-[#0f0f0f]">
                ₹{loan.amount.toLocaleString()}
              </span>
              <span className={`inline-flex items-center rounded border-2 border-[#0f0f0f] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                isClosed ? 'bg-green-500 text-white' : 'bg-white text-[#0f0f0f]'
              }`}>
                {loan.status}
              </span>
            </div>
            <div className="flex flex-col mt-1">
              <span className="text-sm font-black uppercase tracking-widest text-[#0f0f0f]">{loan.borrowerId?.name || 'Unknown Borrower'}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">ID: {loan._id.slice(-8)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onViewDetails}
              className="rounded border-2 border-[#0f0f0f] bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
            >
              Details
            </button>
            {!isClosed && (
              <button
                onClick={onTogglePanel}
                className={`flex items-center gap-1.5 rounded border-2 border-[#0f0f0f] px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  isOpen
                    ? 'bg-white text-[#0f0f0f]'
                    : 'bg-[#0f0f0f] text-white shadow-[2px_2px_0_0_rgba(217,119,6,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px]'
                }`}
              >
                {isOpen ? (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    CANCEL
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    ADD PAYMENT
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Payment progress */}
        <PaymentProgress paid={amountPaid} total={loan.totalRepayment} />

        {/* Inline payment form */}
        {isOpen && (
          <div className="mt-5 rounded border-2 border-[#0f0f0f] bg-white p-4 shadow-[4px_4px_0_0_rgba(15,15,15,1)] animate-in slide-in-from-top-2 fade-in duration-200">
            <h4 className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f]">Record Payment</h4>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-[#0f0f0f]">₹</span>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full rounded border-2 border-[#0f0f0f] bg-white py-2 pl-7 pr-3 text-sm font-bold text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] focus:outline-none"
                    placeholder={`Max ₹${remaining.toLocaleString()}`}
                    max={remaining}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">UTR / Reference No.</label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full rounded border-2 border-[#0f0f0f] bg-white px-3 py-2 text-sm font-bold text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] focus:outline-none"
                  placeholder="Bank reference"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500">Payment Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full rounded border-2 border-[#0f0f0f] bg-white px-3 py-2 text-sm font-bold text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleAddPayment}
              disabled={submitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded border-2 border-[#0f0f0f] bg-[#0f0f0f] py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-[2px_2px_0_0_rgba(217,119,6,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                  RECORDING...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  CONFIRM PAYMENT OF ₹{payAmount ? Number(payAmount).toLocaleString() : '—'}
                </>
              )}
            </button>
          </div>
        )}

        {/* Payment history list */}
        {loan.payments && loan.payments.length > 0 && (
          <div className="mt-6 rounded border-2 border-[#0f0f0f] bg-white p-2 shadow-[2px_2px_0_0_rgba(15,15,15,1)]">
            <button 
              className="flex w-full items-center justify-between rounded px-4 py-3 hover:bg-gray-100 transition-all"
              onClick={() => setExpandedHistory(!expandedHistory)}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded border-2 border-[#0f0f0f] bg-[#0f0f0f] text-[10px] font-black text-white">
                  {loan.payments.length}
                </span>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0f0f0f]">Repayment History</h4>
              </div>
              <svg className={`h-4 w-4 text-[#0f0f0f] transition-transform duration-300 ${expandedHistory ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedHistory && (
              <div className="px-4 py-4 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[7px] before:w-0.5 before:bg-[#0f0f0f]">
                  {loan.payments.map((p: any, i: number) => (
                    <div key={i} className="relative pl-8 flex flex-wrap items-center justify-between gap-2">
                      <span className="absolute left-[3px] top-1/2 flex h-2.5 w-2.5 -translate-y-1/2 rounded border-2 border-[#0f0f0f] bg-white" />
                      <div>
                        <p className="font-black text-[#0f0f0f] text-sm">₹{Number(p.amount).toLocaleString()}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">UTR: <span className="text-[#0f0f0f]">{p.utrNumber}</span></p>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">
                          {new Date(p.paymentDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="inline-flex items-center rounded border-2 border-[#0f0f0f] bg-green-500 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white shadow-[2px_2px_0_0_rgba(15,15,15,1)]">SUCCESS</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
