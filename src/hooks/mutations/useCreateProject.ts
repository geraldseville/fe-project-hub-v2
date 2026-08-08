import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProject } from '@/api/project.api';

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,

    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['projects'],
      });
    },
  });
}
