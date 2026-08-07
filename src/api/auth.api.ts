import type { Response } from '@/api/api';
import { apiClient } from '@/api/api';

import type { AuthLoginDto, AuthRegisterDto } from '@/types/user.types';

export const authLogin = (payload: AuthLoginDto): Promise<Response> => {
  return apiClient('/auth/login', {
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
  return apiClient('/auth/me', {
    method: 'GET',
  });
};

export const authRegister = (payload: AuthRegisterDto): Promise<Response> => {
  return apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
