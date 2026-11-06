'use client';

import Link from 'next/link';
import { MoreVertical, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../lib/api/client.js';

const PAGE_SIZE = 10;

function noticeDate(publishedAt, createdAt) {
  const dateValue = publishedAt || createdAt;
  if (!dateValue) return null;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kathmandu',
  }).format(new Date(dateValue));
}

export default function NoticeList() {
  const [notices, setNotices] = useState([]);
  const [state, setState] = useState('loading');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [draftFromDate, setDraftFromDate] = useState('');
  const [draftToDate, setDraftToDate] = useState('');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest('/notices')
      .then((data) => {
        if (active) {
          setNotices(Array.isArray(data) ? data : []);
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
    return notices.filter((notice) => {
      const publishedAt = new Date(notice.published_at);
      return (!start || publishedAt >= start) && (!end || publishedAt <= end);
    });
  }, [notices, fromDate, toDate]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate]);

  useEffect(() => {
    if (!filtersOpen) return;
    function closeOnEscape(event) {
      if (event.key === 'Escape') setFiltersOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [filtersOpen]);

  if (state === 'loading')
    return (
      <p
        role="status"
        className="mt-8 rounded-xl bg-white p-6 text-sm text-slate-600"
      >
        Loading notices...
      </p>
    );
  if (state === 'error')
    return (
      <p
        role="alert"
        className="mt-8 rounded-xl bg-white p-6 text-sm text-slate-600"
      >
        Notices are temporarily unavailable. Please check back later.
      </p>
    );

  return (
    <section className="mt-8" aria-label="Notice archive">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'notice' : 'notices'}
          {fromDate || toDate ? ' in selected dates' : ''}
        </p>
        <button
          type="button"
          aria-label="Notice list options"
          title="Filter notices by date"
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

      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-filter-title"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id="notice-filter-title"
                className="text-lg font-bold text-forest-900"
              >
                Filter notices by date
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
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraftFromDate('');
                  setDraftToDate('');
                  setFromDate('');
                  setToDate('');
                  setFiltersOpen(false);
                }}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Clear dates
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
          <p className="font-semibold">No notices found for these dates.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Clear the date filters to browse all current notices.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-forest-100 overflow-hidden rounded-2xl border border-forest-100 bg-white">
          {pageItems.map((notice) => (
            <article
              key={notice.id}
              className="grid gap-2 px-4 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-5"
            >
              <time
                dateTime={notice.published_at || notice.created_at}
                className="text-xs font-medium text-slate-500 sm:pt-1 sm:text-sm"
              >
                {noticeDate(notice.published_at, notice.created_at)}
              </time>
              <div className="flex min-w-0 gap-4">
                {notice.image_url && (
                  <img
                    src={notice.image_url}
                    alt={notice.title}
                    loading="lazy"
                    className="h-20 w-28 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-forest-900">
                    <Link
                      href={`/notice/${encodeURIComponent(notice.slug)}`}
                      className="text-base font-semibold text-slate-800 hover:text-forest-700 hover:underline"
                    >
                      {notice.title}
                    </Link>
                  </h2>
                  {notice.body && (
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {notice.body}
                    </p>
                  )}
                  <Link
                    href={`/notice/${encodeURIComponent(notice.slug)}`}
                    className="mt-1 inline-flex text-xs font-semibold text-forest-700 hover:underline"
                  >
                    Read full notice
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <nav
          aria-label="Notice pages"
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
