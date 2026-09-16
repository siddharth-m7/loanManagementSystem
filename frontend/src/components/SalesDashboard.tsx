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

  if (loading) return (
    <div className="flex h-64 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 text-gray-500">
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
      </div>
    </div>
  );

  return (
    <div className="rounded bg-white p-6 sm:p-8 border-2 border-[#0f0f0f] shadow-[8px_8px_0_0_rgba(15,15,15,1)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#0f0f0f] uppercase tracking-widest">Sales Dashboard - Leads</h2>
        <span className="rounded border-2 border-[#0f0f0f] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)]">
          {leads.length} Total
        </span>
      </div>
      
      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded bg-white border-2 border-[#0f0f0f]">
          <svg className="mx-auto h-12 w-12 text-[#0f0f0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-black uppercase tracking-widest text-[#0f0f0f]">No leads</h3>
          <p className="mt-1 text-xs font-bold text-gray-500">New registered users will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded bg-white p-5 border-2 border-[#0f0f0f] shadow-[4px_4px_0_0_rgba(15,15,15,1)] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] transition-all">
              
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border-2 border-[#0f0f0f] bg-[#0f0f0f] text-white font-black text-lg shadow-[2px_2px_0_0_rgba(217,119,6,1)]">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0f0f0f]">{lead.name}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {lead.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:justify-end">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Joined</p>
                  <span className="inline-flex items-center rounded border-2 border-[#0f0f0f] bg-white px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)]">
                    {new Date(lead.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
