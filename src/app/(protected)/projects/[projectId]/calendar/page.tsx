'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import clsx from 'clsx';

import { useMe } from '@/hooks/queries/useMe';
import { useProject } from '@/hooks/queries/useProject';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { blankTaskForm } from '@/validators/task.validator';

import type { Task } from '@/types/task.types';

import type { CalendarEvent } from './calendar.types';
import Calendix from './Calendix';

import { defaultTimezone } from '@/lib/date-time';

export default function ProjectCalendarPage() {
  const params = useParams();

  const projectId = params.projectId as string;

  const { data: project } = useProject(projectId);

  const tasks = project?.tasks ?? [];

  const { data: me } = useMe();

  const timezone = me?.timezone ?? defaultTimezone;

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

  const initializedProjectIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!project || initializedProjectIdRef.current === projectId) return;

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
  }, [project, projectId]);

  const handleEventDragEnd = (
    event: CalendarEvent<Task>,
    selection: { startDate: string; endDate: string },
  ) => {
    setEvents((currentEvents) =>
      currentEvents.map((currentEvent) =>
        currentEvent.id === event.id
          ? {
              ...currentEvent,
              startDate: selection.startDate,
              endDate: selection.endDate,
            }
          : currentEvent,
      ),
    );
  };

  return (
    <div className={clsx('flex', 'flex-1 min-h-0', 'px-6 pb-6')}>
      <Calendix<Task>
        events={events}
        timezone={timezone}
        is12hrFormat={true}
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
