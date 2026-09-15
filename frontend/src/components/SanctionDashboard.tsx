'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function SanctionDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const data = await fetchApi('/dashboard/sanction/loans');
      setLoans(data.loans || []);
    } catch (error) {
      console.error('Failed to fetch sanction loans', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, status: string) => {
    if (status === 'REJECTED' && !rejectionReason) {
      alert('Please provide a rejection reason');
      return;
    }
    
    try {
      await fetchApi(`/dashboard/sanction/loans/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status, rejectionReason: status === 'REJECTED' ? rejectionReason : undefined })
      });
      alert(`Loan ${status} successfully`);
      setSelectedLoan(null);
      setRejectionReason('');
      fetchLoans();
    } catch (error: any) {
      alert(error.message || 'Review failed');
    }
  };

  if (loading) return <div>Loading sanction dashboard...</div>;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Sanction Dashboard - Pending Loans</h2>
      
      {loans.length === 0 ? (
        <p className="text-gray-500">No pending loans for review.</p>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan._id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">Amount: ₹{loan.amount}</p>
                  <p className="text-sm text-gray-600">Tenure: {loan.tenure} days</p>
                  <p className="text-sm text-gray-600">Repayment: ₹{loan.totalRepayment.toFixed(2)}</p>
                  {loan.salarySlipUrl && (
                    <a href={loan.salarySlipUrl} target="_blank" className="text-blue-600 text-sm hover:underline">
                      View Salary Slip
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleReview(loan._id, 'APPROVED')}
                    className="rounded bg-green-500 px-3 py-1 text-sm font-semibold text-white hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => setSelectedLoan(loan._id)}
                    className="rounded bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
              
              {selectedLoan === loan._id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                  <input 
                    type="text" 
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Provide a reason..."
                  />
                  <div className="mt-2 flex space-x-2">
                    <button 
                      onClick={() => handleReview(loan._id, 'REJECTED')}
                      className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Confirm Reject
                    </button>
                    <button 
                      onClick={() => { setSelectedLoan(null); setRejectionReason(''); }}
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
