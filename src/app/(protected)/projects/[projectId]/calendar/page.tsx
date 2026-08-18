'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import clsx from 'clsx';
import momentTimezone from 'moment-timezone';

import { useUpdateTask } from '@/hooks/mutations/useUpdateTask';
import { useMe } from '@/hooks/queries/useMe';
import { useProject } from '@/hooks/queries/useProject';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { generateColorPalette } from '@/utils/color.utils';
import { DEFAULT_EVENT_BG } from '@/utils/task.utils';

import { blankTaskForm } from '@/validators/task.validator';

import type { Task } from '@/types/task.types';

import TaskAssigneeUI from '@/components/shared/tasks/TaskAssigneeUI';

import type { CalendarEvent } from './calendar.types';
import Calendix from './Calendix';

import { defaultTimezone } from '@/lib/date-time';

export default function ProjectCalendarPage() {
  const params = useParams();

  const projectId = params.projectId as string;

  const { data: me } = useMe();
  const { data: project, isPending: isProjectPending } = useProject(projectId);
  const updateTask = useUpdateTask();

  const tasks = project?.tasks ?? [];
  const timezone = me?.timezone ?? defaultTimezone;
  const is12hrFormat = false;

  const openTaskCreateDrawer = useUiStore(
    (state) => state.openTaskCreateDrawer,
  );

  const openTaskUpdateDrawer = useUiStore(
    (state) => state.openTaskUpdateDrawer,
  );

  const [events, setEvents] = useState<CalendarEvent<Task>[]>(() => {
    return (
      tasks.map((taskItem) => ({
        id: taskItem.id,
        title: taskItem.title,
        startDate: taskItem.startDate ?? '',
        endDate: taskItem.endDate ?? '',
        data: taskItem,
      })) ?? []
    );
  });

  const handleEventDragEnd = (
    event: CalendarEvent<Task>,
    selection: { startDate: string; endDate: string },
  ) => {
    const previousEvent = event;
    const optimisticEvent: CalendarEvent<Task> = {
      ...event,
      startDate: selection.startDate,
      endDate: selection.endDate,
      data: {
        ...event.data,
        startDate: selection.startDate,
        endDate: selection.endDate,
      },
    };

    setEvents((currentEvents) =>
      currentEvents.map((currentEvent) =>
        currentEvent.id === event.id ? optimisticEvent : currentEvent,
      ),
    );

    updateTask.mutate(
      {
        taskId: event.id,
        projectId,
        payload: {
          startDate: selection.startDate,
          endDate: selection.endDate,
        },
      },
      {
        onError: () => {
          setEvents((currentEvents) =>
            currentEvents.map((currentEvent) =>
              currentEvent.id === event.id ? previousEvent : currentEvent,
            ),
          );
        },
      },
    );
  };

  const initializedProjectIdRef = useRef<string | null>(null);
  const taskSnapshotRef = useRef<string | null>(null);

  useEffect(() => {
    if (!project) return;

    const taskSnapshot = JSON.stringify(project.tasks);

    if (
      initializedProjectIdRef.current === projectId &&
      taskSnapshotRef.current === taskSnapshot
    ) {
      return;
    }

    setEvents(
      project.tasks.map((taskItem) => ({
        id: taskItem.id,
        title: taskItem.title,
        startDate: taskItem.startDate ?? '',
        endDate: taskItem.endDate ?? '',
        data: taskItem,
      })),
    );
    initializedProjectIdRef.current = projectId;
    taskSnapshotRef.current = taskSnapshot;
  }, [project, projectId]);

  return (
    <div className={clsx('flex', 'flex-1 min-h-0', 'px-6 pb-6')}>
      <Calendix<Task>
        isLoading={isProjectPending}
        events={events}
        timezone={timezone}
        is12hrFormat={is12hrFormat}
        viewOptions={['day', 'week', 'month']}
        renderEvent={(event) => {
          const taskColorPalette = generateColorPalette(
            event.data.primaryColor ?? DEFAULT_EVENT_BG,
          );

          return (
            <div
              className={clsx(
                'text-(--task-primaryForeground-color)',
                'relative block',
                'w-full h-full',
                'py-1 px-2',
                'bg-(--task-primaryActive-color) hover:bg-(--task-primaryHover-color)',
              )}
              style={
                {
                  '--task-primary-color': taskColorPalette.primary,
                  '--task-primaryActive-color': taskColorPalette.primaryActive,
                  '--task-primaryForeground-color':
                    taskColorPalette.primaryForeground,
                  '--task-primaryHover-color': taskColorPalette.primaryHover,
                } as React.CSSProperties
              }
            >
              <div className="flex justify-start items-center gap-2">
                <div
                  className={clsx(
                    'font-inter font-semibold',
                    'text-sm truncate',
                  )}
                >
                  {event.title}
                </div>
              </div>
              <div className="text-xs mt-2">
                {momentTimezone(event.startDate)
                  .tz(timezone)
                  .format(is12hrFormat ? 'h:mm A' : 'HH:mm')}
                {' - '}
                {momentTimezone(event.endDate)
                  .tz(timezone)
                  .format(is12hrFormat ? 'h:mm A' : 'HH:mm')}
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <TaskAssigneeUI
                  classNames={{
                    name: 'text-(--task-primaryForeground-color)! text-[12px]',
                  }}
                  assignee={event.data.assignee}
                  displayName="fullName"
                />
              </div>
            </div>
          );
        }}
        onEventClick={(event) => {
          openTaskUpdateDrawer(event.id, projectId);
        }}
        onEventDragEnd={handleEventDragEnd}
        onCreate={() => {
          openTaskCreateDrawer(projectId);
        }}
        onCreateSelect={(selection) => {
          openTaskCreateDrawer(projectId, {
            ...blankTaskForm,
            startDate: selection.startDate,
            endDate: selection.endDate,
          });
        }}
      />
    </div>
  );
}
