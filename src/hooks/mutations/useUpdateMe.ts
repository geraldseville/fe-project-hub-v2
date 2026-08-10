import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMe } from '@/api/user.api';

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,

    async onSuccess() {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['me'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['users'],
        }),
      ]);
    },
  });
}
