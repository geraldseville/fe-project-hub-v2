'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { useToastStore } from '@/hooks/ui/useToastStore';

import {
  IconCaution1,
  IconCheckCircle2,
  IconClose1,
  IconCloseCircle2,
} from '@/components/svgs/icons';

const statusStyle = {
  success: {
    container: 'border-green-200',
    icon: 'bg-green-100 text-green-600',
  },
  failed: {
    container: 'border-red-200',
    icon: 'bg-red-100 text-red-600',
  },
  warning: {
    container: 'border-yellow-200',
    icon: 'bg-yellow-100 text-yellow-600',
  },
};

const statusIcon = {
  success: <IconCheckCircle2 className="min-w-4.5 w-4.5 h-auto" />,
  failed: <IconCloseCircle2 className="min-w-4.5 w-4.5 h-auto" />,
  warning: <IconCaution1 className="min-w-4.5 w-4.5 h-auto" />,
};

export default function Toast() {
  const toasts = useToastStore((state) => state.toasts);

  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div
      className={clsx(
        'fixed z-9999 bottom-6 right-6',
        'flex flex-col gap-3',
        'w-90',
      )}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = statusStyle[toast.status];

          return (
            <motion.div
              className={clsx(
                'flex items-center gap-3',
                'w-90',
                'py-3 px-4',
                'rounded-lg',
                'bg-[#171F33]',
                'border border-[#464554]',
                'shadow-lg',
                style.container,
              )}
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={clsx(
                  'flex justify-center items-center',
                  'min-w-10 w-10 h-10',
                  'rounded-lg',
                  style.icon,
                )}
              >
                {toast.icon ?? statusIcon[toast.status]}
              </div>
              <p
                className={clsx(
                  'font-inter font-medium',
                  'text-[#DAE2FD]',
                  'line-clamp-2',
                )}
              >
                {toast.message}
              </p>
              <button
                className={clsx(
                  'flex justify-center items-center',
                  'min-w-4.5 w-4.5 h-4.5',
                  'ml-auto',
                )}
                onClick={() => removeToast(toast.id)}
              >
                <IconClose1 className="min-w-3 w-3 h-3" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
