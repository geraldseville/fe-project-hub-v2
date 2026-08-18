import { z } from 'zod';

import { COMMON_PASSWORDS } from '@/utils/auth.utils';
import { isValidTimezone } from '@/utils/date-time';

export const changeUserPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Za-z]/, 'Password must contain at least one letter.')
      .regex(/\d/, 'Password must contain at least one number.')
      .refine(
        (value) => !COMMON_PASSWORDS.has(value.toLowerCase()),
        'Please choose a stronger password.',
      ),

    confirmNewPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmNewPassword'],
        message: 'Passwords do not match.',
      });
    }
  });

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters.')
    .max(50, 'First name must not exceed 50 characters.')
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters.')
    .max(50, 'Last name must not exceed 50 characters.')
    .optional(),

  bio: z
    .string()
    .trim()
    .max(500, 'Bio must not exceed 500 characters.')
    .nullable()
    .optional(),

  role: z.string().trim().nullable().optional(),

  imageUrl: z.string().trim().nullable().optional(),

  timezone: z
    .string()
    .trim()
    .refine(isValidTimezone, {
      message: 'Invalid timezone.',
    })
    .nullable()
    .optional(),

  timeFormat: z
    .enum(['H12', 'H24'], {
      error: 'Invalid time format.',
    })
    .optional(),

  savedColors: z
    .array(
      z
        .string()
        .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, 'Invalid HEX color.'),
    )
    .optional(),
});

export type ChangeUserPasswordInput = z.infer<typeof changeUserPasswordSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const validateChangePassword = (values: ChangeUserPasswordInput) => {
  const result = changeUserPasswordSchema.safeParse(values);

  if (result.success) {
    return {
      success: true,
      errors: {},
    };
  }

  const fieldErrors = result.error.flatten().fieldErrors;

  return {
    success: false,
    errors: {
      newPassword: fieldErrors.newPassword?.[0],
      confirmNewPassword: fieldErrors.confirmNewPassword?.[0],
    },
  };
};

export const validateUpdateUser = (values: UpdateUserInput) => {
  const result = updateUserSchema.safeParse(values);

  if (result.success) {
    return {
      success: true,
      errors: {},
    };
  }

  const fieldErrors = result.error.flatten().fieldErrors;

  return {
    success: false,
    errors: {
      firstName: fieldErrors.firstName?.[0],
      lastName: fieldErrors.lastName?.[0],
      bio: fieldErrors.bio?.[0],
      role: fieldErrors.role?.[0],
      imageUrl: fieldErrors.imageUrl?.[0],
      timezone: fieldErrors.timezone?.[0],
      timeFormat: fieldErrors.timeFormat?.[0],
    },
  };
};
