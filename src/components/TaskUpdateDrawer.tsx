import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import clsx from 'clsx';

import { useCreateTaskComment } from '@/hooks/mutations/useCreateTaskComment';
import { useUpdateSavedColors } from '@/hooks/mutations/useUpdateSavedColors';
import { useUpdateTask } from '@/hooks/mutations/useUpdateTask';
import { useMe } from '@/hooks/queries/useMe';
import { useProject } from '@/hooks/queries/useProject';
import { useTask } from '@/hooks/queries/useTask';
import { useUsers } from '@/hooks/queries/useUsers';
import { useDebouncedCallback } from '@/hooks/ui/useDebounceCallback';
import { useToastStore } from '@/hooks/ui/useToastStore';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { COLOR_PRESETS } from '@/utils/color.utils';
import { DEFAULT_TIMEZONE } from '@/utils/date-time';
import { PROJECT_DEFAULT_COLOR } from '@/utils/project.utils';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/utils/task.utils';
import { getFullName } from '@/utils/user.utils';

import type {
  TaskPriority,
  TaskStatus,
  UpdateTaskDto,
} from '@/types/task.types';
import type { User } from '@/types/user.types';

import Button from '@/components/elements/Button';
import ColorSelector, {
  type SelectedColor,
} from '@/components/elements/ColorSelector';
import DateTimePicker from '@/components/elements/DateTimePicker';
import Drawer from '@/components/elements/Drawer';
import EditableField from '@/components/elements/EditableField';
import LabelField from '@/components/elements/LabelField';
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
}

