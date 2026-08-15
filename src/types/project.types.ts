import { PROJECT_PRIORITIES, PROJECT_STATUSES } from '@/utils/project.utils';

import type { Task } from '@/types/task.types';
import type { User } from '@/types/user.types';

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number];

export type Project = {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: string;
  endDate?: string;
  primaryColor?: string;
  secondaryColor?: string;
  ownerId: string;
  owner: User;
  members: User[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectDto = {
  title: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  primaryColor: string;
  secondaryColor: string;
  memberIds: string[];
};

export type UpdateProjectDto = {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  endDate?: string;
  primaryColor?: string;
  secondaryColor?: string;
  memberIds?: string[];
};
