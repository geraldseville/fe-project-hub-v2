import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTask } from '@/api/task.api';

import type { UpdateTaskDto } from '@/types/task.types';

interface UpdateTaskVariables {
  taskId: string;
  projectId: string;
  payload: UpdateTaskDto;
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: UpdateTaskVariables) =>
      updateTask(taskId, payload),

    onSuccess: async (_, { projectId }) => {
      await queryClient.invalidateQueries({
        queryKey: ['projects', projectId],
      });
    },
  });
}
