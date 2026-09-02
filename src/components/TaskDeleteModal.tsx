import React, { useState } from 'react';

import clsx from 'clsx';

import { useDeleteTask } from '@/hooks/mutations/useDeleteTask';
import { useTask } from '@/hooks/queries/useTask';
import { useToastStore } from '@/hooks/ui/useToastStore';

import Button from '@/components/elements/Button';
import Modal from '@/components/elements/Modal';
import SingleLineField from '@/components/elements/SingleLineField';
import { IconCaution2, IconClose1 } from '@/components/svgs/icons';

interface TaskDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}

export default function TaskDeleteModal({
  isOpen,
  onClose,
  taskId,
}: TaskDeleteModalProps) {
  const toast = useToastStore();
  const { data: task } = useTask(taskId);
  const deleteTask = useDeleteTask();

  const [confirmTaskName, setConfirmTaskName] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const isConfirmNameValid = confirmTaskName === task?.title;

  const handleDeleteTask = async () => {
    if (!task) return;

    try {
      setIsDeleting(true);

      const taskId = task.id;

      await deleteTask.mutateAsync(taskId);

      toast.success(`task "${task.title}" deleted successfully.`);
    } catch (err) {
      toast.failed(
        err instanceof Error
          ? err.message
          : 'error deleting task. please try again.',
      );
    } finally {
      setConfirmTaskName('');
      setIsDeleting(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setConfirmTaskName('');
    onClose();
  };

  return (
    <Modal
      classNames={{ content: 'max-w-md bg-[#131B2E]' }}
      isOpen={isOpen}
      onClose={handleCancel}
    >
      <>
        {/* Head */}
        <div
          className={clsx(
            'flex justify-between items-start gap-4',
            'pt-8 px-6 pb-4',
            'rounded-t-sm',
            'border-t-8 border-t-[#FFB4AB]',
          )}
        >
          <div
            className={clsx(
              'flex justify-center items-center',
              'min-w-12 w-12 h-12',
              'rounded-lg',
              'bg-[#93000A]/20',
              'border border-[#FFB4AB]/30',
            )}
          >
            <IconCaution2 className="min-w-4.5 w-4.5 h-4.5" />
          </div>
          <div className="flex-1">
            <div
              className={clsx(
                'font-hanken-grotesk font-semibold',
                'text-[#DAE2FD] text-[20px] leading-normal',
              )}
            >
              Delete Task
            </div>
            <div className={clsx('font-inter', 'text-[#C7C4D7] leading-tight')}>
              Warning: This action is destructive and final.
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
        <div className="py-4 px-6">
          <p
            className={clsx(
              'font-inter',
              'text-[#C7C4D7] leading-tight',
              'mb-4 p-4',
              'bg-[#93000A]/20',
              'border-l-4 border-l-[#FFB4AB]',
            )}
          >
            Your about to delete the task.{' '}
            <span className="font-semibold text-[#FFB4AB]">
              This action is irreversible and will permanently remove all
              associated data.
            </span>{' '}
            Please confirm your decision to proceed with the deletion.
          </p>
          <p
            className={clsx(
              'font-jetbrains-mono',
              'text-[#C7C4D7] leading-normal',
              'mb-4',
            )}
          >
            Please type{' '}
            <span
              className={clsx(
                'font-bold',
                'p-1',
                'rounded-sm',
                'bg-[#222A3D]',
                'border border-[#464554]',
              )}
            >
              {task?.title}
            </span>{' '}
            to confirm.
          </p>
          <SingleLineField
            id="task-name-confirmation"
            type="text"
            placeholder={`Type "${task?.title ?? 'title'}" to confirm`}
            value={confirmTaskName}
            onChange={(e) => {
              const newValue = e.target.value;

              setConfirmTaskName(newValue);
            }}
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
            className="flex-1 min-w-0!"
            buttonStyle="secondary"
            type="button"
            text="Cancel"
            onClick={handleCancel}
          />
          <Button
            className={clsx(
              'text-[#FFDAD6]!',
              'flex-1 min-w-0!',
              'bg-[#93000A]! hover:bg-[#93000A]/60!',
              'border-[#464554]!',
            )}
            buttonStyle="primary"
            type="button"
            text={isDeleting ? 'Deleting...' : 'Delete Task'}
            onClick={handleDeleteTask}
            disabled={!isConfirmNameValid || isDeleting}
          />
        </div>
      </>
    </Modal>
  );
}
