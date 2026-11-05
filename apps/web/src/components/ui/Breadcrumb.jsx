'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import '@/components/ui/design-tokens.css';

export function Breadcrumb({
  items = [],
  separator = <ChevronRight className="w-4 h-4 flex-shrink-0" />,
  className = '',
  maxItems = 5,
}) {
  const displayItems = items.length > maxItems
    ? [
        items[0],
        { label: '...', href: null, disabled: true },
        ...items.slice(-(maxItems - 1)),
      ]
    : items;

  return (
    <nav className={`flex items-center gap-2 flex-wrap text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {displayItems.map((item, index) => (
          <li key={item.href || index} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-text-quaternary flex-shrink-0" aria-hidden="true">
                {separator}
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={`font-medium transition-colors ${item.isActive ? 'text-text-primary' : 'text-text-secondary hover:text-brand-600'} ${item.disabled ? 'pointer-events-none opacity-50' : ''}`}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ) : (
              <span className={`font-medium ${item.isActive ? 'text-text-primary' : 'text-text-tertiary'}`} aria-current={item.isActive ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function BreadcrumbItem({ children, href, isActive = false, disabled = false, className = '' }) {
  if (href) {
    return (
      <Link
        href={href}
        className={`font-medium transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary hover:text-brand-600'} ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <span className={`font-medium ${isActive ? 'text-text-primary' : 'text-text-tertiary'} ${className}`} aria-current={isActive ? 'page' : undefined}>
      {children}
    </span>
  );
}

export function BreadcrumbSeparator({ children = <ChevronRight className="w-4 h-4" />, className = '' }) {
  return <span className={`text-text-quaternary flex-shrink-0 ${className}`} aria-hidden="true">{children}</span>;
}

export function BreadcrumbHome({ href = '/', className = '', ...props }) {
  return (
    <Link href={href} className={`p-1.5 rounded-lg text-text-quaternary hover:text-text-primary hover:bg-bg-tertiary transition-colors ${className}`} aria-label="Home" {...props}>
      <Home className="w-4 h-4" aria-hidden="true" />
    </Link>
  );
}