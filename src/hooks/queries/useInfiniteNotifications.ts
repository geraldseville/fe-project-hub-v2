import { useInfiniteQuery } from '@tanstack/react-query';

import { getUserNotifications } from '@/api/user.api';

export const useInfiniteNotifications = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['notifications'],

    queryFn: ({ pageParam }) =>
      getUserNotifications({
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
};
