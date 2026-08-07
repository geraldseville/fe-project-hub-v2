import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authRegister } from '@/api/auth.api';

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authRegister,

    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['current-user'],
      });
    },
  });
}
