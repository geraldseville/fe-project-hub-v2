'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import clsx from 'clsx';

import { useProject } from '@/hooks/queries/useProject';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { getFullName } from '@/utils/user.utils';

import type { Task } from '@/types/task.types';

import Button from '@/components/elements/Button';
import DataTable from '@/components/elements/DataTable';
import SingleSelect from '@/components/elements/SingleSelect';
import ThreeDotActions from '@/components/elements/ThreeDotActions';
import Avatar from '@/components/reusable/Avatar';
import TaskPriorityUI from '@/components/shared/tasks/TaskPriorityUI';
import TaskStatusUI from '@/components/shared/tasks/TaskStatusUI';
import { IconBin1, IconPen2, IconPlus1 } from '@/components/svgs/icons';

export default function ProjectTablePage() {
  const params = useParams();

  const projectId = params.projectId as string;

  const { data: project = null, isPending: isProjectPending } =
    useProject(projectId);

  const tasks = project?.tasks ?? [];

  const openTaskCreateDrawer = useUiStore(
    (state) => state.openTaskCreateDrawer,
  );

  const openTaskUpdateDrawer = useUiStore(
    (state) => state.openTaskUpdateDrawer,
  );

  const openTaskDeleteModal = useUiStore((state) => state.openTaskDeleteModal);

  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [tablePageLimit, setTablePageLimit] = useState<number>(5);

  const totalTasks = tasks.length;
  const totalPages = Math.max(1, Math.ceil(totalTasks / tablePageLimit));
  const activePage = Math.min(currentPage, totalPages);
  const firstTaskIndex = (activePage - 1) * tablePageLimit;
  const lastTaskIndex = Math.min(firstTaskIndex + tablePageLimit, totalTasks);
  const paginatedTasks = tasks.slice(firstTaskIndex, lastTaskIndex);

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
          'flex-1 min-h-0 w-full',
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
          value={paginatedTasks}
          isLoading={isProjectPending}
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
                          openTaskUpdateDrawer(row.id, projectId);
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
        <div
          className={clsx(
            'flex shrink-0 justify-between items-center',
            'p-4',
            'border-t border-t-[#334155]',
          )}
        >
          <div className="flex items-center gap-4">
            <SingleSelect
              classNames={{ root: 'w-40!', trigger: 'h-8!' }}
              id="taskTable"
              placeholder="Pagination by"
              value={{
                id: `page-by-${tablePageLimit}`,
                label: `${tablePageLimit} per page`,
                value: tablePageLimit,
              }}
              options={[
                {
                  id: 'page-by-5',
                  label: '5 per page',
                  value: 5,
                },
                {
                  id: 'page-by-10',
                  label: '10 per page',
                  value: 10,
                },
                {
                  id: 'page-by-20',
                  label: '20 per page',
                  value: 20,
                },
                {
                  id: 'page-by-30',
                  label: '30 per page',
                  value: 30,
                },
                {
                  id: 'page-by-50',
                  label: '50 per page',
                  value: 50,
                },
              ]}
              onChange={(e) => {
                setTablePageLimit(e.value as number);
                setCurrentPage(1);
              }}
            />
            <div>
              Showing {totalTasks === 0 ? 0 : firstTaskIndex + 1} -{' '}
              {lastTaskIndex} of {totalTasks}
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              className={clsx(
                'hover:text-neutral',
                'min-w-20! h-8!',
                'py-1 px-3',
                'hover:bg-[#C0C1FF]',
                'border-[#C0C1FF]',
                activePage === 1 && 'opacity-50!',
              )}
              buttonStyle="outlined"
              type="button"
              text="Prev"
              disabled={activePage === 1}
              onClick={() => {
                setCurrentPage((page) => Math.max(1, page - 1));
              }}
            />
            <Button
              className={clsx(
                'hover:text-neutral',
                'min-w-20! h-8!',
                'py-1 px-3',
                'hover:bg-[#C0C1FF]',
                'border-[#C0C1FF]',
                activePage === totalPages && 'opacity-50!',
              )}
              buttonStyle="outlined"
              type="button"
              text="Next"
              disabled={activePage === totalPages}
              onClick={() => {
                setCurrentPage((page) => Math.min(totalPages, page + 1));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
