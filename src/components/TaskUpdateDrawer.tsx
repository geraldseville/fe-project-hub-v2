import { useEffect, useState } from 'react';
import Link from 'next/link';

import clsx from 'clsx';

import { useUpdateTask } from '@/hooks/mutations/useUpdateTask';
import { useProject } from '@/hooks/queries/useProject';
import { useUsers } from '@/hooks/queries/useUsers';
import { useDebouncedCallback } from '@/hooks/ui/useDebounceCallback';
import { useToastStore } from '@/hooks/ui/useToastStore';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { TASK_PRIORITIES, TASK_STATUSES } from '@/utils/task.utils';
import { getFullName } from '@/utils/user.utils';

import type {
  TaskPriority,
  TaskStatus,
  UpdateTaskDto,
} from '@/types/task.types';
import type { User } from '@/types/user.types';

import Button from '@/components/elements/Button';
import DateTimePicker from '@/components/elements/DateTimePicker';
import Drawer from '@/components/elements/Drawer';
import EditableField from '@/components/elements/EditableField';
import MultiLineField from '@/components/elements/MultiLineField';
import SingleSelect from '@/components/elements/SingleSelect';
import SkeletonLoading from '@/components/elements/SkeletonLoading';
import ProjectTitleUI from '@/components/shared/projects/ProjectTitleUI';
import TaskActivityTimeline from '@/components/shared/tasks/TaskActivityTimeline';
import TaskPriorityUI from '@/components/shared/tasks/TaskPriorityUI';
import TaskStatusUI from '@/components/shared/tasks/TaskStatusUI';
import { IconClose1, IconExternalLink } from '@/components/svgs/icons';

interface TaskUpdateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  projectId: string;
}

