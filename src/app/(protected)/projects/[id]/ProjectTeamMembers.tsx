import React from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import { getFullName } from '@/utils/user.utils';

import { User } from '@/types/user.types';

import ThreeDotActions from '@/components/elements/ThreeDotActions';
import { IconPlus1 } from '@/components/svgs/icons';

interface ProjectTeamMembersProps {
  members: User[] | null;
}

export default function ProjectTeamMembers({
  members,
}: ProjectTeamMembersProps) {
  if (!members) return null;

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
      </div>
      <div
        className={clsx(
          'overflow-auto',
          'flex flex-col gap-4',
          'max-h-38 min-h-38',
        )}
      >
        {members.map((item) => (
          <div
            className="flex flex-row justify-start items-center gap-4"
            key={item.id}
          >
            <div className={clsx('relative', 'min-w-10 w-10 h-10')}>
              {item.imageUrl ? (
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
              ) : null}
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
              <div
                className={clsx(
                  'font-semibold',
                  'text-[#DAE2FD] text-[12px] leading-tight',
                )}
              >
                {getFullName(item.firstName, item.lastName)}
              </div>
              <div
                className={clsx(
                  'font-semibold',
                  'text-[#C7C4D7] text-[11px] leading-tight',
                  'mt-1',
                )}
              >
                {item.role}
              </div>
            </div>
            <ThreeDotActions orientation="Vertical" />
          </div>
        ))}
      </div>
    </div>
  );
}
