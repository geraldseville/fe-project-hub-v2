import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authRegister } from '@/api/auth.api';

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authRegister,

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
