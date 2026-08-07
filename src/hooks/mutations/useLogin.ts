import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authLogin } from '@/api/auth.api';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authLogin,

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['current-user'],
      });
    },
  });
}
