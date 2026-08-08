import React, { SetStateAction, useState } from 'react';

import clsx from 'clsx';
import { v4 as uuid } from 'uuid';

import { useMe } from '@/hooks/queries/useMe';
// import { blankTaskForm } from '@/lib/taskHelper';
import { useUsers } from '@/hooks/queries/useUsers';

// import { useAuthStore } from '@/store/use-auth-store';
// import { useUsersStore } from '@/store/use-user-store';
// import {
//   PROJECT_STATUS_COLORS,
//   PROJECT_STATUSES,
//   PROJECT_URGENCIES,
//   PROJECT_URGENCY_COLORS,
//   type ProjectFormFields,
//   type ProjectStatus,
//   type ProjectUrgency,
// } from '@/types/project.types';
// import {
//   TASK_PRIORITIES,
//   TASK_PRIORITY_COLORS,
//   type TaskPriority,
// } from '@/types/task.types';
import {
  PROJECT_STATUS_COLORS,
  PROJECT_STATUSES,
  PROJECT_URGENCIES,
  PROJECT_URGENCY_COLORS,
} from '@/utils/project.utils';
import { getFullName } from '@/utils/user.utils';

import type {
  ProjectFormErrors,
  ProjectFormInput,
} from '@/validators/project.validator';

import type { ProjectStatus, ProjectUrgency } from '@/types/project.types';
import { User } from '@/types/user.types';

import Button from '@/components/elements/Button';
import DateTimePicker from '@/components/elements/DateTimePicker';
import EditableField from '@/components/elements/EditableField';
import ErrorTextField from '@/components/elements/ErrorTextField';
import LabelField from '@/components/elements/LabelField';
import MultiLineField from '@/components/elements/MultiLineField';
import MultiSelect from '@/components/elements/MultiSelect';
import SegmentedTab from '@/components/elements/SegmentedTabs';
import SingleLineField from '@/components/elements/SingleLineField';
import SingleSelect from '@/components/elements/SingleSelect';
import { IconBin2, IconPlus1 } from '@/components/svgs/icons';

interface ProjectFormProps {
  draftProjectForm: ProjectFormInput;
  setDraftProjectForm: React.Dispatch<SetStateAction<ProjectFormInput>>;
  errors: ProjectFormErrors;
}

