import { useQuery } from '@tanstack/react-query';

import { getTasks } from '@/api/task.api';

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await getTasks();

      return response.data?.tasks ?? [];
    },
  });
}
