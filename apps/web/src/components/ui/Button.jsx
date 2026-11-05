'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/components/ui/design-tokens.css';

const buttonVariants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 border border-brand-600',
  secondary: 'bg-white text-brand-700 hover:bg-brand-50 active:bg-brand-100 border border-brand-200',
  outline: 'bg-transparent text-brand-700 hover:bg-brand-50 active:bg-brand-100 border border-brand-300',
  ghost: 'bg-transparent text-brand-700 hover:bg-brand-50 active:bg-brand-100 border border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600',
  dangerOutline: 'bg-transparent text-red-600 hover:bg-red-50 active:bg-red-100 border border-red-300',
  success: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 border border-brand-600',
};

const buttonSizes = {
  xs: 'px-2.5 py-1.5 text-xs gap-1.5',
  sm: 'px-3 py-2 text-sm gap-2',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2.5',
  xl: 'px-6 py-3.5 text-base gap-2.5',
};

const buttonIconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-5 h-5',
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    type = 'button',
    className = '',
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 ease-out focus-ring disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';
  const variantClasses = buttonVariants[variant] || buttonVariants.primary;
  const sizeClasses = buttonSizes[size] || buttonSizes.md;
  const iconSizeClasses = buttonIconSizes[size] || buttonIconSizes.md;

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      whileTap={{ scale: loading || disabled ? 1 : 0.98 }}
      whileHover={{ scale: loading || disabled ? 1 : 1.0 }}
      {...props}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <Loader2
            key="loader"
            className={`${iconSizeClasses} animate-spin`}
            aria-hidden="true"
          />
        ) : leftIcon ? (
          <motion.span
            key="left-icon"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            className="flex-shrink-0"
          >
            {leftIcon}
          </motion.span>
        ) : null}
      </AnimatePresence>
      <span className="truncate">{children}</span>
      <AnimatePresence mode="wait">
        {!loading && rightIcon ? (
          <motion.span
            key="right-icon"
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            className="flex-shrink-0"
          >
            {rightIcon}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
});

Button.displayName = 'Button';

export const IconButton = forwardRef(function IconButton(
  {
    children,
    variant = 'ghost',
    size = 'md',
    disabled = false,
    loading = false,
    'aria-label': ariaLabel,
    className = '',
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 ease-out focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = buttonVariants[variant] || buttonVariants.ghost;
  const sizeClasses = buttonSizes[size] || buttonSizes.md;

  return (
    <motion.button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      whileTap={{ scale: loading || disabled ? 1 : 0.95 }}
      aria-label={ariaLabel}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : (
        children
      )}
    </motion.button>
  );
});

IconButton.displayName = 'IconButton';