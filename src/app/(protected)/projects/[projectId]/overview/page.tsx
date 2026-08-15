'use client';

import { useParams } from 'next/navigation';

import clsx from 'clsx';

import { useProject } from '@/hooks/queries/useProject';

import ProjectOverview from '../ProjectOverview';
import ProjectStatusCard from '../ProjectStatusCard';
import ProjectTaskTable from '../ProjectTaskTable';
import ProjectTeamMembers from '../ProjectTeamMembers';

export default function ProjectOverviewPage() {
  const params = useParams();

  const projectId = params.projectId as string;

  const { data: project = null, isPending: isProjectPending } =
    useProject(projectId);

  return (
    <div className={clsx('overflow-y-auto', 'flex-1 min-h-0', 'px-6 pb-6')}>
      <div className={clsx('flex justify-between items-start gap-6')}>
        <div className={clsx('flex flex-col gap-6', 'flex-1')}>
          <ProjectOverview
            project={project}
            isProjectPending={isProjectPending}
          />
          <ProjectTaskTable
            project={project}
            isProjectPending={isProjectPending}
          />
        </div>
        <div
          className={clsx('flex flex-col gap-6', 'basis-[305px] min-w-[305px]')}
        >
          <ProjectStatusCard
            project={project}
            isProjectPending={isProjectPending}
          />
          <ProjectTeamMembers
            project={project}
            isProjectPending={isProjectPending}
          />
        </div>
      </div>
    </div>
  );
}
