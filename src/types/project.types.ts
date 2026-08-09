import { PROJECT_STATUSES, PROJECT_URGENCIES } from '@/utils/project.utils';

import type { User } from './user.types';

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type ProjectUrgency = (typeof PROJECT_URGENCIES)[number];

export type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  urgency: ProjectUrgency;
  startDate?: string;
  endDate?: string;
  primaryColor?: string;
  secondaryColor?: string;
  ownerId: string;
  owner: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectDto = {
  title: string;
  description: string;
  status: ProjectStatus;
  urgency: ProjectUrgency;
  startDate: string;
  endDate: string;
  primaryColor: string;
  secondaryColor: string;
  memberIds: string[];
};

export type UpdateProjectDto = {
  title: string;
  description?: string;
  status?: ProjectStatus;
  urgency?: ProjectUrgency;
  startDate?: string;
  endDate?: string;
  primaryColor?: string;
  secondaryColor?: string;
  memberIds?: string[];
};
