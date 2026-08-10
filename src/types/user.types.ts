import { Project } from '@/types/project.types';

export type AuthLoginDto = {
  email: string;
  password: string;
};

export type AuthRegisterDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  timezone: string;
};

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role?: string;
  bio?: string;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
  memberProjects?: Project[];
};

export type UserChangePasswordDto = {
  newPassword: string;
};

export type UserDto = {
  firstName?: string;
  lastName?: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
  timezone?: string;
};
