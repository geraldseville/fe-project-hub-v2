import React from 'react';

import clsx from 'clsx';

import { TASK_PRIORITY_COLORS } from '@/utils/task.utils';

import type { TaskPriority } from '@/types/task.types';

interface TaskPriorityUIProps {
  priority: TaskPriority;
}

export default function TaskPriorityUI({ priority }: TaskPriorityUIProps) {
  const styles = TASK_PRIORITY_COLORS[priority];

  return (
    <div
      className={clsx(
        'flex justify-center items-center gap-2',
        'w-fit',
        'py-1 px-2',
        'rounded-md',
        styles.bg,
        'border',
        styles.border,
      )}
    >
      <div
        className={clsx(
          'font-jetbrains-mono font-medium',
          styles.text,
          'text-[12px] uppercase leading-none',
        )}
      >
        {priority}
      </div>
    </div>
  );
}
