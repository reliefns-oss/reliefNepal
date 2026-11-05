'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import '@/components/ui/design-tokens.css';

export const Card = forwardRef(function Card(
  { children, className = '', hover = false, padding = 'md', ...props },
  ref
) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <motion.div
      ref={ref}
      className={`bg-white rounded-xl border border-border-light shadow-sm ${paddingClasses[padding]} ${hover ? 'hover:shadow-md hover:border-border-medium transition-all duration-200' : ''} ${className}`}
      whileHover={hover ? { y: -2, boxShadow: 'var(--shadow-md)' } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export const CardHeader = forwardRef(function CardHeader(
  { children, className = '', action, title, description, ...props },
  ref
) {
  return (
    <div ref={ref} className={`mb-4 ${className}`} {...props}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0 mt-2 sm:mt-0">{action}</div>}
      </div>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef(function CardContent(
  { children, className = '', ...props },
  ref
) {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef(function CardFooter(
  { children, className = '', ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`mt-4 pt-4 border-t border-border-light flex items-center gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';