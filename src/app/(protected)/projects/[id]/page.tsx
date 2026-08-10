'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import clsx from 'clsx';

import { useUpdateProjectStatus } from '@/hooks/mutations/useUpdateProjectStatus';
import { useProject } from '@/hooks/queries/useProject';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { PROJECT_STATUS_COLORS, PROJECT_STATUSES } from '@/utils/project.utils';

import type { ProjectStatus } from '@/types/project.types';

import Button from '@/components/elements/Button';
import SingleSelect from '@/components/elements/SingleSelect';
import { IconAngleRight, IconPen3, IconShare2 } from '@/components/svgs/icons';

import ProjectOverview from './ProjectOverview';
import ProjectStatusCard from './ProjectStatus';
import ProjectTaskTable from './ProjectTaskTable';
import ProjectTeamMembers from './ProjectTeamMembers';

export default function ProjectItemPage() {
  const params = useParams();

  const projectId = params.id as string;

  const { data: project = null, isPending: isProjectPending } =
    useProject(projectId);

  const updateProjectStatus = useUpdateProjectStatus();

  const openProjectUpdateModal = useUiStore(
    (state) => state.openProjectUpdateModal,
  );

  if (!project) return null;

  return (
    <main className={clsx('overflow-auto', 'w-full h-screen', 'py-10 px-4')}>
      {/* Head */}
      <div className="flex justify-start items-center gap-4 max-[1080px]:flex-wrap">
        <div className="">
          <div
            className={clsx(
              'font-hanken-grotesk',
              'text-[#C7C4D7] text-[16px] leading-tight',
              'whitespace-nowrap',
              'flex justify-start items-center gap-2',
            )}
          >
            <Link href="/projects">Projects</Link>
            <IconAngleRight />
            <span>{project.title}</span>
          </div>
          <div
            className={clsx(
              'font-hanken-grotesk font-bold',
              'text-[#DAE2FD] text-[24px] leading-tight',
              'mt-1',
            )}
          >
            {project.title}
          </div>
        </div>
        <SingleSelect
          classNames={{
            root: 'max-w-[180px] ml-auto',
            trigger: 'h-10!',
          }}
          id="projectStatus"
          placeholder="Select Status..."
          value={{
            id: project.status,
            color: PROJECT_STATUS_COLORS[project.status].hex,
            label: project.status,
            value: project.status,
          }}
          options={PROJECT_STATUSES.map((item) => ({
            id: item,
            color: PROJECT_STATUS_COLORS[item].hex,
            label: item,
            value: item,
          }))}
          onChange={(selected) => {
            updateProjectStatus.mutate({
              projectId,
              status: selected.value as ProjectStatus,
            });
          }}
        />
        <Button
          className="min-w-[100px]!"
          buttonStyle="secondary"
          type="button"
          icon={<IconShare2 className="min-w-3.5 w-3.5 h-auto" />}
          text="Share"
        />
        <Button
          buttonStyle="primary"
          type="button"
          icon={<IconPen3 className="min-w-3.5 w-3.5 h-auto" />}
          text="Edit Project"
          onClick={() => {
            openProjectUpdateModal(project);
          }}
        />
      </div>
      {/* Body */}
      <div className={clsx('flex justify-between items-start gap-4', 'mt-10')}>
        <div className={clsx('flex flex-col gap-4', 'flex-1')}>
          <ProjectOverview project={project} />
          <ProjectTaskTable project={project} />
        </div>
        <div
          className={clsx('flex flex-col gap-4', 'basis-[305px] min-w-[305px]')}
        >
          <ProjectStatusCard project={project} />
          <ProjectTeamMembers members={project.members} />
        </div>
      </div>
    </main>
  );
}
