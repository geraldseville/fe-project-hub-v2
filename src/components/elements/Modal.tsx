'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
  classNames?: {
    root?: string;
    backdrop?: string;
    content?: string;
  };
  isOpen?: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function Modal({
  classNames,
  isOpen = false,
  onClose,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent SSR issues
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className={clsx(
            'fixed inset-0 z-50',
            'flex items-center justify-center',
            'p-4',
            classNames?.root,
          )}
        >
          {/* Backdrop */}
          <motion.div
            className={clsx(
              'absolute inset-0 z-1',
              'w-full h-full',
              'bg-black/60',
              'backdrop-blur-sm',
              classNames?.backdrop,
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Close modal"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            className={clsx(
              'relative z-2',
              'overflow-hidden',
              'flex flex-col',
              'max-w-md w-full',
              'max-h-[90dvh] min-h-[40dvh] h-auto',
              classNames?.content,
            )}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
