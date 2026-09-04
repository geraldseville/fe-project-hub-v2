'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import { useUser } from '@/hooks/queries/useUser';

import { DEFAULT_TIMEZONE, readableTimezone } from '@/utils/date-time';
import { PROJECT_DEFAULT_COLOR } from '@/utils/project.utils';
import { getFullName, SOCIAL_CONFIG } from '@/utils/user.utils';

import type { Social } from '@/types/user.types';

import AppShellHead from '@/components/AppShellHead';
import CopyToClipboard from '@/components/elements/CopyToClipboard';
import SingleSelect from '@/components/elements/SingleSelect';
import SkeletonLoading from '@/components/elements/SkeletonLoading';
import Avatar from '@/components/reusable/Avatar';
import ProjectDescriptionUI from '@/components/shared/projects/ProjectDescriptionUI';
import ProjectMembersUI from '@/components/shared/projects/ProjectMembersUI';
import ProjectPriorityUI from '@/components/shared/projects/ProjectPriorityUI';
import ProjectStatusUI from '@/components/shared/projects/ProjectStatusUI';
import ProjectTaskCounterUI from '@/components/shared/projects/ProjectTaskCounterUI';
import ProjectTitleUI from '@/components/shared/projects/ProjectTitleUI';
import {
  IconCalendar2,
  IconCircleFilled,
  IconFolder1,
  IconProfileDetails,
  IconShare2,
} from '@/components/svgs/icons';

