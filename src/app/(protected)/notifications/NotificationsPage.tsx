'use client';

import { useCallback } from 'react';

import clsx from 'clsx';

import { useMarkAllNotificationsAsRead } from '@/hooks/mutations/useMarkAllNotificationsAsRead';
import { useInfiniteNotifications } from '@/hooks/queries/useInfiniteNotifications';

import { groupNotificationsByDate } from '@/utils/notification.utils';

import AppShellHead from '@/components/AppShellHead';
import Button from '@/components/elements/Button';
import LoaderSpinner from '@/components/elements/LoaderSpinner';

import NotificationItem from './NotificationItem';

export default function NotificationsPage() {
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteNotifications(20);

  const markAllNotificationsAsRead = useMarkAllNotificationsAsRead();

  const notifications =
    data?.pages.flatMap((page) => page.data?.notifications ?? []) ?? [];

  const groupedNotifications = groupNotificationsByDate(notifications);

  const hanldeMarkAllNotificationsAsRead = () => {
    markAllNotificationsAsRead.mutate();
  };

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const element = event.currentTarget;

      const threshold = 200;

      const isNearBottom =
        element.scrollHeight - element.scrollTop - element.clientHeight <
        threshold;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return (
    <main
      className={clsx('overflow-hidden', 'flex flex-col', 'w-full h-screen')}
    >
      {/* Head */}
      <AppShellHead />
      <div
        className={clsx('overflow-y-auto', 'flex-1 min-h-0', 'py-4 px-6')}
        onScroll={handleScroll}
      >
        <div
          className={clsx('flex justify-between items-center gap-4', 'mb-8')}
        >
          <h1
            className={clsx('text-white text-[18px] leading-normal truncate')}
          >
            Stay updated with your team&apos;s progress
          </h1>
          <Button
            className=""
            buttonStyle="primary"
            type="button"
            text="Mark All as Read"
            onClick={hanldeMarkAllNotificationsAsRead}
          />
        </div>
        {isPending ? (
          <div className="flex justify-center items-center gap-4">
            <LoaderSpinner className="w-6! h-6!" />

            <div className="leading-none whitespace-nowrap">
              Loading notifications...
            </div>
          </div>
        ) : !notifications.length ? (
          <div className="italic text-placeholder text-sm text-center">
            No notifications yet.
          </div>
        ) : (
          <>
            {groupedNotifications.map((group) => (
              <div className="mb-8" key={group.label}>
                <div
                  className={clsx(
                    'relative',
                    'flex justify-between items-center gap-4',
                    'mb-3',
                  )}
                >
                  <h2
                    className={clsx(
                      'font-jetbrains-mono font-medium',
                      'text-[14px] uppercase',
                    )}
                  >
                    {group.label}
                  </h2>
                  <div className="flex-1 h-px bg-[#464554]"></div>
                </div>
                <div className="flex flex-col gap-4">
                  {group.notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              </div>
            ))}
            {isFetchingNextPage && (
              <div
                className={clsx(
                  'flex justify-center items-center gap-3',
                  'py-6',
                )}
              >
                <LoaderSpinner className="w-5! h-5!" />
                <span className="text-sm text-placeholder">Loading...</span>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
