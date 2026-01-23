'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Modal({ isOpen, onClose, children, title, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center p-4',
        'bg-black/80 backdrop-blur-sm',
        'animate-in fade-in duration-200'
      )}
    >
      <div
        className={cn(
          'relative w-full max-w-md',
          'bg-arcade-surface border border-arcade-border rounded-game-lg',
          'shadow-2xl shadow-black/50',
          'animate-in zoom-in-95 duration-200',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-arcade-border">
            <h2 id="modal-title" className="font-arcade text-xs text-neon-cyan">
              {title}
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                'text-text-secondary hover:text-white hover:bg-arcade-border',
                'transition-colors duration-fast'
              )}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;

  return createPortal(modalContent, document.body);
}
