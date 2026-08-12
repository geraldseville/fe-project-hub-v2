import React from 'react';

import clsx from 'clsx';

import { PROJECT_URGENCY_COLORS } from '@/utils/project.utils';

import type { ProjectUrgency } from '@/types/project.types';

interface ProjectUrgencyUIProps {
  urgency: ProjectUrgency;
}

export default function ProjectUrgencyUI({ urgency }: ProjectUrgencyUIProps) {
  const styles = PROJECT_URGENCY_COLORS[urgency];

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
        {urgency}
      </div>
    </div>
  );
}
