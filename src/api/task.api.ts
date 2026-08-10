import { apiClient } from '@/api/api';

import type { CreateTaskDto, Task, UpdateTaskDto } from '@/types/task.types';

export const createTask = (payload: CreateTaskDto) => {
  return apiClient<{ task: Task }>('/tasks', {
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
