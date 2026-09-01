'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import clsx from 'clsx';

import { useUpdateTask } from '@/hooks/mutations/useUpdateTask';
import { useProject } from '@/hooks/queries/useProject';
import { useToastStore } from '@/hooks/ui/useToastStore';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { blankTaskForm } from '@/validators/task.validator';

import type { Task, TaskStatus } from '@/types/task.types';

import KanbanBoard from '@/components/reusable/kanban/KanbanBoard';
import TaskStatusUI from '@/components/shared/tasks/TaskStatusUI';
import { IconPlus1 } from '@/components/svgs/icons';

import ProjectTaskCard from './ProjectTaskCard';

export default function ProjectKanbanPage() {
  const params = useParams();

  const projectId = params.projectId as string;

  const toast = useToastStore();

  const { data: project = null, isPending: isProjectPending } =
    useProject(projectId);
  const updateTask = useUpdateTask();
  const openTaskCreateDrawer = useUiStore(
    (state) => state.openTaskCreateDrawer,
  );
  const openTaskUpdateDrawer = useUiStore(
    (state) => state.openTaskUpdateDrawer,
  );

  const [tasks, setTasks] = useState<Task[]>(() => project?.tasks ?? []);
  const taskSnapshotRef = useRef<string | null>(null);

  useEffect(() => {
    if (!project) return;

    const taskSnapshot = JSON.stringify(project.tasks);
    if (taskSnapshotRef.current === taskSnapshot) return;

    setTasks(project.tasks);
    taskSnapshotRef.current = taskSnapshot;
  }, [project]);

  const columns = [
    {
      id: 'TODO',
      title: 'To Do',
      items: tasks.filter((task) => task.status === 'TODO'),
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      items: tasks.filter((task) => task.status === 'IN_PROGRESS'),
    },
    {
      id: 'IN_REVIEW',
      title: 'In Review',
      items: tasks.filter((task) => task.status === 'IN_REVIEW'),
    },
    {
      id: 'DONE',
      title: 'Done',
      items: tasks.filter((task) => task.status === 'DONE'),
    },
    {
      id: 'ARCHIVE',
      title: 'Archive',
      items: tasks.filter((task) => task.status === 'ARCHIVE'),
    },
  ];

  return (
    <div
      className={clsx(
        'overflow-hidden',
        'flex flex-col',
        'flex-1 min-h-0',
        'px-6',
      )}
    >
      <KanbanBoard<Task>
        classNames={{
          root: 'flex-1 min-h-0! max-h-full! h-full!',
        }}
        columns={columns}
        isLoading={isProjectPending}
        renderColumnTitle={(column) => (
          <TaskStatusUI status={column.id as TaskStatus} />
        )}
        getCardId={(task) => task.id}
        renderCard={(task) => <ProjectTaskCard task={task} />}
        addCardRender={
          <div
            className={clsx(
              'flex justify-center items-center gap-4',
              'min-h-16',
              'rounded-lg',
              'hover:bg-[#1E293B]',
              'border-2 border-dashed',
              'border-transparent group-hover/add-card:border-primary',
            )}
          >
            <div
              className={clsx(
                'flex justify-center items-center',
                'w-8 h-8',
                'rounded-xl',
                'bg-[#171F33]',
              )}
            >
              <IconPlus1 className="min-w-2.5 w-2.5 h-auto" />
            </div>
            <div className="leading-none">Add Task</div>
          </div>
        }
        onCardClick={(task) => {
          if (!project) return;

          openTaskUpdateDrawer(task.id);
        }}
        onAddCardClick={(column) => {
          if (!project) return;

          const preSelectedTaskStatus = column.id;

          openTaskCreateDrawer(projectId, {
            ...blankTaskForm,
            status: preSelectedTaskStatus as TaskStatus,
          });
        }}
        onCardMove={(task, fromColumn, toColumn) => {
          const nextStatus = toColumn.id as TaskStatus;
          const previousStatus = task.status;

          setTasks((currentTasks) =>
            currentTasks.map((currentTask) =>
              currentTask.id === task.id
                ? { ...currentTask, status: nextStatus }
                : currentTask,
            ),
          );

          updateTask.mutate(
            {
              taskId: task.id,
              projectId,
              payload: {
                status: nextStatus,
              },
            },
            {
              onSuccess: () => {
                toast.success(`task moved to ${toColumn.title}`);
              },
              onError: () => {
                setTasks((currentTasks) =>
                  currentTasks.map((currentTask) =>
                    currentTask.id === task.id &&
                    currentTask.status === nextStatus
                      ? { ...currentTask, status: previousStatus }
                      : currentTask,
                  ),
                );
                toast.failed(`failed to move task to ${toColumn.title}`);
              },
            },
          );
        }}
      />
    </div>
  );
}
