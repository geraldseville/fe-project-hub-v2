import { useQuery } from '@tanstack/react-query';

import { getTasksByProjectId } from '@/api/task.api';

export function useProjectTasks(
  projectId: string,
  options?: {
    page?: number;
    limit?: number;
  },
) {
  return useQuery({
    queryKey: ['projects', projectId, 'tasks', options?.page, options?.limit],

    queryFn: async () => {
      const response = await getTasksByProjectId(projectId, options);

      return (
        response.data ?? {
          tasks: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        }
      );
    },

    enabled: !!projectId,
  });
}
