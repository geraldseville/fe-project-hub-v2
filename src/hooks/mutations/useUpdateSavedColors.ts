import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMySavedColors } from '@/api/user.api';

export function useUpdateSavedColors() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMySavedColors,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
    },
  });
}
