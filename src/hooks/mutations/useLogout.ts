import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authLogout } from '@/api/auth.api';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authLogout,

    async onSuccess() {
      queryClient.clear();
    },
  });
}
