'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function SalesDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await fetchApi('/dashboard/sales/leads');
        setLeads(data.leads || []);
      } catch (error) {
        console.error('Failed to fetch leads', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (loading) return <div>Loading sales leads...</div>;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-800">Sales Dashboard - Leads</h2>
      
      {leads.length === 0 ? (
        <p className="text-gray-500">No leads available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Joined On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{lead.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{lead.email}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
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
