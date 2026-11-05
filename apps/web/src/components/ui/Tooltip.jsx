'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/components/ui/design-tokens.css';

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 200,
  className = '',
  contentClassName = '',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const showTooltip = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  }, [delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') hideTooltip();
  }, [hideTooltip]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-brand-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-brand-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-brand-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-brand-900',
  };

  const positionClass = positions[position] || positions.top;
  const arrowClass = arrowPositions[position] || arrowPositions.top;

  return (
    <div className={`relative inline-block ${className}`} onMouseEnter={showTooltip} onMouseLeave={hideTooltip} onFocus={showTooltip} onBlur={hideTooltip}>
      {typeof children === 'function' ? children({ isVisible, showTooltip, hideTooltip }) : children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0, x: position === 'left' ? 4 : position === 'right' ? -4 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`fixed z-[700] px-3 py-1.5 text-xs font-medium text-white bg-brand-900 rounded-lg shadow-lg whitespace-nowrap max-w-xs pointer-events-none ${positionClass} ${contentClassName}`}
            role="tooltip"
            style={{ zIndex: 700 }}
          >
            {content}
            <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClass}`} aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TooltipTrigger({ children, ...props }) {
  return <Tooltip {...props}>{({ showTooltip, hideTooltip }) => children({ onMouseEnter: showTooltip, onMouseLeave: hideTooltip, onFocus: showTooltip, onBlur: hideTooltip })}</Tooltip>;
}