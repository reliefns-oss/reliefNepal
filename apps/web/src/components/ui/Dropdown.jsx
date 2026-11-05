'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from './Input';
import '@/components/ui/design-tokens.css';

export function Dropdown({
  trigger,
  items = [],
  align = 'end',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        type="button"
        className="focus-ring"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`fixed z-[100] min-w-[180px] max-w-[320px] bg-white rounded-lg border border-border-light shadow-lg overflow-hidden ${align === 'end' ? 'right-0' : 'left-0'}`}
            role="menu"
            style={{ top: '100%', marginTop: '6px' }}
          >
            <div className="py-1">
              {items.map((item, index) => (
                <motion.button
                  key={item.key || index}
                  onClick={() => { item.onClick?.(); if (!item.keepOpen) setIsOpen(false); }}
                  className={`w-full px-3 py-2 text-sm text-left flex items-center gap-3 transition-colors focus:bg-bg-primary focus:outline-none focus-ring ${item.disabled ? 'opacity-50 cursor-not-allowed text-text-tertiary' : 'text-text-primary hover:bg-bg-primary'} ${item.className || ''}`}
                  role="menuitem"
                  disabled={item.disabled}
                  tabIndex={-1}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.02 }}
                >
                  {item.icon && <span className="w-5 h-5 flex-shrink-0" aria-hidden="true">{item.icon}</span>}
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.shortcut && <span className="text-xs text-text-quaternary font-mono">{item.shortcut}</span>}
                  {item.badge && <span className="ml-auto">{item.badge}</span>}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownMenu({
  trigger,
  items = [],
  align = 'end',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        type="button"
        className="focus-ring"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`fixed z-[100] min-w-[200px] bg-white rounded-lg border border-border-light shadow-lg overflow-hidden ${align === 'end' ? 'right-0' : 'left-0'}`}
            role="menu"
            style={{ top: '100%', marginTop: '6px' }}
          >
            <div className="py-1">
              {items.map((item, index) => {
                if (item.type === 'divider') {
                  return <div key={index} className="h-px bg-border-light my-1" role="separator" />;
                }
                return (
                  <motion.button
                    key={item.key || index}
                    onClick={() => { item.onClick?.(); if (!item.keepOpen) setIsOpen(false); }}
                    className={`w-full px-3 py-2 text-sm text-left flex items-center gap-3 transition-colors focus:bg-bg-primary focus:outline-none focus-ring ${item.disabled ? 'opacity-50 cursor-not-allowed text-text-tertiary' : 'text-text-primary hover:bg-bg-primary'} ${item.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : ''} ${item.className || ''}`}
                    role="menuitem"
                    disabled={item.disabled}
                    tabIndex={-1}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    {item.icon && <span className="w-5 h-5 flex-shrink-0" aria-hidden="true">{item.icon}</span>}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.shortcut && <span className="text-xs text-text-quaternary font-mono">{item.shortcut}</span>}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SelectDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  searchable = false,
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const filteredOptions = searchable
    ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className={`relative inline-block w-full ${className}`}>
      <button
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-left transition-all duration-150 focus-ring ${
          disabled ? 'opacity-50 cursor-not-allowed border-border-light' : 'border-border-medium hover:border-brand-300 focus:ring-brand-500'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        disabled={disabled}
        type="button"
      >
        <div className="flex items-center justify-between">
          <span className={`truncate ${value ? 'text-text-primary' : 'text-text-tertiary'}`}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 flex-shrink-0 text-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed z-[100] w-full max-h-60 overflow-auto bg-white rounded-lg border border-border-light shadow-lg mt-1"
            role="listbox"
            aria-label={ariaLabel}
          >
            {searchable && (
              <div className="p-2 border-b border-border-light sticky top-0 bg-white">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  leftIcon={<Search className="w-4 h-4" />}
                  size="sm"
                  className="w-full"
                />
              </div>
            )}
            <div className="py-1" role="listbox">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-text-tertiary">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { onChange(option.value); setIsOpen(false); }}
                    className={`w-full px-3 py-2 text-sm text-left flex items-center gap-3 transition-colors focus:bg-bg-primary focus:outline-none focus-ring ${option.value === value ? 'bg-brand-50 text-brand-700' : 'text-text-primary hover:bg-bg-primary'} ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    role="option"
                    aria-selected={option.value === value}
                    disabled={option.disabled}
                    tabIndex={-1}
                  >
                    {option.icon && <span className="w-5 h-5 flex-shrink-0" aria-hidden="true">{option.icon}</span>}
                    <span className="flex-1 truncate">{option.label}</span>
                    {option.value === value && <ChevronDown className="w-4 h-4 text-brand-600" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}