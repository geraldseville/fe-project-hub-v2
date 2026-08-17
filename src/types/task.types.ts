import { TASK_PRIORITIES, TASK_STATUSES } from '@/utils/task.utils';

import type { Project } from '@/types/project.types';
import type { User } from '@/types/user.types';

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string | null;
  endDate: string | null;
  primaryColor: string | null;
  projectId: string;
  project: Project;
  createdById: string;
  createdBy: User;
  assigneeId: string | null;
  assignee: User | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskDto = {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  primaryColor?: string | null;
  assigneeId?: string | null;
};

export type UpdateTaskDto = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: string | null;
  endDate?: string | null;
  primaryColor?: string | null;
  projectId?: string;
  assigneeId?: string | null;
};

export type TaskComment = {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  task: Task;
  author: User;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskCommentDto = {
  content: string;
};
