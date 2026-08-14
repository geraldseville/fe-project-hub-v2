import React, { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import clsx from 'clsx';

import { useUiStore } from '@/hooks/ui/useUiStore';

import { getFullName } from '@/utils/user.utils';

import type { Project } from '@/types/project.types';
import type { Task } from '@/types/task.types';

import Button from '@/components/elements/Button';
import DataTable from '@/components/elements/DataTable';
import ThreeDotActions from '@/components/elements/ThreeDotActions';
import Avatar from '@/components/reusable/Avatar';
import { IconBin1, IconPen2, IconPlus1 } from '@/components/svgs/icons';

import TaskDeleteModal from './TaskDeleteModal';

interface ProjectTaskTableProps {
  project?: Project | null;
  isProjectPending: boolean;
}

export default function ProjectTaskTable({
  project,
  isProjectPending,
}: ProjectTaskTableProps) {
  const params = useParams();

  const projectId = params.projectId as string;

  const openTaskCreateDrawer = useUiStore(
    (state) => state.openTaskCreateDrawer,
  );

  const openTaskUpdateDrawer = useUiStore(
    (state) => state.openTaskUpdateDrawer,
  );

  const [taskDeleteModal, setTaskDeleteModal] = useState<{
    isOpen: boolean;
    task: Task | null;
  }>({
    isOpen: false,
    task: null,
  });

  const visibleTasks = project?.tasks ?? [];

  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  const handleToggleDelete = (task: Task) => {
    setTaskDeleteModal((prev) => ({
      ...prev,
      isOpen: true,
      task,
    }));
  };

  return (
    <div
      className={clsx(
        'overflow-hidden',
        'w-full',
        'rounded-lg',
        'bg-[#171F33]',
        'border border-[#464554]',
      )}
    >
      <div className={clsx('flex justify-between items-center', 'p-6')}>
        <div
          className={clsx(
            'font-hanken-grotesk font-semibold',
            'text-[#DAE2FD] text-[24px]',
          )}
        >
          Active Task
        </div>
        {project && !isProjectPending && (
          <Button
            buttonStyle="primary"
            icon={<IconPlus1 className="min-w-3.5 w-3.5 h-auto" />}
            text="Add Task"
            onClick={() => {
              openTaskCreateDrawer(project.id);
            }}
          />
        )}
      </div>
      <DataTable
        value={visibleTasks}
        isLoading={isProjectPending}
        emptyMessage={<div className="text-center">No Tasks Found</div>}
        columns={[
          {
            field: 'title',
            header: 'Task Name',
          },
          {
            field: 'status',
            header: 'Status',
          },
          {
            field: 'priority',
            header: 'Priority',
          },
          {
            field: 'assignee',
            header: 'Assignee',
            render: (row: Task) => {
              return (
                <div className={clsx('relative', 'min-w-10 w-10 h-10')}>
                  {row.assignee?.imageUrl ? (
                    <Image
                      className={clsx(
                        'w-full h-full',
                        'object-cover object-top',
                        'rounded-full',
                      )}
                      src={row.assignee.imageUrl}
                      alt={getFullName(
                        row.assignee.firstName,
                        row.assignee.lastName,
                      )}
                      title={getFullName(
                        row.assignee.firstName,
                        row.assignee.lastName,
                      )}
                      width={40}
                      height={40}
                      draggable={false}
                    />
                  ) : (
                    <Avatar initial={row.assignee?.firstName?.charAt(0)} />
                  )}
                  {false && (
                    <div
                      className={clsx(
                        'absolute z-2 bottom-0 right-0',
                        'min-w-2.5 w-2.5 h-2.5',
                        'rounded-full',
                        'bg-[#22C55E]',
                        'border border-white',
                      )}
                    />
                  )}
                </div>
              );
            },
          },
          {
            header: 'Actions',
            thClassName: 'text-center w-[110px]',
            render: (row: Task) => {
              return (
                <ThreeDotActions
                  classNames={{
                    root: '',
                    trigger: 'mx-auto',
                    dropdown: '',
                  }}
                  orientation="Vertical"
                  placement="left-start"
                  actions={[
                    {
                      id: 'action-edit',
                      color: '#C7C4D7',
                      label: 'Edit',
                      icon: <IconPen2 />,
                      onClick: () => {
                        openTaskUpdateDrawer(row.id, projectId);
                      },
                    },
                    {
                      id: 'action-delete',
                      color: '#e90f1e',
                      icon: <IconBin1 />,
                      label: 'Delete',
                      onClick: () => {
                        handleToggleDelete(row);
                      },
                    },
                  ]}
                />
              );
            },
          },
        ]}
        selectionMode="multiple"
        selectedRows={selectedTasks}
        onSelectionChange={(row) => {
          setSelectedTasks(row);
        }}
        getRowId={(project) => project.id}
      />
      {/* Task Delete Modal */}
      <TaskDeleteModal
        isOpen={taskDeleteModal.isOpen}
        onClose={() => {
          setTaskDeleteModal((prev) => ({
            ...prev,
            isOpen: false,
            task: null,
          }));
        }}
        task={taskDeleteModal.task}
      />
    </div>
  );
}
