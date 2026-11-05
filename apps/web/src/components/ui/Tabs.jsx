'use client';

import { motion, AnimatePresence } from 'framer-motion';
import '@/components/ui/design-tokens.css';

export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'line',
  className = '',
  fullWidth = false,
}) {
  const variants = {
    line: 'border-b border-border-light',
    enclosed: 'bg-bg-tertiary rounded-lg p-1',
    soft: '',
  };

  const tabVariants = {
    line: (isActive) => `relative px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'text-brand-600' : 'text-text-secondary hover:text-text-primary'}`,
    enclosed: (isActive) => `px-4 py-2.5 text-sm font-semibold rounded-md transition-all ${isActive ? 'bg-white text-brand-600 shadow-sm' : 'text-text-secondary hover:text-text-primary'}`,
    soft: (isActive) => `px-4 py-3 text-sm font-semibold transition-colors ${isActive ? 'text-brand-600 bg-brand-50 rounded-lg' : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg'}`,
  };

  return (
    <div className={className} role="tablist" aria-orientation="horizontal">
      <div className={`${variants[variant]} ${fullWidth ? 'flex' : 'inline-flex'}`}>
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => onChange?.(tab.id)}
            className={`${tabVariants[variant](activeTab === tab.id)} ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${tab.className || ''}`}
            disabled={tab.disabled}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon && <span className="flex items-center gap-2">{tab.icon}</span>}
            {tab.label}
            {tab.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-brand-100 text-brand-700">
                {tab.badge}
              </span>
            )}
          </motion.button>
        ))}
      </div>
      {variant === 'line' && (
        <motion.div
          className="absolute bottom-0 h-0.5 bg-brand-600"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${tabs.findIndex((t) => t.id === activeTab) * (100 / tabs.length)}%)`,
          }}
          animate={{ width: `${100 / tabs.length}%`, transform: `translateX(${tabs.findIndex((t) => t.id === activeTab) * (100 / tabs.length)}%)` }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export function TabPanels({ tabs = [], activeTab, className = '' }) {
  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div className={className} role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTabData?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function SegmentedControl({
  options = [],
  value,
  onChange,
  className = '',
  disabled = false,
}) {
  return (
    <div className={`inline-flex bg-bg-tertiary rounded-lg p-1 ${className}`} role="group" aria-disabled={disabled}>
      {options.map((option) => (
        <motion.button
          key={option.value}
          role="radio"
          aria-checked={value === option.value}
          onClick={() => !disabled && onChange?.(option.value)}
          disabled={disabled}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${value === option.value ? 'bg-white text-brand-600 shadow-sm' : 'text-text-secondary hover:text-text-primary'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${option.className || ''}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.98 }}
        >
          {option.icon && <span className="flex items-center gap-2">{option.icon}</span>}
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}