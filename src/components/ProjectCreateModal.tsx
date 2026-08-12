import { useState } from 'react';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useCreateProject } from '@/hooks/mutations/useCreateProject';
import { useToastStore } from '@/hooks/ui/useToastStore';

import type { ProjectFormInput } from '@/validators/project.validator';
import {
  blankProjectForm,
  validateProjectForm,
} from '@/validators/project.validator';

import Button from '@/components/elements/Button';
import Modal from '@/components/elements/Modal';
import ProjectForm from '@/components/shared/projects/ProjectForm';
import { IconClose1 } from '@/components/svgs/icons';

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectCreateModal({
  isOpen,
  onClose,
}: ProjectCreateModalProps) {
  const router = useRouter();

  const toast = useToastStore();

  const createProject = useCreateProject();

  const isCreatingProjectPending = createProject.isPending;

  const [draftProjectForm, setDraftProjectForm] =
    useState<ProjectFormInput>(blankProjectForm);

  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const validationResult = validateProjectForm(draftProjectForm);

  const errors = hasSubmitted ? validationResult.errors : {};

  const handleCreateProject = async () => {
    setHasSubmitted(true);

    if (!validationResult.success) {
      return;
    }

    try {
      const result = await createProject.mutateAsync({
        title: draftProjectForm.title,
        description: draftProjectForm.description,
        status: draftProjectForm.status,
        urgency: draftProjectForm.urgency,
        primaryColor: draftProjectForm.primaryColor,
        secondaryColor: draftProjectForm.secondaryColor,
        startDate: draftProjectForm.startDate,
        endDate: draftProjectForm.endDate,
        memberIds: draftProjectForm.memberIds,
      });

      const projectId = result.data?.project.id;

      toast.success('project created successfully.');

      setDraftProjectForm(blankProjectForm);

      router.push(`/projects/${projectId}`);
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
    setDraftProjectForm(blankProjectForm);
    setHasSubmitted(false);
    onClose();
  };

  return (
    <Modal
      classNames={{
        root: clsx(isCreatingProjectPending && 'is-disabled opacity-100!'),
        content: 'max-w-5xl! rounded-lg bg-[#1E293B] border border-[#464554]',
      }}
      isOpen={isOpen}
      onClose={handleCancel}
    >
      <>
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
              Create Project
            </div>
            <div
              className={clsx(
                'font-inter',
                'text-[#C7C4D7] leading-tight truncate',
              )}
            >
              Set the core parameters for your new collaborative space.
            </div>
          </div>
          <button
            className={clsx('flex justify-center items-center', 'w-8 h-8')}
            type="button"
            onClick={onClose}
          >
            <IconClose1 className="min-w-3.5 w-3.5 h-3.5" />
          </button>
        </div>
        {/* Body */}
        <div className={clsx('overflow-y-auto', 'flex-1', 'p-6')}>
          <ProjectForm
            draftProjectForm={draftProjectForm}
            setDraftProjectForm={setDraftProjectForm}
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
            text={isCreatingProjectPending ? 'Creating...' : 'Create Project'}
            onClick={handleCreateProject}
          />
        </div>
      </>
    </Modal>
  );
}
