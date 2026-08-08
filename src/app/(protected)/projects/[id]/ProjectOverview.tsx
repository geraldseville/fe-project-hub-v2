import React from 'react';

import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import { useMe } from '@/hooks/queries/useMe';

import { Project } from '@/types/project.types';

import { defaultTimezone } from '@/lib/date-time';

interface ProjectOverviewProps {
  project: Project;
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const { data: me } = useMe();

  const timezone = me?.timezone ?? defaultTimezone;

  const startDate = momentTimezone(project.startDate)
    .tz(timezone)
    .format('MMM DD, YYYY');

  const endDate = momentTimezone(project.endDate)
    .tz(timezone)
    .format('MMM DD, YYYY');

  return (
    <div
      className={clsx(
        'p-6',
        'rounded-xl',
        'bg-[#171F33]',
        'border border-[#334155]',
      )}
    >
      <h2
        className={clsx(
          'font-hanken-grotesk font-semibold',
          'text-[#DAE2FD] text-[24px] leading-normal',
        )}
      >
        Project Overview
      </h2>
      <p className={clsx('text-[#C7C4D7] leading-normal', 'mt-4')}>
        {project.description}
      </p>
      <div className={clsx('flex justify-start items-stretch gap-4', 'mt-4')}>
        <BoxUI label="Start Date" value={startDate} />
        <BoxUI label="End Date" value={endDate} />
      </div>
    </div>
  );
}

function BoxUI({
  className,
  label = 'Label',
  value = 'Value',
}: {
  className?: string;
  label: string;
  value: string;
}) {
  return (
    <div
      className={clsx(
        className,
        'basis-1/4 min-h-20',
        'p-4',
        'rounded-sm',
        'bg-[#131B2E]',
        'border border-[#334155]',
      )}
    >
      <div
        className={clsx('font-jetbrains-mono', 'text-[#C7C4D7] leading-tight')}
      >
        {label}
      </div>
      <div className={clsx('text-[#DAE2FD] text-[16px] leading-tight', 'mt-1')}>
        {value}
      </div>
    </div>
  );
}
