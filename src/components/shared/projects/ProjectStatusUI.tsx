import clsx from 'clsx';

import { PROJECT_STATUS_COLORS } from '@/utils/project.utils';

import type { ProjectStatus } from '@/types/project.types';

interface ProjectStatusProps {
  status: ProjectStatus;
}

export default function ProjectStatusUI({ status }: ProjectStatusProps) {
  const styles = PROJECT_STATUS_COLORS[status];

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
          styles.text,
        )}
      >
        {status}
      </div>
    </div>
  );
}
