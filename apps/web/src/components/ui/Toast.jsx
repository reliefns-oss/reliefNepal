'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const toasts = [];

let listeners = [];

function notify() {
  listeners.forEach((fn) => fn([...toasts]));
}

export function toast({ title, description, type = 'success', duration = 5000 }) {
  const id = Date.now() + Math.random();
  const newToast = { id, title, description, type, duration };
  toasts.push(newToast);
  notify();

  if (duration > 0) {
    setTimeout(() => {
      const index = toasts.findIndex((t) => t.id === id);
      if (index > -1) {
        toasts.splice(index, 1);
        notify();
      }
    }, duration);
  }

  return id;
}

export function useToasts() {
  const [state, setState] = useState(toasts);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((fn) => fn !== setState);
    };
  }, []);

  const dismiss = (id) => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
      notify();
    }
  };

  return { toasts: state, dismiss };
}

const icons = {
  success: <CheckCircle size={20} className="text-white" />,
  error: <AlertCircle size={20} className="text-white" />,
  warning: <AlertTriangle size={20} className="text-white" />,
  info: <Info size={20} className="text-white" />,
};

const bgColors = {
  success: 'bg-forest-700',
  error: 'bg-red-600',
  warning: 'bg-amber-600',
  info: 'bg-blue-600',
};

const toastStyles = `
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('toast-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'toast-styles';
  styleSheet.textContent = toastStyles;
  document.head.appendChild(styleSheet);
}

export function ToastContainer() {
  const { toasts, dismiss } = useToasts();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 w-full max-w-sm rounded-xl shadow-lg p-4 animate-slide-in ${bgColors[t.type]}`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
          <div className="flex-1 min-w-0">
            {t.title && <p className="font-semibold text-white">{t.title}</p>}
            {t.description && <p className="mt-1 text-sm text-white/90">{t.description}</p>}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  return { toast };
}