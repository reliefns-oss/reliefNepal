'use client';

import Link from 'next/link';
import { MoreVertical, X, FileText, Calendar, ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../lib/api/client.js';

const PAGE_SIZE = 10;

function formatDate(value: string | null) {
  if (!value) return 'Date not available';
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

export default function ProcurementList() {
  const [procurements, setProcurements] = useState([]);
  const [state, setState] = useState('loading');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [draftFromDate, setDraftFromDate] = useState('');
  const [draftToDate, setDraftToDate] = useState('');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    let active = true;
    apiRequest('/procurement')
      .then((data) => {
        if (active) {
          setProcurements(data as any[]);
          setState('ready');
        }
      })
      .catch(() => {
        if (active) setState('error');
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const start = fromDate ? new Date(`${fromDate}T00:00:00+05:45`) : null;
    const end = toDate ? new Date(`${toDate}T23:59:59.999+05:45`) : null;
    return procurements.filter((item) => {
      const publishedAt = new Date(item.published_at);
      const matchesDate = (!start || publishedAt >= start) && (!end || publishedAt <= end);
      const matchesCategory = category === 'all' || item.category === category;
      return matchesDate && matchesCategory;
    });
  }, [procurements, fromDate, toDate, category]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate, category]);

  useEffect(() => {
    if (!filtersOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setFiltersOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [filtersOpen]);

  const categories = [
    { value: 'all', label: 'All categories' },
    { value: 'goods', label: 'Goods & Supplies' },
    { value: 'services', label: 'Services & Consulting' },
    { value: 'works', label: 'Works & Construction' },
    { value: 'procurement', label: 'General Procurement' },
  ];

  if (state === 'loading')
    return (
      <p role="status" className="mt-8 rounded-xl bg-white p-6 text-sm text-slate-600">
        Loading procurement opportunities…
      </p>
    );
  if (state === 'error')
    return (
      <p role="alert" className="mt-8 rounded-xl bg-white p-6 text-sm text-slate-600">
        Procurement information is temporarily unavailable. Please check back later.
      </p>
    );

  return (
    <section className="mt-8" aria-label="Procurement archive">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'opportunity' : 'opportunities'}
          {fromDate || toDate ? ' in selected dates' : ''}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Procurement list options"
            title="Filter by date"
            onClick={() => {
              setDraftFromDate(fromDate);
              setDraftToDate(toDate);
              setFiltersOpen(true);
            }}
            className="rounded-full p-2 text-slate-500 transition hover:bg-forest-50 hover:text-forest-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest-700"
          >
            <MoreVertical size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="procurement-filter-title"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 id="procurement-filter-title" className="text-lg font-bold text-forest-900">
                Filter procurement by date
              </h2>
              <button
                type="button"
                aria-label="Close date filters"
                onClick={() => setFiltersOpen(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                From date
                <input
                  type="date"
                  value={draftFromDate}
                  max={draftToDate || undefined}
                  onChange={(event) => setDraftFromDate(event.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                To date
                <input
                  type="date"
                  value={draftToDate}
                  min={draftFromDate || undefined}
                  onChange={(event) => setDraftToDate(event.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 font-normal"
                />
              </label>
            </div>
            <div className="mt-4">
              <label className="text-sm font-semibold text-slate-700 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 font-normal text-slate-900 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraftFromDate('');
                  setDraftToDate('');
                  setFromDate('');
                  setToDate('');
                  setCategory('all');
                  setFiltersOpen(false);
                }}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Clear filters
              </button>
              <button
                type="button"
                onClick={() => {
                  setFromDate(draftFromDate);
                  setToDate(draftToDate);
                  setFiltersOpen(false);
                }}
                className="rounded-lg bg-forest-800 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-900"
              >
                Apply filter
              </button>
            </div>
          </section>
        </div>
      )}

      {pageItems.length === 0 ? (
        <div className="rounded-2xl border border-forest-100 bg-white p-7">
          <p className="font-semibold">No procurement opportunities found.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {fromDate || toDate || category !== 'all'
              ? 'Clear the filters to browse all current opportunities.'
              : 'Check back later for new procurement opportunities.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-forest-100 overflow-hidden rounded-2xl border border-forest-100 bg-white">
          {pageItems.map((item) => {
            const deadlineInfo = formatDeadline(item.deadline);
            return (
              <article
                key={item.id}
                className="grid gap-2 px-4 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-5"
              >
                <div className="flex flex-col items-start sm:items-end">
                  <time
                    dateTime={item.published_at}
                    className="text-xs font-medium text-slate-500 sm:pt-1 sm:text-sm"
                  >
                    {formatDate(item.published_at)}
                  </time>
                  {deadlineInfo && (
                    <time
                      dateTime={item.deadline}
                      className={`mt-1 text-sm font-semibold ${
                        deadlineInfo.isExpired
                          ? 'text-red-600'
                          : deadlineInfo.isUrgent
                          ? 'text-amber-600'
                          : 'text-forest-700'
                      }`}
                    >
                      {deadlineInfo.isExpired ? (
                        <>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} aria-hidden="true" />
                            Expired {deadlineInfo.formatted}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} aria-hidden="true" />
                            Deadline: {deadlineInfo.formatted}
                          </span>
                          {deadlineInfo.daysLeft >= 0 && (
                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium">
                              {deadlineInfo.isUrgent ? (
                                <>
                                  <span className="bg-amber-100 text-amber-800">
                                    {deadlineInfo.daysLeft} day{deadlineInfo.daysLeft !== 1 ? 's' : ''} left
                                  </span>
                                </>
                              ) : (
                                <span className="bg-forest-100 text-forest-800">
                                  {deadlineInfo.daysLeft} day{deadlineInfo.daysLeft !== 1 ? 's' : ''} left
                                </span>
                              )}
                            </span>
                          )}
                        </>
                      )}
                    </time>
                  )}
                  <span
                    className={`mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'closed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.status === 'open' ? 'Open' : item.status === 'closed' ? 'Closed' : 'Draft'}
                  </span>
                </div>
                <div className="flex min-w-0 flex-col gap-2 sm:gap-4">
                  <div className="flex min-w-0 gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-forest-900">
                        <Link
                          href={`/procurement/${encodeURIComponent(item.slug)}`}
                          className="text-base font-semibold text-slate-800 hover:text-forest-700 hover:underline"
                        >
                          {item.title}
                        </Link>
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Ref: {item.reference_number}
                        {item.category && (
                          <>
                            <span className="mx-1">•</span>
                            {item.category
                              .replace('_', ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </>
                        )}
                      </p>
                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {item.attachment_url && (
                      <a
                        href={item.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-forest-200 bg-forest-50 px-3 py-1.5 text-sm font-medium text-forest-700 hover:bg-forest-100"
                      >
                        <FileText size={14} aria-hidden="true" />
                        Download documents
                      </a>
                    )}
                    {item.submission_email && (
                      <a
                        href={`mailto:${item.submission_email}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-forest-200 bg-white px-3 py-1.5 text-sm font-medium text-forest-700 hover:bg-forest-50"
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                        Submit via email
                      </a>
                    )}
                    {item.submission_url && (
                      <a
                        href={item.submission_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-forest-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-forest-900"
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                        View portal
                      </a>
                    )}
                    <Link
                      href={`/procurement/${encodeURIComponent(item.slug)}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-forest-700 hover:bg-slate-200"
                    >
                      View details
                      <ExternalLink size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <nav
          aria-label="Procurement pages"
          className="mt-4 flex items-center justify-between gap-4 px-1 py-2"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-lg border border-forest-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600" aria-live="polite">
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
            className="rounded-lg border border-forest-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}