import { useMemo, useState } from 'react';
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

type SearchResultType = 'user' | 'project' | 'task';

type SearchFilter = 'all' | SearchResultType;

type SearchResult =
  | {
      type: 'user';
      id: string;
      title: string;
      description: string;
      data: User;
    }
  | {
      type: 'project';
      id: string;
      title: string;
      description?: string;
      data: Project;
    }
  | {
      type: 'task';
      id: string;
      title: string;
      description?: string;
      data: Task;
    };

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

  const SEARCH_FILTERS = [
    {
      value: 'all',
      label: 'All',
    },
    {
      value: 'user',
      label: 'Users',
    },
    {
      value: 'project',
      label: 'Projects',
    },
    {
      value: 'task',
      label: 'Tasks',
    },
  ] satisfies {
    value: SearchFilter;
    label: string;
  }[];

  const [search, setSearch] = useState<string>('');
  const [filter, setFilter] = useState<SearchFilter>('all');

  const searchResults = useMemo<SearchResult[]>(() => {
    return [
      ...(users ?? []).map((user) => ({
        type: 'user' as const,
        id: user.id,
        title: getFullName(user.firstName, user.lastName),
        description: user.email,
        data: user,
      })),

      ...(projects ?? []).map((project) => ({
        type: 'project' as const,
        id: project.id,
        title: project.title,
        description: project.description ?? '',
        data: project,
      })),

      ...(tasks ?? []).map((task) => ({
        type: 'task' as const,
        id: task.id,
        title: task.title,
        description: task.description ?? '',
        data: task,
      })),
    ];
  }, [users, projects, tasks]);

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return searchResults.filter((result) => {
      // Filter by type
      if (filter !== 'all' && result.type !== filter) {
        return false;
      }

      // No search text
      if (!query) {
        return true;
      }

      // Search title + description
      return (
        result.title.toLowerCase().includes(query) ||
        result.description?.toLowerCase().includes(query)
      );
    });
  }, [searchResults, search, filter]);

  const groupedResults = useMemo(() => {
    return {
      users: filteredResults.filter((result) => result.type === 'user'),

      projects: filteredResults.filter((result) => result.type === 'project'),

      tasks: filteredResults.filter((result) => result.type === 'task'),
    };
  }, [filteredResults]);

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
          'transition-all duration-200 ease-in-out',
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
          !search ? 'h-0 opacity-0' : 'h-full opacity-100',
          'transition-all duration-200 ease-in-out',
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
          {SEARCH_FILTERS.map((filterItem) => (
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
                filterItem.value === filter && 'text-[#F8FAFC] bg-[#7C3AED]',
              )}
              key={`filter-${filterItem.value}`}
              type="button"
              aria-label={`Filter by ${filterItem.label}`}
              onClick={() => {
                setFilter(filterItem.value);
              }}
            >
              {filterItem.label}
            </button>
          ))}
        </div>
        {/* Results */}
        <div className={clsx('overflow-y-auto', 'flex-1', 'py-4 px-6')}>
          {filteredResults.length === 0 ? (
            <div
              className={clsx(
                'text-center',
                'flex flex-col justify-center items-center',
                'h-full',
              )}
            >
              <div
                className={clsx(
                  'flex justify-center items-center',
                  'w-10 h-10 mb-3',
                  'rounded-full',
                  'bg-[#1E293B]',
                  'border border-[#334155]',
                )}
              >
                <IconSearch
                  className={clsx('min-w-4 w-4 h-4', 'text-[#64748B]')}
                />
              </div>
              <div className={clsx('font-semibold', 'text-[#F8FAFC]')}>
                No matches found
              </div>
              <div className={clsx('text-[#64748B] text-[12px]', 'mt-1')}>
                Try a different search term or filter.
              </div>
            </div>
          ) : (
            <>
              {/* Users Result */}
              {groupedResults.users.length > 0 && (
                <div className="w-full">
                  <LabelField text="TEAM" />

                  <div className="flex flex-col">
                    {groupedResults.users.map((result) => (
                      <SearchResultItem
                        key={`${result.type}-${result.id}`}
                        result={result}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Result */}
              {groupedResults.projects.length > 0 && (
                <div className="w-full">
                  <LabelField text="PROJECTS" />

                  <div className="flex flex-col">
                    {groupedResults.projects.map((result) => (
                      <SearchResultItem
                        key={`${result.type}-${result.id}`}
                        result={result}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Result */}
              {groupedResults.tasks.length > 0 && (
                <div className="w-full">
                  <LabelField text="TASKS" />

                  <div className="flex flex-col">
                    {groupedResults.tasks.map((result) => (
                      <SearchResultItem
                        key={`${result.type}-${result.id}`}
                        result={result}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
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

function SearchResultItem({ result }: { result: SearchResult }) {
  switch (result.type) {
    case 'user':
      return <UserSearchResult user={result.data} />;

    case 'project':
      return <ProjectSearchResult project={result.data} />;

    case 'task':
      return <TaskSearchResult task={result.data} />;
  }
}

function UserSearchResult({ user }: { user: User }) {
  return (
    <button
      className={clsx(
        'flex justify-start items-center gap-4',
        'p-3',
        'rounded-lg',
        'hover:bg-[#1E293B]',
      )}
      key={user.id}
      type="button"
      aria-label="Click User"
    >
      <div className="min-w-10 w-10 h-10 rounded-full">
        {user.imageUrl ? (
          <Image
            className={clsx(
              'w-full h-full',
              'object-cover object-center',
              'rounded-full',
            )}
            src={user.imageUrl}
            alt={getFullName(user.firstName, user.lastName)}
            title={getFullName(user.firstName, user.lastName)}
            width={40}
            height={40}
          />
        ) : (
          <Avatar initial={user.firstName?.charAt(0)} />
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
          {getFullName(user.firstName, user.lastName)}
        </div>
        <div className={clsx('text-[#94A3B8] text-[12px] text-left')}>
          {user.email}
        </div>
      </div>
      <TeamRoleUI role={user.role} />
    </button>
  );
}

function ProjectSearchResult({ project }: { project: Project }) {
  return (
    <button
      className={clsx(
        'flex justify-start items-center gap-4',
        'p-3',
        'rounded-lg',
        'hover:bg-[#1E293B]',
      )}
      key={project.id}
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
            '--search-project-color': project.primaryColor,
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
            {project.title}
          </div>
          <ProjectStatusUI status={project.status} />
        </div>
        <div
          className={clsx(
            'text-[#94A3B8] text-[12px] text-left',
            'line-clamp-1',
          )}
        >
          {project.description}
        </div>
      </div>
    </button>
  );
}

function TaskSearchResult({ task }: { task: Task }) {
  return (
    <button
      className={clsx(
        'flex justify-start items-center gap-4',
        'p-3',
        'rounded-lg',
        'hover:bg-[#1E293B]',
      )}
      key={task.id}
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
            '--search-task-color': task.primaryColor,
          } as React.CSSProperties
        }
      >
        <IconTask1
          className={clsx('text-(--search-task-color)', 'min-w-4 w-4 h-auto')}
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
          {task.title}
        </div>
        <div
          className={clsx(
            'text-[#94A3B8] text-[12px] text-left',
            'line-clamp-1',
          )}
        >
          {task.description}
        </div>
      </div>
      <TaskPriorityUI priority={task.priority} />
      <div className="min-w-7.5 w-7.5 h-7.5">
        {task.assignee?.imageUrl ? (
          <Image
            className={clsx(
              'w-full h-full',
              'object-cover object-center',
              'rounded-full',
            )}
            src={task.assignee?.imageUrl}
            alt={getFullName(task.assignee?.firstName, task.assignee?.lastName)}
            title={getFullName(
              task.assignee?.firstName,
              task.assignee?.lastName,
            )}
            width={40}
            height={40}
          />
        ) : (
          <Avatar initial={task.assignee?.firstName?.charAt(0)} />
        )}
      </div>
    </button>
  );
}
