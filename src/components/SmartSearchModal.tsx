import { useState } from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import { useProjects } from '@/hooks/queries/useProjects';
import { useTasks } from '@/hooks/queries/useTasks';
import { useUsers } from '@/hooks/queries/useUsers';

import { toCapitalize } from '@/utils/string.utils';
import { getFullName } from '@/utils/user.utils';

import type { Project } from '@/types/project.types';
import type { Task } from '@/types/task.types';
import type { User } from '@/types/user.types';

import LabelField from '@/components/elements/LabelField';
import Modal from '@/components/elements/Modal';
import SingleLineField from '@/components/elements/SingleLineField';
import Avatar from '@/components/reusable/Avatar';
import ProjectStatusUI from '@/components/shared/projects/ProjectStatusUI';
import TaskPriorityUI from '@/components/shared/tasks/TaskPriorityUI';
import TeamRoleUI from '@/components/shared/teams/TeamRoleUI';
import {
  IconArrowDown,
  IconArrowUp,
  IconFolder1,
  IconSearch,
  IconTask1,
} from '@/components/svgs/icons';

type SearchFilter = 'all' | 'users' | 'projects' | 'tasks';

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartSearchModal({
  isOpen,
  onClose,
}: SmartSearchModalProps) {
  const { data: users } = useUsers();
  const { data: projects } = useProjects();
  const { data: tasks } = useTasks();

  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<SearchFilter>('all');

  const handleCancel = () => {
    setSearch('');
    onClose();
  };

  return (
    <Modal
      classNames={{
        root: clsx(
          'items-start py-[10dvh]',
          // isCreatingProjectPending && 'is-disabled opacity-100!'
        ),
        content: clsx(
          'max-w-3xl!',
          !search
            ? 'max-h-15! min-h-15! h-15!'
            : 'max-h-[80dvh]! min-h-[80dvh]! h-[80dvh]!',
          'transition-all duration-200',
          'rounded-lg',
          'border border-[#464554]',
        ),
      }}
      isOpen={isOpen}
      onClose={handleCancel}
    >
      {/* Head */}
      <div className="min-h-15 h-15">
        <div className="relative">
          <SingleLineField
            classNames={{
              root: 'h-15!',
              input: 'pr-20 rounded-b-none border-none!',
            }}
            type="search"
            placeholder="Search anything..."
            icon={<IconSearch className="min-w-4 w-4 h-4" />}
            value={search}
            onChange={(e) => {
              const newValue = e.target.value;

              setSearch(newValue);
            }}
          />
          <div
            className={clsx(
              'font-jetbrains-mono font-bold',
              'leading-none',
              'absolute top-1/2 right-4 -translate-y-1/2',
              'py-1 px-3',
              'rounded-md',
              'border border-[#334155]',
            )}
          >
            ESC
          </div>
        </div>
      </div>
      {/* Body */}
      <div
        className={clsx(
          'overflow-hidden',
          'flex flex-col',
          !search ? 'h-0' : 'h-full',
          'transition-all duration-200',
          'bg-[#0F172A]',
        )}
      >
        {/* Filters */}
        <div
          className={clsx(
            'flex justify-start items-center gap-2',
            'py-4 px-6',
            'border-y border-y-[#1E293B]',
          )}
        >
          {['all', 'users', 'projects', 'tasks'].map((filterItem) => (
            <button
              className={clsx(
                'font-medium',
                'text-[#94A3B8]',
                'leading-none',
                'block',
                'h-7',
                'py-1 px-3',
                'rounded-lg',
                'transition-all duration-200',
                'border border-[#334155]',
                filterItem === filter && 'text-[#F8FAFC] bg-[#7C3AED]',
              )}
              key={`filter-${filterItem}`}
              type="button"
              aria-label={`Filter by ${toCapitalize(filterItem)}`}
              onClick={() => {
                setFilter(filterItem as SearchFilter);
              }}
            >
              {toCapitalize(filterItem)}
            </button>
          ))}
        </div>
        {/* Results */}
        <div className={clsx('overflow-y-auto', 'flex-1', 'py-4 px-6')}>
          {/* Users Result */}
          <div className="w-full">
            <LabelField text="TEAM" />
            <div className="flex flex-col">
              {users?.map((userItem) => (
                <button
                  className={clsx(
                    'flex justify-start items-center gap-4',
                    'p-3',
                  )}
                  key={userItem.id}
                  type="button"
                  aria-label="Click User"
                >
                  <div className="min-w-10 w-10 h-10 rounded-full">
                    {userItem.imageUrl ? (
                      <Image
                        className={clsx(
                          'w-full h-full',
                          'object-cover object-center',
                          'rounded-full',
                        )}
                        src={userItem.imageUrl}
                        alt={getFullName(userItem.firstName, userItem.lastName)}
                        title={getFullName(
                          userItem.firstName,
                          userItem.lastName,
                        )}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <Avatar initial={userItem.firstName?.charAt(0)} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={clsx(
                        'font-semibold',
                        'text-[#F8FAFC] text-left leading-normal',
                        'truncate',
                      )}
                    >
                      {getFullName(userItem.firstName, userItem.lastName)}
                    </div>
                    <div
                      className={clsx('text-[#94A3B8] text-[12px] text-left')}
                    >
                      {userItem.email}
                    </div>
                  </div>
                  <TeamRoleUI role={userItem.role} />
                </button>
              ))}
            </div>
          </div>
          {/* Projects Result */}
          <div className="w-full">
            <LabelField text="PROJECTS" />
            <div className="flex flex-col">
              {projects?.map((projectItem) => (
                <button
                  className={clsx(
                    'flex justify-start items-center gap-4',
                    'p-3',
                  )}
                  key={projectItem.id}
                  type="button"
                  aria-label="Click User"
                >
                  <div
                    className={clsx(
                      'flex justify-center items-center',
                      'min-w-10 w-10 h-10',
                      'rounded-[10px]',
                      'bg-[#1E293B]/50',
                      'border border-[#334155]',
                    )}
                    style={
                      {
                        '--search-project-color': projectItem.primaryColor,
                      } as React.CSSProperties
                    }
                  >
                    <IconFolder1
                      className={clsx(
                        'text-(--search-project-color)',
                        'min-w-4 w-4 h-auto',
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-start items-center gap-2">
                      <div
                        className={clsx(
                          'font-semibold',
                          'text-[#F8FAFC] text-left leading-normal',
                          'truncate',
                        )}
                      >
                        {projectItem.title}
                      </div>
                      <ProjectStatusUI status={projectItem.status} />
                    </div>
                    <div
                      className={clsx(
                        'text-[#94A3B8] text-[12px] text-left',
                        'line-clamp-1',
                      )}
                    >
                      {projectItem.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Tasks Result */}
          <div className="w-full">
            <LabelField text="TASKS" />
            <div className="flex flex-col">
              {tasks?.map((taskItem) => (
                <button
                  className={clsx(
                    'flex justify-start items-center gap-4',
                    'p-3',
                  )}
                  key={taskItem.id}
                  type="button"
                  aria-label="Click User"
                >
                  <div
                    className={clsx(
                      'flex justify-center items-center',
                      'min-w-10 w-10 h-10',
                      'rounded-[10px]',
                      'bg-[#1E293B]/50',
                      'border border-[#334155]',
                    )}
                    style={
                      {
                        '--search-task-color': taskItem.primaryColor,
                      } as React.CSSProperties
                    }
                  >
                    <IconTask1
                      className={clsx(
                        'text-(--search-task-color)',
                        'min-w-4 w-4 h-auto',
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={clsx(
                        'font-semibold',
                        'text-[#F8FAFC] text-left leading-normal',
                        'truncate',
                      )}
                    >
                      {taskItem.title}
                    </div>
                    <div
                      className={clsx(
                        'text-[#94A3B8] text-[12px] text-left',
                        'line-clamp-1',
                      )}
                    >
                      {taskItem.description}
                    </div>
                  </div>
                  <TaskPriorityUI priority={taskItem.priority} />
                  <div className="min-w-7.5 w-7.5 h-7.5">
                    {taskItem.assignee?.imageUrl ? (
                      <Image
                        className={clsx(
                          'w-full h-full',
                          'object-cover object-center',
                          'rounded-full',
                        )}
                        src={taskItem.assignee?.imageUrl}
                        alt={getFullName(
                          taskItem.assignee?.firstName,
                          taskItem.assignee?.lastName,
                        )}
                        title={getFullName(
                          taskItem.assignee?.firstName,
                          taskItem.assignee?.lastName,
                        )}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <Avatar
                        initial={taskItem.assignee?.firstName?.charAt(0)}
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Foot */}
        <div
          className={clsx(
            'py-3 px-6',
            'rounded-b-[inherit]',
            'bg-[#1E293B]/50',
          )}
        >
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <div
                className={clsx(
                  'flex justify-center items-center gap-2',
                  'w-fit',
                  'mr-auto',
                )}
              >
                <div
                  className={clsx(
                    'font-jetbrains-mono font-bold',
                    'leading-none',
                    'flex justify-center items-center',
                    'w-6 h-6',
                    'py-1 px-1',
                    'rounded-md',
                    'border border-[#334155]',
                  )}
                >
                  <IconArrowUp className="min-w-2 w-2 h-auto" />
                </div>
                <div
                  className={clsx(
                    'font-jetbrains-mono font-bold',
                    'leading-none',
                    'flex justify-center items-center',
                    'w-6 h-6',
                    'py-1 px-1',
                    'rounded-md',
                    'border border-[#334155]',
                  )}
                >
                  <IconArrowDown className="min-w-2 w-2 h-auto" />
                </div>
                <div className={clsx('text-[#64748B] leading-none')}>
                  Navigate
                </div>
              </div>
            </div>
            {/* Center */}
            <div className="min-w-40">
              <div className="flex justify-center items-center gap-2">
                <div
                  className={clsx(
                    'font-jetbrains-mono font-bold',
                    'leading-none',
                    'h-6',
                    'py-1 px-3',
                    'rounded-md',
                    'border border-[#334155]',
                  )}
                >
                  Enter
                </div>
                <div className={clsx('text-[#64748B] leading-none')}>
                  Select
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div
                className={clsx(
                  'flex justify-center items-center gap-2',
                  'w-fit h-6',
                  'ml-auto',
                )}
              >
                <div
                  className={clsx(
                    'font-jetbrains-mono font-bold',
                    'leading-none',
                    'py-1 px-3',
                    'rounded-md',
                    'border border-[#334155]',
                  )}
                >
                  Enter
                </div>
                <div className={clsx('text-[#64748B] leading-none')}>
                  Select
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