export default function TaskUpdateDrawer({
  isOpen,
  onClose,
  taskId,
}: TaskUpdateDrawerProps) {
  const toast = useToastStore();

  const { data: me } = useMe();
  const { data: { users = [] } = {} } = useUsers();
  const { data: task, isPending: isTaskPending } = useTask(taskId);
  const { data: project, isPending: isProjectPending } = useProject(
    task?.projectId ?? '',
  );
  const { mutate: updateSavedColors } = useUpdateSavedColors();

  const updateTask = useUpdateTask();
  const createTaskComment = useCreateTaskComment();
  const openTaskDeleteModal = useUiStore((state) => state.openTaskDeleteModal);

  const [taskStatus, setTaskStatus] = useState<TaskStatus>();
  const [taskPriority, setTaskPriority] = useState<TaskPriority>();
  const [taskStartDate, setTaskStartDate] = useState<string>(
    task?.startDate ?? '',
  );
  const [taskEndDate, setTaskEndDate] = useState<string>(task?.endDate ?? '');
  const [taskAssigneeId, setTaskAssigneeId] = useState<string>(
    task?.assigneeId ?? '',
  );
  const [taskColor, setTaskColor] = useState<string>(task?.primaryColor ?? '');
  const [taskDescription, setTaskDescription] = useState<string>(
    task?.description ?? '',
  );
  const [taskAddComment, setAddTaskComment] = useState<string>('');

  const timezone = me?.timezone ?? DEFAULT_TIMEZONE;

  const savedColors = useMemo(() => me?.savedColors ?? [], [me?.savedColors]);

  const allColors = useMemo(
    () => [...COLOR_PRESETS, ...savedColors],
    [savedColors],
  );

  const debouncedUpdateTask = useDebouncedCallback((payload: UpdateTaskDto) => {
    if (!task) return;

    updateTask.mutate(
      {
        taskId: task.id,
        projectId: task.projectId,
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
  }, 1000);

  const handleAddColor = (color: SelectedColor) => {
    if (savedColors.includes(color.hex)) {
      return;
    }

    const nextColors = [...savedColors, color.hex];

    updateSavedColors(nextColors);
  };

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
    setTaskColor(task.primaryColor ?? '');
    setTaskAssigneeId(task.assigneeId ?? '');
  }, [task]);

  return (
    <Drawer
      classNames={{ content: 'flex flex-col overflow-y-hidden' }}
      isOpen={isOpen}
      onClose={handleCancel}
    >
      {/* Head */}
      <div
        className={clsx(
          'py-4 px-6',
          'bg-[#334155]',
          'border-b border-[#464554]',
        )}
      >
        <div className="flex justify-between items-center gap-4">
          {isTaskPending ? (
            <SkeletonLoading className="w-full h-6" />
          ) : task ? (
            <h2 className={clsx('font-bold', 'text-[20px]')}>
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
            <i className={clsx('font-bold', 'text-[20px]')}>No Task Found</i>
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
              <LabelField className="min-w-28 w-28" text="Project" />
              {isTaskPending ? (
                <SkeletonLoading className="w-full h-4" />
              ) : project ? (
                <div className="flex justify-start items-center gap-2">
                  <div
                    className="min-w-4 w-4 h-4 rounded-md"
                    style={{
                      backgroundColor:
                        project.primaryColor ?? PROJECT_DEFAULT_COLOR,
                    }}
                  />
                  <ProjectTitleUI title={project.title} />
                  <Link
                    title="Go To Project"
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
              <LabelField className="min-w-28 w-28" text="Status" />
              {isProjectPending ? null : taskStatus ? (
                <SingleSelect
                  classNames={{ optionSelected: 'border-l-transparent!' }}
                  id="task-status"
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
              <LabelField className="min-w-28 w-28" text="Priority" />
              {isProjectPending ? null : taskPriority ? (
                <SingleSelect
                  classNames={{ optionSelected: 'border-l-transparent!' }}
                  id="task-priority"
                  placeholder="Select Priority..."
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
              <LabelField className="min-w-28 w-28" text="Start Date" />
              <DateTimePicker
                type="date-time"
                formatDate="MMM DD, YYYY"
                formatTime={me?.timeFormat === 'H12' ? 'hh:mm A' : 'hh:mm'}
                timezone={timezone}
                value={taskStartDate}
                onChange={(selected) => {
                  setTaskStartDate(selected.iso);

                  debouncedUpdateTask({
                    startDate: selected.iso,
                  });
                }}
                onClear={() => {
                  setTaskStartDate('');

                  debouncedUpdateTask({
                    startDate: null,
                  });
                }}
              />
            </div>
            {/* End Date */}
            <div className={clsx('flex justify-start items-center', 'py-1')}>
              <LabelField className="min-w-28 w-28" text="End Date" />
              <DateTimePicker
                type="date-time"
                formatDate="MMM DD, YYYY"
                formatTime={me?.timeFormat === 'H12' ? 'hh:mm A' : 'hh:mm'}
                timezone={timezone}
                value={taskEndDate}
                onChange={(selected) => {
                  setTaskEndDate(selected.iso);

                  debouncedUpdateTask({
                    endDate: selected.iso,
                  });
                }}
                onClear={() => {
                  setTaskEndDate('');

                  debouncedUpdateTask({
                    endDate: null,
                  });
                }}
              />
            </div>
            {/* Assignee */}
            <div className={clsx('flex justify-start items-center', 'py-1')}>
              <LabelField className="min-w-28 w-28" text="Assignee" />
              {isProjectPending ? null : users ? (
                <SingleSelect
                  id="task-assignee"
                  placeholder={
                    taskAssigneeId ? 'Update Assignee...' : 'Add Assignee...'
                  }
                  searchable
                  value={(() => {
                    const user = users.find(
                      (user) => user.id === taskAssigneeId,
                    );

                    return user
                      ? {
                          id: user.id,
                          image: user.imageUrl ?? '',
                          label: getFullName(user.firstName, user.lastName),
                          value: user.id,
                        }
                      : undefined;
                  })()}
                  options={users.map((item: User) => ({
                    id: item.id,
                    image: item.imageUrl ?? '',
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
          <LabelField text="Description" />
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
        {/* Task Color */}
        <div className={clsx('pt-4 pb-4', 'border-t border-[#464554]')}>
          <LabelField text="Color" />
          <ColorSelector
            presetColors={allColors}
            value={taskColor ?? ''}
            onChange={(selected) => {
              const newColor = selected.hex;

              setTaskColor(newColor);

              debouncedUpdateTask({
                primaryColor: newColor,
              });
            }}
            onAddColor={handleAddColor}
          />
        </div>
        {/* Task Activities */}
        <div className={clsx('pt-4 pb-4', 'border-t border-[#464554]')}>
          <LabelField id="task-activity" text="Activity & Comments" />
          <div className="relative mb-4 rounded-lg bg-[#060E20] border border-[#464554]">
            <MultiLineField
              classNames={{
                input: 'min-h-24! border-none!',
              }}
              id="task-activity"
              placeholder="Write a comment..."
              value={taskAddComment}
              onChange={(e) => {
                const newValue = e.target.value;

                setAddTaskComment(newValue);
              }}
            />
            <div className="flex justify-end w-full p-4">
              <Button
                className="min-w-fit! h-6!"
                buttonStyle="primary"
                type="button"
                text="Comment"
                onClick={async () => {
                  await createTaskComment.mutateAsync({
                    taskId,
                    payload: {
                      content: taskAddComment,
                    },
                  });

                  setAddTaskComment('');
                }}
              />
            </div>
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
