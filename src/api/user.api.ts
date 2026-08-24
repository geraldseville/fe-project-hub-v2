import { apiClient } from '@/api/api';

import type { Pagination } from '@/types/generic.types';
import type { Notification } from '@/types/notifications.types';
import type { User, UserChangePasswordDto, UserDto } from '@/types/user.types';

export const changeMyPassword = (payload: UserChangePasswordDto) => {
  return apiClient<{ user: User }>('/users/me/change-password', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteMyAccount = () => {
  return apiClient<{ user: User }>('/users/me', {
    method: 'DELETE',
  });
};

export interface GetUsersOptions {
  excludeMe?: boolean;
  page?: number;
  limit?: number;
}

export const getUsers = ({
  excludeMe = false,
  page = 1,
  limit = 20,
}: {
  excludeMe?: boolean;
  page?: number;
  limit?: number;
} = {}) => {
  const params = new URLSearchParams();

  if (excludeMe) {
    params.set('excludeMe', 'true');
  }

  params.set('page', String(page));
  params.set('limit', String(limit));

  return apiClient<{
    users: User[];
    pagination: Pagination;
  }>(`/users?${params.toString()}`, {
    method: 'GET',
  });
};

export const getUser = (userId: string) => {
  return apiClient<{ user: User }>(`/users/${userId}`, {
    method: 'GET',
  });
};

export const getUserNotifications = ({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams();

  params.set('page', String(page));
  params.set('limit', String(limit));

  return apiClient<{
    notifications: Notification[];
    pagination: Pagination;
  }>(`/notifications?${params.toString()}`, {
    method: 'GET',
  });
};

export const updateMe = (payload: UserDto) => {
  return apiClient<{ user: User }>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const updateMySavedColors = (savedColors: string[]) => {
  return apiClient<{ user: User }>('/users/me/saved-colors', {
    method: 'PATCH',
    body: JSON.stringify({
      savedColors,
    }),
  });
};
