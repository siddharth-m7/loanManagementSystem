'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function BorrowerDashboard() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await fetchApi('/loans/my-loans');
        setLoans(data.loans || []);
      } catch (error) {
        console.error('Failed to fetch loans', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  if (loading) return <div>Loading your loans...</div>;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-800">My Applications</h2>
      
      {loans.length === 0 ? (
        <p className="text-gray-500">You haven't applied for any loans yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tenure</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Repayment</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Applied On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loans.map((loan) => (
                <tr key={loan._id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{loan.amount}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{loan.tenure} days</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{loan.totalRepayment.toFixed(2)}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      loan.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
