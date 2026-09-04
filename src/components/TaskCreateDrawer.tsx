import { useEffect, useMemo, useState } from 'react';

import clsx from 'clsx';

import { useCreateTask } from '@/hooks/mutations/useCreateTask';
import { useUpdateSavedColors } from '@/hooks/mutations/useUpdateSavedColors';
import { useMe } from '@/hooks/queries/useMe';
import { useUsers } from '@/hooks/queries/useUsers';
import { useToastStore } from '@/hooks/ui/useToastStore';

import { COLOR_PRESETS } from '@/utils/color.utils';
import { DEFAULT_TIMEZONE } from '@/utils/date-time';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/utils/task.utils';
import { getFullName } from '@/utils/user.utils';

import type { TaskFormInput } from '@/validators/task.validator';
import { blankTaskForm } from '@/validators/task.validator';
import { validateTaskForm } from '@/validators/task.validator';

import type {
  CreateTaskDto,
  TaskPriority,
  TaskStatus,
} from '@/types/task.types';
import type { User } from '@/types/user.types';

import Button from '@/components/elements/Button';
import ColorSelector, {
  type SelectedColor,
} from '@/components/elements/ColorSelector';
import DateTimePicker from '@/components/elements/DateTimePicker';
import Drawer from '@/components/elements/Drawer';
import ErrorTextField from '@/components/elements/ErrorTextField';
import LabelField from '@/components/elements/LabelField';
import MultiLineField from '@/components/elements/MultiLineField';
import SingleLineField from '@/components/elements/SingleLineField';
import SingleSelect from '@/components/elements/SingleSelect';
import TaskPriorityUI from '@/components/shared/tasks/TaskPriorityUI';
import TaskStatusUI from '@/components/shared/tasks/TaskStatusUI';
import { IconClose1 } from '@/components/svgs/icons';

interface TaskCreateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  initialTask: CreateTaskDto | null;
}

