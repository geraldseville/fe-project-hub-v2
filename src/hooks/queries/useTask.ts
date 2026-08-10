import { useQuery } from '@tanstack/react-query';

import { getTask } from '@/api/task.api';

export function useTask(taskId: string) {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: async () => {
      const response = await getTask(taskId);

      return response.data?.task || null;
    },
    enabled: !!taskId,
  });
}
