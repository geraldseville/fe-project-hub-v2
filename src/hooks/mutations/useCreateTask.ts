import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTask } from '@/api/task.api';

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,

    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
    },
  });
}
