import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useProjects } from '@/hooks/queries/useProjects';
import { useTasks } from '@/hooks/queries/useTasks';
import { useUsers } from '@/hooks/queries/useUsers';
import { useKeyboardShortcut } from '@/hooks/ui/useKeyboardShortcut';
import { useUiStore } from '@/hooks/ui/useUiStore';

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

const RESULT_SECTION_LABELS: Record<SearchResultType, string> = {
  user: 'TEAM',
  project: 'PROJECTS',
  task: 'TASKS',
};

export default function SmartSearchModal({
  isOpen,
  onClose,
}: SmartSearchModalProps) {
  const router = useRouter();

  const { data: { users = [] } = {} } = useUsers();
  const { data: projects } = useProjects();
  const { data: tasks } = useTasks();

  const openTaskUpdateDrawer = useUiStore(
    (state) => state.openTaskUpdateDrawer,
  );

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const resultRefs = useRef<
    Record<string, HTMLAnchorElement | HTMLButtonElement | null>
  >({});

  /**
   * Normalize all searchable entities into one structure.
   */
  const searchResults = useMemo<SearchResult[]>(
    () => [
      ...(users ?? []).map(
        (user): SearchResult => ({
          type: 'user',
          id: user.id,
          title: getFullName(user.firstName, user.lastName),
          description: user.email,
          data: user,
        }),
      ),

      ...(projects ?? []).map(
        (project): SearchResult => ({
          type: 'project',
          id: project.id,
          title: project.title,
          description: project.description ?? '',
          data: project,
        }),
      ),

      ...(tasks ?? []).map(
        (task): SearchResult => ({
          type: 'task',
          id: task.id,
          title: task.title,
          description: task.description ?? '',
          data: task,
        }),
      ),
    ],
    [users, projects, tasks],
  );

  /**
   * Filter results by selected filter and search query.
   */
  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return searchResults.filter((result) => {
      if (filter !== 'all' && result.type !== filter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        result.title.toLowerCase().includes(query) ||
        result.description?.toLowerCase().includes(query)
      );
    });
  }, [searchResults, search, filter]);

  /**
   * Group filtered results by entity type.
   */
  const groupedResults = useMemo(() => {
    return {
      user: filteredResults.filter((result) => result.type === 'user'),
      project: filteredResults.filter((result) => result.type === 'project'),
      task: filteredResults.filter((result) => result.type === 'task'),
    };
  }, [filteredResults]);

  const getResultKey = (result: SearchResult) => `${result.type}-${result.id}`;

  /**
   * Move between search filters using Tab.
   */
  useKeyboardShortcut({
    key: 'Tab',
    callback: () => {
      if (!isOpen) {
        return;
      }

      const currentIndex = SEARCH_FILTERS.findIndex(
        (item) => item.value === filter,
      );

      const nextIndex =
        currentIndex >= SEARCH_FILTERS.length - 1 ? 0 : currentIndex + 1;

      setFilter(SEARCH_FILTERS[nextIndex].value);
    },
  });

  /**
   * Navigate results with ArrowDown.
   */
  useKeyboardShortcut({
    key: 'ArrowDown',
    callback: () => {
      if (!isOpen || !filteredResults.length) {
        return;
      }

      setSelectedIndex((current) =>
        current >= filteredResults.length - 1 ? 0 : current + 1,
      );
    },
  });

  /**
   * Navigate results with ArrowUp.
   */
  useKeyboardShortcut({
    key: 'ArrowUp',
    callback: () => {
      if (!isOpen || !filteredResults.length) {
        return;
      }

      setSelectedIndex((current) =>
        current <= 0 ? filteredResults.length - 1 : current - 1,
      );
    },
  });

  /**
   * Select the currently highlighted result.
   */
  useKeyboardShortcut({
    key: 'Enter',
    callback: () => {
      if (!isOpen) {
        return;
      }

      const result = filteredResults[selectedIndex];

      if (result) {
        handleSelectResult(result);
      }
    },
  });

  const handleSelectResult = (result: SearchResult) => {
    handleClose();

    switch (result.type) {
      case 'user':
        router.push(`/teams/${result.id}`);
        break;

      case 'project':
        router.push(`/projects/${result.id}`);
        break;

      case 'task':
        openTaskUpdateDrawer(result.data.id, result.data.projectId);
        break;
    }
  };

  const handleClose = () => {
    setSearch('');
    onClose();
  };

  const handleFilterChange = (value: SearchFilter) => {
    setFilter(value);
  };

  /**
   * Reset result selection whenever the search context changes.
   */
  useEffect(() => {
    setSelectedIndex(0);
  }, [search, filter]);

  /**
   * Focus search input when modal opens.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, [isOpen]);

  /**
   * Keep the selected result visible while navigating.
   */
  useEffect(() => {
    if (!isOpen || !filteredResults.length) {
      return;
    }

    const selectedResult = filteredResults[selectedIndex];

    if (!selectedResult) {
      return;
    }

    const element = resultRefs.current[getResultKey(selectedResult)];

    element?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [isOpen, selectedIndex, filteredResults]);

  return (
    <Modal
      classNames={{
        root: clsx('items-start py-[10dvh]'),
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
      onClose={handleClose}
    >
      {/* Header */}
      <div className="min-h-15 h-15">
        <div className="relative">
          <SingleLineField
            classNames={{
              root: 'h-15!',
              input: 'pr-20 rounded-b-none border-none!',
            }}
            type="search"
            ref={searchInputRef}
            placeholder="Search anything..."
            icon={<IconSearch className="min-w-4 w-4 h-4" />}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
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
        <SearchFilters value={filter} onChange={handleFilterChange} />

        {/* Results */}
        <div className={clsx('overflow-y-auto', 'flex-1', 'py-4 px-6')}>
          {filteredResults.length === 0 ? (
            <NoResults />
          ) : (
            <div className="flex flex-col gap-4">
              {(['user', 'project', 'task'] as const).map((type) => {
                const results = groupedResults[type];

                if (!results.length) {
                  return null;
                }

                return (
                  <SearchResultGroup
                    key={type}
                    type={type}
                    results={results}
                    filteredResults={filteredResults}
                    selectedIndex={selectedIndex}
                    search={search}
                    resultRefs={resultRefs}
                    onSelect={handleSelectResult}
                    onClose={handleClose}
                    getResultKey={getResultKey}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <SearchFooter />
      </div>
    </Modal>
  );
}

function SearchFilters({
  value,
  onChange,
}: {
  value: SearchFilter;
  onChange: (value: SearchFilter) => void;
}) {
  return (
    <div
      className={clsx(
        'flex justify-start items-center gap-2',
        'py-4 px-6',
        'border-y border-y-[#1E293B]',
      )}
    >
      {SEARCH_FILTERS.map((filter) => (
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
            filter.value === value && 'text-[#F8FAFC] bg-[#7C3AED]',
          )}
          key={filter.value}
          type="button"
          aria-label={`Filter by ${filter.label}`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

function SearchResultGroup({
  type,
  results,
  filteredResults,
  selectedIndex,
  search,
  resultRefs,
  onSelect,
  onClose,
  getResultKey,
}: {
  type: SearchResultType;
  results: SearchResult[];
  filteredResults: SearchResult[];
  selectedIndex: number;
  search: string;
  resultRefs: React.MutableRefObject<
    Record<string, HTMLAnchorElement | HTMLButtonElement | null>
  >;
  onSelect: (result: SearchResult) => void;
  onClose: () => void;
  getResultKey: (result: SearchResult) => string;
}) {
  return (
    <div className="w-full">
      <LabelField text={RESULT_SECTION_LABELS[type]} />

      <div className="flex flex-col">
        {results.map((result) => {
          const index = filteredResults.findIndex(
            (item) => item.id === result.id && item.type === result.type,
          );

          const key = getResultKey(result);
          const selected = index === selectedIndex;

          const content = (
            <SearchResultItem
              result={result}
              search={search}
              selected={selected}
            />
          );

          if (result.type === 'task') {
            return (
              <button
                key={key}
                ref={(element) => {
                  resultRefs.current[key] = element;
                }}
                type="button"
                onClick={() => onSelect(result)}
              >
                {content}
              </button>
            );
          }

          const href =
            result.type === 'user'
              ? `/teams/${result.id}`
              : `/projects/${result.id}`;

          return (
            <Link
              key={key}
              ref={(element) => {
                resultRefs.current[key] = element;
              }}
              href={href}
              onClick={onClose}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultItem({
  result,
  search,
  selected,
}: {
  result: SearchResult;
  search: string;
  selected: boolean;
}) {
  switch (result.type) {
    case 'user':
      return (
        <UserSearchResult
          user={result.data}
          search={search}
          selected={selected}
        />
      );

    case 'project':
      return (
        <ProjectSearchResult
          project={result.data}
          search={search}
          selected={selected}
        />
      );

    case 'task':
      return (
        <TaskSearchResult
          task={result.data}
          search={search}
          selected={selected}
        />
      );
  }
}

function UserSearchResult({
  user,
  search,
  selected,
}: {
  user: User;
  search: string;
  selected: boolean;
}) {
  const fullName = getFullName(user.firstName, user.lastName);

  return (
    <div
      className={clsx(
        'flex justify-start items-center gap-4',
        'p-3',
        'rounded-lg',
        selected ? 'bg-[#1E293B]' : 'hover:bg-[#1E293B]',
      )}
    >
      <div className="min-w-10 w-10 h-10 rounded-full">
        {user.imageUrl ? (
          <Image
            className="w-full h-full object-cover object-center rounded-full"
            src={user.imageUrl}
            alt={fullName}
            title={fullName}
            width={40}
            height={40}
          />
        ) : (
          <Avatar initial={user.firstName?.charAt(0)} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={clsx(
            'font-semibold',
            'text-[#F8FAFC] text-left leading-normal',
            'truncate',
          )}
        >
          <HighlightMatch text={fullName} query={search} />
        </div>
        <div className="text-[#94A3B8] text-[12px] text-left">
          <HighlightMatch text={user.email} query={search} />
        </div>
      </div>
      <TeamRoleUI role={user.role} />
    </div>
  );
}

function ProjectSearchResult({
  project,
  search,
  selected,
}: {
  project: Project;
  search: string;
  selected: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex justify-start items-center gap-4',
        'p-3',
        'rounded-lg',
        selected ? 'bg-[#1E293B]' : 'hover:bg-[#1E293B]',
      )}
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
      <div className="flex-1 min-w-0">
        <div className="flex justify-start items-center gap-2">
          <div
            className={clsx(
              'font-semibold',
              'text-[#F8FAFC] text-left leading-normal',
              'truncate',
            )}
          >
            <HighlightMatch text={project.title} query={search} />
          </div>
          <ProjectStatusUI status={project.status} />
        </div>
        <div
          className={clsx(
            'text-[#94A3B8] text-[12px] text-left',
            'line-clamp-1',
          )}
        >
          <HighlightMatch text={project.description} query={search} />
        </div>
      </div>
    </div>
  );
}

function TaskSearchResult({
  task,
  search,
  selected,
}: {
  task: Task;
  search: string;
  selected: boolean;
}) {
  const assigneeName = task.assignee
    ? getFullName(task.assignee.firstName, task.assignee.lastName)
    : '';

  return (
    <div
      className={clsx(
        'flex justify-start items-center gap-4',
        'p-3',
        'rounded-lg',
        selected ? 'bg-[#1E293B]' : 'hover:bg-[#1E293B]',
      )}
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
      <div className="flex-1 min-w-0">
        <div
          className={clsx(
            'font-semibold',
            'text-[#F8FAFC] text-left leading-normal',
            'truncate',
          )}
        >
          <HighlightMatch text={task.title} query={search} />
        </div>
        <div
          className={clsx(
            'text-[#94A3B8] text-[12px] text-left',
            'line-clamp-1',
          )}
        >
          <HighlightMatch text={task.description} query={search} />
        </div>
      </div>
      <TaskPriorityUI priority={task.priority} />
      <div className="min-w-7.5 w-7.5 h-7.5">
        {task.assignee?.imageUrl ? (
          <Image
            className="w-full h-full object-cover object-center rounded-full"
            src={task.assignee.imageUrl}
            alt={assigneeName}
            title={assigneeName}
            width={40}
            height={40}
          />
        ) : (
          <Avatar initial={task.assignee?.firstName?.charAt(0)} />
        )}
      </div>
    </div>
  );
}

function NoResults() {
  return (
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
        <IconSearch className={clsx('min-w-4 w-4 h-4', 'text-[#64748B]')} />
      </div>
      <div className={clsx('font-semibold', 'text-[#F8FAFC]')}>
        No matches found
      </div>
      <div className={clsx('text-[#64748B] text-[12px]', 'mt-1')}>
        Try a different search term or filter.
      </div>
    </div>
  );
}

function SearchFooter() {
  return (
    <div
      className={clsx('py-3 px-6', 'rounded-b-[inherit]', 'bg-[#1E293B]/50')}
    >
      <div className="flex justify-between items-center gap-4">
        <KeyboardHint
          className="flex-1"
          keys={
            <>
              <KeyboardKey>
                <IconArrowUp className="min-w-2 w-2 h-auto" />
              </KeyboardKey>

              <KeyboardKey>
                <IconArrowDown className="min-w-2 w-2 h-auto" />
              </KeyboardKey>
            </>
          }
          label="Navigate"
        />
        <KeyboardHint
          keys={<KeyboardKey className="px-3">Enter</KeyboardKey>}
          label="Select"
          className="min-w-40"
          centered
        />
        <KeyboardHint
          keys={<KeyboardKey className="px-3">Esc</KeyboardKey>}
          label="Dismiss"
          className="flex-1"
          alignRight
        />
      </div>
    </div>
  );
}

function KeyboardHint({
  keys,
  label,
  className,
  centered = false,
  alignRight = false,
}: {
  keys: React.ReactNode;
  label: string;
  className?: string;
  centered?: boolean;
  alignRight?: boolean;
}) {
  return (
    <div
      className={clsx(
        'flex items-center gap-2',
        className,
        centered && 'justify-center',
        alignRight && 'justify-end',
      )}
    >
      {keys}
      <div className="text-[#64748B] leading-none">{label}</div>
    </div>
  );
}

function KeyboardKey({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        'font-jetbrains-mono font-bold',
        'leading-none',
        'flex justify-center items-center',
        'h-6',
        'py-1 px-1',
        'rounded-md',
        'border border-[#334155]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function HighlightMatch({
  query,
  className,
  text,
}: {
  query: string;
  className?: string;
  text?: string | null;
}) {
  if (!text) {
    return null;
  }

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return <span className={className}>{text}</span>;
  }

  const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const matcher = new RegExp(`(${escapedQuery})`, 'gi');

  return (
    <span className={className}>
      {text.split(matcher).map((part, index) => {
        const isMatch = part.toLowerCase() === trimmedQuery.toLowerCase();

        return isMatch ? (
          <mark
            className={clsx(
              'text-[#F8FAFC]',
              'px-0.5',
              'rounded-xs',
              'bg-[#7C3AED]/40',
            )}
            key={`${part}-${index}`}
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </span>
  );
}
