import React from 'react';
import { useToast } from '../../context/ToastContext';

const variantClasses = {
  info: 'bg-gray-900 text-white',
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-yellow-600 text-white',
};

const ToastContainer = () => {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed top-4 right-4 z-[1000] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[240px] max-w-sm px-4 py-3 rounded shadow-lg flex items-start gap-3 ${variantClasses[t.variant] || variantClasses.info}`}
        >
          <div className="flex-1 text-sm">{t.message}</div>
          <button
            onClick={() => dismiss(t.id)}
            className="opacity-80 hover:opacity-100 text-sm"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
