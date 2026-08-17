import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTask } from '@/api/task.api';

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,

    async onSuccess(_, variables) {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['tasks'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['projects'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['projects', variables.projectId],
        }),
      ]);
    },
  });
}
