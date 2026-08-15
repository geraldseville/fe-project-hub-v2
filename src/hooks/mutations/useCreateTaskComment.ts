import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTaskComment } from '@/api/task.api';

import type { CreateTaskCommentDto } from '@/types/task.types';

export function useCreateTaskComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: CreateTaskCommentDto;
    }) => createTaskComment(taskId, payload),

    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', taskId, 'task-activities'],
      });
    },
  });
}