export default function ProjectForm({
  draftProjectForm,
  setDraftProjectForm,
  errors,
}: ProjectFormProps) {
  // const userTimezone = useAuthStore((state) => state.user?.timezone);
  const { data: me } = useMe();

  const { data: users = [] } = useUsers();

  // console.log({ me, users });

  // const assignees = useUsersStore((state) => state.users);

  // const [taskTitleInput, setTaskTitleInput] = useState<string>('');

  // const handleAddTask = () => {
  //   setDraftProjectForm((prev) => ({
  //     ...prev,
  //     tasks: [
  //       ...(prev.tasks ?? []),
  //       {
  //         ...blankTaskForm,
  //         id: uuid(),
  //         title: taskTitleInput,
  //         startDate: prev.startDate,
  //         endDate: prev.startDate,
  //       },
  //     ],
  //   }));

  //   setTaskTitleInput('');
  // };

  return (
    <div className="flex flex-wrap gap-6">
      {/* Title */}
      <div className="basis-full">
        <LabelField id="projectTitle" text="Project Title" />
        <SingleLineField
          classNames={{}}
          id="projectTitle"
          type="text"
          placeholder="e.g. Project Title"
          value={draftProjectForm.title}
          onChange={(e) => {
            const newValue = e.target.value;

            setDraftProjectForm((prev) => ({
              ...prev,
              title: newValue,
            }));
          }}
        />
        <ErrorTextField text={errors.title} />
      </div>
      {/* Description */}
      <div className="basis-full">
        <LabelField id="projectDescription" text="Project Description" />
        <MultiLineField
          classNames={{}}
          placeholder="e.g. brief description of your project..."
          value={draftProjectForm?.description}
          onChange={(e) => {
            const newValue = e.target.value;

            setDraftProjectForm((prev) => ({
              ...prev,
              description: newValue,
            }));
          }}
        />
        <ErrorTextField text={errors.description} />
      </div>
      {/* Status */}
      <div className="basis-[calc(50%-(24px/2))]">
        <LabelField id="projectStatus" text="Status" />
        <SingleSelect
          id="projectStatus"
          placeholder="Select Status..."
          value={{
            id: draftProjectForm.status,
            color: PROJECT_STATUS_COLORS[draftProjectForm.status].hex,
            label: draftProjectForm.status,
            value: draftProjectForm.status,
          }}
          options={PROJECT_STATUSES.map((item) => ({
            id: item,
            color: PROJECT_STATUS_COLORS[item].hex,
            label: item,
            value: item,
          }))}
          onChange={(selected) => {
            setDraftProjectForm((prev) => ({
              ...prev,
              status: selected.value as ProjectStatus,
            }));
          }}
        />
        <ErrorTextField text={errors.status} />
      </div>
      {/* Urgency */}
      <div className="basis-[calc(50%-(24px/2))]">
        <LabelField id="projectUrgency" text="Urgency" />
        <SingleSelect
          id="projectUrgency"
          placeholder="Select Urgency..."
          value={{
            id: draftProjectForm.urgency,
            color: PROJECT_URGENCY_COLORS[draftProjectForm.urgency].hex,
            label: draftProjectForm.urgency,
            value: draftProjectForm.urgency,
          }}
          options={PROJECT_URGENCIES.map((item) => ({
            id: item,
            color: PROJECT_URGENCY_COLORS[item].hex,
            label: item,
            value: item,
          }))}
          onChange={(selected) => {
            setDraftProjectForm((prev) => ({
              ...prev,
              urgency: selected.value as ProjectUrgency,
            }));
          }}
        />
        <ErrorTextField text={errors.urgency} />
      </div>
      {/* Start Date */}
      <div className="basis-[calc(50%-(24px/2))]">
        <LabelField id="projectStartDate" text="Start Date" />
        <DateTimePicker
          type="date-time"
          placeholder="Select Start Date..."
          timezone={me?.timezone}
          value={draftProjectForm.startDate}
          onChange={(selected) => {
            setDraftProjectForm((prev) => ({
              ...prev,
              startDate: selected.iso,
              // tasks: prev.tasks?.map((task) => ({
              //   ...task,
              //   startDate:
              //     !task.startDate || task.startDate === prev.startDate
              //       ? selected.iso
              //       : task.startDate,
              // })),
            }));
          }}
        />
        <ErrorTextField text={errors.startDate} />
      </div>
      {/* End Date */}
      <div className="basis-[calc(50%-(24px/2))]">
        <LabelField id="projectEndDate" text="End Date" />
        <DateTimePicker
          type="date-time"
          placeholder="Select End Date..."
          timezone={me?.timezone}
          value={draftProjectForm.endDate}
          onChange={(selected) => {
            setDraftProjectForm((prev) => ({
              ...prev,
              endDate: selected.iso,
              // tasks: prev.tasks?.map((task) => ({
              //   ...task,
              //   endDate:
              //     !task.endDate || task.endDate === prev.endDate
              //       ? selected.iso
              //       : task.endDate,
              // })),
            }));
          }}
        />
        <ErrorTextField text={errors.endDate} />
      </div>
      {/* Assignees */}
      <div className="w-full">
        <LabelField id="projectAssignees" text="Assignees" />
        <MultiSelect
          id="multiSelect"
          placeholder="Add Assignees..."
          searchable
          value={users
            .filter((u) => draftProjectForm.assigneeIds.includes(u.id))
            .map((u) => ({
              id: u.id,
              image: u.imageUrl,
              label: getFullName(u.firstName, u.lastName),
              value: u.id,
              data: u,
            }))}
          options={users.map((item: User) => ({
            id: item.id,
            image: item.imageUrl,
            label: getFullName(item.firstName, item.lastName),
            value: item.id,
            data: { ...item },
          }))}
          onChange={(selected) => {
            setDraftProjectForm((prev) => ({
              ...prev,
              assigneeIds: [...selected.map((item) => item.data.id)],
            }));
          }}
        />
      </div>
      {/* Task Input 
      <div className="basis-full">
        <LabelField id="taskInput" text="Tasks" />
        <div className="flex justify-between items-center gap-6 h-[47px]">
          <SingleLineField
            classNames={{
              root: 'w-full',
            }}
            type="text"
            placeholder="Task Name..."
            value={taskTitleInput}
            onChange={(e) => {
              const newValue = e.target.value;

              setTaskTitleInput(newValue);
            }}
            onEnter={handleAddTask}
          />
          <Button
            className={clsx(
              'min-w-[70px]! h-[47px]!',
              'rounded-md',
              'bg-[#2D3449]! hover:bg-[#2D3449]/60!',
            )}
            buttonStyle="secondary"
            icon={<IconPlus1 className="min-w-3 w-3 h-3" />}
            text=""
            disabled={!taskTitleInput}
            onClick={handleAddTask}
          />
        </div>
      </div>
      */}
      {/* Task List and Repeater 
      <div className="basis-full">
        <div className="flex flex-col gap-6">
          {draftProjectForm.tasks?.map((taskItem) => (
            <div
              className={clsx(
                'group/task-item',
                'flex justify-between items-center gap-4',
                'h-[47px]',
                'py-2 px-4',
                'rounded-md',
                'bg-[#2D3449]',
              )}
              key={`taskItem-${taskItem.id}`}
            >
              <EditableField
                classNames={{ root: 'p-0! border-transparent!', input: '' }}
                label="Edit Task Title"
                value={taskItem.title}
                onSave={(value) => {
                  setDraftProjectForm((prev) => ({
                    ...prev,
                    tasks: prev.tasks?.map((task) =>
                      task.id === taskItem.id
                        ? { ...task, title: value }
                        : task,
                    ),
                  }));
                }}
              />
              <SegmentedTab
                classNames={{
                  root: 'h-[36px]! ml-auto',
                  tabItem: 'text-[11px]! min-w-20',
                  tabIndicator: 'bg-[#2D3449]!',
                }}
                id={`taskPriority-${taskItem.id}`}
                selected={{
                  id: taskItem.priority,
                  label: taskItem.priority,
                }}
                options={TASK_PRIORITIES.map((item) => ({
                  id: item,
                  className: TASK_PRIORITY_COLORS[item].text,
                  label: item,
                }))}
                onSelect={(selected) => {
                  setDraftProjectForm((prev) => ({
                    ...prev,
                    tasks: prev.tasks?.map((task) =>
                      task.id === taskItem.id
                        ? { ...task, priority: selected.id as TaskPriority }
                        : task,
                    ),
                  }));
                }}
              />
              <button
                className={clsx(
                  'flex justify-center items-center',
                  'min-w-8 w-8 h-8',
                  'invisible group-hover/task-item:visible',
                )}
                type="button"
                onClick={() => {
                  setDraftProjectForm((prev) => ({
                    ...prev,
                    tasks: prev.tasks?.filter(
                      (task) => task.id !== taskItem.id,
                    ),
                  }));
                }}
              >
                <IconBin2 className="min-w-3 w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
      */}
    </div>
  );
}
