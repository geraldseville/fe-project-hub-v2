import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateMe } from '@/api/user.api';

import type { User } from '@/types/user.types';

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,

    async onMutate(updatedUser) {
      await queryClient.cancelQueries({
        queryKey: ['me'],
      });

      const previousUser = queryClient.getQueryData(['me']);

      queryClient.setQueryData(['me'], (currentUser: User) => {
        if (!currentUser) return currentUser;

        return {
          ...currentUser,
          ...updatedUser,
        };
      });

      return { previousUser };
    },

    onError(_error, _updatedUser, context) {
      if (context?.previousUser) {
        queryClient.setQueryData(['me'], context.previousUser);
      }
    },

    onSuccess(response) {
      if (response.data?.user) {
        queryClient.setQueryData(['me'], response.data.user);
      }
    },
  });
}
