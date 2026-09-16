'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

const roles = [
  {
    icon: '👔',
    title: 'Admin',
    color: 'from-slate-600 to-slate-800',
    badge: 'bg-slate-100 text-slate-700',
    features: [
      'Full system oversight & monitoring',
      'View all 4 executive dashboards in one place',
      'Track the entire loan lifecycle',
      'Access aggregated reports & analytics',
    ],
  },
  {
    icon: '📊',
    title: 'Sales Executive',
    color: 'from-blue-500 to-blue-700',
    badge: 'bg-blue-50 text-blue-700',
    features: [
      'View all incoming loan applications',
      'Review borrower details & documents',
      'Track application status in real-time',
      'Forward qualified applications for review',
    ],
  },
  {
    icon: '✅',
    title: 'Sanction Executive',
    color: 'from-indigo-500 to-violet-700',
    badge: 'bg-indigo-50 text-indigo-700',
    features: [
      'Review & evaluate loan applications',
      'Approve or reject applications with remarks',
      'Verify eligibility against business rules',
      'Ensure compliance with lending policies',
    ],
  },
  {
    icon: '💳',
    title: 'Disbursement Executive',
    color: 'from-green-500 to-emerald-700',
    badge: 'bg-green-50 text-green-700',
    features: [
      'Process approved loan disbursements',
      'Manage fund transfer workflows',
      'Record disbursement dates & amounts',
      'Generate disbursement confirmations',
    ],
  },
  {
    icon: '🏦',
    title: 'Collection Executive',
    color: 'from-orange-500 to-amber-600',
    badge: 'bg-orange-50 text-orange-700',
    features: [
      'Track active loans & repayment schedules',
      'Log EMI & payment collections',
      'Manage overdue & defaulted accounts',
      'Monitor portfolio collection health',
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
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 pb-24 pt-20 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-96 w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400/10 to-indigo-400/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <span className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
            🎓 Full-Stack Loan Management System — Assignment
          </span>
          <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-gray-900 sm:text-6xl">
            Smart Loans with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              LMS
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600">
            A comprehensive loan management platform connecting borrowers with a structured pipeline of executives — from
            application to disbursement and collection. Built with Next.js, Express, and MongoDB.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => router.push('/register')}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/30 transition hover:scale-[1.03] hover:shadow-blue-500/40 sm:w-auto"
            >
              Apply for a Loan →
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-base font-bold text-gray-700 transition hover:border-blue-300 hover:bg-gray-50 sm:w-auto"
            >
              Executive Login
            </button>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900">
              Who Uses LMS?
            </h2>
            <p className="mx-auto max-w-xl text-lg text-gray-500">
              Five distinct roles, each with a tailored dashboard and permissions — ensuring the right information reaches the right person.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <div
                key={role.title}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${role.color} text-2xl shadow-md`}>
                  {role.icon}
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{role.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${role.badge}`}>Role</span>
                </div>
                <ul className="space-y-2">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-0.5 shrink-0 text-blue-500">✓</span>
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
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900">
              Loan Requirements
            </h2>
            <p className="mx-auto max-w-xl text-lg text-gray-500">
              A simple set of eligibility criteria ensures fair and responsible lending for all borrowers.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {requirements.map((req) => (
              <div
                key={req.label}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:border-blue-200 hover:bg-blue-50/30"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                  {req.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold text-gray-500">{req.label}</div>
                  <div className="text-base font-bold text-gray-900">{req.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Lifecycle */}
      <section className="bg-gray-50 border-t border-gray-100 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900">Loan Lifecycle</h2>
            <p className="mx-auto max-w-xl text-lg text-gray-500">
              Every application follows a structured, transparent pipeline from start to finish.
            </p>
          </div>
          <div className="relative mx-auto mt-20 max-w-6xl">
            {/* Connecting Line for Desktop */}
            <div className="absolute left-1/2 top-10 hidden h-0.5 w-4/5 -translate-x-1/2 bg-gray-200 md:block" />

            <div className="grid gap-12 md:grid-cols-5 md:gap-6">
              {lifecycle.map((item, i) => (
                <div key={item.step} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-4 ring-gray-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:ring-blue-100">
                    <span className="text-2xl font-black text-blue-600 group-hover:text-white transition-colors">{item.step}</span>
                  </div>
                  <h3 className="mb-3 text-lg font-extrabold tracking-tight text-gray-900">{item.title}</h3>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed px-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8 text-center text-sm text-gray-400">
        <p>
          <span className="font-bold text-gray-700">LMS</span> — Loan Management System &nbsp;&middot;&nbsp; Built with Next.js, Express &amp; MongoDB
        </p>
      </footer>
    </div>
  );
}
