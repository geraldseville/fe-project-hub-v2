'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import clsx from 'clsx';

import { useMe } from '@/hooks/queries/useMe';
import { useProject } from '@/hooks/queries/useProject';
import { useUiStore } from '@/hooks/ui/useUiStore';

import type { Task } from '@/types/task.types';

import type { CalendarEvent } from './calendar.types';
import Calendix from './Calendix';

import { defaultTimezone } from '@/lib/date-time';

export default function ProjectCalendarPage() {
  const params = useParams();

  const projectId = params.projectId as string;

  const {
    data: project,
    isPending: isProjectPending,
    isError: isProjecterror,
    refetch: refetchProject,
  } = useProject(projectId);

  const tasks = project?.tasks ?? [];

  const { data: me } = useMe();

  const timezone = me?.timezone ?? defaultTimezone;

  const openTaskCreateDrawer = useUiStore(
    (state) => state.openTaskCreateDrawer,
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

  useEffect(() => {
    if (isProjectPending) return;

    setEvents(
      tasks.map((taskItem) => ({
        id: taskItem.id,
        title: taskItem.title,
        startDate: taskItem.startDate ?? '',
        endDate: taskItem.endDate ?? '',
        data: taskItem,
      })),
    );
  }, [isProjectPending, tasks]);

  return (
    <div className={clsx('flex', 'flex-1 min-h-0', 'px-6 pb-6')}>
      <Calendix<Task>
        events={events}
        timezone={timezone}
        is12hrFormat={true}
        onCreate={() => {
          openTaskCreateDrawer(projectId);
        }}
        onCreateSelect={({ startDate, endDate }) => {
          console.log({ startDate, endDate });
        }}
      />
    </div>
  );
}
