import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadUserProfileImage } from '@/api/image.api';

export function useUploadUserProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadUserProfileImage,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
    },
  });
}
