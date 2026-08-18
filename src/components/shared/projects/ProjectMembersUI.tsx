import clsx from 'clsx';

import { getFullName } from '@/utils/user.utils';

import type { User } from '@/types/user.types';

import ImageStack from '@/components/elements/ImageStack';

interface ProjectMembersUIProps {
  classNames?: {
    root?: string;
    item?: string;
    empty?: string;
  };
  members: User[];
  maxDisplay?: number;
}

export default function ProjectMembersUI({
  classNames,
  members,
  maxDisplay,
}: ProjectMembersUIProps) {
  if (members.length === 0) {
    return (
      <div
        className={clsx(
          'font-hanken-grotesk',
          'text-[#DAE2FD] leading-tight truncate',
          classNames?.empty,
        )}
      >
        No Members
      </div>
    );
  }

  return (
    <ImageStack
      className={{
        root: classNames?.root,
        item: clsx('border-[#131B2E]!', classNames?.item),
      }}
      images={members.map((item) => ({
        src: item.imageUrl ?? '',
        alt: getFullName(item.firstName, item.lastName),
      }))}
      size={32}
      maxDisplay={maxDisplay}
    />
  );
}
