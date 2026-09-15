'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function CollectionDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  useEffect(() => {
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

  const handleAddPayment = async (id: string) => {
    if (!amount || !utrNumber || !paymentDate) {
      alert('Please fill all payment fields');
      return;
    }
    
    try {
      const response = await fetchApi(`/dashboard/collection/loans/${id}/payment`, {
        method: 'POST',
        body: JSON.stringify({ amount: Number(amount), utrNumber, paymentDate })
      });
      alert(response.message || 'Payment added successfully');
      setSelectedLoan(null);
      setAmount('');
      setUtrNumber('');
      setPaymentDate('');
      fetchLoans();
    } catch (error: any) {
      alert(error.message || 'Failed to add payment');
    }
  };

  if (loading) return <div>Loading collection dashboard...</div>;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Collection Dashboard - Disbursed Loans</h2>
      
      {loans.length === 0 ? (
        <p className="text-gray-500">No active loans for collection.</p>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan._id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">Amount Disbursed: ₹{loan.amount}</p>
                  <p className="text-sm text-gray-600">Total Repayment Due: ₹{loan.totalRepayment.toFixed(2)}</p>
                  <p className="text-xs font-semibold mt-1">Status: <span className={loan.status === 'CLOSED' ? 'text-green-600' : 'text-blue-600'}>{loan.status}</span></p>
                </div>
                
                {loan.status !== 'CLOSED' && (
                  <button 
                    onClick={() => setSelectedLoan(loan._id)}
                    className="rounded bg-indigo-600 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Add Payment
                  </button>
                )}
              </div>
              
              {selectedLoan === loan._id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount Received (₹)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">UTR Number (Reference)</label>
                    <input 
                      type="text" 
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                    <input 
                      type="date" 
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={() => handleAddPayment(loan._id)}
                      className="rounded bg-green-600 px-3 py-1 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Save Payment
                    </button>
                    <button 
                      onClick={() => { setSelectedLoan(null); setAmount(''); setUtrNumber(''); setPaymentDate(''); }}
                      className="rounded bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-400"
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
    </div>
  );
}
