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
};
