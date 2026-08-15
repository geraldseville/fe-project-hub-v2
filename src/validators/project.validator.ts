import { z } from 'zod';

import { PROJECT_PRIORITIES, PROJECT_STATUSES } from '@/utils/project.utils';

export const projectFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.'),

    description: z.string().trim(),

    status: z
      .enum(PROJECT_STATUSES, {
        error: 'Invalid project status.',
      })
      .default('PLANNING'),

    priority: z
      .enum(PROJECT_PRIORITIES, {
        error: 'Invalid project priority.',
      })
      .default('LOW'),

    startDate: z
      .string()
      .trim()
      .min(1, 'Start date is required.')
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: 'Invalid start date.',
      }),

    endDate: z
      .string()
      .trim()
      .min(1, 'End date is required.')
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: 'Invalid end date.',
      }),

    primaryColor: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid primary color.')
      .default('#000000'),

    secondaryColor: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid secondary color.')
      .default('#000000'),

    memberIds: z.array(z.string().cuid()).optional().default([]),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      path: ['endDate'],
      message: 'End date must be after start date.',
    },
  );

export type ProjectFormInput = z.infer<typeof projectFormSchema>;

export const blankProjectForm: ProjectFormInput = {
  title: '',
  description: '',
  status: 'PLANNING',
  priority: 'MEDIUM',
  startDate: '',
  endDate: '',
  primaryColor: '#000000',
  secondaryColor: '#000000',
  memberIds: [],
};

export type ProjectFormErrors = {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  primaryColor?: string;
  secondaryColor?: string;
  memberIds?: string;
};

export const validateProjectForm = (
  values: ProjectFormInput,
):
  | {
      success: true;
      errors: ProjectFormErrors;
    }
  | {
      success: false;
      errors: ProjectFormErrors;
    } => {
  const result = projectFormSchema.safeParse(values);

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
      title: fieldErrors.title?.[0],
      description: fieldErrors.description?.[0],
      status: fieldErrors.status?.[0],
      priority: fieldErrors.priority?.[0],
      startDate: fieldErrors.startDate?.[0],
      endDate: fieldErrors.endDate?.[0],
      primaryColor: fieldErrors.primaryColor?.[0],
      secondaryColor: fieldErrors.secondaryColor?.[0],
      memberIds: fieldErrors.memberIds?.[0],
    },
  };
};
