import { SetStateAction } from 'react';

import { useMe } from '@/hooks/queries/useMe';
import { useUsers } from '@/hooks/queries/useUsers';

import {
  TASK_PRIORITIES,
  TASK_PRIORITY_COLORS,
  TASK_STATUS_COLORS,
  TASK_STATUSES,
} from '@/utils/task.utils';
import { getFullName } from '@/utils/user.utils';

import type {
  TaskFormErrors,
  TaskFormInput,
} from '@/validators/task.validator';

import type { TaskPriority, TaskStatus } from '@/types/task.types';
import type { User } from '@/types/user.types';

import DateTimePicker from '@/components/elements/DateTimePicker';
import ErrorTextField from '@/components/elements/ErrorTextField';
import LabelField from '@/components/elements/LabelField';
import MultiLineField from '@/components/elements/MultiLineField';
import SingleLineField from '@/components/elements/SingleLineField';
import SingleSelect from '@/components/elements/SingleSelect';

interface TaskFormProps {
  draftTaskForm: TaskFormInput;
  setDraftTaskForm: React.Dispatch<SetStateAction<TaskFormInput>>;
  errors: TaskFormErrors;
}

export default function TaskForm({
  draftTaskForm,
  setDraftTaskForm,
  errors,
}: TaskFormProps) {
  const { data: me } = useMe();

  const { data: users = [] } = useUsers();

  return (
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
        <ErrorTextField text={errors.assigneeId} />
      </div>
    </div>
  );
}
