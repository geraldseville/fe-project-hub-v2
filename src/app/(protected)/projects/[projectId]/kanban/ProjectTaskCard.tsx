import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import { useMe } from '@/hooks/queries/useMe';

import { generateColorPalette } from '@/utils/color.utils';
import { DEFAULT_TIMEZONE } from '@/utils/date-time';
import { DEFAULT_EVENT_BG } from '@/utils/task.utils';

import type { Task } from '@/types/task.types';

import TaskAssigneeUI from '@/components/shared/tasks/TaskAssigneeUI';
import TaskPriorityUI from '@/components/shared/tasks/TaskPriorityUI';
import { IconCalendar2 } from '@/components/svgs/icons';

export default function ProjectTaskCard({ task }: { task: Task }) {
  const { data: user } = useMe();

  const timezone = user?.timezone ?? DEFAULT_TIMEZONE;

  const taskColorPalette = generateColorPalette(
    task.primaryColor ?? DEFAULT_EVENT_BG,
  );

  return (
    <div
      className={clsx(
        'text-(--task-primaryForeground-color)',
        'min-h-28',
        'p-3',
        'rounded-lg',
        'bg-(--task-primaryActive-color) hover:bg-(--task-primaryHover-color)',
        'border border-[#908FA0]/20',
      )}
      style={
        {
          '--task-primary-color': taskColorPalette.primary,
          '--task-primaryActive-color': taskColorPalette.primaryActive,
          '--task-primaryForeground-color': taskColorPalette.primaryForeground,
          '--task-primaryHover-color': taskColorPalette.primaryHover,
        } as React.CSSProperties
      }
    >
      <div className="flex justify-between items-center gap-4">
        <TaskPriorityUI priority={task.priority} />
      </div>

      <h4
        className={clsx('font-semibold', 'leading-tight line-clamp-2', 'mt-3')}
      >
        {task.title}
      </h4>

      <p className={clsx('text-sm', 'leading-tight line-clamp-3', 'mt-2')}>
        {task.description}
      </p>

      <div className={clsx('flex justify-between items-center gap-4', 'mt-3')}>
        <TaskAssigneeUI
          classNames={{
            name: 'text-(--task-primaryForeground-color)! text-[12px]',
          }}
          assignee={task.assignee}
        />
        {task.startDate ? (
          <div className={clsx('flex justify-center items-center gap-3')}>
            <IconCalendar2 className="min-w-3.5 w-3.5 h-auto" />
            <div
              className={clsx('text-[11px]', 'leading-none whitespace-nowrap')}
            >
              {momentTimezone(task.startDate).tz(timezone).format('MMM DD')}
            </div>
          </div>
        ) : (
          <i className={clsx('text-[11px]', 'leading-none whitespace-nowrap')}>
            No Schedule
          </i>
        )}
      </div>
    </div>
  );
}
