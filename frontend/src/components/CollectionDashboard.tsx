'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import LoanDetailModal from './LoanDetailModal';

function PaymentProgress({ paid, total }: { paid: number; total: number }) {
  const pct = Math.min((paid / total) * 100, 100);
  return (
    <div className="mt-4">
      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
        <span className="text-gray-500">Collected</span>
        <span className={pct >= 100 ? 'text-green-600' : 'text-indigo-600'}>
          {pct.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${pct >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-blue-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Paid: <strong className="text-gray-900">₹{paid.toLocaleString()}</strong></span>
        <span>Remaining: <strong className={pct >= 100 ? 'text-green-600' : 'text-red-600'}>
          ₹{Math.max(total - paid, 0).toLocaleString()}
        </strong></span>
      </div>
    </div>
  );
}

export default function CollectionDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);
  const [viewLoanId, setViewLoanId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Payment form state
  const [payAmount, setPayAmount] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => { fetchLoans(); }, []);

  const fetchLoans = async () => {
    try {
      const data = await fetchApi('/dashboard/collection/loans');
      setLoans(data.loans || []);
    } catch (error) {
      console.error('Failed to fetch collection loans', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const resetForm = () => {
    setPayAmount('');
    setUtrNumber('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
  };

  const openPanel = (id: string) => {
    setOpenPanelId(openPanelId === id ? null : id);
    resetForm();
  };

  const handleAddPayment = async (loanId: string) => {
    if (!payAmount || !utrNumber || !paymentDate) {
      showToast('Please fill in all payment fields', 'error');
      return;
    }
    if (Number(payAmount) <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetchApi(`/dashboard/collection/loans/${loanId}/payment`, {
        method: 'POST',
        body: JSON.stringify({ amount: Number(payAmount), utrNumber, paymentDate }),
      });

      showToast(res.message || 'Payment recorded!', 'success');
      setOpenPanelId(null);
      resetForm();
      await fetchLoans(); // Refresh to get updated amountPaid
    } catch (err: any) {
      showToast(err.message || 'Failed to record payment', 'error');
    } finally {
      setSubmitting(false);
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

  const active = loans.filter((l) => l.status !== 'CLOSED');
  const closed = loans.filter((l) => l.status === 'CLOSED');

  return (
    <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-lg animate-in slide-in-from-top-4 fade-in duration-300 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Collection Dashboard</h2>
        <div className="flex gap-2">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
            {active.length} Active
          </span>
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-700/10">
            {closed.length} Closed
          </span>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl bg-gray-50 border border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No active loans</h3>
          <p className="mt-1 text-sm text-gray-500">Disbursed loans will appear here for collection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => {
            const amountPaid = loan.amountPaid ?? 0;
            const remaining = Math.max(loan.totalRepayment - amountPaid, 0);
            const isClosed = loan.status === 'CLOSED';
            const isOpen = openPanelId === loan._id;

            return (
              <div
                key={loan._id}
                className={`overflow-hidden rounded-[2rem] border transition-all duration-300 relative ${
                  isClosed
                    ? 'border-green-100 bg-green-50/30 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]'
                    : isOpen
                    ? 'border-indigo-200 bg-white shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]'
                    : 'border-gray-50 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1'
                }`}
              >
                {/* Status stripe */}
                <div className={`absolute top-0 left-0 h-1.5 w-full ${isClosed ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-indigo-400 to-indigo-500'}`} />

                <div className="p-5">
                  {/* Top row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-black tracking-tight text-gray-900">
                          ₹{loan.amount.toLocaleString()}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          isClosed ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {loan.status}
                        </span>
                      </div>
                      <div className="flex flex-col mt-1">
                        <span className="text-sm font-bold text-gray-700">{loan.borrowerId?.name || 'Unknown Borrower'}</span>
                        <span className="text-xs text-gray-400 font-mono mt-0.5">ID: {loan._id.slice(-8)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewLoanId(loan._id)}
                        className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Details
                      </button>
                      {!isClosed && (
                        <button
                          onClick={() => openPanel(loan._id)}
                          className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold transition-all ${
                            isOpen
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md active:scale-95'
                          }`}
                        >
                          {isOpen ? (
                            <>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                              Cancel
                            </>
                          ) : (
                            <>
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                              Add Payment
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
                    <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 animate-in slide-in-from-top-2 fade-in duration-200">
                      <h4 className="mb-3 text-sm font-bold text-indigo-900">Record Payment</h4>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-600">Amount (₹)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                            <input
                              type="number"
                              value={payAmount}
                              onChange={(e) => setPayAmount(e.target.value)}
                              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-7 pr-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              placeholder={`Max ₹${remaining.toLocaleString()}`}
                              max={remaining}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-600">UTR / Reference No.</label>
                          <input
                            type="text"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="Bank reference"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-600">Payment Date</label>
                          <input
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddPayment(loan._id)}
                        disabled={submitting}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                            Recording...
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            Confirm Payment of ₹{payAmount ? Number(payAmount).toLocaleString() : '—'}
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Payment history pills */}
                  {loan.payments && loan.payments.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {loan.payments.map((p: any, i: number) => (
                        <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          ₹{Number(p.amount).toLocaleString()} · {new Date(p.paymentDate).toLocaleDateString()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewLoanId && (
        <LoanDetailModal loanId={viewLoanId} onClose={() => setViewLoanId(null)} />
      )}
    </div>
  );
}
