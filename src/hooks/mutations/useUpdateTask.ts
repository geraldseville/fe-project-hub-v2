import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTask } from '@/api/task.api';

import type { UpdateTaskDto } from '@/types/task.types';

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: UpdateTaskDto;
    }) => updateTask(taskId, payload),

    async onSuccess(_, variables) {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['tasks'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['tasks', variables.taskId],
        }),
      ]);
    },
  });
}
