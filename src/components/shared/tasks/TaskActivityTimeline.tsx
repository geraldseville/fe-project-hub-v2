import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import { useTaskActivities } from '@/hooks/queries/useTaskActivities';

import { getFullName } from '@/utils/user.utils';

import type { TaskActivity } from '@/types/task-activity.types';

import LoaderSpinner from '@/components/elements/LoaderSpinner';
import {
  IconCalendar4,
  IconNotes1,
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
        Loading activities...
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="italic text-sm text-placeholder text-center">
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

interface TaskActivityItemProps {
  activity: TaskActivity;
  isLast: boolean;
}

function TaskActivityItem({ activity, isLast }: TaskActivityItemProps) {
  const activityIcons = {
    CREATED: IconNotes1,
    UPDATED: IconNotes1,
    TITLE_CHANGED: IconNotes1,
    DESCRIPTION_CHANGED: IconNotes1,
    STATUS_CHANGED: IconTicket2,
    PRIORITY_CHANGED: IconTicket2,
    START_DATE_CHANGED: IconNotes1,
    END_DATE_CHANGED: IconCalendar4,
    ASSIGNEE_CHANGED: IconCalendar4,
    COMMENT_ADDED: IconNotes1,
    ATTACHMENT_ADDED: IconNotes1,
    ATTACHMENT_REMOVED: IconNotes1,
  };

  const Icon = activityIcons[activity.type];

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
      <div className="pb-6">
        <div className="text-sm">{renderActivityMessage(activity)}</div>

        <div className="mt-1 text-xs text-placeholder">
          {momentTimezone(activity.createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
}

function renderActivityMessage(activity: TaskActivity) {
  const actor = getFullName(activity.actor.firstName, activity.actor.lastName);

  switch (activity.type) {
    case 'CREATED':
      return (
        <>
          <strong>{actor}</strong> created this task.
        </>
      );

    case 'TITLE_CHANGED':
      return (
        <>
          <strong>{actor}</strong> changed the task title.
        </>
      );

    case 'DESCRIPTION_CHANGED':
      return (
        <>
          <strong>{actor}</strong> updated the description.
        </>
      );

    case 'STATUS_CHANGED':
      return (
        <>
          <strong>{actor}</strong> changed status from{' '}
          <strong>{activity.metadata.from?.replace('_', ' ')}</strong> to{' '}
          <strong>{activity.metadata.to?.replace('_', ' ')}</strong>.
        </>
      );

    case 'PRIORITY_CHANGED':
      return (
        <>
          <strong>{actor}</strong> changed priority from{' '}
          <strong>{activity.metadata.from?.replace('_', ' ')}</strong> to{' '}
          <strong>{activity.metadata.to?.replace('_', ' ')}</strong>.
        </>
      );

    case 'START_DATE_CHANGED':
      return (
        <>
          <strong>{actor}</strong> changed the start date.
        </>
      );

    case 'END_DATE_CHANGED':
      return (
        <>
          <strong>{actor}</strong> changed the end date.
        </>
      );

    case 'ASSIGNEE_CHANGED':
      return (
        <>
          <strong>{actor}</strong> changed the assignee.
        </>
      );

    case 'COMMENT_ADDED':
      return (
        <>
          <strong>{actor}</strong> added a comment.
        </>
      );

    case 'ATTACHMENT_ADDED':
      return (
        <>
          <strong>{actor}</strong> added an attachment.
        </>
      );

    default:
      return null;
  }
}