export default function TaskCreateDrawer({
  isOpen,
  onClose,
  projectId,
  initialTask,
}: TaskCreateDrawerProps) {
  const toast = useToastStore();

  const { data: me } = useMe();
  const { data: { users = [] } = {} } = useUsers();

  const createTask = useCreateTask();
  const { mutate: updateSavedColors } = useUpdateSavedColors();

  const [draftTaskForm, setDraftTaskForm] = useState<TaskFormInput>({
    ...blankTaskForm,
    ...(initialTask ?? {}),
    projectId,
  });
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const timezone = me?.timezone ?? DEFAULT_TIMEZONE;
  const validationResult = validateTaskForm(draftTaskForm);
  const errors = hasSubmitted ? validationResult.errors : {};

  const savedColors = useMemo(() => me?.savedColors ?? [], [me?.savedColors]);

  const allColors = useMemo(
    () => [...COLOR_PRESETS, ...savedColors],
    [savedColors],
  );

  const handleAddColor = (color: SelectedColor) => {
    if (savedColors.includes(color.hex)) {
      return;
    }

    const nextColors = [...savedColors, color.hex];

    updateSavedColors(nextColors);
  };

  const handleCreateTask = async () => {
    setHasSubmitted(true);

    if (!validationResult.success) {
      return;
    }

    try {
      await createTask.mutateAsync({
        title: draftTaskForm.title,
        description: draftTaskForm.description,
        status: draftTaskForm.status,
        priority: draftTaskForm.priority,
        startDate: draftTaskForm.startDate,
        endDate: draftTaskForm.endDate,
        projectId: draftTaskForm.projectId,
        assigneeId: draftTaskForm.assigneeId,
      });

      toast.success('successfully created task.');

      setDraftTaskForm(blankTaskForm);
    } catch (err) {
      toast.failed(
        err instanceof Error ? err.message : 'failed to create task.',
      );
    } finally {
      setHasSubmitted(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setDraftTaskForm(blankTaskForm);
    setHasSubmitted(false);
    onClose();
  };

  useEffect(() => {
    if (!projectId) return;

    setDraftTaskForm((prev) => ({
      ...prev,
      ...(initialTask ?? {}),
      projectId,
    }));
  }, [projectId, initialTask]);

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
          <h2 className={clsx('font-bold', 'text-[20px]')}>Create Task</h2>
          <button
            className={clsx('flex justify-center items-center', 'w-8 h-8')}
            type="button"
            onClick={handleCancel}
          >
            <IconClose1 className="min-w-3.5 w-3.5 h-auto" />
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="overflow-y-auto flex-1 h-full p-6">
        <div className="flex flex-wrap gap-6">
          {/* Title */}
          <div className="basis-full">
            <LabelField id="task-title" text="Task Title" />
            <SingleLineField
              classNames={{}}
              id="task-title"
              type="text"
              placeholder="e.g. Task Title"
              value={draftTaskForm.title}
              onChange={(e) => {
                const newValue = e.target.value;

                setDraftTaskForm((prev) => ({
                  ...prev,
                  title: newValue,
                }));
              }}
            />
            <ErrorTextField text={errors.title} />
          </div>
          {/* Description */}
          <div className="basis-full">
            <LabelField id="task-description" text="Task Description" />
            <MultiLineField
              id="task-description"
              placeholder="e.g. brief description of your task..."
              value={draftTaskForm?.description ?? ''}
              onChange={(e) => {
                const newValue = e.target.value;

                setDraftTaskForm((prev) => ({
                  ...prev,
                  description: newValue,
                }));
              }}
            />
            <ErrorTextField text={errors.description} />
          </div>
          {/* Status */}
          <div className="basis-full">
            <LabelField id="task-status" text="Status" />
            <SingleSelect
              id="task-status"
              placeholder="Select Status..."
              value={{
                id: draftTaskForm.status,
                custom: <TaskStatusUI status={draftTaskForm.status} />,
                label: draftTaskForm.status.replace('_', ' '),
                value: draftTaskForm.status,
              }}
              options={TASK_STATUSES.map((item) => ({
                id: item,
                custom: <TaskStatusUI status={item} />,
                label: item.replace('_', ' '),
                value: item,
              }))}
              onChange={(selected) => {
                setDraftTaskForm((prev) => ({
                  ...prev,
                  status: selected.value as TaskStatus,
                }));
              }}
            />
            <ErrorTextField text={errors.status} />
          </div>
          {/* Priority */}
          <div className="basis-full">
            <LabelField id="task-priority" text="Priority" />
            <SingleSelect
              id="task-priority"
              placeholder="Select Priority..."
              value={{
                id: draftTaskForm.priority,
                custom: <TaskPriorityUI priority={draftTaskForm.priority} />,
                label: draftTaskForm.priority,
                value: draftTaskForm.priority,
              }}
              options={TASK_PRIORITIES.map((item) => ({
                id: item,
                custom: <TaskPriorityUI priority={item} />,
                label: item,
                value: item,
              }))}
              onChange={(selected) => {
                setDraftTaskForm((prev) => ({
                  ...prev,
                  priority: selected.value as TaskPriority,
                }));
              }}
            />
            <ErrorTextField text={errors.priority} />
          </div>
          {/* Start Date */}
          <div className="basis-full">
            <LabelField id="task-start-date" text="Start Date" />
            <DateTimePicker
              id="task-start-date"
              type="date-time"
              formatDate="MMM DD, YYYY"
              placeholder="Select Start Date..."
              timezone={timezone}
              value={draftTaskForm.startDate}
              onChange={(selected) => {
                setDraftTaskForm((prev) => ({
                  ...prev,
                  startDate: selected.iso,
                }));
              }}
              onClear={() => {
                setDraftTaskForm((prev) => ({
                  ...prev,
                  startDate: null,
                }));
              }}
            />
            <ErrorTextField text={errors.startDate} />
          </div>
          {/* End Date */}
          <div className="basis-full">
            <LabelField id="task-end-date" text="End Date" />
            <DateTimePicker
              id="task-end-date"
              type="date-time"
              formatDate="MMM DD, YYYY"
              placeholder="Select End Date..."
              timezone={timezone}
              value={draftTaskForm.endDate}
              onChange={(selected) => {
                setDraftTaskForm((prev) => ({
                  ...prev,
                  endDate: selected.iso,
                }));
              }}
              onClear={() => {
                setDraftTaskForm((prev) => ({
                  ...prev,
                  endDate: null,
                }));
              }}
            />
            <ErrorTextField text={errors.endDate} />
          </div>
          {/* Color */}
          <div className="basis-full">
            <LabelField id="task-color" text="Color" />
            <ColorSelector
              presetColors={allColors}
              value={draftTaskForm.primaryColor ?? ''}
              onChange={(selected) => {
                setDraftTaskForm((prev) => ({
                  ...prev,
                  primaryColor: selected.hex,
                }));
              }}
              onAddColor={handleAddColor}
            />
            <ErrorTextField text={errors.primaryColor} />
          </div>
          {/* Assignee */}
          <div className="basis-full">
            <LabelField id="task-assignee" text="Assignee" />
            <SingleSelect
              id="task-assignee"
              placeholder="Add Assignee..."
              searchable
              value={(() => {
                const user = users.find(
                  (user) => user.id === draftTaskForm.assigneeId,
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
                setDraftTaskForm((prev) => ({
                  ...prev,
                  assigneeId: selected.id,
                }));
              }}
            />
            <ErrorTextField text={errors.assigneeId} />
          </div>
        </div>
      </div>
      {/* Foot */}
      <div
        className={clsx(
          'flex justify-end items-center gap-4',
          'shrink-0 h-[92px]',
          'p-6',
          'bg-[#131B2E]/50',
          'border-t border-[#464554]',
        )}
      >
        <Button
          className=""
          buttonStyle="secondary"
          type="button"
          text="Cancel"
          onClick={handleCancel}
        />
        <Button
          className=""
          buttonStyle="primary"
          type="button"
          text={createTask.isPending ? 'Creating...' : 'Create Task'}
          onClick={handleCreateTask}
        />
      </div>
    </Drawer>
  );
}
