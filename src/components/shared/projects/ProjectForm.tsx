'use client';

import React, { SetStateAction, useEffect, useMemo, useState } from 'react';

import { useUpdateSavedColors } from '@/hooks/mutations/useUpdateSavedColors';
import { useMe } from '@/hooks/queries/useMe';
import { useUsers } from '@/hooks/queries/useUsers';
import { useDebouncedCallback } from '@/hooks/ui/useDebounceCallback';

import { DEFAULT_TIMEZONE } from '@/utils/date-time';
import {
  PROJECT_COLOR_PRESETS,
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
} from '@/utils/project.utils';
import { getFullName } from '@/utils/user.utils';

import type {
  ProjectFormErrors,
  ProjectFormInput,
} from '@/validators/project.validator';

import type { ProjectPriority, ProjectStatus } from '@/types/project.types';
import type { User } from '@/types/user.types';

import ColorSelector, {
  type SelectedColor,
} from '@/components/elements/ColorSelector';
import DateTimePicker from '@/components/elements/DateTimePicker';
import ErrorTextField from '@/components/elements/ErrorTextField';
import LabelField from '@/components/elements/LabelField';
import MultiLineField from '@/components/elements/MultiLineField';
import MultiSelect from '@/components/elements/MultiSelect';
import SingleLineField from '@/components/elements/SingleLineField';
import SingleSelect from '@/components/elements/SingleSelect';
import ProjectPriorityUI from '@/components/shared/projects/ProjectPriorityUI';
import ProjectStatusUI from '@/components/shared/projects/ProjectStatusUI';

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
  const { data: me } = useMe();
  const { data: { users = [] } = {} } = useUsers();
  const { mutate: updateSavedColors } = useUpdateSavedColors();

  const [savedColors, setSavedColors] = useState<string[]>([]);

  const timezone = me?.timezone ?? DEFAULT_TIMEZONE;

  const allColors = useMemo(
    () => [...PROJECT_COLOR_PRESETS, ...savedColors],
    [savedColors],
  );

  const handleAddColor = (color: SelectedColor) => {
    if (savedColors.includes(color.hex)) {
      return;
    }

    const nextColors = [...savedColors, color.hex];

    setSavedColors(nextColors);
    debounceSavedColors(nextColors);
  };

  const debounceSavedColors = useDebouncedCallback((colors: string[]) => {
    updateSavedColors(colors);
  }, 500);

  useEffect(() => {
    if (me?.savedColors) {
      setSavedColors(me.savedColors);
    }
  }, [me?.savedColors]);

  return (
    <div className="flex flex-wrap gap-6">
      {/* Title */}
      <div className="basis-full">
        <LabelField id="projectTitle" text="Title" />
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
        <LabelField id="projectDescription" text="Description" />
        <MultiLineField
          classNames={{}}
          placeholder="e.g. brief description of your project..."
          value={draftProjectForm.description}
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
      {/* Color */}
      <div className="basis-full">
        <LabelField id="projectColor" text="Color" />
        <ColorSelector
          presetColors={allColors}
          value={draftProjectForm.primaryColor}
          onChange={(selected) => {
            setDraftProjectForm((prev) => ({
              ...prev,
              primaryColor: selected.hex,
            }));
          }}
          onAddColor={handleAddColor}
        />
      </div>
      {/* Status */}
      <div className="basis-[calc(50%-(24px/2))]">
        <LabelField id="projectStatus" text="Status" />
        <SingleSelect
          id="projectStatus"
          placeholder="Select Status..."
          value={{
            id: draftProjectForm.status,
            custom: <ProjectStatusUI status={draftProjectForm.status} />,
            label: draftProjectForm.status,
            value: draftProjectForm.status,
          }}
          options={PROJECT_STATUSES.map((item) => ({
            id: item,
            custom: <ProjectStatusUI status={item} />,
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
      {/* Priority */}
      <div className="basis-[calc(50%-(24px/2))]">
        <LabelField id="projectPriority" text="Priority" />
        <SingleSelect
          id="projectPriority"
          placeholder="Select Priority..."
          value={{
            id: draftProjectForm.priority,
            custom: <ProjectPriorityUI priority={draftProjectForm.priority} />,
            label: draftProjectForm.priority,
            value: draftProjectForm.priority,
          }}
          options={PROJECT_PRIORITIES.map((item) => ({
            id: item,
            custom: <ProjectPriorityUI priority={item} />,
            label: item,
            value: item,
          }))}
          onChange={(selected) => {
            setDraftProjectForm((prev) => ({
              ...prev,
              priority: selected.value as ProjectPriority,
            }));
          }}
        />
        <ErrorTextField text={errors.priority} />
      </div>
      {/* Start Date */}
      <div className="basis-[calc(50%-(24px/2))]">
        <LabelField id="projectStartDate" text="Start Date" />
        <DateTimePicker
          type="date-time"
          placeholder="Select Start Date..."
          formatDate="MMM DD, YYYY"
          formatTime={me?.timeFormat === 'H12' ? 'hh:mm A' : 'hh:mm'}
          timezone={timezone}
          value={draftProjectForm.startDate}
          onChange={(selected) => {
            setDraftProjectForm((prev) => ({
              ...prev,
              startDate: selected.iso,
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
          formatDate="MMM DD, YYYY"
          formatTime={me?.timeFormat === 'H12' ? 'hh:mm A' : 'hh:mm'}
          timezone={timezone}
          value={draftProjectForm.endDate}
          onChange={(selected) => {
            setDraftProjectForm((prev) => ({
              ...prev,
              endDate: selected.iso,
            }));
          }}
        />
        <ErrorTextField text={errors.endDate} />
      </div>
      {/* Members */}
      <div className="w-full">
        <LabelField id="projectMembers" text="Members" />
        <MultiSelect
          id="multiSelect"
          placeholder="Add Members..."
          searchable
          value={users
            .filter((user) => draftProjectForm.memberIds.includes(user.id))
            .map((user) => ({
              id: user.id,
              image: user.imageUrl ?? '',
              label: getFullName(user.firstName, user.lastName),
              value: user.id,
              data: user,
            }))}
          options={users.map((user: User) => ({
            id: user.id,
            image: user.imageUrl ?? '',
            label: getFullName(user.firstName, user.lastName),
            value: user.id,
            data: user,
          }))}
          onChange={(selected) => {
            setDraftProjectForm((prev) => ({
              ...prev,
              memberIds: selected.map((item) => item.data.id),
            }));
          }}
        />
      </div>
    </div>
  );
}
