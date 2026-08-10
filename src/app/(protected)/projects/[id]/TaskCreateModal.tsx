import { useState } from 'react';

import clsx from 'clsx';

import { useCreateTask } from '@/hooks/mutations/useCreateTask';
import { useMe } from '@/hooks/queries/useMe';
import { useUsers } from '@/hooks/queries/useUsers';
import { useToastStore } from '@/hooks/ui/useToastStore';

import {
  TASK_PRIORITIES,
  TASK_PRIORITY_COLORS,
  TASK_STATUS_COLORS,
  TASK_STATUSES,
} from '@/utils/task.utils';
import { getFullName } from '@/utils/user.utils';

import type { TaskFormInput } from '@/validators/task.validator';
import { blankTaskForm } from '@/validators/task.validator';
import { validateTaskForm } from '@/validators/task.validator';

import type { Project } from '@/types/project.types';
import type { TaskPriority, TaskStatus } from '@/types/task.types';
import type { User } from '@/types/user.types';

import Button from '@/components/elements/Button';
import DateTimePicker from '@/components/elements/DateTimePicker';
import ErrorTextField from '@/components/elements/ErrorTextField';
import LabelField from '@/components/elements/LabelField';
import Modal from '@/components/elements/Modal';
import MultiLineField from '@/components/elements/MultiLineField';
import SingleLineField from '@/components/elements/SingleLineField';
import SingleSelect from '@/components/elements/SingleSelect';
import { IconClose1 } from '@/components/svgs/icons';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export default function TaskCreateModal({
  isOpen,
  onClose,
  project,
}: TaskCreateModalProps) {
  const projectId = project.id;

  const { data: me } = useMe();

  const { data: users = [] } = useUsers();

  const toast = useToastStore();

  const createTask = useCreateTask();

  const isCreateTaskPending = createTask.isPending;

  const [draftTaskForm, setDraftTaskForm] = useState<TaskFormInput>({
    ...blankTaskForm,
    projectId: projectId,
  });

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const validationResult = validateTaskForm(draftTaskForm);

  const errors = hasSubmitted ? validationResult.errors : {};

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

      toast.success('project created successfully.');

      setDraftTaskForm({
        ...blankTaskForm,
        projectId: projectId,
      });
    } catch (err) {
      toast.failed(
        err instanceof Error ? err.message : 'failed to create project.',
      );
    } finally {
      setHasSubmitted(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setDraftTaskForm({
      ...blankTaskForm,
      projectId: projectId,
    });
    setHasSubmitted(false);
    onClose();
  };

  return (
    <Modal
      classNames={{
        root: clsx(false && 'is-disabled opacity-100!'),
        content: 'max-w-xl! rounded-lg bg-[#1E293B] border border-[#464554]',
      }}
      isOpen={isOpen}
      onClose={handleCancel}
    >
      {/* Head */}
      <div
        className={clsx(
          'flex justify-between items-center gap-4',
          'shrink-0 h-[85px]',
          'py-4 px-6',
          'rounded-t-[inherit]',
          'bg-[#2D3449]',
        )}
      >
        <div className="flex-1 min-w-0">
          <div
            className={clsx(
              'font-hanken-grotesk font-semibold',
              'text-[#DAE2FD] text-[24px] leading-tight',
            )}
          >
            Create Task
          </div>
          <div
            className={clsx(
              'font-inter',
              'text-[#C7C4D7] leading-tight truncate',
            )}
          >
            {project.title}
          </div>
        </div>
        <button
          className={clsx('flex justify-center items-center', 'w-8 h-8')}
          type="button"
          onClick={handleCancel}
        >
          <IconClose1 className="min-w-3.5 w-3.5 h-3.5" />
        </button>
      </div>
      {/* Body */}
      <div className={clsx('overflow-y-auto', 'flex-1', 'p-6')}>
        <div className="flex flex-wrap gap-6">
          {/* Title */}
          <div className="basis-full">
            <LabelField id="taskTitle" text="Task Title" />
            <SingleLineField
              classNames={{}}
              id="taskTitle"
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
            <LabelField id="taskDescription" text="Task Description" />
            <MultiLineField
              classNames={{}}
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
          <div className="basis-[calc(50%-(24px/2))]">
            <LabelField id="taskStatus" text="Status" />
            <SingleSelect
              id="taskStatus"
              placeholder="Select Status..."
              value={{
                id: draftTaskForm.status,
                color: TASK_STATUS_COLORS[draftTaskForm.status].hex,
                label: draftTaskForm.status.replace('_', ' '),
                value: draftTaskForm.status,
              }}
              options={TASK_STATUSES.map((item) => ({
                id: item,
                color: TASK_STATUS_COLORS[item].hex,
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
          <div className="basis-[calc(50%-(24px/2))]">
            <LabelField id="taskPriority" text="Priority" />
            <SingleSelect
              id="taskPriority"
              placeholder="Select Priority..."
              value={{
                id: draftTaskForm.priority,
                color: TASK_PRIORITY_COLORS[draftTaskForm.priority].hex,
                label: draftTaskForm.priority,
                value: draftTaskForm.priority,
              }}
              options={TASK_PRIORITIES.map((item) => ({
                id: item,
                color: TASK_PRIORITY_COLORS[item].hex,
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
          <div className="basis-[calc(50%-(24px/2))]">
            <LabelField id="taskStartDate" text="Start Date" />
            <DateTimePicker
              type="date-time"
              placeholder="Select Start Date..."
              timezone={me?.timezone}
              value={draftTaskForm.startDate}
              onChange={(selected) => {
                setDraftTaskForm((prev) => ({
                  ...prev,
                  startDate: selected.iso,
                }));
              }}
            />
            <ErrorTextField text={errors.startDate} />
          </div>
          {/* End Date */}
          <div className="basis-[calc(50%-(24px/2))]">
            <LabelField id="taskEndDate" text="End Date" />
            <DateTimePicker
              type="date-time"
              placeholder="Select End Date..."
              timezone={me?.timezone}
              value={draftTaskForm.endDate}
              onChange={(selected) => {
                setDraftTaskForm((prev) => ({
                  ...prev,
                  endDate: selected.iso,
                }));
              }}
            />
            <ErrorTextField text={errors.endDate} />
          </div>
          {/* Assignee */}
          <div className="basis-full">
            <LabelField id="projectAssignee" text="Assignee" />
            <SingleSelect
              id="singleSelect"
              placeholder="Add Assignee..."
              searchable
              value={(() => {
                const user = users.find(
                  (user) => user.id === draftTaskForm.assigneeId,
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
                setDraftTaskForm((prev) => ({
                  ...prev,
                  assigneeId: selected.id,
                }));
              }}
            />
          </div>
        </div>
      </div>
      {/* Foot */}
      <div
        className={clsx(
          'flex justify-end items-center gap-4',
          'shrink-0 h-[75px]',
          'py-4 px-6',
          'rounded-b-[inherit]',
          'bg-[#131B2E]/50',
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
          text={isCreateTaskPending ? 'Creating...' : 'Create Task'}
          onClick={handleCreateTask}
        />
      </div>
    </Modal>
  );
}
