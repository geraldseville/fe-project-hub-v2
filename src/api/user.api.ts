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

export const getUsers = () => {
  return apiClient<{ users: User[] }>('/users', {
    method: 'GET',
  });
};

export const updateMe = (payload: UserDto) => {
  return apiClient<{ user: User }>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};
