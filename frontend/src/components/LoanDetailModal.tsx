'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

interface Props {
  loanId: string;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
  APPROVED: 'bg-green-50 text-green-700 ring-green-600/20',
  REJECTED: 'bg-red-50 text-red-700 ring-red-600/20',
  DISBURSED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  CLOSED: 'bg-gray-50 text-gray-700 ring-gray-600/20',
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value ?? '—'}</span>
    </div>
  );
}

export default function LoanDetailModal({ loanId, onClose }: Props) {
  const [loan, setLoan] = useState<any>(null);
  const [borrower, setBorrower] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi(`/loans/${loanId}`)
      .then((data) => {
        setLoan(data.loan);
        setBorrower(data.borrower);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [loanId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Loan Details</h2>
            {loan && (
              <p className="mt-0.5 font-mono text-xs text-gray-400">ID: {loan._id}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center">
                <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                <p className="mt-1 text-4xl font-black tracking-tight text-gray-900">
                  ₹{loan.amount.toLocaleString()}
                </p>
                <span className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${statusColors[loan.status] || statusColors.PENDING}`}>
                  {loan.status}
                </span>
              </div>

              {/* Loan Info */}
              <div>
                <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Loan Info</h3>
                <div className="rounded-xl bg-gray-50 px-4">
                  <Row label="Tenure" value={`${loan.tenure} days`} />
                  <Row label="Interest Rate" value={`${loan.interestRate}% p.a.`} />
                  <Row label="Total Repayment" value={`₹${loan.totalRepayment?.toFixed(2)}`} />
                  <Row label="Applied On" value={new Date(loan.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} />
                  {loan.salarySlipUrl && (
                    <Row
                      label="Salary Slip"
                      value={
                        <a href={loan.salarySlipUrl} target="_blank" className="text-blue-600 underline hover:text-blue-700">
                          View Document
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
                  <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Borrower</h3>
                  <div className="rounded-xl bg-gray-50 px-4">
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
                  <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">Payments ({loan.payments.length})</h3>
                  <div className="space-y-2">
                    {loan.payments.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-green-800">₹{Number(p.amount).toLocaleString()}</p>
                          <p className="text-xs text-green-600">UTR: {p.utrNumber}</p>
                        </div>
                        <span className="text-xs text-green-600">{new Date(p.paymentDate).toLocaleDateString()}</span>
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
        <div className="border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
