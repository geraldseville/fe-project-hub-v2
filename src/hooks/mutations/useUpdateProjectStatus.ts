import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProject } from '@/api/project.api';

import type { Project, ProjectStatus } from '@/types/project.types';

interface UpdateProjectStatusVariables {
  projectId: string;
  status: ProjectStatus;
}

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, status }: UpdateProjectStatusVariables) =>
      updateProject(projectId, { status }),

    onMutate: async ({ projectId, status }) => {
      await queryClient.cancelQueries({
        queryKey: ['projects', projectId],
      });

      const previousProject = queryClient.getQueryData<Project>([
        'projects',
        projectId,
      ]);

      queryClient.setQueryData<Project>(
        ['projects', projectId],
        (currentProject) => {
          if (!currentProject) return currentProject;

          return {
            ...currentProject,
            status,
          };
        },
      );

      return { previousProject };
    },

    onError: (_error, { projectId }, context) => {
      if (!context?.previousProject) return;

      queryClient.setQueryData(
        ['projects', projectId],
        context.previousProject,
      );
    },

    onSuccess: (response, { projectId }) => {
      const updatedProject = response.data?.project;

      if (!updatedProject) return;

      queryClient.setQueryData(['projects', projectId], updatedProject);

      queryClient.invalidateQueries({
        queryKey: ['projects'],
        exact: true,
      });
    },
  });
}
