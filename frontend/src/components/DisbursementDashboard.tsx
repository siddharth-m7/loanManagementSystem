'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function DisbursementDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const data = await fetchApi('/dashboard/disbursement/loans');
      setLoans(data.loans || []);
    } catch (error) {
      console.error('Failed to fetch disbursement loans', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisburse = async (id: string) => {
    try {
      await fetchApi(`/dashboard/disbursement/loans/${id}/disburse`, {
        method: 'PATCH'
      });
      alert('Loan disbursed successfully');
      fetchLoans();
    } catch (error: any) {
      alert(error.message || 'Disbursement failed');
    }
  };

  if (loading) return <div>Loading disbursement dashboard...</div>;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Disbursement Dashboard - Approved Loans</h2>
      
      {loans.length === 0 ? (
        <p className="text-gray-500">No approved loans ready for disbursement.</p>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan._id} className="rounded-lg border border-gray-200 p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">Amount: ₹{loan.amount}</p>
                <p className="text-sm text-gray-600">Total Repayment: ₹{loan.totalRepayment.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Approved On: {new Date(loan.updatedAt).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => handleDisburse(loan._id)}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Mark as Disbursed
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
