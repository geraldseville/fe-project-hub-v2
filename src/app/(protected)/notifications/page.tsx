'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import { useMarkAllNotificationsAsRead } from '@/hooks/mutations/useMarkAllNotificationsAsRead';
import { useMarkNotificationAsRead } from '@/hooks/mutations/useMarkNotificationAsRead';
import { useInfiniteNotifications } from '@/hooks/queries/useInfiniteNotifications';
import { useMe } from '@/hooks/queries/useMe';

import {
  DEFAULT_TIME_FORMAT,
  DEFAULT_TIMEZONE,
  getTimeFormat,
} from '@/utils/date-time';
import { groupNotificationsByDate } from '@/utils/notification.utils';

import type { Notification } from '@/types/notifications.types';

import AppShellHead from '@/components/AppShellHead';
import Button from '@/components/elements/Button';
import LoaderSpinner from '@/components/elements/LoaderSpinner';
import { IconFolder1, IconTask1 } from '@/components/svgs/icons';

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

  console.log({ data, notifications, groupedNotifications });

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
            {/* <DisplayJSON data={notifications} /> */}
          </>
        )}
      </div>
    </main>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  const router = useRouter();

  const { data: me } = useMe();
  const markNotificationAsRead = useMarkNotificationAsRead();

  const timezone = me?.timezone ?? DEFAULT_TIMEZONE;
  const timeFormat = getTimeFormat(me?.timeFormat ?? DEFAULT_TIME_FORMAT);
  const isProjectNotification = notification.entityType === 'PROJECT';
  const isTaskNotification = notification.entityType === 'TASK';

  const canViewEntity =
    (isProjectNotification && notification.project) ||
    (isTaskNotification && notification.task);

  const handleViewProject = () => {
    markNotificationAsRead.mutate(notification.id);

    router.push(`/projects/${notification.entityId}`);
  };

  const handleViewTask = () => {
    markNotificationAsRead.mutate(notification.id);

    router.push(`/projects/${notification.task?.projectId}`);
  };

  const handleDismiss = async () => {
    await markNotificationAsRead.mutateAsync(notification.id);
  };

  return (
    <div
      className={clsx(
        'flex justify-between items-start gap-4',
        'p-4',
        'rounded-lg',
        'border',
        notification.readAt
          ? ['bg-[#171F33]', 'border-[#464554]']
          : ['bg-[#1E293B]', 'border-[#5B5A6F]'],
      )}
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
        {notification.entityType === 'PROJECT' ? (
          <IconFolder1 className="min-w-4 w-4- h-auto" />
        ) : notification.entityType === 'TASK' ? (
          <IconTask1 className="min-w-4 w-4- h-auto" />
        ) : null}
      </div>
      <div className="flex-1">
        {/* Notification Title */}
        <div
          className={clsx(
            'font-hanken-grotesk font-semibold',
            'text-[#DAE2FD] text-[18px] leading-normal',
          )}
        >
          {notification.title}
        </div>
        {/* Notification Message */}
        <div
          className={clsx(
            'font-hanken-grotesk font-semibold',
            'text-white leading-normal',
            'mt-1',
          )}
        >
          {notification.message}
        </div>
        {/* Actions */}
        <div className={clsx('flex justify-start items-center gap-4', 'mt-4')}>
          {canViewEntity && (
            <>
              {notification.entityType === 'PROJECT' && (
                <Button
                  className="min-w-[150px] px-4!"
                  buttonStyle="tertiary"
                  type="button"
                  text="View Project"
                  onClick={handleViewProject}
                />
              )}
              {notification.entityType === 'TASK' && (
                <Button
                  className="min-w-[150px] px-4!"
                  buttonStyle="tertiary"
                  type="button"
                  text="View Task"
                  onClick={handleViewTask}
                />
              )}
            </>
          )}
          {!notification.readAt && (
            <Button
              className="min-w-auto! px-4! border-[#908FA0] hover:opacity-50"
              buttonStyle="secondary"
              type="button"
              text="Dismiss"
              onClick={handleDismiss}
            />
          )}
        </div>
      </div>
      <div
        className={clsx(
          'font-jetbrains-mono font-medium',
          'text-[#C7C4D7] leading-none',
          'whitespace-nowrap',
        )}
        title={momentTimezone(notification.createdAt)
          .tz(timezone)
          .format(`MMM DD, YYYY ${timeFormat}`)}
      >
        {momentTimezone(notification.createdAt).fromNow()}
      </div>
    </div>
  );
}
