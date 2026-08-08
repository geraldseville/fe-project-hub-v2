import React from 'react';
import Link from 'next/link';

import clsx from 'clsx';

import { PROJECT_STATUS_COLORS } from '@/utils/project.utils';
import { getFullName } from '@/utils/user.utils';

import type { Project, ProjectStatus } from '@/types/project.types';

// import { type Project, ProjectStatus } from '@/types/project.types';
// import { PROJECT_STATUS_COLORS } from '@/types/project.types';
import AnimatedNumber from '@/components/elements/AnimatedNumber';
import ImageStack from '@/components/elements/ImageStack';
import ThreeDotActions from '@/components/elements/ThreeDotActions';
import { IconBin2, IconCheck3, IconPen2 } from '@/components/svgs/icons';

interface ProjectGridViewProps {
  project: Project;
  onToggleEdit?: (project: Project) => void;
  onToggleDelete?: (project: Project) => void;
}

export default function ProjectGridView({
  project,
  onToggleEdit,
  onToggleDelete,
}: ProjectGridViewProps) {
  // const totalTasks = project.tasks?.length || 0;

  // const totalCompletedTasks =
  //   project.tasks?.filter((item) => item.status === 'DONE').length || 0;

  return (
    <>
      <Link
        className={clsx(
          'overflow-hidden',
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
        <div className="flex justify-between items-center">
          {/* Project Status */}
          <ProjectStatusUI status={project.status} />
          {/* Project Action */}
          <ThreeDotActions
            orientation="Vertical"
            placement="bottom-end"
            actions={[
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
        {/* Project Title */}
        <div
          className={clsx(
            'font-hanken-grotesk',
            'text-[#DAE2FD] text-[16px] leading-tight truncate',
            'mt-2',
          )}
        >
          {project.title}
        </div>
        {/* Project Description */}
        <div
          className={clsx(
            'font-inter',
            'text-[#C7C4D7] leading-normal',
            'line-clamp-2',
            'min-h-[calc(1.5em*2)]',
            'mt-4',
          )}
        >
          {project.description}
        </div>
        <div
          className={clsx(
            'flex justify-between items-center gap-2',
            'h-8',
            'mt-4',
          )}
        >
          {project.assignees.length > 0 ? (
            <ImageStack
              className={{ item: 'border-[#131B2E]!' }}
              images={project.assignees.map((item) => ({
                src: item.imageUrl ?? '',
                alt: getFullName(item.firstName, item.lastName),
              }))}
              size={32}
            />
          ) : (
            <div
              className={clsx(
                'font-hanken-grotesk',
                'text-[#DAE2FD] leading-tight truncate',
              )}
            >
              No Assignees
            </div>
          )}
          {/* Task Counter */}
          {/* <TaskCounterUI current={totalCompletedTasks} total={totalTasks} /> */}
        </div>
      </Link>
    </>
  );
}

function ProjectStatusUI({ status }: { status: ProjectStatus }) {
  const styles = PROJECT_STATUS_COLORS[status];

  return (
    <div
      className={clsx(
        'flex justify-center items-center',
        'w-fit h-[24px]',
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

function TaskCounterUI({ current, total }: { current: number; total: number }) {
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
