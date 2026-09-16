import React from 'react';

export default function PaymentProgress({ paid, total }: { paid: number; total: number }) {
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
