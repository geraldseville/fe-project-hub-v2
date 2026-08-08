import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProject } from '@/api/project.api';

import type { UpdateProjectDto } from '@/types/project.types';

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: UpdateProjectDto;
    }) => updateProject(projectId, payload),

    async onSuccess(_, variables) {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['projects'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['projects', variables.projectId],
        }),
      ]);
    },
  });
}
