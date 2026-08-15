import { useInfiniteQuery } from '@tanstack/react-query';

import { getTaskActivities } from '@/api/task.api';

export function useTaskActivities(taskId: string, limit = 20) {
  return useInfiniteQuery({
    queryKey: ['tasks', taskId, 'activities', limit],

    queryFn: async ({ pageParam }) => {
      const response = await getTaskActivities(taskId, pageParam, limit);

      if (!response.data) {
        throw new Error('failed to fetch task activities.');
      }

      return response.data;
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.totalPages) {
        return undefined;
      }

      return lastPage.page + 1;
    },

    enabled: !!taskId,
  });
}
