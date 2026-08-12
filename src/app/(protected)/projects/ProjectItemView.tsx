import React from 'react';
import Link from 'next/link';

import clsx from 'clsx';

import type { Project } from '@/types/project.types';

import ThreeDotActions from '@/components/elements/ThreeDotActions';
import ProjectDescriptionUI from '@/components/shared/projects/ProjectDescriptionUI';
import ProjectMembersUI from '@/components/shared/projects/ProjectMembersUI';
import ProjectStatusUI from '@/components/shared/projects/ProjectStatusUI';
import ProjectTaskCounterUI from '@/components/shared/projects/ProjectTaskCounterUI';
import ProjectTitleUI from '@/components/shared/projects/ProjectTitleUI';
import ProjectUrgencyUI from '@/components/shared/projects/ProjectUrgencyUI';
import { IconBin2, IconExternalLink, IconPen2 } from '@/components/svgs/icons';

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
