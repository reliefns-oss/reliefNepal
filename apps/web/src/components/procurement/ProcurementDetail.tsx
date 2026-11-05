'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar, ExternalLink, FileText, MapPin, Mail, Phone, AlertTriangle, Clock } from 'lucide-react';
import { apiRequest } from '../../lib/api/client.js';

interface ProcurementItem {
  id: string;
  slug: string;
  reference_number: string;
  title: string;
  category: string;
  description: string;
  requirements: string;
  submission_instructions: string;
  submission_email: string;
  submission_url: string;
  attachment_url: string | null;
  attachment_public_id: string | null;
  deadline: string;
  status: string;
  published_at: string;
  location: string;
  duration: string;
  work_schedule: string;
}

function formatDate(value: string | null) {
  if (!value) return 'Not specified';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kathmandu',
  }).format(new Date(value));
}

function formatDeadline(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    formatted: new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Kathmandu',
    }).format(date),
    daysLeft: diffDays,
    isUrgent: diffDays <= 7 && diffDays >= 0,
    isExpired: diffDays < 0,
  };
}

export default function ProcurementDetail({ slug }: { slug: string }) {
  const [item, setItem] = useState<ProcurementItem | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    apiRequest(`/procurement/${slug}`)
      .then((data) => {
        if (active) {
          if (data) {
            setItem(data as ProcurementItem);
            setState('ready');
          } else {
            setState('error');
          }
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const deadlineInfo = item ? formatDeadline(item.deadline) : null;

  if (state === 'loading') {
    return (
      <main className="bg-[#f7f8f5] px-5 py-16 text-[#183a2a] sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p role="status" className="text-center text-slate-600">
            Loading procurement details…
          </p>
        </div>
      </main>
    );
  }

  if (state === 'error' || !item) {
    return (
      <main className="bg-[#f7f8f5] px-5 py-16 text-[#183a2a] sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-forest-900">Procurement not found</h1>
          <p className="mt-4 text-slate-600">
            The procurement opportunity you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/procurement"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest-700 underline"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to procurement
          </Link>
        </div>
      </main>
    );
  }

  const categoryLabels: Record<string, string> = {
    goods: 'Goods & Supplies',
    services: 'Services & Consulting',
    works: 'Works & Construction',
    procurement: 'General Procurement',
  };

  return (
    <>
      <header className="bg-forest-900 px-5 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/70" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/get-involved" className="hover:text-white">
              Get Involved
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/procurement" className="hover:text-white">
              Procurement
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{item.title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                item.status === 'open'
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {item.status === 'open' ? 'Open' : 'Closed'}
            </span>
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white/80"
            >
              {categoryLabels[item.category] || item.category}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
            {item.title}
          </h1>
          <p className="mt-3 text-lg text-white/80">Ref: {item.reference_number}</p>
        </div>
      </header>

      <main className="bg-[#f7f8f5] px-5 py-16 text-[#183a2a] sm:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Deadline Banner */}
          {deadlineInfo && (
            <div
              className={`mb-8 rounded-xl p-5 ${
                deadlineInfo.isExpired
                  ? 'bg-red-50 border border-red-200'
                  : deadlineInfo.isUrgent
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-forest-50 border border-forest-200'
              }`}
              role="alert"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 p-2 rounded-lg ${
                      deadlineInfo.isExpired
                        ? 'bg-red-100 text-red-600'
                        : deadlineInfo.isUrgent
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-forest-100 text-forest-600'
                    }`}
                  >
                    <Calendar size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {deadlineInfo.isExpired ? 'Submission deadline passed' : 'Submission deadline'}
                    </p>
                    <p className="font-bold text-lg">
                      {deadlineInfo.isExpired
                        ? `Expired on ${deadlineInfo.formatted}`
                        : deadlineInfo.formatted}
                    </p>
                  </div>
                </div>
                {!deadlineInfo.isExpired && deadlineInfo.daysLeft >= 0 && (
                  <span
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      deadlineInfo.isUrgent
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-forest-100 text-forest-800'
                    }`}
                  >
                    <Clock size={14} aria-hidden="true" />
                    {deadlineInfo.daysLeft} day{'s' + (deadlineInfo.daysLeft !== 1 ? '' : '')} remaining
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              {/* Description */}
              <section className="rounded-2xl border border-forest-100 bg-white p-6 sm:p-8" aria-labelledby="description-heading">
                <h2 id="description-heading" className="text-xl font-bold text-forest-900">
                  Description
                </h2>
                <div className="mt-4 prose prose-slate max-w-none">
                  {item.description ? (
                    <p className="leading-7 text-slate-600 whitespace-pre-line">{item.description}</p>
                  ) : (
                    <p className="leading-7 text-slate-500">
                      Detailed description will be added when available.
                    </p>
                  )}
                </div>
              </section>

              {/* Requirements */}
              {item.requirements && (
                <section className="rounded-2xl border border-forest-100 bg-white p-6 sm:p-8" aria-labelledby="requirements-heading">
                  <h2 id="requirements-heading" className="text-xl font-bold text-forest-900 flex items-center gap-2">
                    <FileText size={24} className="text-forest-700" aria-hidden="true" />
                    Requirements & Qualifications
                  </h2>
                  <div className="mt-4 prose prose-slate max-w-none">
                    <p className="leading-7 text-slate-600 whitespace-pre-line">{item.requirements}</p>
                  </div>
                </section>
              )}

              {/* Submission Instructions */}
              {item.submission_instructions && (
                <section className="rounded-2xl border border-forest-100 bg-white p-6 sm:p-8" aria-labelledby="submission-heading">
                  <h2 id="submission-heading" className="text-xl font-bold text-forest-900 flex items-center gap-2">
                    <ExternalLink size={24} className="text-forest-700" aria-hidden="true" />
                    Submission Instructions
                  </h2>
                  <div className="mt-4 prose prose-slate max-w-none">
                    <p className="leading-7 text-slate-600 whitespace-pre-line">{item.submission_instructions}</p>
                  </div>
                </section>
              )}

              {/* Additional Details */}
              {(item.location || item.duration || item.work_schedule) && (
                <section className="rounded-2xl border border-forest-100 bg-white p-6 sm:p-8" aria-labelledby="details-heading">
                  <h2 id="details-heading" className="text-xl font-bold text-forest-900">
                    Additional Details
                  </h2>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    {item.location && (
                      <>
                        <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <MapPin size={16} aria-hidden="true" />
                          Location
                        </dt>
                        <dd className="text-slate-900">{item.location}</dd>
                      </>
                    )}
                    {item.duration && (
                      <>
                        <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <Clock size={16} aria-hidden="true" />
                          Duration
                        </dt>
                        <dd className="text-slate-900">{item.duration}</dd>
                      </>
                    )}
                    {item.work_schedule && (
                      <>
                        <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <Calendar size={16} aria-hidden="true" />
                          Work Schedule
                        </dt>
                        <dd className="text-slate-900">{item.work_schedule}</dd>
                      </>
                    )}
                  </dl>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              {/* Key Information Card */}
              <section className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm" aria-labelledby="key-info-heading">
                <h2 id="key-info-heading" className="text-lg font-bold text-forest-900">
                  Key Information
                </h2>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Reference Number</dt>
                    <dd className="mt-1 font-mono text-slate-900">{item.reference_number}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Category</dt>
                    <dd className="mt-1 text-slate-900">{categoryLabels[item.category] || item.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Status</dt>
                    <dd className="mt-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status === 'open' ? 'Open for submissions' : 'Closed'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Published</dt>
                    <dd className="mt-1 text-slate-900">{formatDate(item.published_at)}</dd>
                  </div>
                  {deadlineInfo && (
                    <div>
                      <dt className="text-sm font-medium text-slate-500">Deadline</dt>
                      <dd className={`mt-1 font-medium ${deadlineInfo.isExpired ? 'text-red-600' : deadlineInfo.isUrgent ? 'text-amber-600' : 'text-forest-700'}`}>
                        {deadlineInfo.formatted}
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              {/* Submission Actions */}
              <section className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm" aria-labelledby="submit-heading">
                <h2 id="submit-heading" className="text-lg font-bold text-forest-900">
                  How to Submit
                </h2>
                <div className="mt-4 space-y-3">
                  {item.attachment_url && (
                    <a
                      href={item.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-forest-200 bg-forest-50 p-4 text-forest-700 hover:bg-forest-100 transition-colors"
                    >
                      <FileText size={20} aria-hidden="true" />
                      <div>
                        <p className="font-medium">Download Tender Documents</p>
                        <p className="text-sm text-forest-600">Terms of reference, bid forms, specifications</p>
                      </div>
                    </a>
                  )}
                  {item.submission_email && (
                    <a
                      href={`mailto:${item.submission_email}`}
                      className="flex items-center gap-3 rounded-lg border border-forest-200 bg-white p-4 text-forest-700 hover:bg-forest-50 transition-colors"
                    >
                      <Mail size={20} aria-hidden="true" />
                      <div>
                        <p className="font-medium">Submit via Email</p>
                        <p className="text-sm text-forest-600">{item.submission_email}</p>
                      </div>
                    </a>
                  )}
                  {item.submission_url && (
                    <a
                      href={item.submission_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-lg bg-forest-700 p-4 text-white hover:bg-forest-900 transition-colors"
                    >
                      <ExternalLink size={20} aria-hidden="true" />
                      <div>
                        <p className="font-medium">Submit via Portal</p>
                        <p className="text-sm text-forest-100">Online submission system</p>
                      </div>
                    </a>
                  )}
                  {(!item.submission_email && !item.submission_url && !item.attachment_url) && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm text-amber-800 flex items-center gap-2">
                        <AlertTriangle size={16} aria-hidden="true" />
                        Submission details will be added. Please check back or contact us for more information.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-forest-100">
                  <p className="text-sm text-slate-600">
                    For questions about this procurement, contact the procurement team at
                    <a href="mailto:procurement@reliefnepal.org.np" className="text-forest-700 underline">
                      procurement@reliefnepal.org.np
                    </a>
                  </p>
                </div>
              </section>

              {/* Back Link */}
              <Link
                href="/procurement"
                className="block rounded-lg border border-forest-200 bg-white px-4 py-3 text-center text-sm font-semibold text-forest-700 hover:bg-forest-50"
              >
                ← Back to all procurement opportunities
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}