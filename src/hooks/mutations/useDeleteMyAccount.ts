import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteMyAccount } from '@/api/user.api';

export function useDeleteMyAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyAccount,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ['me'],
      });
    },
  });
}
