import { z } from 'zod';

import { getPasswordRules } from '@/utils/auth.utils';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please provide a valid email')
    .toLowerCase(),

  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Please enter your full name.'),

    email: z.string().email('Enter a valid email address.'),

    password: z.string().superRefine((password, ctx) => {
      const rules = getPasswordRules(password);

      if (!rules.hasMinimumLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must be at least 8 characters.',
        });
      }

      if (!rules.hasLetter) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one letter.',
        });
      }

      if (!rules.hasNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one number.',
        });
      }

      if (!rules.isNotCommon) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose a stronger password.',
        });
      }
    }),

    confirmPassword: z.string().min(1, 'Please confirm your password.'),

    agreeTerms: z.boolean().refine((value) => value === true, {
      message: 'You must agree to the terms.',
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;

export type ReigsterInput = z.infer<typeof registerSchema>;

export const validateRegister = (values: ReigsterInput) => {
  const result = registerSchema.safeParse(values);

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
      name: fieldErrors.name?.[0],
      email: fieldErrors.email?.[0],
      password: fieldErrors.password?.[0],
      confirmPassword: fieldErrors.confirmPassword?.[0],
      agreeTerms: fieldErrors.agreeTerms?.[0],
    },
  };
};

export const validateLogin = (values: LoginInput) => {
  const result = loginSchema.safeParse(values);

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
      email: fieldErrors.email?.[0],
      password: fieldErrors.password?.[0],
    },
  };
};
