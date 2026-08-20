import Link from 'next/link';

import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import { useMe } from '@/hooks/queries/useMe';
import { useTaskActivities } from '@/hooks/queries/useTaskActivities';
import { useUsers } from '@/hooks/queries/useUsers';

import { DEFAULT_TIMEZONE, getTimeFormat } from '@/utils/date-time';
import { getFullName } from '@/utils/user.utils';

import type { TaskPriority, TaskStatus } from '@/types/task.types';
import type { TaskActivity } from '@/types/task-activity.types';

import LoaderSpinner from '@/components/elements/LoaderSpinner';
import MultiLineField from '@/components/elements/MultiLineField';
import TaskPriorityUI from '@/components/shared/tasks/TaskPriorityUI';
import TaskStatusUI from '@/components/shared/tasks/TaskStatusUI';
import {
  IconCalendar4,
  IconNotes1,
  IconProfile1,
  IconTicket2,
} from '@/components/svgs/icons';
interface TaskActivityTimelineProps {
  taskId: string;
}

export default function TaskActivityTimeline({
  taskId,
}: TaskActivityTimelineProps) {
  const {
    data: taskActivities,
    isPending: isTaskActivitiesPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useTaskActivities(taskId);

  const activities =
    taskActivities?.pages.flatMap((page) => page?.activities) ?? [];

  if (isTaskActivitiesPending) {
    return (
      <div className="flex justify-center items-center gap-4">
        <LoaderSpinner className="w-6! h-6!" />
        <div className="leading-none whitespace-nowrap">
          Loading activities...
        </div>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="italic text-placeholder text-sm text-center">
        No activity yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {activities.map((activity, index) => (
        <TaskActivityItem
          key={activity?.id}
          activity={activity}
          isLast={index === activities.length - 1}
        />
      ))}

      {hasNextPage && (
        <button
          className="mt-4 text-sm"
          type="button"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}

function TaskActivityItem({
  activity,
  isLast,
}: {
  activity: TaskActivity;
  isLast: boolean;
}) {
  const { data: me } = useMe();

  const activityIcons = {
    CREATED: IconNotes1,
    UPDATED: IconNotes1,
    TITLE_CHANGED: IconNotes1,
    DESCRIPTION_CHANGED: IconNotes1,
    STATUS_CHANGED: IconTicket2,
    PRIORITY_CHANGED: IconTicket2,
    START_DATE_CHANGED: IconNotes1,
    END_DATE_CHANGED: IconCalendar4,
    PRIMARY_COLOR_CHANGED: IconNotes1,
    ASSIGNEE_CHANGED: IconProfile1,
    COMMENT_ADDED: IconNotes1,
    ATTACHMENT_ADDED: IconNotes1,
    ATTACHMENT_REMOVED: IconNotes1,
  };

  const Icon = activityIcons[activity.type];

  const isCurrentUser = me?.id === activity.actor.id;

  const actorFullName = getFullName(
    activity.actor.firstName,
    activity.actor.lastName,
  );

  const actorId = activity.actorId;
  const actor = isCurrentUser ? 'You' : actorFullName;

  return (
    <div className="relative flex gap-4">
      {/* Timeline */}
      <div className="relative flex flex-col items-center">
        {/* Icon */}
        <div
          className={clsx(
            'relative z-10',
            'flex items-center justify-center',
            'min-w-8 w-8 h-8',
            'rounded-full',
            'bg-[#334155]',
          )}
        >
          <Icon />
        </div>
        {/* Connector */}
        {!isLast && (
          <div
            className={clsx(
              'absolute',
              'top-8',
              'bottom-0',
              'left-1/2',
              '-translate-x-1/2',
              'w-px',
              'bg-[#CBD5E1]',
            )}
          />
        )}
      </div>
      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="text-sm">
          <Link className="hover:text-primary" href={`/teams/${actorId}`}>
            <strong>{`@${actor}`}</strong>
          </Link>{' '}
          <RenderActivityMessage activity={activity} />
        </div>
        <div
          className={clsx('text-placeholder text-xs', 'mt-1')}
          title={momentTimezone(activity.createdAt).format(
            'MMM DD, YYYY - hh:mm A',
          )}
        >
          {momentTimezone(activity.createdAt).fromNow()}
        </div>
        {activity.metadata?.comment && (
          <MultiLineField
            classNames={{ root: 'mt-4', input: 'min-h-20! h-20!' }}
            disabled={true}
            value={activity.metadata.comment.content ?? ''}
            onChange={() => {}}
          />
        )}
      </div>
    </div>
  );
}

function RenderActivityMessage({ activity }: { activity: TaskActivity }) {
  const { data: me } = useMe();
  const { data: { users = [] } = {} } = useUsers();

  const timezone = me?.timezone ?? DEFAULT_TIMEZONE;

  const timeFormat = getTimeFormat(me?.timeFormat);

  const from = activity.metadata?.from;
  const to = activity.metadata?.to;

  switch (activity.type) {
    case 'CREATED':
      return <>created this task</>;

    case 'TITLE_CHANGED':
      return (
        <>
          changed the task title from{' '}
          <strong className="text-primary">{from}</strong> to{' '}
          <strong className="text-primary">{to}</strong>
        </>
      );

    case 'DESCRIPTION_CHANGED':
      return (
        <>
          updated the description from{' '}
          <strong className="text-primary">{from}</strong> to{' '}
          <strong className="text-primary">{to}</strong>
        </>
      );

    case 'STATUS_CHANGED':
      return (
        <>
          changed status from <TaskStatusUI status={from as TaskStatus} /> to{' '}
          <TaskStatusUI status={to as TaskStatus} />
        </>
      );

    case 'PRIORITY_CHANGED':
      return (
        <>
          changed priority from{' '}
          <TaskPriorityUI priority={from as TaskPriority} /> to{' '}
          <TaskPriorityUI priority={to as TaskPriority} />
        </>
      );

    case 'START_DATE_CHANGED':
      if (from !== null && to === null) {
        return <>removed the start date.</>;
      }

      if (from === null && to !== null) {
        return (
          <>
            added a start date of{' '}
            {momentTimezone(to)
              .tz(timezone)
              .format(`MMM DD, YYYY ${timeFormat}`)}
            .
          </>
        );
      }

      if (from !== null && to !== null) {
        return (
          <>
            changed the start date from{' '}
            {momentTimezone(from)
              .tz(timezone)
              .format(`MMM DD, YYYY ${timeFormat}`)}{' '}
            to{' '}
            {momentTimezone(to)
              .tz(timezone)
              .format(`MMM DD, YYYY ${timeFormat}`)}
            .
          </>
        );
      }

      return <>added a start date.</>;

    case 'END_DATE_CHANGED':
      if (from !== null && to === null) {
        return <>removed the end date.</>;
      }

      if (from === null && to !== null) {
        return (
          <>
            added an end date of{' '}
            {momentTimezone(to)
              .tz(timezone)
              .format(`MMM DD, YYYY ${timeFormat}`)}
            .
          </>
        );
      }

      if (from !== null && to !== null) {
        return (
          <>
            changed the end date from{' '}
            {momentTimezone(from)
              .tz(timezone)
              .format(`MMM DD, YYYY ${timeFormat}`)}{' '}
            to{' '}
            {momentTimezone(to)
              .tz(timezone)
              .format(`MMM DD, YYYY ${timeFormat}`)}
            .
          </>
        );
      }

      return <>added an end date.</>;

    case 'ASSIGNEE_CHANGED': {
      const assignee = users?.find((userItem) => userItem.id === to);

      if (from !== null && to === null) {
        return <>removed the assignee.</>;
      }

      if (from === null && to !== null) {
        return (
          <>
            assigned to{' '}
            <Link
              className="hover:text-primary"
              href={`/teams/${assignee?.id}`}
            >
              <strong>{`@${assignee?.firstName}`}</strong>
            </Link>
            .
          </>
        );
      }

      if (from !== null && to !== null) {
        return (
          <>
            changed the assignee to{' '}
            <Link
              className="hover:text-primary"
              href={`/teams/${assignee?.id}`}
            >
              <strong>{`@${assignee?.firstName}`}</strong>
            </Link>
            .
          </>
        );
      }

      return <>changed the assignee</>;
    }

    case 'PRIMARY_COLOR_CHANGED':
      if (from === null && to !== null) {
        return (
          <>
            added a task color{' '}
            <span
              className="inline-block align-middle min-w-4 w-4 h-4 rounded-full"
              style={{ backgroundColor: to }}
            />
          </>
        );
      }

      if (from !== null && to !== null) {
        return (
          <>
            changed the task color from{' '}
            <span
              className="inline-block align-middle min-w-4 w-4 h-4 rounded-full"
              style={{ backgroundColor: from }}
            />{' '}
            to{' '}
            <span
              className="inline-block align-middle min-w-4 w-4 h-4 rounded-full"
              style={{ backgroundColor: to }}
            />
          </>
        );
      }

      return <>changed the task color</>;

    case 'COMMENT_ADDED':
      return <>added a comment.</>;

    case 'ATTACHMENT_ADDED':
      return <>added an attachment.</>;

    default:
      return null;
  }
}
