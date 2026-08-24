import momentTimezone from 'moment-timezone';

import type {
  Notification,
  NotificationEntityType,
  NotificationType,
} from '@/types/notifications.types';

export const NOTIFICATION_TYPES: NotificationType[] = [
  'PROJECT_MEMBER_ADDED',
  'PROJECT_MEMBER_REMOVED',
  'PROJECT_UPDATED',
  'PROJECT_DELETED',

  'TASK_ASSIGNED',
  'TASK_UPDATED',
  'TASK_COMMENTED',
  'TASK_DELETED',
];

export const NOTIFICATION_ENTITY_TYPES: NotificationEntityType[] = [
  'PROJECT',
  'TASK',
  'TASK_COMMENT',
];

type NotificationGroupLabel =
  | 'Today'
  | 'Yesterday'
  | 'Earlier this week'
  | 'Last week'
  | 'Earlier this month'
  | 'Last month'
  | 'Older';

interface NotificationGroup {
  label: NotificationGroupLabel;
  notifications: Notification[];
}

export const groupNotificationsByDate = (
  notifications: Notification[],
): NotificationGroup[] => {
  const groups = new Map<string, Notification[]>();

  const now = momentTimezone();

  for (const notification of notifications) {
    const date = momentTimezone(notification.createdAt);

    let label: NotificationGroup['label'];

    if (date.isSame(now, 'day')) {
      label = 'Today';
    } else if (date.isSame(now.clone().subtract(1, 'day'), 'day')) {
      label = 'Yesterday';
    } else if (date.isSame(now, 'week')) {
      label = 'Earlier this week';
    } else if (date.isSame(now.clone().subtract(1, 'week'), 'week')) {
      label = 'Last week';
    } else if (date.isSame(now, 'month')) {
      label = 'Earlier this month';
    } else if (date.isSame(now.clone().subtract(1, 'month'), 'month')) {
      label = 'Last month';
    } else {
      label = 'Older';
    }

    const existing = groups.get(label) ?? [];

    existing.push(notification);

    groups.set(label, existing);
  }

  return Array.from(groups.entries()).map(([label, notifications]) => ({
    label: label as NotificationGroup['label'],
    notifications,
  }));
};
