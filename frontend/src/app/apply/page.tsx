'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';
import LoanDetailModal from '@/components/LoanDetailModal';

export default function ApplyLoanPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [breReason, setBreReason] = useState('');
  const [successLoanId, setSuccessLoanId] = useState<string | null>(null);

  // Form Data
  const [amount, setAmount] = useState('50000');
  const [tenure, setTenure] = useState('30');
  const [pan, setPan] = useState('');
  const [dob, setDob] = useState('');
  const [salary, setSalary] = useState('');
  const [employmentMode, setEmploymentMode] = useState('SALARIED');
  const [salarySlip, setSalarySlip] = useState<File | null>(null);

  const calculateAge = (dobString: string): number => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const getSurnameFirstLetter = (name: string): string => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    return surname?.charAt(0).toUpperCase() || "";
  };

  // Validation logic for disabling buttons and showing inline errors
  const currentUserName = typeof window !== 'undefined' ? localStorage.getItem('userName') || '' : '';
  const expectedFifthLetter = getSurnameFirstLetter(currentUserName);
  
  const isAgeValid = dob ? (calculateAge(dob) >= 23 && calculateAge(dob) <= 50) : false;
  const isPanFormatValid = pan ? /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan) : false;
  const isPanLetterValid = pan && pan.length >= 5 && expectedFifthLetter ? pan.charAt(4).toUpperCase() === expectedFifthLetter : true;
  const isSalaryValid = salary ? Number(salary) >= 25000 : false;
  
  const isStep1Valid = Boolean(amount && tenure && Number(amount) >= 50000 && Number(amount) <= 500000 && Number(tenure) >= 30 && Number(tenure) <= 365);
  const isStep2Valid = Boolean(pan && dob && salary && isAgeValid && isPanFormatValid && isPanLetterValid && isSalaryValid);
  const isStep3Valid = Boolean(salarySlip && employmentMode !== 'UNEMPLOYED');
  
  const canGoNext = (step === 1 && isStep1Valid) || (step === 2 && isStep2Valid);

  // Clear backend error if user modifies any input
  useEffect(() => {
    setError('');
    setBreReason('');
  }, [pan, dob, salary, amount, tenure, employmentMode, salarySlip]);

  const handleNext = () => {
    setError('');
    setBreReason('');
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBreReason('');
    
    if (!isStep3Valid) {
      if (employmentMode === 'UNEMPLOYED') {
        setError('User is unemployed');
        setBreReason('Unemployed users are not eligible for a loan.');
      } else if (!salarySlip) {
        setError('Salary slip document is strictly required');
      }
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
      const res = await fetchApi('/loans/apply', {
        method: 'POST',
        body: formData,
      });
      setSuccessLoanId(res.loan._id);
    } catch (err: any) {
      setError(err.message || 'Failed to submit loan application');
      if (err.reason) setBreReason(err.reason);
    }
  };

  if (successLoanId) {
    return (
      <DashboardLayout>
        <div className="flex min-h-full items-center justify-center p-8">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Application Submitted!</h2>
            <p className="text-gray-500 mb-6">Your loan application has been received and is pending review.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <LoanDetailModal loanId={successLoanId} onClose={() => router.push('/dashboard')} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col max-w-2xl mx-auto py-8 px-4 w-full">
        <div className="w-full space-y-8 rounded border-2 border-[#0f0f0f] bg-white p-8 sm:p-10 shadow-[8px_8px_0_0_rgba(15,15,15,1)]">
          
          <div>
            <h2 className="text-left text-2xl font-black text-[#0f0f0f] flex items-center gap-2 uppercase tracking-widest">
              Create Application
            </h2>
            <div className="mt-6 flex gap-2 border-2 border-[#0f0f0f] bg-white p-1 shadow-[2px_2px_0_0_rgba(15,15,15,1)]">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-2 flex-1 transition-all duration-300 ${s <= step ? 'bg-[#0f0f0f]' : 'bg-transparent'}`} />
              ))}
            </div>
            <p className="mt-4 text-[10px] font-black text-[#0f0f0f] uppercase tracking-widest">
              {step === 1 ? 'Loan Requirements' : step === 2 ? 'Personal Details' : 'Employment Details'}
            </p>
          </div>
          
          {error && (
            <div className="rounded border-2 border-[#0f0f0f] bg-red-50 p-4 shadow-[4px_4px_0_0_rgba(15,15,15,1)]">
              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{error}</p>
              {breReason && (
                <p className="mt-1.5 text-[10px] font-black text-red-600 uppercase tracking-widest">
                  <span>Reason: </span>{breReason}
                </p>
              )}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Step 1: Loan Requirements */}
            {step === 1 && (
              <div className="space-y-8">
                {/* Sliders */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#0f0f0f]">Loan Amount</label>
                      <span className="text-xl font-black text-[#0f0f0f]">₹{Number(amount).toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="500000"
                      step="5000"
                      className="w-full h-2 appearance-none cursor-pointer border-2 border-[#0f0f0f] bg-white accent-[#0f0f0f]"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span>₹50K</span>
                      <span>₹5L</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#0f0f0f]">Tenure (Days)</label>
                      <span className="text-xl font-black text-[#0f0f0f]">{tenure} Days</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="365"
                      step="1"
                      className="w-full h-2 appearance-none cursor-pointer border-2 border-[#0f0f0f] bg-white accent-[#0f0f0f]"
                      value={tenure}
                      onChange={(e) => setTenure(e.target.value)}
                    />
                    <div className="flex justify-between mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <span>30 Days</span>
                      <span>365 Days</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Panel */}
                <div className="rounded border-2 border-[#0f0f0f] bg-yellow-50 p-6 shadow-[4px_4px_0_0_rgba(15,15,15,1)]">
                  <h3 className="mb-4 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] flex items-center gap-2">
                    <svg className="h-4 w-4 text-[#0f0f0f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    LIVE REPAYMENT CALCULATION
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Principal (P)</span>
                      <span className="font-black text-[#0f0f0f]">₹{Number(amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Interest Rate (R)</span>
                      <span className="font-black text-[#0f0f0f]">12% p.a.</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Tenure (T)</span>
                      <span className="font-black text-[#0f0f0f]">{tenure} days</span>
                    </div>
                    
                    <div className="my-4 border-t-2 border-[#0f0f0f] pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Simple Interest (SI)</span>
                        <span className="font-black text-[#d97706]">
                          + ₹{Math.round((Number(amount) * 12 * Number(tenure)) / (365 * 100)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-end justify-between mt-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0f0f0f]">Total Repayment</span>
                        <span className="text-2xl font-black text-[#0f0f0f]">
                          ₹{Math.round(Number(amount) + (Number(amount) * 12 * Number(tenure)) / (365 * 100)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] mb-1.5">PAN Card Number</label>
                  <input
                    type="text"
                    required
                    className={`block w-full rounded border-2 px-4 py-3 font-bold text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] focus:outline-none uppercase ${pan && (!isPanFormatValid || !isPanLetterValid) ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-[#0f0f0f] bg-white'}`}
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                  />
                  {pan && !isPanFormatValid && (
                    <p className="mt-1.5 text-[10px] font-black uppercase tracking-widest text-red-500">Invalid format. Must be ABCDE1234F.</p>
                  )}
                  {pan && isPanFormatValid && !isPanLetterValid && (
                    <p className="mt-1.5 text-[10px] font-black uppercase tracking-widest text-red-500">5th letter must be '{expectedFifthLetter}' (first letter of surname).</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    required
                    className={`block w-full rounded border-2 px-4 py-3 font-bold text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] focus:outline-none ${dob && !isAgeValid ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-[#0f0f0f] bg-white'}`}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                  {dob && !isAgeValid && (
                    <p className="mt-1.5 text-[10px] font-black uppercase tracking-widest text-red-500">Age must be between 23 and 50.</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] mb-1.5">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    required
                    className={`block w-full rounded border-2 px-4 py-3 font-bold text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] focus:outline-none ${salary && !isSalaryValid ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-[#0f0f0f] bg-white'}`}
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. 50000"
                  />
                  {salary && !isSalaryValid ? (
                    <p className="mt-1.5 text-[10px] font-black uppercase tracking-widest text-red-500">Salary must be at least ₹25,000.</p>
                  ) : (
                    <p className="mt-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">MUST BE {'>='} 25,000</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Employment Details & Uploads */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] mb-1.5">Employment Mode</label>
                  <select
                    className="block w-full rounded border-2 border-[#0f0f0f] bg-white px-4 py-3 font-bold text-[#0f0f0f] shadow-[2px_2px_0_0_rgba(15,15,15,1)] focus:outline-none"
                    value={employmentMode}
                    onChange={(e) => setEmploymentMode(e.target.value)}
                  >
                    <option value="SALARIED">Salaried</option>
                    <option value="SELF_EMPLOYED">Self Employed</option>
                    <option value="UNEMPLOYED">Unemployed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] mb-1.5">Salary Slip (PDF/Image)</label>
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/jpg"
                    className="block w-full text-[10px] font-bold text-gray-500 file:mr-4 file:cursor-pointer file:rounded file:border-2 file:border-[#0f0f0f] file:bg-white file:py-2 file:px-5 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:text-[#0f0f0f] file:shadow-[2px_2px_0_0_rgba(15,15,15,1)] hover:file:translate-y-[2px] hover:file:translate-x-[2px] hover:file:shadow-none transition-all"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          setError('Salary slip file size must be less than 5MB');
                          setSalarySlip(null);
                          e.target.value = '';
                          return;
                        }
                        const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
                        if (!validTypes.includes(file.type)) {
                          setError('Only PDF, PNG, and JPG files are allowed');
                          setSalarySlip(null);
                          e.target.value = '';
                          return;
                        }
                        setError('');
                      }
                      setSalarySlip(file);
                    }}
                  />
                  <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500">*STRICTLY REQUIRED. MAX 5MB (PDF/JPG/PNG)</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-8 border-t-2 border-[#0f0f0f]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded border-2 border-[#0f0f0f] bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[4px_4px_0_0_rgba(15,15,15,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
                >
                  BACK
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded border-2 border-[#0f0f0f] bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#0f0f0f] shadow-[4px_4px_0_0_rgba(15,15,15,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all"
                >
                  CANCEL
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className={`rounded border-2 border-[#0f0f0f] px-8 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all ${
                    canGoNext 
                      ? 'bg-[#0f0f0f] shadow-[4px_4px_0_0_rgba(217,119,6,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none' 
                      : 'bg-gray-400 cursor-not-allowed opacity-60 shadow-none'
                  }`}
                >
                  NEXT
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!isStep3Valid}
                  className={`rounded border-2 border-[#0f0f0f] px-8 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all ${
                    isStep3Valid 
                      ? 'bg-green-600 shadow-[4px_4px_0_0_rgba(21,128,61,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none' 
                      : 'bg-gray-400 cursor-not-allowed opacity-60 shadow-none'
                  }`}
                >
                  SUBMIT APPLICATION
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
