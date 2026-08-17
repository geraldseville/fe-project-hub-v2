import type { Task } from '@/types/task.types';
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
  | 'PRIMARY_COLOR_CHANGED'
  | 'ASSIGNEE_CHANGED'
  | 'COMMENT_ADDED'
  | 'ATTACHMENT_ADDED'
  | 'ATTACHMENT_REMOVED';

export interface TaskActivityMetadata {
  from?: string | null;
  to?: string | null;
  commentId?: string;
  comment?: TaskComment;
}

export interface TaskActivity {
  id: string;
  taskId: string;
  actorId: string;
  type: TaskActivityType;
  metadata?: TaskActivityMetadata;
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
