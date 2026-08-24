import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { markAllNotificationsAsRead } from '@/api/notification.api';

import type { Pagination } from '@/types/generic.types';
import type { Notification } from '@/types/notifications.types';

interface NotificationsResponse {
  data: {
    notifications: Notification[];
    pagination: Pagination;
  };
}

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['notifications'],
      });

      const previousNotifications = queryClient.getQueryData<
        InfiniteData<NotificationsResponse>
      >(['notifications']);

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
                notifications: page.data.notifications.map((notification) => ({
                  ...notification,
                  readAt: notification.readAt ?? new Date().toISOString(),
                })),
              },
            })),
          };
        },
      );

      return {
        previousNotifications,
      };
    },

    onError: (_error, _variables, context) => {
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
