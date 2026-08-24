import { apiClient } from '@/api/api';

export const markNotificationAsRead = (notificationId: string) => {
  return apiClient(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
};

export const markNotificationsAsRead = (notificationIds: string[]) => {
  return apiClient(`/notifications/read`, {
    method: 'PATCH',
    body: JSON.stringify({
      notificationIds,
    }),
  });
};

export const markAllNotificationsAsRead = () => {
  return apiClient(`/notifications/read-all`, {
    method: 'PATCH',
  });
};
