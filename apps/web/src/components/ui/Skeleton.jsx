'use client';

import { motion } from 'framer-motion';
import '@/components/ui/design-tokens.css';

export function Skeleton({ className = '', variant = 'text', width, height, lines = 1, animation = 'pulse' }) {
  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-[wave_1.5s_ease-in-out_infinite]',
    none: '',
  };

  const baseClasses = 'bg-bg-tertiary rounded ${animations[animation]} ${className}';

  if (variant === 'circular') {
    return <motion.div className={`rounded-full ${baseClasses}`} style={{ width, height }} aria-hidden="true" />;
  }

  if (variant === 'rectangular') {
    return <motion.div className={`rounded-lg ${baseClasses}`} style={{ width, height }} aria-hidden="true" />;
  }

  if (variant === 'avatar') {
    const size = width || height || 40;
    return <motion.div className={`rounded-full ${baseClasses}`} style={{ width: size, height: size }} aria-hidden="true" />;
  }

  if (variant === 'card') {
    return (
      <div className={`space-y-3 ${className}`} aria-hidden="true">
        <motion.div className="h-6 rounded w-3/4 ${animations[animation]} bg-bg-tertiary" />
        <motion.div className="h-4 rounded w-1/2 ${animations[animation]} bg-bg-tertiary" />
        <motion.div className="h-4 rounded w-full ${animations[animation]} bg-bg-tertiary" />
        <motion.div className="h-4 rounded w-5/6 ${animations[animation]} bg-bg-tertiary" />
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className="grid gap-4" aria-hidden="true" style={{ gridTemplateColumns: width }}>
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div key={i} className="h-4 rounded ${animations[animation]} bg-bg-tertiary" />
        ))}
      </div>
    );
  }

  if (variant === 'list-item') {
    return (
      <div className="flex items-center gap-4 ${className}" aria-hidden="true">
        <motion.div className="w-10 h-10 rounded-full ${animations[animation]} bg-bg-tertiary flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <motion.div className="h-5 rounded w-3/4 ${animations[animation]} bg-bg-tertiary" />
          <motion.div className="h-4 rounded w-1/2 ${animations[animation]} bg-bg-tertiary" />
        </div>
        <motion.div className="w-20 h-6 rounded ${animations[animation]} bg-bg-tertiary flex-shrink-0" />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div key={i} className={`h-4 rounded ${animations[animation]} bg-bg-tertiary`} style={{ width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-border-light bg-white ${className}`} role="status" aria-label="Loading table data">
      <div className="divide-y divide-border-light">
        <div className="px-4 py-3 bg-bg-primary border-b border-border-light">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, i) => (
              <motion.div key={i} className="h-4 rounded w-3/4 animate-pulse bg-bg-tertiary" />
            ))}
          </div>
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-4 py-3">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, i) => (
                <motion.div key={i} className="h-4 rounded animate-pulse bg-bg-tertiary" style={{ width: i === 0 ? '80%' : '60%' }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ className = '', lines = 3, image = true }) {
  return (
    <div className={`bg-white rounded-xl border border-border-light shadow-sm p-5 ${className}`} aria-hidden="true">
      {image && <motion.div className="aspect-video w-full rounded-lg animate-pulse bg-bg-tertiary mb-4" />}
      <div className="space-y-3">
        <motion.div className="h-6 rounded w-1/3 animate-pulse bg-bg-tertiary" />
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div key={i} className="h-4 rounded animate-pulse bg-bg-tertiary" style={{ width: i === lines - 1 ? '70%' : '100%' }} />
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton({ fields = 5, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`} aria-hidden="true">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <motion.div className="h-4 rounded w-1/4 animate-pulse bg-bg-tertiary" />
          <motion.div className="h-10 rounded animate-pulse bg-bg-tertiary" />
        </div>
      ))}
    </div>
  );
}