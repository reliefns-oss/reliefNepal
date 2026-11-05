'use client';

import { motion } from 'framer-motion';
import '@/components/ui/design-tokens.css';

const badgeVariants = {
  default: 'bg-bg-tertiary text-text-secondary border border-border-light',
  primary: 'bg-brand-50 text-brand-700 border border-brand-200',
  success: 'bg-success-light text-success border border-success-border',
  warning: 'bg-warning-light text-warning border border-warning-border',
  error: 'bg-error-light text-error border border-error-border',
  info: 'bg-info-light text-info border border-info-border',
  published: 'bg-brand-50 text-brand-700 border border-brand-200',
  draft: 'bg-bg-tertiary text-text-secondary border border-border-light',
  archived: 'bg-slate-50 text-slate-600 border border-slate-200',
  active: 'bg-brand-50 text-brand-700 border border-brand-200',
  inactive: 'bg-slate-50 text-slate-600 border border-slate-200',
  pending: 'bg-warning-light text-warning border border-warning-border',
  open: 'bg-brand-50 text-brand-700 border border-brand-200',
  closed: 'bg-slate-50 text-slate-600 border border-slate-200',
  cancelled: 'bg-error-light text-error border border-error-border',
  awarded: 'bg-purple-50 text-purple-700 border border-purple-200',
  unverified: 'bg-bg-tertiary text-text-secondary border border-border-light',
  verified: 'bg-brand-50 text-brand-700 border border-brand-200',
};

const badgeSizes = {
  xs: 'px-2 py-0.5 text-xs gap-1',
  sm: 'px-2.5 py-1 text-xs gap-1.5',
  md: 'px-3 py-1 text-sm gap-1.5',
  lg: 'px-3.5 py-1.5 text-sm gap-2',
};


export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  dotColor,
  className = '',
  ...props
}) {
  const variantClasses = badgeVariants[variant] || badgeVariants.default;
  const sizeClasses = badgeSizes[size] || badgeSizes.md;

  return (
    <motion.span
      className={`inline-flex items-center font-medium rounded-full border ${variantClasses} ${sizeClasses} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            dotColor || (variant === 'error' ? 'bg-red-500' : variant === 'success' ? 'bg-brand-500' : variant === 'warning' ? 'bg-amber-500' : 'bg-text-tertiary')
          }`}
          aria-hidden="true"
        />
      )}
      {children}
    </motion.span>
  );
}

export function StatusBadge({ status, size = 'md', className = '' }) {
  const normalizedStatus = String(status).toLowerCase();
  return <Badge variant={normalizedStatus} size={size} className={className}>{status}</Badge>;
}

export function StatusDot({ status, size = 'md', className = '', label }) {
  const normalizedStatus = String(status).toLowerCase();
  const dotColors = {
    published: 'bg-brand-500',
    draft: 'bg-text-quaternary',
    archived: 'bg-slate-400',
    active: 'bg-brand-500',
    inactive: 'bg-slate-400',
    pending: 'bg-amber-500',
    open: 'bg-brand-500',
    closed: 'bg-slate-400',
    cancelled: 'bg-red-500',
    awarded: 'bg-purple-500',
    unverified: 'bg-text-quaternary',
    verified: 'bg-brand-500',
    success: 'bg-brand-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };

  const dotColor = dotColors[normalizedStatus] || 'bg-text-quaternary';
  const sizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <motion.span
        className={`${sizes[size] || sizes.md} rounded-full ${dotColor}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        aria-hidden="true"
      />
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </span>
  );
}