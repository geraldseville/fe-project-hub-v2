import { apiClient } from '@/api/api';

export const uploadUserProfileImage = (file: FormData) => {
  return apiClient<{ url: string }>('/images/user-profile-image', {
    method: 'POST',
    body: file,
  });
};
