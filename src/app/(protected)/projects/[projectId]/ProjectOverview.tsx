import React from 'react';

import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import { useMe } from '@/hooks/queries/useMe';

import { DEFAULT_TIMEZONE } from '@/utils/date-time';

import type { Project } from '@/types/project.types';

import SkeletonLoading from '@/components/elements/SkeletonLoading';

interface ProjectOverviewProps {
  project?: Project | null;
  isProjectPending: boolean;
}

export default function ProjectOverview({
  project,
  isProjectPending,
}: ProjectOverviewProps) {
  const { data: me } = useMe();

  const timezone = me?.timezone ?? DEFAULT_TIMEZONE;

  const startDate = project?.startDate
    ? momentTimezone(project.startDate).tz(timezone).format('MMM DD, YYYY')
    : '—';

  const endDate = project?.endDate
    ? momentTimezone(project.endDate).tz(timezone).format('MMM DD, YYYY')
    : '—';

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
      {isProjectPending ? (
        <div className="w-full space-y-1.5 mt-4">
          <SkeletonLoading className="w-full h-4" />
          <SkeletonLoading className="w-full h-4" />
          <SkeletonLoading className="w-full h-4" />
          <SkeletonLoading className="w-1/2 h-4" />
        </div>
      ) : (
        <>
          <p className={clsx('text-[#C7C4D7] leading-normal', 'mt-4')}>
            {project ? project.description : <i>No Description</i>}
          </p>
        </>
      )}
      <div className={clsx('flex justify-start items-stretch gap-4', 'mt-4')}>
        {/* Start Date */}
        <div
          className={clsx(
            'basis-1/4 min-h-20',
            'p-4',
            'rounded-sm',
            'bg-[#131B2E]',
            'border border-[#334155]',
          )}
        >
          {isProjectPending ? (
            <>
              <SkeletonLoading className="w-20 h-4" />
              <SkeletonLoading className="w-32 h-4 mt-2" />
            </>
          ) : (
            <>
              <div
                className={clsx(
                  'font-jetbrains-mono',
                  'text-[#C7C4D7] leading-tight',
                )}
              >
                Start Date
              </div>
              <div
                className={clsx(
                  'text-[#DAE2FD] text-[16px] leading-tight',
                  'mt-1',
                )}
              >
                {startDate}
              </div>
            </>
          )}
        </div>
        {/* End Date */}
        <div
          className={clsx(
            'basis-1/4 min-h-20',
            'p-4',
            'rounded-sm',
            'bg-[#131B2E]',
            'border border-[#334155]',
          )}
        >
          {isProjectPending ? (
            <>
              <SkeletonLoading className="w-20 h-4" />
              <SkeletonLoading className="w-32 h-4 mt-2" />
            </>
          ) : (
            <>
              <div
                className={clsx(
                  'font-jetbrains-mono',
                  'text-[#C7C4D7] leading-tight',
                )}
              >
                End Date
              </div>
              <div
                className={clsx(
                  'text-[#DAE2FD] text-[16px] leading-tight',
                  'mt-1',
                )}
              >
                {endDate}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
