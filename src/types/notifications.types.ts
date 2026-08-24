import type { Project } from '@/types/project.types';
import type { Task } from '@/types/task.types';
import type { User } from '@/types/user.types';

export type NotificationType =
  | 'PROJECT_MEMBER_ADDED'
  | 'PROJECT_MEMBER_REMOVED'
  | 'PROJECT_UPDATED'
  | 'PROJECT_DELETED'
  | 'TASK_ASSIGNED'
  | 'TASK_UPDATED'
  | 'TASK_COMMENTED'
  | 'TASK_DELETED';

export type NotificationEntityType = 'PROJECT' | 'TASK' | 'TASK_COMMENT';

export type Notification = {
  id: string;
  recipientId: string;
  recipient: User;
  actorId: string | null;
  actor: User | null;
  type: NotificationType;
  entityType: NotificationEntityType;
  entityId: string;
  project?: Project | null;
  task?: Task | null;
  title: string;
  message: string | null;
  metadata?: any | null;
  readAt: string | null;
  createdAt: string;
};
