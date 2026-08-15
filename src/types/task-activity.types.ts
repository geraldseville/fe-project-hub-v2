import type { User } from '@/types/user.types';

export type TaskActivityType =
  | 'CREATED'
  | 'UPDATED'
  | 'TITLE_CHANGED'
  | 'DESCRIPTION_CHANGED'
  | 'STATUS_CHANGED'
  | 'PRIORITY_CHANGED'
  | 'START_DATE_CHANGED'
  | 'END_DATE_CHANGED'
  | 'ASSIGNEE_CHANGED'
  | 'COMMENT_ADDED'
  | 'ATTACHMENT_ADDED'
  | 'ATTACHMENT_REMOVED';

export interface TaskActivityMetadata {
  from: string | null;
  to: string | null;
}

export interface TaskActivity {
  id: string;
  taskId: string;
  actorId: string;
  type: TaskActivityType;
  metadata: TaskActivityMetadata;
  createdAt: string;
  actor: User;
}

export interface TaskActivitiesPaginated {
  activities: TaskActivity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
