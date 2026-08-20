import { useInfiniteQuery } from '@tanstack/react-query';

import { getTaskActivities } from '@/api/task.api';

export function useInfiniteTaskActivities(taskId: string, limit = 20) {
  return useInfiniteQuery({
    queryKey: ['tasks', taskId, 'task-activities', 'infinite', limit],

    queryFn: ({ pageParam }) =>
      getTaskActivities(taskId, {
        page: pageParam,
        limit,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;

      if (!pagination?.hasNextPage) {
        return undefined;
      }

      return pagination.page + 1;
    },
  });
}
