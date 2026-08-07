import type { Response } from '@/api/api';
import { apiClient } from '@/api/api';

import type { UserChangePasswordDto, UserDto } from '@/types/user.types';

export const changeMyPassword = (
  payload: UserChangePasswordDto,
): Promise<Response> => {
  return apiClient('/users/me/change-password', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteMyAccount = (): Promise<Response> => {
  return apiClient('/users/me', {
    method: 'DELETE',
  });
};

export const getUsers = (): Promise<Response> => {
  return apiClient('/users', {
    method: 'GET',
  });
};

export const updateMe = (payload: UserDto): Promise<Response> => {
  return apiClient('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};
