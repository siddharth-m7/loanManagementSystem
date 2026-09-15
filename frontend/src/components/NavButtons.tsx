'use client';

import { useRouter } from 'next/navigation';

export default function NavButtons() {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
      <button
        onClick={() => router.back()}
        title="Go back"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow-lg ring-1 ring-gray-200 backdrop-blur-md transition hover:bg-white hover:text-blue-600 hover:ring-blue-300 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => router.forward()}
        title="Go forward"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow-lg ring-1 ring-gray-200 backdrop-blur-md transition hover:bg-white hover:text-blue-600 hover:ring-blue-300 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
