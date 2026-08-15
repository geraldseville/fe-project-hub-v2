import React from 'react';

import clsx from 'clsx';

import { PROJECT_PRIORITY_COLORS } from '@/utils/project.utils';
import { toCapitalize } from '@/utils/string.utils';

import type { ProjectPriority } from '@/types/project.types';

import { IconFlag1 } from '@/components/svgs/icons';

interface ProjectPriorityUIProps {
  priority: ProjectPriority;
}

export default function ProjectPriorityUI({
  priority,
}: ProjectPriorityUIProps) {
  const styles = PROJECT_PRIORITY_COLORS[priority];

  return (
    <div
      className={clsx('flex justify-center items-center gap-2', 'w-fit')}
      style={
        {
          '--task-priority-text-color': styles.hex,
        } as React.CSSProperties
      }
    >
      <IconFlag1
        className={clsx(
          'text-[var(--task-priority-text-color)]!',
          'min-w-2.5 w-2.5 h-auto',
        )}
      />
      <div
        className={clsx(
          'font-jetbrains-mono font-medium',
          styles.text,
          'text-[12px] uppercase leading-none',
        )}
      >
        {toCapitalize(priority)}
      </div>
    </div>
  );
}
