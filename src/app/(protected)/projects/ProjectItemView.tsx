import React from 'react';
import Link from 'next/link';

import clsx from 'clsx';

import {
  PROJECT_STATUS_COLORS,
  PROJECT_URGENCY_COLORS,
} from '@/utils/project.utils';
import { getFullName } from '@/utils/user.utils';

import type {
  Project,
  ProjectStatus,
  ProjectUrgency,
} from '@/types/project.types';
import type { User } from '@/types/user.types';

import AnimatedNumber from '@/components/elements/AnimatedNumber';
import ImageStack from '@/components/elements/ImageStack';
import ThreeDotActions from '@/components/elements/ThreeDotActions';
import {
  IconBin2,
  IconCheck3,
  IconDot,
  IconExternalLink,
  IconPen2,
} from '@/components/svgs/icons';

interface ProjectItemViewProps {
  view: 'tab-grid' | 'tab-list' | string;
  project: Project;
  onTogglePreview?: (project: Project) => void;
  onToggleEdit?: (project: Project) => void;
  onToggleDelete?: (project: Project) => void;
}

export default function ProjectItemView({
  view = 'tab-grid',
  project,
  onTogglePreview,
  onToggleEdit,
  onToggleDelete,
}: ProjectItemViewProps) {
  const totalTasks = project.tasks?.length || 0;

  const totalCompletedTasks =
    project.tasks?.filter((item) => item.status === 'DONE').length || 0;

  return (
    <>
      <Link
        className={clsx(
          'overflow-hidden',
          'min-h-32',
          'p-6',
          'rounded-lg',
          'bg-[#131B2E]',
          'border border-l-[6px] border-transparent hover:border-[#464554]',
        )}
        style={{
          borderLeftColor: project.primaryColor,
        }}
        href={`/projects/${project.id}`}
      >
        {view === 'tab-grid' && (
          <div className="relative block">
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center gap-4">
                {/* Project Status */}
                <ProjectStatusUI status={project.status} />
                {/* Project Urgency */}
                <ProjectUrgencyUI urgency={project.urgency} />
              </div>
              {/* Project Action */}
              <ThreeDotActions
                classNames={{ trigger: 'ml-auto' }}
                orientation="Vertical"
                placement="bottom-end"
                actions={[
                  {
                    id: 'action-preview',
                    color: '#C7C4D7',
                    label: 'Preview',
                    icon: <IconExternalLink />,
                    onClick: () => {
                      onTogglePreview?.(project);
                    },
                  },
                  {
                    id: 'action-edit',
                    color: '#C7C4D7',
                    label: 'Edit',
                    icon: <IconPen2 />,
                    onClick: () => {
                      onToggleEdit?.(project);
                    },
                  },
                  {
                    id: 'action-delete',
                    color: '#e90f1e',
                    label: 'Delete',
                    icon: <IconBin2 />,
                    onClick: () => {
                      onToggleDelete?.(project);
                    },
                  },
                ]}
              />
            </div>
            <div className="mt-2">
              {/* Project Title */}
              <ProjectTitleUI title={project.title} />
            </div>
            {/* Project Description */}
            <ProjectDescriptionUI description={project.description ?? ''} />
            <div
              className={clsx(
                'flex justify-between items-center gap-2',
                'h-8',
                'mt-4',
              )}
            >
              {/* Project Members */}
              <ProjectMembersUI members={project.members} />
              {/* Task Counter */}
              <ProjectTaskCounterUI
                current={totalCompletedTasks}
                total={totalTasks}
              />
            </div>
          </div>
        )}
        {view === 'tab-list' && (
          <div
            className={clsx('flex justify-start items-center gap-4', 'w-full')}
          >
            <div className="flex-1">
              {/* Project Title */}
              <ProjectTitleUI title={project.title} />
              {/* Project Description */}
              <ProjectDescriptionUI description={project.description ?? ''} />
            </div>
            <div
              className={clsx(
                'flex justify-start items-center gap-4',
                'basis-50',
              )}
            >
              {/* Project Status */}
              <ProjectStatusUI status={project.status} />
              {/* Project Urgency */}
              <ProjectUrgencyUI urgency={project.urgency} />
            </div>
            {/* Project Members */}
            <div
              className={clsx(
                'flex justify-between items-center gap-2',
                'basis-40 h-8',
              )}
            >
              <ProjectMembersUI members={project.members} />
            </div>
            {/* Task Counter */}
            <div className="flex justify-start basis-40">
              <ProjectTaskCounterUI
                current={totalCompletedTasks}
                total={totalTasks}
              />
            </div>
            {/* Project Action */}
            <ThreeDotActions
              classNames={{ trigger: 'ml-auto' }}
              orientation="Vertical"
              placement="bottom-end"
              actions={[
                {
                  id: 'action-preview',
                  color: '#C7C4D7',
                  label: 'Preview',
                  icon: <IconExternalLink />,
                  onClick: () => {
                    onTogglePreview?.(project);
                  },
                },
                {
                  id: 'action-edit',
                  color: '#C7C4D7',
                  label: 'Edit',
                  icon: <IconPen2 />,
                  onClick: () => {
                    onToggleEdit?.(project);
                  },
                },
                {
                  id: 'action-delete',
                  color: '#e90f1e',
                  label: 'Delete',
                  icon: <IconBin2 />,
                  onClick: () => {
                    onToggleDelete?.(project);
                  },
                },
              ]}
            />
          </div>
        )}
      </Link>
    </>
  );
}

