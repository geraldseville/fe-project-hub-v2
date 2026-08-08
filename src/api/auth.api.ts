import { apiClient } from '@/api/api';

import type { AuthLoginDto, AuthRegisterDto, User } from '@/types/user.types';

export const authLogin = (payload: AuthLoginDto) => {
  return apiClient<{ user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const authLogout = () => {
  return apiClient('/auth/logout', {
    method: 'POST',
  });
};

export const authMe = () => {
  return apiClient<{ user: User }>('/auth/me', {
    method: 'GET',
  });
};

export const authRegister = (payload: AuthRegisterDto) => {
  return apiClient<{ user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
