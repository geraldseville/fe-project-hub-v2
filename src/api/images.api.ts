import type { Response } from '@/api/api';
import { apiClient } from '@/api/api';

export const uploadUserProfileImage = (file: FormData): Promise<Response> => {
  return apiClient('/images/user-profile-image', {
    method: 'POST',
    body: file,
  });
};
