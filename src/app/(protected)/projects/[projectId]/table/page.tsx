'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import clsx from 'clsx';

import { useProject } from '@/hooks/queries/useProject';
import { useProjectTasks } from '@/hooks/queries/useProjectTasks';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { getFullName } from '@/utils/user.utils';

import type { Task } from '@/types/task.types';

import Button from '@/components/elements/Button';
import DataTable from '@/components/elements/DataTable';
import ThreeDotActions from '@/components/elements/ThreeDotActions';
import Avatar from '@/components/reusable/Avatar';
import Pagination from '@/components/reusable/Pagination';
import TaskPriorityUI from '@/components/shared/tasks/TaskPriorityUI';
import TaskStatusUI from '@/components/shared/tasks/TaskStatusUI';
import { IconBin1, IconPen2, IconPlus1 } from '@/components/svgs/icons';

export default function ProjectTablePage() {
  const params = useParams();

  const projectId = params.projectId as string;

  const { data: project = null, isPending: isProjectPending } =
    useProject(projectId);

  const [paginationOptions, setPaginationOptions] = useState({
    page: 1,
    limit: 10,
  });

  const {
    data: { tasks = [], pagination } = {},
    isPending: isProjectTasksPending,
  } = useProjectTasks(projectId, { ...paginationOptions });

  const openTaskCreateDrawer = useUiStore(
    (state) => state.openTaskCreateDrawer,
  );

  const openTaskUpdateDrawer = useUiStore(
    (state) => state.openTaskUpdateDrawer,
  );

  const openTaskDeleteModal = useUiStore((state) => state.openTaskDeleteModal);

  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  return (
    <div
      className={clsx(
        'overflow-hidden',
        'flex flex-col',
        'flex-1 min-h-0',
        'px-6 pb-6',
      )}
    >
      <div
        className={clsx(
          'flex flex-col',
          'overflow-hidden',
          'flex-1 w-full min-h-0',
          'rounded-lg',
          'bg-[#171F33]',
          'border border-[#464554]',
        )}
      >
        <div
          className={clsx('flex shrink-0 justify-between items-center', 'p-6')}
        >
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
          classNames={{
            root: 'flex-1 min-h-0',
          }}
          value={tasks}
          isLoading={isProjectTasksPending}
          emptyMessage={<div className="text-center">No Tasks Found</div>}
          columns={[
            {
              field: 'title',
              header: 'Task Name',
              sortable: true,
            },
            {
              field: 'status',
              header: 'Status',
              sortable: true,
              render: (row: Task) => {
                return <TaskStatusUI status={row.status} />;
              },
            },
            {
              field: 'priority',
              header: 'Priority',
              sortable: true,
              render: (row: Task) => {
                return <TaskPriorityUI priority={row.priority} />;
              },
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
                          openTaskUpdateDrawer(row.id);
                        },
                      },
                      {
                        id: 'action-delete',
                        color: '#e90f1e',
                        icon: <IconBin1 />,
                        label: 'Delete',
                        onClick: () => {
                          openTaskDeleteModal(row.id);
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
        {pagination && (
          <Pagination
            pagination={pagination}
            pageSizeOptions={[10, 20, 30, 50]}
            onPageChange={(page) => {
              setPaginationOptions((prev) => ({
                ...prev,
                page,
              }));
            }}
            onLimitChange={(limit) => {
              setPaginationOptions({
                page: 1,
                limit,
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
