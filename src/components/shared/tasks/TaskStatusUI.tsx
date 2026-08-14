import clsx from 'clsx';

import { TASK_STATUS_COLORS } from '@/utils/task.utils';

import type { TaskStatus } from '@/types/task.types';

interface TaskStatusProps {
  status: TaskStatus;
}

export default function TaskStatusUI({ status }: TaskStatusProps) {
  const styles = TASK_STATUS_COLORS[status];

  return (
    <div
      className={clsx(
        'flex justify-center items-center',
        'w-fit h-6',
        'py-1 px-2',
        'rounded-full',
        styles.bg,
        styles.border,
      )}
    >
      <div
        className={clsx(
          'font-inter font-medium',
          'text-[12px] leading-none',
          'whitespace-nowrap',
          styles.text,
        )}
      >
        {status.replace('_', ' ')}
      </div>
    </div>
  );
}
