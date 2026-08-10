import { apiClient } from '@/api/api';

import type {
  CreateProjectDto,
  Project,
  UpdateProjectDto,
} from '@/types/project.types';

export const createProject = (payload: CreateProjectDto) => {
  return apiClient<{ project: Project }>('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const deleteProject = (projectId: string) => {
  return apiClient<{ project: Project }>(`/projects/${projectId}`, {
    method: 'DELETE',
  });
};

export const getProject = (projectId: string) => {
  return apiClient<{ project: Project }>(`/projects/${projectId}`, {
    method: 'GET',
  });
};

export const getProjects = () => {
  return apiClient<{ projects: Project[] }>('/projects', {
    method: 'GET',
  });
};

export const updateProject = (projectId: string, payload: UpdateProjectDto) => {
  return apiClient<{ project: Project }>(`/projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};
