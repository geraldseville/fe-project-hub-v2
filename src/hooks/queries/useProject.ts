import { useQuery } from '@tanstack/react-query';

import { getProject } from '@/api/project.api';

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const response = await getProject(projectId);

      return response.data?.project;
    },
    enabled: !!projectId,
  });
}
