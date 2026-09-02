import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMySavedColors } from '@/api/user.api';

import type { User } from '@/types/user.types';

export function useUpdateSavedColors() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMySavedColors,

    onMutate: async (newSavedColors) => {
      // Cancel any in-flight `me` request so it doesn't overwrite
      // our optimistic update.
      await queryClient.cancelQueries({
        queryKey: ['me'],
      });

      // Save the previous state for rollback.
      const previousUser = queryClient.getQueryData(['me']);

      // Optimistically update the cached user.
      queryClient.setQueryData(['me'], (currentUser: User) => {
        if (!currentUser) {
          return currentUser;
        }

        return {
          ...currentUser,
          savedColors: newSavedColors,
        };
      });

      return { previousUser };
    },

    onError: (_error, _newSavedColors, context) => {
      // Roll back if the request failed.
      if (context?.previousUser) {
        queryClient.setQueryData(['me'], context.previousUser);
      }
    },

    onSettled: () => {
      // Re-sync with the server after either success or failure.
      queryClient.invalidateQueries({
        queryKey: ['me'],
      });
    },
  });
}