export default function TeamPage() {
  const { userId } = useParams<{ userId: string }>();

  const { data: user = null, isPending: isUserPending } = useUser(userId);

  const userFullName = getFullName(user?.firstName, user?.lastName) || '';
  const timezone = user?.timezone ?? DEFAULT_TIMEZONE;
  const joinedDate = momentTimezone(user?.createdAt)
    .tz(timezone)
    .format('MMM DD, YYYY');
  const socials = user?.socials ?? {};

  const [myProjectType, setMyProjectType] = useState<'Owned' | 'Assigned'>(
    'Owned',
  );

  const visibleProjects = useMemo(
    () =>
      myProjectType === 'Owned'
        ? (user?.ownedProjects ?? [])
        : (user?.memberProjects ?? []),
    [myProjectType, user],
  );

  return (
    <main
      className={clsx('overflow-hidden', 'flex flex-col', 'w-full h-screen')}
    >
      {/* Head */}
      <AppShellHead
        breadcrumb={{ label: userFullName, href: `/teams/${user?.id}` }}
      />
      {/* Body */}
      <div className={clsx('overflow-y-auto', 'flex-1 min-h-0', 'py-4 px-6')}>
        <div className="flex justify-start items-center gap-4 w-full">
          {/* Profile Image */}
          <div
            className={clsx(
              'group',
              'relative',
              'flex justify-center items-center',
              'min-w-34 w-34 h-34',
              'rounded-xl',
              'border-4 border-background',
              'bg-background',
            )}
          >
            {user?.imageUrl ? (
              <Image
                className={clsx(
                  'relative z-1',
                  'w-full h-full object-cover object-top',
                  'rounded-xl',
                )}
                src={user.imageUrl}
                alt={userFullName}
                title={userFullName}
                width={136}
                height={136}
                draggable={false}
                loading="eager"
              />
            ) : (
              <Avatar
                className="w-full h-full rounded-[inherit]!"
                initial={userFullName.charAt(0)}
              />
            )}
          </div>
          {/* User Details */}
          <div className="flex-1">
            <div
              className={clsx(
                'font-hanken-grotesk',
                'text-[18px] leading-tight',
              )}
            >
              {userFullName}
            </div>
            <div
              className={clsx(
                'font-inter',
                'text-[16px] leading-tight',
                'mt-1',
              )}
            >
              {user?.role}
            </div>
            <div
              className={clsx(
                'flex justify-center items-center gap-2',
                'w-fit',
                'mt-4 py-2 px-4',
                'rounded-full',
                'border border-red-50',
              )}
            >
              <IconCircleFilled className="min-w-2 w-2 h-2" />
              <div>ACTIVE</div>
            </div>
          </div>
        </div>
        <div
          className={clsx('flex justify-between items-start gap-4', 'mt-16')}
        >
          {/* Left */}
          <div className="flex flex-col gap-4 flex-1">
            {/* Projects */}
            <div
              className={clsx(
                'w-full',
                'p-6',
                'rounded-lg',
                'bg-[#131B2E]',
                'border border-[#464554]',
              )}
            >
              <div
                className={clsx(
                  'flex flex-row justify-start items-center gap-2',
                  'mb-6 pb-4',
                  'border-b border-[#464554]',
                )}
              >
                <IconFolder1 className="w-auto h-3.5" />
                <div className="font-hanken-grotesk text-forground">
                  Projects
                </div>
                <SingleSelect
                  classNames={{
                    root: 'max-w-50 ml-auto',
                    trigger: 'h-10!',
                  }}
                  value={{
                    id: myProjectType.toLowerCase(),
                    label: myProjectType,
                    value: myProjectType,
                  }}
                  options={[
                    {
                      id: 'owned',
                      label: 'Owned Projects',
                      value: 'Owned',
                    },
                    {
                      id: 'assigned',
                      label: 'Assigned Projects',
                      value: 'Assigned',
                    },
                  ]}
                  onChange={(selected) => {
                    setMyProjectType(selected.value as 'Owned' | 'Assigned');
                  }}
                />
              </div>
              {isUserPending ? (
                <SkeletonLoading className="w-full h-20" />
              ) : visibleProjects.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {visibleProjects.map((projectItem) => {
                    const startEndDate =
                      momentTimezone(projectItem.startDate)
                        .tz(timezone)
                        .format('MMM DD, YYYY') +
                      ' - ' +
                      momentTimezone(projectItem.endDate)
                        .tz(timezone)
                        .format('MMM DD, YYYY');

                    const totalTasks = projectItem.tasks?.length || 0;

                    const totalCompletedTasks =
                      projectItem.tasks?.filter(
                        (item) => item.status === 'DONE',
                      ).length || 0;

                    return (
                      <Link
                        className={clsx(
                          'overflow-hidden',
                          'min-h-32 h-auto',
                          'p-6',
                          'rounded-lg',
                          'bg-[#0B1326]',
                          'border border-l-[6px] border-transparent hover:border-[#464554]',
                        )}
                        key={projectItem.id}
                        style={{
                          borderLeftColor:
                            projectItem.primaryColor ?? PROJECT_DEFAULT_COLOR,
                        }}
                        href={`/projects/${projectItem.id}`}
                      >
                        <div className="flex justify-end items-center gap-4">
                          <div className="mr-auto">
                            <ProjectTitleUI title={projectItem.title} />
                          </div>
                          <ProjectStatusUI status={projectItem.status} />
                          <ProjectPriorityUI priority={projectItem.priority} />
                        </div>
                        <div className="w-full mt-3">
                          <ProjectDescriptionUI
                            description={projectItem.description ?? ''}
                          />
                        </div>
                        <div
                          className={clsx(
                            'flex justify-start items-center gap-4',
                            'mt-4',
                          )}
                        >
                          <ProjectTaskCounterUI
                            current={totalCompletedTasks}
                            total={totalTasks}
                          />
                          <div className="flex justify-center items-center gap-2">
                            <IconCalendar2 />
                            {startEndDate}
                          </div>
                          <div className="ml-auto">
                            <ProjectMembersUI members={projectItem.members} />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <i>No Projects Found</i>
              )}
            </div>
          </div>
          {/* Right */}
          <div
            className={clsx(
              'flex flex-col gap-4',
              'basis-[420px] min-w-[420px]',
            )}
          >
            {/* Details */}
            <div
              className={clsx(
                'w-full',
                'p-6',
                'rounded-lg',
                'bg-[#131B2E]',
                'border border-[#464554]',
              )}
            >
              <div
                className={clsx(
                  'flex flex-row justify-start items-center gap-2',
                  'mb-6 pb-4',
                  'border-b border-[#464554]',
                )}
              >
                <IconProfileDetails className="w-auto h-3.5" />
                <div className="font-hanken-grotesk text-forground">
                  Details
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {/* Email */}
                <div>
                  <span className="font-jetbrains-mono text-[#4f4e55] uppercase">
                    Email:
                  </span>{' '}
                  {user?.email}
                  <CopyToClipboard className="ml-3" value={user?.email ?? ''} />
                </div>
                {/* Timezone */}
                <div>
                  <span className="font-jetbrains-mono text-[#4f4e55] uppercase">
                    Timezone:
                  </span>{' '}
                  {readableTimezone(timezone)}
                  {' - '}
                  {momentTimezone().tz(timezone).format('[GMT]Z')}
                </div>
                {/* Joined */}
                <div>
                  <span className="font-jetbrains-mono text-[#4f4e55] uppercase">
                    Joined:
                  </span>{' '}
                  {joinedDate}
                </div>
              </div>
            </div>
            {/* Socials */}
            <div
              className={clsx(
                'w-full',
                'p-6',
                'rounded-lg',
                'bg-[#131B2E]',
                'border border-[#464554]',
              )}
            >
              <div
                className={clsx(
                  'flex flex-row justify-start items-center gap-2',
                  'mb-6 pb-4',
                  'border-b border-[#464554]',
                )}
              >
                <IconShare2 className="w-auto h-3.5" />
                <div className="font-hanken-grotesk text-forground">
                  Socials
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {Object.entries(socials).map(([key, value]) => {
                  const social = key as Social;
                  const label = SOCIAL_CONFIG[social].label;
                  const Icon = SOCIAL_CONFIG[social].icon;

                  return (
                    <Link
                      className="flex justify-start items-center gap-4"
                      key={social}
                      href={value}
                      target="_blank"
                    >
                      <div
                        className={clsx(
                          'flex justify-center items-center',
                          'min-w-10 w-10 h-10',
                          'rounded-sm',
                          'bg-[#DAE2FD]/20',
                        )}
                      >
                        <Icon className="min-w-3.5 w-3.5 h-3.5" />
                      </div>
                      <div className="">{label}</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
