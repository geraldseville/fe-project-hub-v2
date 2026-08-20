import { useQuery } from '@tanstack/react-query';

import { getTaskActivities } from '@/api/task.api';

interface UseTaskActivitiesOptions {
  page?: number;
  limit?: number;
}

export function useTaskActivities(
  taskId: string,
  { page = 1, limit = 20 }: UseTaskActivitiesOptions = {},
) {
  return useQuery({
    queryKey: ['tasks', taskId, 'task-activities', page, limit],

    queryFn: () =>
      getTaskActivities(taskId, {
        page,
        limit,
      }),
  });
}
