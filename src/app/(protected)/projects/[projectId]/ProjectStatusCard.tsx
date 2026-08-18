import React from 'react';

import clsx from 'clsx';

import { useMe } from '@/hooks/queries/useMe';

import { getProjectTimeline } from '@/utils/project.utils';

import type { Project } from '@/types/project.types';

import ProgressBar from '@/components/elements/ProgressBar';
import SkeletonLoading from '@/components/elements/SkeletonLoading';
import { IconTimer } from '@/components/svgs/icons';

import { DEFAULT_TIMEZONE } from '@/lib/date-time';

interface ProjectStatusCardProps {
  project?: Project | null;
  isProjectPending: boolean;
}

export default function ProjectStatusCard({
  project,
  isProjectPending,
}: ProjectStatusCardProps) {
  const { data: me } = useMe();

  const timezone = me?.timezone ?? DEFAULT_TIMEZONE;

  const totalTasks = project?.tasks.length || 0;

  const totalCompletedTasks =
    project?.tasks.filter((item) => item.status === 'DONE').length || 0;

  const totalPendingTasks =
    project?.tasks.filter((item) => item.status !== 'DONE').length || 0;

  const projectTimeline = getProjectTimeline(
    project?.startDate ?? '',
    project?.endDate ?? '',
    timezone,
  );

  return (
    <div
      className={clsx(
        'p-6',
        'rounded-xl',
        'bg-[#171F33]',
        'border border-[#334155]',
      )}
    >
      <div className="text-[#DAE2FD] text-[18px] leading-tight">
        Project Status
      </div>
      <ProgressBar
        className="mt-4"
        value={totalCompletedTasks}
        total={totalTasks}
      />
      <div className={clsx('flex justify-between items-center gap-4', 'mt-4')}>
        {isProjectPending ? (
          <SkeletonLoading className="w-1/3 h-4" />
        ) : (
          <div
            className={clsx(
              'font-jetbrains-mono font-medium',
              'text-[#C7C4D7] text-[12px] leading-tight',
            )}
          >
            {totalCompletedTasks} Tasks Done
          </div>
        )}
        {isProjectPending ? (
          <SkeletonLoading className="w-1/3 h-4" />
        ) : (
          <div
            className={clsx(
              'font-jetbrains-mono font-medium',
              'text-[#C7C4D7] text-[12px] leading-tight',
            )}
          >
            {totalPendingTasks} Tasks Pending
          </div>
        )}
      </div>
      <div
        className={clsx(
          'flex justify-start items-center gap-2',
          'mt-4 p-4',
          'rounded-md',
          'bg-[#DAE2FD]',
        )}
      >
        {!isProjectPending && (
          <>
            <IconTimer className="text-[#0B1C30] min-w-3.75 w-3.75 h-auto" />
            <div
              className={clsx(
                'font-semibold',
                'text-[#0B1C30] text-[12px] leading-tight',
              )}
            >
              {projectTimeline.label}
            </div>
            <div
              className={clsx(
                'font-bold',
                'text-[#0B1C30] leading-tight',
                'ml-auto',
              )}
            >
              {projectTimeline.value}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
