import type { Project } from '@/types/project.types';
import type { TaskActivity } from '@/types/task-activity.types';

export type AuthLoginDto = {
  email: string;
  password: string;
};

export type AuthRegisterDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type Social =
  | 'facebook'
  | 'figma'
  | 'github'
  | 'instagram'
  | 'linkedin'
  | 'pinterest'
  | 'spotify'
  | 'telegram'
  | 'twitter'
  | 'website'
  | 'youtube';

export type UserSocial = Partial<Record<Social, string>>;

export type TimeFormat = 'H12' | 'H24';

export type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
  socials: UserSocial;
  timezone: string | null;
  timeFormat: TimeFormat;
  savedColors: string[];
  ownedProjects: Project[];
  memberProjects: Project[];
  taskActivities: TaskActivity[];
  createdAt?: string;
  updatedAt?: string;
};

export type UserChangePasswordDto = {
  newPassword: string;
};

export type UserDto = {
  firstName?: string;
  lastName?: string;
  role?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  socials?: UserSocial;
  timezone?: string | null;
  timeFormat?: TimeFormat;
  savedColors?: string[];
};
