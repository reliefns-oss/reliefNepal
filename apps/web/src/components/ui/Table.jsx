'use client';

import { forwardRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Button } from './Button';
import '@/components/ui/design-tokens.css';

const tableCellPadding = {
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-5 py-4',
};

export const Table = forwardRef(function Table(
  {
    columns = [],
    data = [],
    keyField = 'id',
    sortable = true,
    selectable = false,
    onSelectionChange,
    selectedKeys = [],
    loading = false,
    emptyMessage = 'No data available',
    rowClassName,
    onRowClick,
    size = 'md',
    className = '',
    ...props
  },
  ref
) {
  const cellPadding = tableCellPadding[size] || tableCellPadding.md;
  const allSelected = data.length > 0 && data.every((row) => selectedKeys.includes(row[keyField]));
  const someSelected = data.length > 0 && data.some((row) => selectedKeys.includes(row[keyField]));

  const handleSelectAll = () => {
    if (onSelectionChange) {
      if (allSelected) {
        onSelectionChange([]);
      } else {
        onSelectionChange(data.map((row) => row[keyField]));
      }
    }
  };

  const handleRowSelect = (key, event) => {
    event.stopPropagation();
    if (onSelectionChange) {
      if (selectedKeys.includes(key)) {
        onSelectionChange(selectedKeys.filter((k) => k !== key));
      } else {
        onSelectionChange([...selectedKeys, key]);
      }
    }
  };

  const sortedColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      sortable: sortable && col.sortable !== false,
    }));
  }, [columns, sortable]);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border-light bg-white" role="status" aria-label="Loading table data">
        <div className="divide-y divide-border-light">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`animate-pulse ${cellPadding}`}>
              <div className="h-4 bg-bg-tertiary rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden rounded-xl border border-border-light bg-white ${className}`} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full" role="grid">
          <thead className="bg-bg-primary border-b border-border-light">
            <tr>
              {selectable && (
                <th scope="col" className={`${cellPadding} text-left`}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                    size="sm"
                  />
                </th>
              )}
              {sortedColumns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`${cellPadding} text-left font-semibold text-text-secondary uppercase tracking-wider text-xs ${column.align === 'right' ? 'text-right' : ''} ${column.align === 'center' ? 'text-center' : ''} ${column.className || ''}`}
                  style={{ width: column.width }}
                  aria-sort={column.sorted === 'asc' ? 'ascending' : column.sorted === 'desc' ? 'descending' : 'none'}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{column.header}</span>
                    {column.sortable && column.sorted && (
                      <span className="flex-shrink-0" aria-hidden="true">
                        {column.sorted === 'asc' ? <ChevronUp className="w-4 h-4 text-brand-600" /> : <ChevronDown className="w-4 h-4 text-brand-600" />}
                      </span>
                    )}
                    {column.sortable && !column.sorted && (
                      <ChevronsUpDown className="w-4 h-4 text-text-quaternary" aria-hidden="true" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {data.length === 0 ? (
              <tr>
                <td colSpan={sortedColumns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-text-tertiary">
                    <svg className="w-12 h-12 text-border-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium text-text-secondary">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {data.map((row, rowIndex) => (
                  <motion.tr
                    key={row[keyField]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: rowIndex * 0.03 }}
                    className={`${rowClassName ? rowClassName(row) : ''} ${onRowClick ? 'cursor-pointer hover:bg-bg-primary' : ''} ${selectedKeys.includes(row[keyField]) ? 'bg-brand-50/50' : ''}`}
                    onClick={() => onRowClick?.(row)}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick?.(row); } }}
                    role={onRowClick ? 'button' : 'row'}
                    aria-selected={selectedKeys.includes(row[keyField])}
                  >
                    {selectable && (
                      <td className={cellPadding}>
                        <Checkbox
                          checked={selectedKeys.includes(row[keyField])}
                          onChange={(e) => handleRowSelect(row[keyField], e)}
                          aria-label={`Select row ${rowIndex + 1}`}
                          size="sm"
                        />
                      </td>
                    )}
                    {sortedColumns.map((column) => (
                      <motion.td
                        key={column.key}
                        className={`${cellPadding} text-text-primary ${column.align === 'right' ? 'text-right' : ''} ${column.align === 'center' ? 'text-center' : ''} ${column.className || ''}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {column.render
                          ? column.render(row[column.key], row, rowIndex)
                          : row[column.key] ?? '—'}
                      </motion.td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
      {selectable && selectedKeys.length > 0 && (
        <div className="px-4 py-3 bg-bg-primary border-t border-border-light flex items-center justify-between">
          <span className="text-sm font-medium text-text-secondary">
            {selectedKeys.length} {selectedKeys.length === 1 ? 'item' : 'items'} selected
          </span>
          <Button variant="ghost" size="sm" onClick={() => onSelectionChange?.([])}>
            Clear selection
          </Button>
        </div>
      )}
    </div>
  );
});

Table.displayName = 'Table';

export const Checkbox = forwardRef(function Checkbox(
  { checked = false, indeterminate = false, size = 'md', className = '', ...props },
  ref
) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5',
  };

  return (
    <label className="inline-flex items-center cursor-pointer" aria-hidden={!props['aria-label'] && !props.id}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        className={`appearance-none rounded border-2 transition-all duration-150 ${sizes[size]} ${sizes[size] === 'w-4 h-4' ? 'border-brand-300' : 'border-brand-300'} ${
          checked ? 'bg-brand-600 border-brand-600' : indeterminate ? 'bg-brand-600 border-brand-600' : 'bg-white border-border-medium'
        } focus-ring ${className}`}
        aria-checked={indeterminate ? 'mixed' : checked}
        {...props}
      />
      {checked && (
        <svg
          className="absolute w-3 h-3 text-white pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {indeterminate && !checked && (
        <svg
          className="absolute w-3 h-3 text-white pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
        </svg>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';