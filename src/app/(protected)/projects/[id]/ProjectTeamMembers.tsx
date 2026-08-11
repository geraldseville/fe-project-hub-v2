import React from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import { getFullName } from '@/utils/user.utils';

import type { Project } from '@/types/project.types';

import SkeletonLoading from '@/components/elements/SkeletonLoading';
import ThreeDotActions from '@/components/elements/ThreeDotActions';
import Avatar from '@/components/reusable/Avatar';
import { IconExternalLink, IconPlus1 } from '@/components/svgs/icons';

interface ProjectTeamMembersProps {
  project?: Project | null;
  isProjectPending: boolean;
}

export default function ProjectTeamMembers({
  project,
  isProjectPending,
}: ProjectTeamMembersProps) {
  const members = project?.members ?? [];

  return (
    <div
      className={clsx(
        'p-6',
        'rounded-xl',
        'bg-[#171F33]',
        'border border-[#334155]',
      )}
    >
      <div className={clsx('flex justify-between items-center gap-4', 'mb-4')}>
        <div className="text-[#DAE2FD] text-[18px] leading-tight">
          Team Members
        </div>
        {!isProjectPending && (
          <button
            className={clsx(
              'flex justify-center items-center',
              'min-w-8 w-8 h-8',
              'rounded-full',
              'border-2 border-dashed border-[#464553]',
            )}
            type="button"
            onClick={() => {}}
          >
            <IconPlus1 className="text-[#464553]" />
          </button>
        )}
      </div>
      <div
        className={clsx(
          'overflow-auto',
          'flex flex-col gap-4',
          'max-h-38 min-h-38',
        )}
      >
        {isProjectPending
          ? Array.from({ length: 4 }).map((_, index) => {
              return (
                <div
                  className="flex justify-start items-center gap-4"
                  key={`skeleton-loading-${index}`}
                >
                  <div className={clsx('relative', 'min-w-10 w-10 h-10')}>
                    <SkeletonLoading className="w-full h-full rounded-full" />
                  </div>
                  <div className="flex-1">
                    <SkeletonLoading className="w-full h-4" />
                    <SkeletonLoading className="w-1/2 h-4 mt-1" />
                  </div>
                  <SkeletonLoading className="w-8 h-8" />
                </div>
              );
            })
          : members.map((item) => (
              <div
                className="flex justify-start items-center gap-4"
                key={item.id}
              >
                <div className={clsx('relative', 'min-w-10 w-10 h-10')}>
                  {isProjectPending ? (
                    <SkeletonLoading className="w-full h-full rounded-full" />
                  ) : item.imageUrl ? (
                    <Image
                      className={clsx(
                        'w-full h-full',
                        'object-cover object-top',
                        'rounded-full',
                      )}
                      src={item.imageUrl}
                      alt={getFullName(item.firstName, item.lastName)}
                      title={getFullName(item.firstName, item.lastName)}
                      width={40}
                      height={40}
                      draggable={false}
                    />
                  ) : (
                    <Avatar initial={item.firstName?.charAt(0)} />
                  )}
                  {false && (
                    <div
                      className={clsx(
                        'absolute z-2 bottom-0 right-0',
                        'min-w-2.5 w-2.5 h-2.5',
                        'rounded-full',
                        'bg-[#22C55E]',
                        'border border-white',
                      )}
                    />
                  )}
                </div>
                <div className="flex-1">
                  {isProjectPending ? (
                    <SkeletonLoading className="w-full h-4" />
                  ) : (
                    <div
                      className={clsx(
                        'font-semibold',
                        'text-[#DAE2FD] text-[12px] leading-tight',
                        'h-[calc(1.25em*1)]',
                      )}
                    >
                      {getFullName(item.firstName, item.lastName)}
                    </div>
                  )}
                  {isProjectPending ? (
                    <SkeletonLoading className="w-1/2 h-4" />
                  ) : (
                    <div
                      className={clsx(
                        'font-semibold',
                        'text-[#C7C4D7] text-[11px] leading-tight',
                        'h-[calc(1.25em*1)]',
                        'mt-1',
                      )}
                    >
                      {item.role}
                    </div>
                  )}
                </div>
                <ThreeDotActions
                  orientation="Vertical"
                  placement="left-start"
                  actions={[
                    {
                      id: 'action-preview',
                      color: '#C7C4D7',
                      label: 'Preview',
                      icon: <IconExternalLink />,
                      onClick: () => {},
                    },
                    {
                      id: 'action-remove',
                      color: '#e90f1e',
                      label: 'Remove',
                      // icon: <IconExternalLink />,
                      onClick: () => {},
                    },
                  ]}
                />
              </div>
            ))}
      </div>
    </div>
  );
}
