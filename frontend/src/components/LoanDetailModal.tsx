'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { fetchApi, SERVER_URL } from '@/lib/api';

interface Props {
  loanId: string;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-400 text-[#0f0f0f]',
  APPROVED: 'bg-green-400 text-[#0f0f0f]',
  REJECTED: 'bg-red-500 text-white',
  DISBURSED: 'bg-blue-500 text-white',
  CLOSED: 'bg-gray-300 text-[#0f0f0f]',
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-[#0f0f0f] py-3 last:border-0">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
      <span className="text-sm font-black text-[#0f0f0f]">{value ?? '—'}</span>
    </div>
  );
}

export default function LoanDetailModal({ loanId, onClose }: Props) {
  const [loan, setLoan] = useState<any>(null);
  const [borrower, setBorrower] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchApi(`/loans/${loanId}`)
      .then((data) => {
        setLoan(data.loan);
        setBorrower(data.borrower);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [loanId]);

  if (!mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-lg rounded border-2 border-[#0f0f0f] bg-white shadow-[8px_8px_0_0_rgba(15,15,15,1)] animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#0f0f0f] px-6 py-5">
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest text-[#0f0f0f]">Loan Details</h2>
            {loan && (
              <p className="mt-0.5 font-bold text-[10px] text-gray-400 uppercase tracking-widest">ID: {loan._id}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded border-2 border-[#0f0f0f] p-1.5 text-[#0f0f0f] transition hover:bg-[#0f0f0f] hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="flex space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
              </div>
            </div>
          ) : loan ? (
            <div className="space-y-6">
              {/* Status + Amount */}
              <div className="rounded border-2 border-[#0f0f0f] bg-yellow-50 p-4 text-center shadow-[4px_4px_0_0_rgba(15,15,15,1)]">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Loan Amount</p>
                <p className="mt-1 text-4xl font-black text-[#0f0f0f]">
                  ₹{loan.amount.toLocaleString()}
                </p>
                <span className={`mt-2 inline-flex items-center rounded border-2 border-[#0f0f0f] px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_0_rgba(15,15,15,1)] ${statusColors[loan.status] || statusColors.PENDING}`}>
                  {loan.status}
                </span>
              </div>

              {/* Loan Info */}
              <div>
                <h3 className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f]">Loan Info</h3>
                <div className="rounded border-2 border-[#0f0f0f] bg-white px-4 shadow-[4px_4px_0_0_rgba(15,15,15,1)]">
                  <Row label="Tenure" value={`${loan.tenure} days`} />
                  <Row label="Interest Rate" value={`${loan.interestRate}% p.a.`} />
                  <Row label="Total Repayment" value={`₹${loan.totalRepayment?.toFixed(2)}`} />
                  <Row label="Applied On" value={new Date(loan.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} />
                  {loan.salarySlipUrl && (
                    <Row
                      label="Salary Slip"
                      value={
                        <a href={loan.salarySlipUrl.startsWith('http') ? loan.salarySlipUrl : `${SERVER_URL}${loan.salarySlipUrl}`} target="_blank" className="text-blue-600 underline hover:text-blue-700">
                          VIEW DOCUMENT
                        </a>
                      }
                    />
                  )}
                  {loan.rejectionReason && (
                    <Row label="Rejection Reason" value={<span className="text-red-600">{loan.rejectionReason}</span>} />
                  )}
                </div>
              </div>

              {/* Borrower Info */}
              {borrower && (
                <div>
                  <h3 className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f]">Borrower</h3>
                  <div className="rounded border-2 border-[#0f0f0f] bg-white px-4 shadow-[4px_4px_0_0_rgba(15,15,15,1)]">
                    <Row label="Name" value={borrower.name} />
                    <Row label="Email" value={borrower.email} />
                    <Row label="PAN" value={borrower.pan} />
                    <Row label="Monthly Salary" value={borrower.salary ? `₹${Number(borrower.salary).toLocaleString()}` : null} />
                    <Row label="Employment" value={borrower.employmentMode} />
                    <Row label="Date of Birth" value={borrower.dob ? new Date(borrower.dob).toLocaleDateString() : null} />
                  </div>
                </div>
              )}

              {/* Payments */}
              {loan.payments && loan.payments.length > 0 && (
                <div>
                  <h3 className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f]">Payments ({loan.payments.length})</h3>
                  <div className="space-y-2">
                    {loan.payments.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between rounded border-2 border-[#0f0f0f] bg-green-50 px-4 py-3 shadow-[2px_2px_0_0_rgba(15,15,15,1)]">
                        <div>
                          <p className="text-sm font-black text-[#0f0f0f]">₹{Number(p.amount).toLocaleString()}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">UTR: {p.utrNumber}</p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{new Date(p.paymentDate).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">Could not load loan details.</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#0f0f0f] px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded border-2 border-[#0f0f0f] bg-white py-3 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[4px_4px_0_0_rgba(15,15,15,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
