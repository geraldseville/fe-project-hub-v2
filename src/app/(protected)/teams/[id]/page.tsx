'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import { useUser } from '@/hooks/queries/useUser';

import { getFullName } from '@/utils/user.utils';

import CopyToClipboard from '@/components/elements/CopyToClipboard';
import SkeletonLoading from '@/components/elements/SkeletonLoading';
import Avatar from '@/components/reusable/Avatar';
import ProjectDescriptionUI from '@/components/shared/projects/ProjectDescriptionUI';
import ProjectMembersUI from '@/components/shared/projects/ProjectMembersUI';
import ProjectStatusUI from '@/components/shared/projects/ProjectStatusUI';
import ProjectTaskCounterUI from '@/components/shared/projects/ProjectTaskCounterUI';
import ProjectTitleUI from '@/components/shared/projects/ProjectTitleUI';
import ProjectUrgencyUI from '@/components/shared/projects/ProjectUrgencyUI';
import {
  IconAngleRight,
  IconCalendar2,
  IconDot,
  IconFolder1,
  IconProfileDetails,
} from '@/components/svgs/icons';

import { defaultTimezone, readableTimezone } from '@/lib/date-time';

export default function TeamItemPage() {
  const params = useParams();

  const userId = params.id as string;

  const { data: user = null, isPending: isUserPending } = useUser(userId);

  const userFullName = getFullName(user?.firstName, user?.lastName) || '';

  const timezone = user?.timezone ?? defaultTimezone;

  const joinedDate = momentTimezone(user?.createdAt)
    .tz(timezone)
    .format('MMM DD, YYYY');

  console.log({ userId, user, joinedDate });

  return (
    <main className={clsx('overflow-auto', 'w-full h-screen', 'py-10 px-4')}>
      {/* Head */}
      <div className="flex justify-between items-center gap-4 max-[1080px]:flex-wrap">
        <div className="flex-1">
          {isUserPending ? (
            <SkeletonLoading className="w-1/4 h-4" />
          ) : (
            <div
              className={clsx(
                'font-hanken-grotesk',
                'text-[#C7C4D7] text-[16px] leading-tight',
                'whitespace-nowrap',
                'flex justify-start items-center gap-2',
              )}
            >
              <Link href="/projects">Teams</Link>
              <IconAngleRight />
              {user ? <span>{userFullName}</span> : <i>Untitled</i>}
            </div>
          )}
          <div
            className={clsx('flex justify-start items-center gap-3', 'mt-1')}
          >
            {isUserPending || !user ? (
              <SkeletonLoading className="w-1/3 h-7.5" />
            ) : (
              <>
                <h1
                  className={clsx(
                    'font-hanken-grotesk font-bold',
                    'text-[#DAE2FD] text-[24px] leading-tight',
                  )}
                >
                  {user ? userFullName : <i>Untitled</i>}
                </h1>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="mt-10">
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
              <IconDot className="min-w-2 w-2 h-2" />
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
                <IconFolder1 className="min-w-5 w-5 h-auto" />
                <div className="font-hanken-grotesk text-forground">
                  Projects
                </div>
              </div>
              <div className="flex flex-col gap-6">
                {user?.memberProjects?.map((projectItem, projectIndex) => {
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
                    projectItem.tasks?.filter((item) => item.status === 'DONE')
                      .length || 0;

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
                        borderLeftColor: projectItem.primaryColor,
                      }}
                      href={`/projects/${projectItem.id}`}
                    >
                      <div className="flex justify-end items-center gap-4">
                        <div className="mr-auto">
                          <ProjectTitleUI title={projectItem.title} />
                        </div>
                        <ProjectUrgencyUI urgency={projectItem.urgency} />
                        <ProjectStatusUI status={projectItem.status} />
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
            </div>
          </div>
          {/* Right */}
          <div
            className={clsx(
              'flex flex-col gap-4',
              'basis-[305px] min-w-[305px]',
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
                <IconProfileDetails className="min-w-5 w-5 h-auto" />
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
          </div>
        </div>
      </div>
    </main>
  );
}
