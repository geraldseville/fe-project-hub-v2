import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTask } from '@/api/task.api';

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,

    async onSuccess(_, taskId) {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['tasks'],
        }),
        queryClient.removeQueries({
          queryKey: ['tasks', taskId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['projects'],
        }),
      ]);
    },
  });
}
