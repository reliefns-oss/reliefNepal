'use client';

import { motion } from 'framer-motion';
import { Header } from './Header';
import { Button } from '@/components/ui';
import '@/components/ui/design-tokens.css';

export function AdminLayout({ children, user, onSignOut, className = '' }) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header user={user} onSignOut={onSignOut} />
      <main
        className="admin-main min-h-[calc(100vh-64px)] pt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-4 sm:p-6 lg:p-8 ${className}`}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
  secondaryActions,
  breadcrumbs = [],
  className = '',
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <nav className="mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm flex-wrap">
          {breadcrumbs.length > 0 ? (
            breadcrumbs.map((item, index) => (
              <li key={item.href || index} className="flex items-center gap-2">
                {index > 0 && (
                  <svg className="w-3.5 h-3.5 text-text-quaternary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {item.href ? (
                  <a href={item.href} className="text-text-secondary hover:text-brand-600 transition-colors">{item.label}</a>
                ) : (
                  <span className="font-medium text-text-primary" aria-current="page">{item.label}</span>
                )}
              </li>
            ))
          ) : (
            <>
              <li>
                <a href="/admin" className="text-text-secondary hover:text-brand-600 transition-colors">Dashboard</a>
              </li>
              <li>
                <svg className="w-3.5 h-3.5 text-text-quaternary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-text-primary" aria-current="page">{title}</span>
              </li>
            </>
          )}
        </ol>
      </nav>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">{title}</h1>
          {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {secondaryActions?.map((action, index) => (
            <Button key={index} variant="secondary" size="sm" {...action} />
          ))}
          {action && <Button {...action} />}
        </div>
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  action,
  count,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-bg-tertiary text-text-secondary">
              {count}
            </span>
          )}
        </h2>
        {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}