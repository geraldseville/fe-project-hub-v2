import React from 'react';

import clsx from 'clsx';

import { PROJECT_URGENCY_COLORS } from '@/utils/project.utils';

import type { ProjectUrgency } from '@/types/project.types';

import { IconDot } from '@/components/svgs/icons';

interface ProjectUrgencyUIProps {
  urgency: ProjectUrgency;
}

export default function ProjectUrgencyUI({ urgency }: ProjectUrgencyUIProps) {
  const styles = PROJECT_URGENCY_COLORS[urgency];

  return (
    <div
      className={clsx('flex justify-center items-center gap-2', 'w-fit')}
      style={{ '--icon-dot-color': styles.hex } as React.CSSProperties}
    >
      <IconDot className="text-[var(--icon-dot-color)] min-w-2 w-2 h-2" />
      <div
        className={clsx(
          'font-inter font-medium',
          'text-[#C7C4D7] text-[12px] capitalize leading-tight',
        )}
      >
        {urgency}
      </div>
    </div>
  );
}
