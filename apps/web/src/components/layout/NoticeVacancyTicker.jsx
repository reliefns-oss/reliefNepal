'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from '../../lib/api/client.js';
import styles from './NoticeVacancyTicker.module.css';

const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function NoticeVacancyTicker() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadUpdates() {
      const results = await Promise.allSettled([
        apiRequest('/notices'),
        apiRequest('/vacancies'),
      ]);

      const noticesResult = results[0];
      const vacanciesResult = results[1];

      if (noticesResult.status === 'rejected') {
        console.error(
          'Failed to load notices for the header ticker:',
          noticesResult.reason,
        );
      }
      if (vacanciesResult.status === 'rejected') {
        console.error(
          'Failed to load vacancies for the header ticker:',
          vacanciesResult.reason,
        );
      }

      if (!active) return;

      const notices =
        noticesResult.status === 'fulfilled' &&
        Array.isArray(noticesResult.value)
          ? noticesResult.value
              .filter((notice) => notice?.title && notice?.slug)
              .map((notice) => ({
                id: `notice-${notice.id || notice.slug}`,
                title: notice.title,
                href: `/notice/${encodeURIComponent(notice.slug)}`,
                type: 'Notice',
                date: notice.published_at || notice.created_at,
              }))
          : [];
      const vacancies =
        vacanciesResult.status === 'fulfilled' &&
        Array.isArray(vacanciesResult.value)
          ? vacanciesResult.value
              .filter((vacancy) => vacancy?.title && vacancy?.slug)
              .map((vacancy) => ({
                id: `vacancy-${vacancy.id || vacancy.slug}`,
                title: vacancy.title,
                href: `/vacancies/${encodeURIComponent(vacancy.slug)}`,
                type: 'Vacancy',
                date: vacancy.published_at || vacancy.created_at,
              }))
          : [];

      setUpdates(
        [...notices, ...vacancies].sort(
          (a, b) =>
            new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
        ),
      );
    }

    loadUpdates();
    const intervalId = window.setInterval(loadUpdates, REFRESH_INTERVAL);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  if (!updates.length) return null;

  return (
    <aside className={styles.bar} aria-label="Latest notices and vacancies">
      <div className={styles.label}>Latest updates</div>
      <div className={styles.viewport}>
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className={styles.group}
              aria-hidden={copy === 1 ? 'true' : undefined}
            >
              {updates.map((update) => (
                <Link
                  key={update.id}
                  href={update.href}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className={styles.item}
                >
                  <span className={styles.type}>{update.type}</span>
                  <span>{update.title}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
