'use client';

import { forwardRef, useId } from 'react';
import { motion } from 'framer-motion';
import '@/components/ui/design-tokens.css';

const inputBaseClasses =
  'w-full rounded-lg border bg-white text-text-primary placeholder-text-tertiary transition-all duration-150 ease-out focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

const inputSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3.5 py-2.5 text-sm',
  lg: 'px-4 py-3 text-base',
};

const labelSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const Label = forwardRef(function Label(
  { children, required = false, size = 'md', className = '', htmlFor, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={`block font-semibold text-text-primary mb-1.5 ${labelSizes[size]} ${className}`}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-red-600" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
});

Label.displayName = 'Label';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    required = false,
    size = 'md',
    leftIcon,
    rightIcon,
    className = '',
    inputClassName = '',
    id: providedId,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const hasError = Boolean(error);
  const hasHint = Boolean(hint);

  const borderColor = hasError
    ? 'border-red-400 focus:ring-red-500'
    : 'border-border-medium focus:ring-brand-500';

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} required={required} size={size}>
          {label}
        </Label>
      )}
      <div className="relative">
        {leftIcon && (
          <div
            className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-tertiary"
            aria-hidden="true"
          >
            {leftIcon}
          </div>
        )}
        <motion.input
          ref={ref}
          id={id}
          className={`${inputBaseClasses} ${inputSizes[size]} ${borderColor} ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${inputClassName}`}
          aria-invalid={hasError}
          aria-describedby={`${hasError ? errorId : ''} ${hasHint ? hintId : ''}`.trim() || undefined}
          {...props}
        />
        {rightIcon && (
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-tertiary"
            aria-hidden="true"
          >
            {rightIcon}
          </div>
        )}
      </div>
      {hasError && (
        <motion.p
          id={errorId}
          role="alert"
          className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
      {hasHint && !hasError && (
        <p id={hintId} className="mt-1.5 text-sm text-text-tertiary">
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    hint,
    required = false,
    size = 'md',
    rows = 4,
    className = '',
    inputClassName = '',
    id: providedId,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const hasError = Boolean(error);
  const hasHint = Boolean(hint);

  const borderColor = hasError
    ? 'border-red-400 focus:ring-red-500'
    : 'border-border-medium focus:ring-brand-500';

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} required={required} size={size}>
          {label}
        </Label>
      )}
      <motion.textarea
        ref={ref}
        id={id}
        rows={rows}
        className={`${inputBaseClasses} ${inputSizes[size]} ${borderColor} resize-y min-h-[80px] ${inputClassName}`}
        aria-invalid={hasError}
        aria-describedby={`${hasError ? errorId : ''} ${hasHint ? hintId : ''}`.trim() || undefined}
        {...props}
      />
      {hasError && (
        <motion.p
          id={errorId}
          role="alert"
          className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
      {hasHint && !hasError && (
        <p id={hintId} className="mt-1.5 text-sm text-text-tertiary">
          {hint}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    required = false,
    size = 'md',
    options = [],
    placeholder,
    className = '',
    selectClassName = '',
    id: providedId,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const hasError = Boolean(error);
  const hasHint = Boolean(hint);

  const borderColor = hasError
    ? 'border-red-400 focus:ring-red-500'
    : 'border-border-medium focus:ring-brand-500';

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id} required={required} size={size}>
          {label}
        </Label>
      )}
      <div className="relative">
        <motion.select
          ref={ref}
          id={id}
          className={`${inputBaseClasses} ${inputSizes[size]} ${borderColor} appearance-none bg-white ${selectClassName}`}
          aria-invalid={hasError}
          aria-describedby={`${hasError ? errorId : ''} ${hasHint ? hintId : ''}`.trim() || undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </motion.select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-tertiary" aria-hidden="true">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {hasError && (
        <motion.p
          id={errorId}
          role="alert"
          className="mt-1.5 text-sm text-red-600 flex items-center gap-1"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
      {hasHint && !hasError && (
        <p id={hintId} className="mt-1.5 text-sm text-text-tertiary">
          {hint}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';