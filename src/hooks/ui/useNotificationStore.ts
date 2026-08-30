import { create } from 'zustand';

import type { Notification } from '@/types/notifications.types';

interface NotificationState {
  notifications: Notification[];

  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    setTimeout(() => {
      get().removeNotification(notification.id);
    }, 5000);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    })),

  clearNotifications: () =>
    set({
      notifications: [],
    }),
}));
