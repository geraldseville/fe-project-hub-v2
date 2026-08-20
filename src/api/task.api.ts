import { apiClient } from '@/api/api';

import { Pagination } from '@/types/generic.types';
import type {
  CreateTaskCommentDto,
  CreateTaskDto,
  Task,
  TaskComment,
  UpdateTaskDto,
} from '@/types/task.types';
import type { TaskActivity } from '@/types/task-activity.types';

export const createTask = (payload: CreateTaskDto) => {
  return apiClient<{ task: Task }>('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const createTaskComment = (
  taskId: string,
  payload: CreateTaskCommentDto,
) => {
  return apiClient<{ comment: TaskComment }>(`/tasks/${taskId}/comments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const deleteTask = (taskId: string) => {
  return apiClient<{ task: Task }>(`/tasks/${taskId}`, {
    method: 'DELETE',
  });
};

export const getTask = (taskId: string) => {
  return apiClient<{ task: Task }>(`/tasks/${taskId}`, {
    method: 'GET',
  });
};

export const getTaskActivities = (
  taskId: string,
  {
    page = 1,
    limit = 20,
  }: {
    page?: number;
    limit?: number;
  } = {},
) => {
  const params = new URLSearchParams();

  params.set('page', String(page));
  params.set('limit', String(limit));

  return apiClient<{
    taskActivities: TaskActivity[];
    pagination: Pagination;
  }>(`/tasks/${taskId}/activities?${params.toString()}`, {
    method: 'GET',
  });
};

export const getTasks = () => {
  return apiClient<{ tasks: Task[] }>('/tasks', {
    method: 'GET',
  });
};

export const updateTask = (taskId: string, payload: UpdateTaskDto) => {
  return apiClient<{ task: Task }>(`/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};
