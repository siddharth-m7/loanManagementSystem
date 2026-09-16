'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { fetchApi } from '@/lib/api';
import LoanDetailModal from './LoanDetailModal';
import CollectionLoanCard from './CollectionLoanCard';

export default function CollectionDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPanelId, setOpenPanelId] = useState<string | null>(null);
  const [viewLoanId, setViewLoanId] = useState<string | null>(null);
  const [expandedHistory, setExpandedHistory] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'CLOSED'>('ACTIVE');

  useEffect(() => {
    setMounted(true);
    fetchLoans();
  }, []);

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

  const openPanel = (id: string) => {
    setOpenPanelId(openPanelId === id ? null : id);
  };

  const handleAddPayment = async (loanId: string, amount: string, utr: string, date: string) => {
    if (!amount || !utr || !date) {
      showToast('Please fill in all payment fields', 'error');
      return;
    }
    if (Number(amount) <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }

    const loan = loans.find(l => l._id === loanId);
    if (!loan) return;

    const amountPaid = loan.payments?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0;
    const remaining = Math.ceil(Math.max(loan.totalRepayment - amountPaid, 0));

    if (Number(amount) > remaining) {
      showToast(`Amount cannot exceed outstanding balance of ₹${remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'error');
      return;
    }

    try {
      await fetchApi(`/dashboard/collection/loans/${loanId}/payment`, {
        method: 'POST',
        body: JSON.stringify({ amount: Number(amount), utrNumber: utr, paymentDate: date }),
      });

      setOpenPanelId(null);
      await fetchLoans(); // Refresh to get updated amountPaid
      showToast('Payment recorded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to record payment', 'error');
      throw err;
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

  const renderLoan = (loan: any) => (
    <CollectionLoanCard
      key={loan._id}
      loan={loan}
      isOpen={openPanelId === loan._id}
      onTogglePanel={() => openPanel(loan._id)}
      onViewDetails={() => setViewLoanId(loan._id)}
      onSubmitPayment={(amount, utr, date) => handleAddPayment(loan._id, amount, utr, date)}
    />
  );

  return (
    <div className="rounded bg-white p-6 sm:p-8 border-2 border-[#0f0f0f] shadow-[8px_8px_0_0_rgba(15,15,15,1)]">
      {/* Toast */}
      {mounted && toast && createPortal(
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 rounded border-2 border-[#0f0f0f] px-5 py-3 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0_0_rgba(15,15,15,1)] animate-in slide-in-from-top-4 fade-in duration-300 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>,
        document.body
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-black text-[#0f0f0f] uppercase tracking-widest">Collection Dashboard</h2>
        
        {/* Tabs */}
        <div className="flex bg-white p-1 rounded border-2 border-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)]">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'ACTIVE' 
                ? 'bg-[#0f0f0f] text-white' 
                : 'bg-white text-[#0f0f0f] hover:bg-gray-100'
            }`}
          >
            Active
            <span className={`flex h-4 items-center justify-center rounded px-1.5 text-[9px] ${
              activeTab === 'ACTIVE' ? 'bg-white/20 text-white' : 'bg-[#0f0f0f]/10 text-[#0f0f0f]'
            }`}>
              {active.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('CLOSED')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'CLOSED' 
                ? 'bg-[#0f0f0f] text-white' 
                : 'bg-white text-[#0f0f0f] hover:bg-gray-100'
            }`}
          >
            Closed
            <span className={`flex h-4 items-center justify-center rounded px-1.5 text-[9px] ${
              activeTab === 'CLOSED' ? 'bg-white/20 text-white' : 'bg-[#0f0f0f]/10 text-[#0f0f0f]'
            }`}>
              {closed.length}
            </span>
          </button>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded bg-white border-2 border-[#0f0f0f]">
          <svg className="mx-auto h-12 w-12 text-[#0f0f0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="mt-2 text-sm font-black uppercase tracking-widest text-[#0f0f0f]">No loans available</h3>
          <p className="mt-1 text-xs font-bold text-gray-500">Disbursed loans will appear here for collection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'ACTIVE' && (
            active.length === 0 ? (
              <div className="py-8 text-center text-xs font-bold text-gray-500 uppercase tracking-widest rounded bg-white border-2 border-[#0f0f0f]/20">
                No active loans found.
              </div>
            ) : (
              active.map(renderLoan)
            )
          )}

          {activeTab === 'CLOSED' && (
            closed.length === 0 ? (
              <div className="py-8 text-center text-xs font-bold text-gray-500 uppercase tracking-widest rounded bg-white border-2 border-[#0f0f0f]/20">
                No closed loans yet.
              </div>
            ) : (
              closed.map(renderLoan)
            )
          )}
        </div>
      )}

      {viewLoanId && (
        <LoanDetailModal loanId={viewLoanId} onClose={() => setViewLoanId(null)} />
      )}
    </div>
  );
}
