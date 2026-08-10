import { z } from 'zod';

import { TASK_PRIORITIES, TASK_STATUSES } from '@/utils/task.utils';

export const taskFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required.'),

    description: z.string().trim().optional(),

    status: z
      .enum(TASK_STATUSES, {
        error: 'Invalid task status.',
      })
      .default('TODO'),

    priority: z
      .enum(TASK_PRIORITIES, {
        error: 'Invalid task priority.',
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

    projectId: z.string().cuid('Invalid project ID.'),

    assigneeId: z.string().uuid('Please select an assignee.'),
  })
  .refine(
    (data) =>
      !data.startDate || !data.endDate || data.endDate >= data.startDate,
    {
      message: 'End date must be after start date.',
      path: ['endDate'],
    },
  );

export type TaskFormInput = z.infer<typeof taskFormSchema>;

export const blankTaskForm: TaskFormInput = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'LOW',
  startDate: '',
  endDate: '',
  projectId: '',
  assigneeId: '',
};

export type TaskFormErrors = {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  projectId?: string;
  assigneeId?: string;
};

export const validateTaskForm = (
  values: TaskFormInput,
):
  | {
      success: true;
      errors: TaskFormErrors;
    }
  | {
      success: false;
      errors: TaskFormErrors;
    } => {
  const result = taskFormSchema.safeParse(values);

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
      projectId: fieldErrors.projectId?.[0],
      assigneeId: fieldErrors.assigneeId?.[0],
    },
  };
};
