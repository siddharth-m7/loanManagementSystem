'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

const roles = [
  {
    icon: '👔',
    title: 'Admin',
    features: [
      'Full system oversight & monitoring',
      'View all 4 executive dashboards',
      'Track the entire loan lifecycle',
      'Access reports & analytics',
    ],
  },
  {
    icon: '📊',
    title: 'Sales Exec',
    features: [
      'View incoming loan applications',
      'Review borrower details',
      'Track real-time status',
      'Forward qualified applications',
    ],
  },
  {
    icon: '✅',
    title: 'Sanction Exec',
    features: [
      'Review & evaluate applications',
      'Approve or reject with remarks',
      'Verify eligibility rules',
      'Ensure lending compliance',
    ],
  },
  {
    icon: '💳',
    title: 'Disbursement',
    features: [
      'Process loan disbursements',
      'Manage transfer workflows',
      'Record dates & amounts',
      'Generate confirmations',
    ],
  },
  {
    icon: '🏦',
    title: 'Collection',
    features: [
      'Track repayment schedules',
      'Log EMI & collections',
      'Manage defaulted accounts',
      'Monitor portfolio health',
    ],
  },
];

const requirements = [
  { icon: '💰', label: 'Loan Amount', value: '₹50,000 – ₹5,00,000' },
  { icon: '📋', label: 'Valid PAN Card', value: 'Mandatory for all applicants' },
  { icon: '💼', label: 'Minimum Salary', value: '₹25,000 per month' },
  { icon: '🏠', label: 'Employment Status', value: 'Salaried or self-employed' },
  { icon: '📄', label: 'Age Requirement', value: '23 – 50 years' },
];

const lifecycle = [
  { step: '01', title: 'Apply', desc: 'Borrower submits application with PAN and salary details.' },
  { step: '02', title: 'Review', desc: 'Sales Executive reviews and validates the application.' },
  { step: '03', title: 'Sanction', desc: 'Sanction Executive approves or rejects based on eligibility.' },
  { step: '04', title: 'Disburse', desc: 'Disbursement Executive processes the fund transfer.' },
  { step: '05', title: 'Collect', desc: 'Collection Executive tracks repayments and EMIs.' },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="relative min-h-screen bg-white font-sans selection:bg-orange-500 selection:text-white">
      {/* Global Grid Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40" 
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundPosition: 'center top'
        }}
      />

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="px-4 pt-12 pb-16 text-center mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-center gap-2 rounded-full px-3 py-1 bg-white border border-gray-200 inline-flex">
            <span className="h-2 w-2 rounded-full bg-[#10b981]"></span>
            <span className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">
              LMS · Loan Management System
            </span>
          </div>

          <h1 className="mb-6 text-5xl md:text-6xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tighter text-[#0f0f0f]">
            <span className="block">Loan Management</span>
            <span className="block">
              System <span className="text-[#d97706]">Assignment</span>
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-500 font-medium tracking-tight">
            Your comprehensive loan management platform — apply for personal loans, get quick approvals, and manage your repayments with ease.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row w-full sm:w-auto mb-12">
            <button
              onClick={() => router.push('/register')}
              className="w-full sm:w-[200px] rounded bg-[#0f0f0f] px-8 py-3.5 text-xs font-bold tracking-widest text-white transition-all hover:bg-black hover:-translate-y-0.5 shadow-[4px_4px_0_0_rgba(217,119,6,0.3)]"
            >
              GET STARTED &rarr;
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full sm:w-[200px] rounded border-2 border-[#0f0f0f] bg-white px-8 py-3.5 text-xs font-bold tracking-widest text-gray-900 transition-all hover:bg-gray-50 hover:-translate-y-0.5"
            >
              SIGN IN
            </button>
          </div>


        </section>

        {/* Roles Section */}
        <section className="px-6 py-20 border-t-2 border-[#0f0f0f]/10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl md:text-4xl font-black tracking-tighter text-[#0f0f0f]">
                Who Uses LMS?
              </h2>
              <p className="mx-auto max-w-xl text-base font-medium text-gray-500">
                Five distinct roles, each with a tailored dashboard and permissions.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {roles.map((role) => (
                <div
                  key={role.title}
                  className="bg-white p-5 border-2 border-[#0f0f0f]/10 transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(15,15,15,1)] rounded-lg"
                >
                  <div className="mb-3 text-3xl">
                    {role.icon}
                  </div>
                  <h3 className="text-lg font-black text-[#0f0f0f] mb-3">{role.title}</h3>
                  <ul className="space-y-2">
                    {role.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs font-semibold text-gray-600">
                        <span className="text-[#d97706]">■</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Loan Requirements */}
        <section className="px-6 py-20 border-t-2 border-[#0f0f0f]/10 bg-white/50 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl md:text-4xl font-black tracking-tighter text-[#0f0f0f]">
                Loan Requirements
              </h2>
              <p className="mx-auto max-w-xl text-base font-medium text-gray-500">
                A simple set of eligibility criteria ensures fair lending.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {requirements.map((req) => (
                <div
                  key={req.label}
                  className="flex items-center gap-4 border-2 border-[#0f0f0f]/10 bg-white p-4 rounded-lg transition hover:border-[#0f0f0f]"
                >
                  <span className="text-2xl">
                    {req.icon}
                  </span>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#d97706] mb-1">{req.label}</div>
                    <div className="text-sm font-bold text-[#0f0f0f]">{req.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Loan Lifecycle */}
        <section className="px-6 py-20 border-t-2 border-[#0f0f0f]/10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-3 text-3xl md:text-4xl font-black tracking-tighter text-[#0f0f0f]">Loan Lifecycle</h2>
              <p className="mx-auto max-w-xl text-base font-medium text-gray-500">
                Structured, transparent pipeline from start to finish.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-5 relative">
              {/* Connecting Line */}
              <div className="absolute left-0 top-[22px] hidden h-[2px] w-full bg-[#0f0f0f]/10 md:block" />

              {lifecycle.map((item) => (
                <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm border-2 border-[#0f0f0f] bg-white font-black text-[#0f0f0f] transition-transform hover:-translate-y-1 hover:shadow-[3px_3px_0_0_rgba(217,119,6,1)]">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-base font-black tracking-tight text-[#0f0f0f]">{item.title}</h3>
                  <p className="text-xs font-semibold text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-[#0f0f0f]/10 bg-white py-8 text-center text-xs font-bold tracking-widest text-gray-400 uppercase">
          <p>
            <span className="text-[#0f0f0f]">LMS</span> · Built with Next.js &amp; Express
          </p>
        </footer>
      </div>
    </div>
  );
}
