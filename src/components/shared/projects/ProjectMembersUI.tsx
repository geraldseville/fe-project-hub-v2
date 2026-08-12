import clsx from 'clsx';

import { getFullName } from '@/utils/user.utils';

import type { User } from '@/types/user.types';

import ImageStack from '@/components/elements/ImageStack';

interface ProjectMembersUIProps {
  members: User[];
}

export default function ProjectMembersUI({ members }: ProjectMembersUIProps) {
  if (members.length === 0) {
    return (
      <div
        className={clsx(
          'font-hanken-grotesk',
          'text-[#DAE2FD] leading-tight truncate',
        )}
      >
        No Assignees
      </div>
    );
  }

  return (
    <ImageStack
      className={{ item: 'border-[#131B2E]!' }}
      images={members.map((item) => ({
        src: item.imageUrl ?? '',
        alt: getFullName(item.firstName, item.lastName),
      }))}
      size={32}
    />
  );
}
