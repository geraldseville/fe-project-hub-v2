import React from 'react';

import clsx from 'clsx';

import { toCapitalize } from '@/utils/string.utils';
import { TASK_PRIORITY_COLORS } from '@/utils/task.utils';

import type { TaskPriority } from '@/types/task.types';

import { IconFlag1 } from '@/components/svgs/icons';

interface TaskPriorityUIProps {
  className?: string;
  priority: TaskPriority;
}

export default function TaskPriorityUI({
  className,
  priority,
}: TaskPriorityUIProps) {
  const styles = TASK_PRIORITY_COLORS[priority];

  return (
    <div
      className={clsx(
        'inline-flex justify-center items-center gap-2',
        'w-fit',
        className,
      )}
      style={
        {
          '--task-priority-text-color': styles.hex,
        } as React.CSSProperties
      }
    >
      <IconFlag1
        className={clsx(
          'text-(--task-priority-text-color)!',
          'min-w-2.5 w-2.5 h-auto',
        )}
      />
      <div
        className={clsx(
          'font-jetbrains-mono font-medium',
          styles.text,
          'text-[12px] capitalize leading-none',
        )}
      >
        {toCapitalize(priority)}
      </div>
    </div>
  );
}
