import React from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import { getFullName } from '@/utils/user.utils';

import type { User } from '@/types/user.types';

import Avatar from '@/components/reusable/Avatar';

interface TaskAssigneeUIProps {
  classNames?: {
    root?: string;
    avatar?: string;
    name?: string;
  };
  assignee: User | null;
  displayName?: 'fullName' | 'firstNameLastInitial';
}

export default function TaskAssigneeUI({
  classNames,
  assignee,
  displayName = 'firstNameLastInitial',
}: TaskAssigneeUIProps) {
  const assigneeFullName =
    getFullName(assignee?.firstName, assignee?.lastName) ?? 'Unassigned';

  const assigneeDisplayName =
    displayName === 'fullName'
      ? assigneeFullName
      : `${assignee?.firstName ?? ''} ${assignee?.lastName?.charAt(0) ?? ''}`.trim();

  if (!assignee) {
    return (
      <i
        className={clsx(
          'text-[#C7C4D7]',
          'truncate',
          'min-w-0',
          classNames?.name,
        )}
      >
        No Assignee
      </i>
    );
  }

  return (
    <div
      className={clsx(
        'flex justify-start items-center gap-2',
        'min-w-0',
        classNames?.root,
      )}
    >
      <div className={clsx('min-w-7.5 w-7.5 h-7.5', classNames?.avatar)}>
        {assignee.imageUrl ? (
          <Image
            className={clsx(
              'w-full h-full',
              'object-cover object-top',
              'rounded-full',
            )}
            src={assignee.imageUrl}
            alt={assigneeFullName}
            title={assigneeFullName}
            width={30}
            height={30}
          />
        ) : (
          <Avatar
            className="w-full h-full"
            initial={assigneeFullName.charAt(0)}
          />
        )}
      </div>
      <div
        className={clsx(
          'text-[#C7C4D7]',
          'truncate',
          'min-w-0',
          classNames?.name,
        )}
      >
        {assigneeDisplayName}
      </div>
    </div>
  );
}
