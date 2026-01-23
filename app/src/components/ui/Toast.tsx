'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const typeStyles: Record<ToastType, string> = {
  success: 'bg-game-success/20 border-game-success text-game-success',
  error: 'bg-game-danger/20 border-game-danger text-game-danger',
  warning: 'bg-game-warning/20 border-game-warning text-game-warning',
  info: 'bg-game-info/20 border-game-info text-game-info',
};

const typeIcons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 200); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const toastContent = (
    <div
      className={cn(
        'fixed bottom-20 left-1/2 -translate-x-1/2 z-[200]',
        'px-4 py-3 rounded-game border',
        'flex items-center gap-3',
        'shadow-lg shadow-black/30',
        'transition-all duration-200',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        typeStyles[type]
      )}
      role="alert"
    >
      <span className="text-lg">{typeIcons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );

  if (typeof window === 'undefined') return null;

  return createPortal(toastContent, document.body);
}

// Toast Container for managing multiple toasts
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </>
  );
}