export default function TaskUpdateDrawer({
  isOpen,
  onClose,
  taskId,
  projectId,
}: TaskUpdateDrawerProps) {
  const toast = useToastStore();

  const { data: users } = useUsers();

  const { data: project, isPending: isProjectPending } = useProject(projectId);

  const task = project?.tasks.find((task) => task.id === taskId) ?? null;

  const openTaskDeleteModal = useUiStore((state) => state.openTaskDeleteModal);

  const updateTask = useUpdateTask();

  const [taskStatus, setTaskStatus] = useState<TaskStatus>();

  const [taskPriority, setTaskPriority] = useState<TaskPriority>();

  const [taskStartDate, setTaskStartDate] = useState<string>(
    task?.startDate ?? '',
  );

  const [taskEndDate, setTaskEndDate] = useState<string>(task?.endDate ?? '');

  const [taskAssigneeId, setTaskAssigneeId] = useState<string>(
    task?.assigneeId ?? '',
  );

  const [taskDescription, setTaskDescription] = useState<string>(
    task?.description ?? '',
  );

  const debouncedUpdateTask = useDebouncedCallback((payload: UpdateTaskDto) => {
    if (!task || !project) return;

    updateTask.mutate(
      {
        taskId: task.id,
        projectId: project.id,
        payload,
      },
      {
        onSuccess: () => {
          toast.success('task updated');
        },
        onError: () => {
          toast.failed('failed to update task');
        },
      },
    );
  }, 500);

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    if (!task) return;

    setTaskStatus(task.status);
    setTaskPriority(task.priority);
    setTaskStartDate(task.startDate ?? '');
    setTaskEndDate(task.endDate ?? '');
    setTaskDescription(task.description ?? '');
    setTaskAssigneeId(task.assigneeId ?? '');
  }, [task]);

  return (
    <Drawer
      classNames={{ content: 'flex flex-col overflow-y-hidden' }}
      isOpen={isOpen}
      onClose={handleCancel}
    >
      {/* Head */}
      <div className={clsx('p-6', 'bg-[#334155]', 'border-b border-[#464554]')}>
        <div className="flex justify-between items-center gap-4">
          {isProjectPending ? (
            <SkeletonLoading className="w-full h-6" />
          ) : task ? (
            <h2 className={clsx('font-bold', 'text-[24px]')}>
              <EditableField
                classNames={{ root: 'p-0! hover:border-transparent!' }}
                value={task.title}
                onSave={(e) => {
                  const newValue = e;

                  debouncedUpdateTask({
                    title: newValue,
                  });
                }}
              />
            </h2>
          ) : (
            <i>No Task Foun</i>
          )}
          <button
            className={clsx(
              'flex justify-center items-center self-end',
              'w-8 h-8',
            )}
            type="button"
            onClick={handleCancel}
          >
            <IconClose1 className="min-w-3.5 w-3.5 h-auto" />
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="overflow-y-auto flex-1 h-full p-6">
        {/* Task Details */}
        <div className={clsx('block', 'pb-4')}>
          <div className={clsx('font-medium', 'text-[13px]', 'w-full', 'mb-4')}>
            Basic Details
          </div>
          <div className={clsx('flex flex-col gap-4')}>
            {/* Project */}
            <div className={clsx('flex justify-start items-center', 'py-1')}>
              <div
                className={clsx('font-medium', 'text-[13px]', 'min-w-28 w-28')}
              >
                Project
              </div>
              {isProjectPending ? (
                <SkeletonLoading className="w-full h-4" />
              ) : project ? (
                <div className="flex justify-start items-center gap-2">
                  <div
                    className="min-w-4 w-4 h-4 rounded-md"
                    style={{ backgroundColor: project.primaryColor }}
                  />
                  <ProjectTitleUI title={project.title} />
                  <Link
                    onClick={() => {
                      onClose();
                    }}
                    href={`/projects/${project.id}`}
                  >
                    <IconExternalLink className="min-w-3 w-3 h-auto" />
                  </Link>
                </div>
              ) : (
                <i>No Project Found</i>
              )}
            </div>
            {/* Status */}
            <div className={clsx('flex justify-start items-center', 'py-1')}>
              <div
                className={clsx('font-medium', 'text-[13px]', 'min-w-28 w-28')}
              >
                Status
              </div>
              {isProjectPending ? null : taskStatus ? (
                <SingleSelect
                  classNames={{ optionSelected: 'border-l-transparent!' }}
                  id="taskStatus"
                  placeholder="Select Status..."
                  value={{
                    id: taskStatus,
                    custom: <TaskStatusUI status={taskStatus} />,
                    label: taskStatus.replace('_', ' '),
                    value: taskStatus,
                  }}
                  options={TASK_STATUSES.map((item) => ({
                    id: item,
                    custom: <TaskStatusUI status={item} />,
                    label: item.replace('_', ' '),
                    value: item,
                  }))}
                  onChange={(selected) => {
                    const newValue = selected.value as TaskStatus;

                    setTaskStatus(newValue);

                    debouncedUpdateTask({
                      status: newValue,
                    });
                  }}
                />
              ) : (
                <i>No Status</i>
              )}
            </div>
            {/* Priority */}
            <div className={clsx('flex justify-start items-center', 'py-1')}>
              <div
                className={clsx('font-medium', 'text-[13px]', 'min-w-28 w-28')}
              >
                Priority
              </div>
              {isProjectPending ? null : taskPriority ? (
                <SingleSelect
                  classNames={{ optionSelected: 'border-l-transparent!' }}
                  id="taskPriority"
                  placeholder="Select Status..."
                  value={{
                    id: taskPriority,
                    custom: <TaskPriorityUI priority={taskPriority} />,
                    label: taskPriority.replace('_', ' '),
                    value: taskPriority,
                  }}
                  options={TASK_PRIORITIES.map((item) => ({
                    id: item,
                    custom: <TaskPriorityUI priority={item} />,
                    label: item.replace('_', ' '),
                    value: item,
                  }))}
                  onChange={(selected) => {
                    const newValue = selected.value as TaskPriority;

                    setTaskPriority(newValue);

                    debouncedUpdateTask({
                      priority: newValue,
                    });
                  }}
                />
              ) : (
                <i>No Status</i>
              )}
            </div>
            {/* Start Date */}
            <div className={clsx('flex justify-start items-center', 'py-1')}>
              <div
                className={clsx('font-medium', 'text-[13px]', 'min-w-28 w-28')}
              >
                Start Date
              </div>
              <DateTimePicker
                type="date-time"
                formatDate="MMM DD, YYYY"
                value={taskStartDate}
                onChange={(selected) => {
                  setTaskStartDate(selected.iso);

                  debouncedUpdateTask({
                    startDate: selected.iso,
                  });
                }}
              />
            </div>
            {/* End Date */}
            <div className={clsx('flex justify-start items-center', 'py-1')}>
              <div
                className={clsx('font-medium', 'text-[13px]', 'min-w-28 w-28')}
              >
                End Date
              </div>
              <DateTimePicker
                type="date-time"
                formatDate="MMM DD, YYYY"
                value={taskEndDate}
                onChange={(selected) => {
                  setTaskEndDate(selected.iso);

                  debouncedUpdateTask({
                    endDate: selected.iso,
                  });
                }}
              />
            </div>
            {/* Assignee */}
            <div className={clsx('flex justify-start items-center', 'py-1')}>
              <div
                className={clsx('font-medium', 'text-[13px]', 'min-w-28 w-28')}
              >
                Assignee
              </div>
              {isProjectPending ? null : taskAssigneeId && users ? (
                <SingleSelect
                  id="singleSelect"
                  placeholder="Update Assignee..."
                  searchable
                  value={(() => {
                    const user = users.find(
                      (user) => user.id === taskAssigneeId,
                    );

                    return user
                      ? {
                          id: user.id,
                          image: user.imageUrl,
                          label: getFullName(user.firstName, user.lastName),
                          value: user.id,
                        }
                      : undefined;
                  })()}
                  options={users.map((item: User) => ({
                    id: item.id,
                    image: item.imageUrl,
                    label: getFullName(item.firstName, item.lastName),
                    value: item.id,
                    data: { ...item },
                  }))}
                  onChange={(selected) => {
                    const newValue = selected.id;

                    setTaskAssigneeId(newValue);

                    debouncedUpdateTask({
                      assigneeId: newValue,
                    });
                  }}
                />
              ) : (
                <i>No Status</i>
              )}
            </div>
          </div>
        </div>
        {/* Task Description */}
        <div className={clsx('pt-4 pb-4', 'border-t border-[#464554]')}>
          <div className={clsx('font-medium', 'text-[13px]', 'w-full', 'mb-4')}>
            Descripion
          </div>
          <MultiLineField
            placeholder="No Description"
            value={taskDescription}
            onChange={(e) => {
              const newValue = e.target.value;

              setTaskDescription(newValue);

              debouncedUpdateTask({
                description: newValue,
              });
            }}
          />
        </div>
        {/* Task Activities */}
        <div className={clsx('pt-4 pb-4', 'border-t border-[#464554]')}>
          <div className={clsx('font-medium', 'text-[13px]', 'w-full', 'mb-4')}>
            Activity & Comments
          </div>
          <TaskActivityTimeline taskId={taskId} />
        </div>
        {/* Task Delete */}
        <div className={clsx('pt-4', 'border-t border-[#464554]')}>
          <div className={clsx('font-medium', 'text-[13px]', 'w-full', 'mb-4')}>
            Danger Zone
          </div>
          <Button
            className={clsx(
              'text-[#FFDAD6]!',
              'flex-1 min-w-0! w-full',
              'bg-[#93000A]! hover:bg-[#93000A]/60!',
              'border-[#464554]!',
            )}
            buttonStyle="tertiary"
            type="button"
            text="Delete Task"
            onClick={() => {
              handleCancel();
              openTaskDeleteModal(taskId);
            }}
          />
        </div>
      </div>
    </Drawer>
  );
}
