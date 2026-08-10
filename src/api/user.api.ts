import { apiClient } from '@/api/api';

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
}

export const getUsers = ({ excludeMe = false }: GetUsersOptions = {}) => {
  const params = new URLSearchParams();

  if (excludeMe) {
    params.set('excludeMe', 'true');
  }

  return apiClient<{ users: User[] }>(
    `/users${params.toString() ? `?${params.toString()}` : ''}`,
    {
      method: 'GET',
    },
  );
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
