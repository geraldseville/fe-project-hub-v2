'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { useNotificationStore } from '@/hooks/ui/useNotificationStore';

import type { NotificationType } from '@/types/notifications.types';

import {
  IconBin1,
  IconClose1,
  IconFolder1,
  IconTask1,
} from '@/components/svgs/icons';

const notificationIconMap: Record<
  NotificationType,
  React.ComponentType<{ className?: string }>
> = {
  PROJECT_MEMBER_ADDED: IconFolder1,
  PROJECT_MEMBER_REMOVED: IconFolder1,
  PROJECT_UPDATED: IconFolder1,
  PROJECT_DELETED: IconBin1,

  TASK_ASSIGNED: IconTask1,
  TASK_UPDATED: IconTask1,
  TASK_COMMENTED: IconTask1,
  TASK_DELETED: IconBin1,
};

const notificationTitleMap: Record<NotificationType, string> = {
  PROJECT_MEMBER_ADDED: 'Added to project',
  PROJECT_MEMBER_REMOVED: 'Removed from project',
  PROJECT_UPDATED: 'Project updated',
  PROJECT_DELETED: 'Project deleted',

  TASK_ASSIGNED: 'Task assigned',
  TASK_UPDATED: 'Task updated',
  TASK_COMMENTED: 'New comment',
  TASK_DELETED: 'Task deleted',
};

export default function Notification() {
  const notifications = useNotificationStore((state) => state.notifications);

  const removeNotification = useNotificationStore(
    (state) => state.removeNotification,
  );

  return (
    <div
      className={clsx(
        'fixed z-9999 right-6 top-20',
        'flex flex-col gap-3',
        'w-90',
        'pointer-events-none',
      )}
    >
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = notificationIconMap[notification.type];
          const title = notificationTitleMap[notification.type];

          return (
            <motion.div
              className={clsx(
                'flex gap-3',
                'w-90',
                'py-3 px-4',
                'rounded-lg',
                'pointer-events-auto',
                'bg-[#171F33]',
                'border',
                'shadow-lg',
              )}
              key={notification.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={clsx(
                  'flex justify-center items-center',
                  'min-w-10 w-10 h-10',
                  'rounded-[10px]',
                  'bg-[#1E293B]/50',
                  'border border-[#334155]',
                )}
              >
                <Icon className="min-w-4 w-4 h-auto" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-start gap-3">
                  <p
                    className={clsx(
                      'font-inter font-medium',
                      'text-[#DAE2FD]',
                      'line-clamp-2',
                    )}
                  >
                    {title}
                  </p>
                  <button
                    className={clsx(
                      'text-gray-400 hover:text-gray-200',
                      'shrink-0',
                      'transition-colors',
                    )}
                    type="button"
                    onClick={() => removeNotification(notification.id)}
                    aria-label="Dismiss notification"
                  >
                    <IconClose1 className="min-w-3 w-3 h-auto" />
                  </button>
                </div>
                <p
                  className={clsx(
                    'font-inter font-medium',
                    'text-[#DAE2FD]',
                    'line-clamp-2',
                    'mt-1',
                  )}
                >
                  {notification.message}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
