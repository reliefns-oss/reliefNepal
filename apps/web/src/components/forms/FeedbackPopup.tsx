'use client';

import Link from 'next/link';

export default function FeedbackPopup() {
  return (
    <Link
      href="/feedback-form"
      className="fixed bottom-6 right-6 z-[9999] rounded-full bg-forest-700 p-4 shadow-xl text-white hover:bg-forest-900 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
      aria-label="Open feedback form"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </Link>
  );
}