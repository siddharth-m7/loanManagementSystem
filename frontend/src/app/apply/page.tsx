'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';

export default function ApplyLoanPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [breReason, setBreReason] = useState('');
  const [success, setSuccess] = useState(false);

  // Form Data
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [pan, setPan] = useState('');
  const [dob, setDob] = useState('');
  const [salary, setSalary] = useState('');
  const [employmentMode, setEmploymentMode] = useState('SALARIED');
  const [salarySlip, setSalarySlip] = useState<File | null>(null);

  const handleNext = () => {
    setError('');
    setBreReason('');
    if (step === 1) {
      if (!amount || !tenure) {
        setError('Amount and tenure are required');
        return;
      }
      if (Number(amount) < 50000 || Number(amount) > 500000) {
        setError('Amount must be between 50,000 and 5,00,000');
        return;
      }
      if (Number(tenure) < 30 || Number(tenure) > 365) {
        setError('Tenure must be between 30 and 365 days');
        return;
      }
    }
    if (step === 2) {
      if (!pan || !dob || !salary) {
        setError('Please fill in all personal details');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBreReason('');
    
    if (employmentMode === 'SALARIED' && !salarySlip) {
      setError('Salary slip is required for salaried applicants');
      return;
    }

    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('tenure', tenure);
    formData.append('pan', pan);
    formData.append('dob', dob);
    formData.append('salary', salary);
    formData.append('employmentMode', employmentMode);
    
    if (salarySlip) {
      formData.append('salarySlip', salarySlip);
    }

    try {
      await fetchApi('/loans/apply', {
        method: 'POST',
        body: formData,
      });
      setSuccess(true);
      // Wait a moment then redirect to dashboard or my-loans
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit loan application');
      if (err.reason) setBreReason(err.reason);
    }
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="flex min-h-full items-center justify-center p-8">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Application Submitted!</h2>
            <p className="text-gray-500">Your loan application has been received and is pending review. Redirecting to dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col max-w-2xl mx-auto py-8 px-4 w-full">
        <div className="w-full space-y-8 rounded-[2rem] bg-white p-8 sm:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-50">
          
          <div>
            <h2 className="text-left text-2xl font-bold text-gray-900 flex items-center gap-2">
              Projects / <span className="text-gray-400 font-normal">Create Application</span>
            </h2>
            <div className="mt-6 flex gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-blue-600' : 'bg-gray-100'}`} />
              ))}
            </div>
            <p className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
              {step === 1 ? 'Loan Requirements' : step === 2 ? 'Personal Details' : 'Employment Details'}
            </p>
          </div>
          
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm border border-red-100">
              <p className="font-semibold text-red-700">{error}</p>
              {breReason && (
                <p className="mt-1.5 text-red-600">
                  <span className="font-medium">Reason: </span>{breReason}
                </p>
              )}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Step 1: Loan Requirements */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Loan Amount (₹)</label>
                  <input
                    type="number"
                    min="50000"
                    max="500000"
                    required
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 100000"
                  />
                  <p className="mt-1.5 text-xs font-medium text-gray-400">Min: 50,000 | Max: 5,00,000</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tenure (Days)</label>
                  <input
                    type="number"
                    min="30"
                    max="365"
                    required
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    placeholder="e.g. 90"
                  />
                  <p className="mt-1.5 text-xs font-medium text-gray-400">Min: 30 | Max: 365</p>
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">PAN Card Number</label>
                  <input
                    type="text"
                    required
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 uppercase text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    required
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    required
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. 50000"
                  />
                  <p className="mt-1.5 text-xs font-medium text-gray-400">Must be {'>='} 25,000</p>
                </div>
              </div>
            )}

            {/* Step 3: Employment Details & Uploads */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Employment Mode</label>
                  <select
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    value={employmentMode}
                    onChange={(e) => setEmploymentMode(e.target.value)}
                  >
                    <option value="SALARIED">Salaried</option>
                    <option value="SELF_EMPLOYED">Self Employed</option>
                    <option value="UNEMPLOYED">Unemployed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Salary Slip (PDF/Image)</label>
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/jpg"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-blue-50 file:py-2 file:px-5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 transition-all"
                    onChange={(e) => setSalarySlip(e.target.files ? e.target.files[0] : null)}
                  />
                  {employmentMode === 'SALARIED' && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">*Required for Salaried applicants</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-full bg-gray-50 px-6 py-2.5 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-full bg-gray-50 px-6 py-2.5 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  Cancel
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-full bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-full bg-green-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
