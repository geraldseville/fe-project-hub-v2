import { useEffect, useState } from 'react';

import clsx from 'clsx';

import { useUpdateProject } from '@/hooks/mutations/useUpdateProject';
import { useToastStore } from '@/hooks/ui/useToastStore';

import {
  blankProjectForm,
  validateProjectForm,
} from '@/validators/project.validator';

import type { Project } from '@/types/project.types';

import Button from '@/components/elements/Button';
import Modal from '@/components/elements/Modal';
import ProjectForm from '@/components/reusable/ProjectForm';
import { IconClose1 } from '@/components/svgs/icons';

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export default function ProjectUpdateModal({
  isOpen,
  onClose,
  project,
}: ProjectEditModalProps) {
  const toast = useToastStore();

  const updateProject = useUpdateProject();

  const [draftProjectForm, setDraftProjectForm] = useState(blankProjectForm);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const validationResult = validateProjectForm(draftProjectForm);

  const errors = hasSubmitted ? validationResult.errors : {};

  const handleUpdateProject = async () => {
    setHasSubmitted(true);

    if (!project || !validationResult.success) {
      return;
    }

    try {
      await updateProject.mutateAsync({
        projectId: project.id,
        payload: {
          title: draftProjectForm.title,
          description: draftProjectForm.description,
          status: draftProjectForm.status,
          urgency: draftProjectForm.urgency,
          primaryColor: draftProjectForm.primaryColor,
          secondaryColor: draftProjectForm.secondaryColor,
          startDate: draftProjectForm.startDate,
          endDate: draftProjectForm.endDate,
          memberIds: draftProjectForm.memberIds,
        },
      });

      toast.success('project updated successfully.');
    } catch (err) {
      toast.failed(
        err instanceof Error ? err.message : 'failed to update project.',
      );
    } finally {
      setDraftProjectForm(blankProjectForm);

      setHasSubmitted(false);

      onClose();
    }
  };

  const handleCancel = () => {
    setDraftProjectForm(blankProjectForm);
    setHasSubmitted(false);
    onClose();
  };

  useEffect(() => {
    if (!project) {
      setDraftProjectForm(blankProjectForm);
      return;
    }

    setDraftProjectForm({
      title: project.title,
      description: project.description ?? '',
      status: project.status,
      urgency: project.urgency,
      startDate: project.startDate ?? '',
      endDate: project.endDate ?? '',
      primaryColor: project.primaryColor ?? '#000000',
      secondaryColor: project.secondaryColor ?? '#000000',
      memberIds: project.members.map((member) => member.id),
    });
  }, [project]);

  return (
    <Modal
      classNames={{
        root: clsx(updateProject.isPending && 'is-disabled opacity-100!'),
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
            'h-[85px]',
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
              Update Project Details
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
        <div
          className={clsx('overflow-auto', 'h-[calc(100%-(85px+75px))]', 'p-6')}
        >
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
            'h-[75px]',
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
            text={updateProject.isPending ? 'Updating...' : 'Update Project'}
            onClick={handleUpdateProject}
          />
        </div>
      </>
    </Modal>
  );
}
