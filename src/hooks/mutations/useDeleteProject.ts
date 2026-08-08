import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProject } from '@/api/project.api';

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,

    async onSuccess(_, projectId) {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['projects'],
        }),
        queryClient.removeQueries({
          queryKey: ['projects', projectId],
        }),
      ]);
    },
  });
}
