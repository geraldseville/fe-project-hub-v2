'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

interface DrawerProps {
  classNames?: {
    root?: string;
    backdrop?: string;
    content?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function Drawer({
  classNames,
  isOpen,
  onClose,
  children,
}: DrawerProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className={clsx('fixed inset-0 z-50', classNames?.root)}>
          {/* Overlay */}
          <motion.div
            className={clsx(
              'absolute inset-0',
              'w-full h-full',
              'bg-black/60',
              classNames?.backdrop,
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Close drawer"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className={clsx(
              'absolute top-0 right-0',
              'overflow-y-auto',
              'w-full max-w-120 h-full',
              'bg-[#131B2E]',
              'border-l border-[#464554]',
              'shadow-2xl',
              classNames?.content,
            )}
            role="dialog"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
          >
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
