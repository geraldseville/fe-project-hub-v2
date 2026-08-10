import { TASK_PRIORITIES, TASK_STATUSES } from '@/utils/task.utils';

import type { Project } from '@/types/project.types';
import type { User } from '@/types/user.types';

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate?: string;
  endDate?: string;
  projectId: string;
  project: Project;
  createdById: string;
  createdBy: User;
  assigneeId: string;
  assignee: User;
};

export type CreateTaskDto = {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  description?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  assigneeId?: string | undefined;
};

export type UpdateTaskDto = {
  title?: string | undefined;
  description?: string | undefined;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: string | undefined;
  endDate?: string | undefined;
  projectId?: string | undefined;
  assigneeId?: string | undefined;
};