export function ProjectTitleUI({ title }: { title: string }) {
  return (
    <div
      className={clsx(
        'font-hanken-grotesk font-bold',
        'text-[#DAE2FD] text-[16px] leading-tight truncate',
      )}
    >
      {title}
    </div>
  );
}

export function ProjectDescriptionUI({ description }: { description: string }) {
  return (
    <div
      className={clsx(
        'font-inter',
        'text-[#C7C4D7] leading-normal',
        'line-clamp-2',
        'min-h-[calc(1.5em*2)]',
        'mt-4',
      )}
    >
      {description}
    </div>
  );
}

export function ProjectStatusUI({ status }: { status: ProjectStatus }) {
  const styles = PROJECT_STATUS_COLORS[status];

  return (
    <div
      className={clsx(
        'flex justify-center items-center',
        'w-fit h-6',
        'py-1 px-2',
        'rounded-full',
        styles.bg,
        styles.border,
      )}
      style={{}}
    >
      <div
        className={clsx(
          'font-inter font-medium',
          'text-[12px] leading-none',
          styles.text,
        )}
      >
        {status}
      </div>
    </div>
  );
}

export function ProjectUrgencyUI({ urgency }: { urgency: ProjectUrgency }) {
  const styles = PROJECT_URGENCY_COLORS[urgency];

  return (
    <div
      className={clsx('flex justify-center items-center gap-2', 'w-fit')}
      style={{ '--icon-dot-color': styles.hex } as React.CSSProperties}
    >
      <IconDot className="text-[var(--icon-dot-color)] min-w-2 w-2 h-2" />
      <div
        className={clsx(
          'font-inter font-medium',
          'text-[#C7C4D7] text-[12px] capitalize leading-tight',
        )}
      >
        {urgency}
      </div>
    </div>
  );
}

export function ProjectMembersUI({ members }: { members: User[] }) {
  if (members.length === 0) {
    return (
      <div
        className={clsx(
          'font-hanken-grotesk',
          'text-[#DAE2FD] leading-tight truncate',
        )}
      >
        No Assignees
      </div>
    );
  }

  return (
    <ImageStack
      className={{ item: 'border-[#131B2E]!' }}
      images={members.map((item) => ({
        src: item.imageUrl ?? '',
        alt: getFullName(item.firstName, item.lastName),
      }))}
      size={32}
    />
  );
}

export function ProjectTaskCounterUI({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex justify-center items-center gap-1">
      <IconCheck3 className="w-4 h-4" />
      <div className="font-inter font-medium text-[#C7C4D7] leading-tight whitespace-nowrap">
        <AnimatedNumber value={current} /> / <AnimatedNumber value={total} />{' '}
        Tasks
      </div>
    </div>
  );
}
