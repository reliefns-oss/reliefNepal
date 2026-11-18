'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export function FeedbackButton() {
  return (
    <>
      {/* Floating Action Button - links to feedback form page */}
      <Link
        href="/feedback-form"
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-forest-700 shadow-xl text-white flex items-center justify-center transition-all duration-300 hover:bg-forest-800 hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 active:scale-95"
        aria-label="Open feedback form"
      >
        <MessageSquare size={24} aria-hidden="true" />
        <span className="sr-only">Open feedback form</span>
      </Link>

      {/* Tooltip */}
      <motion.div
        className="fixed bottom-6 right-24 z-[9998] hidden lg:block"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-slate-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
          Send Feedback
        </div>
      </motion.div>
    </>
  );
}