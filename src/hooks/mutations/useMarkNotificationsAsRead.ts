import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { markNotificationsAsRead } from '@/api/notification.api';

import type { Pagination } from '@/types/generic.types';
import type { Notification } from '@/types/notifications.types';

interface NotificationsResponse {
  data: {
    notifications: Notification[];
    pagination: Pagination;
  };
}

export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationIds: string[]) =>
      markNotificationsAsRead(notificationIds),

    onMutate: async (notificationIds) => {
      await queryClient.cancelQueries({
        queryKey: ['notifications'],
      });

      const previousNotifications = queryClient.getQueryData<
        InfiniteData<NotificationsResponse>
      >(['notifications']);

      const notificationIdSet = new Set(notificationIds);

      queryClient.setQueryData<InfiniteData<NotificationsResponse>>(
        ['notifications'],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                notifications: page.data.notifications.map((notification) =>
                  notificationIdSet.has(notification.id)
                    ? {
                        ...notification,
                        readAt: new Date().toISOString(),
                      }
                    : notification,
                ),
              },
            })),
          };
        },
      );

      return {
        previousNotifications,
      };
    },

    onError: (_error, _notificationIds, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ['notifications'],
          context.previousNotifications,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });
};
