'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function ApplyLoanPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
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
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-green-600">Application Submitted!</h2>
          <p className="text-gray-600">Your loan application has been received and is pending review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Apply for a Loan</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Step {step} of 3</p>
        </div>
        
        {error && (
          <div className="rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Step 1: Loan Requirements */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Loan Amount (₹)</label>
                <input
                  type="number"
                  min="50000"
                  max="500000"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 100000"
                />
                <p className="mt-1 text-xs text-gray-500">Min: 50,000 | Max: 5,00,000</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Tenure (Days)</label>
                <input
                  type="number"
                  min="30"
                  max="365"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  placeholder="e.g. 90"
                />
                <p className="mt-1 text-xs text-gray-500">Min: 30 | Max: 365</p>
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">PAN Card Number</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 uppercase shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Salary (₹)</label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 50000"
                />
                <p className="mt-1 text-xs text-gray-500">Must be {'>='} 25,000</p>
              </div>
            </div>
          )}

          {/* Step 3: Employment Details & Uploads */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Employment Mode</label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  value={employmentMode}
                  onChange={(e) => setEmploymentMode(e.target.value)}
                >
                  <option value="SALARIED">Salaried</option>
                  <option value="SELF_EMPLOYED">Self Employed</option>
                  <option value="UNEMPLOYED">Unemployed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Salary Slip (PDF/Image)</label>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => setSalarySlip(e.target.files ? e.target.files[0] : null)}
                />
                {employmentMode === 'SALARIED' && (
                  <p className="mt-1 text-xs text-red-500">*Required for Salaried applicants</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            ) : (
              <div></div> // Empty div to keep 'Next' button on the right
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
