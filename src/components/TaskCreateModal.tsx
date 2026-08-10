import { useEffect, useState } from 'react';

import clsx from 'clsx';

import { useCreateTask } from '@/hooks/mutations/useCreateTask';
import { useToastStore } from '@/hooks/ui/useToastStore';

import type { TaskFormInput } from '@/validators/task.validator';
import { blankTaskForm } from '@/validators/task.validator';
import { validateTaskForm } from '@/validators/task.validator';

import type { Project } from '@/types/project.types';

import Button from '@/components/elements/Button';
import Modal from '@/components/elements/Modal';
import TaskForm from '@/components/reusable/TaskForm';
import { IconClose1 } from '@/components/svgs/icons';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export default function TaskCreateModal({
  isOpen,
  onClose,
  project,
}: TaskCreateModalProps) {
  const toast = useToastStore();

  const createTask = useCreateTask();

  const isCreateTaskPending = createTask.isPending;

  const [draftTaskForm, setDraftTaskForm] =
    useState<TaskFormInput>(blankTaskForm);

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

      setDraftTaskForm(blankTaskForm);
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
    setDraftTaskForm(blankTaskForm);
    setHasSubmitted(false);
    onClose();
  };

  useEffect(() => {
    if (!project) return;

    setDraftTaskForm((prev) => ({
      ...prev,
      projectId: project?.id ?? '',
    }));
  }, [project]);

  return (
    <Modal
      classNames={{
        root: clsx(isCreateTaskPending && 'is-disabled opacity-100!'),
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
            {project?.title}
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
        <TaskForm
          draftTaskForm={draftTaskForm}
          setDraftTaskForm={setDraftTaskForm}
          errors={errors}
        />
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
