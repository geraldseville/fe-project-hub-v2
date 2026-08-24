import { useMutation } from '@tanstack/react-query';

import { uploadUserProfileImage } from '@/api/image.api';

export function useUploadUserProfileImage() {
  return useMutation({
    mutationFn: uploadUserProfileImage,
  });
}
