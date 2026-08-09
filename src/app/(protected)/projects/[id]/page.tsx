'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import clsx from 'clsx';

import { useProject } from '@/hooks/queries/useProject';
import { useUiStore } from '@/hooks/ui/useUiStore';

import {
  PROJECT_STATUS_COLORS,
  PROJECT_URGENCY_COLORS,
} from '@/utils/project.utils';

// import { getAllTasksByProjectId, getProjectById } from '@/api/project.api';
// import { useUiStore } from '@/store/use-ui-store';
// import { type Project, PROJECT_STATUS_COLORS } from '@/types/project.types';
// import { type Task } from '@/types/task.types';
import Button from '@/components/elements/Button';
import { IconAngleRight, IconPen3, IconShare2 } from '@/components/svgs/icons';

import ProjectOverview from './ProjectOverview';
import ProjectStatus from './ProjectStatus';
import ProjectTaskTable from './ProjectTaskTable';
import ProjectTeamMembers from './ProjectTeamMembers';

export default function ProjectItemPage() {
  const params = useParams();

  const projectId = params.id as string;

  const { data: project = null, isPending: isProjectPending } =
    useProject(projectId);

  const openProjectUpdateModal = useUiStore(
    (state) => state.openProjectUpdateModal,
  );

  console.log({ project });

  // const openProjectUpdateModal = useUiStore(
  //   (state) => state.openProjectUpdateModal,
  // );

  // const [project, setProject] = useState<Project | null>(null);

  // const [tasks, setTasks] = useState<Task[]>([]);

  // const fetchProject = useCallback(async () => {
  //   const result = await getProjectById(projectId);

  //   setProject(result.data.project);
  // }, [projectId]);

  // const fetchTasks = useCallback(async () => {
  //   const result = await getAllTasksByProjectId(projectId);

  //   if (result.data.tasks.length) {
  //     setTasks(result.data.tasks);
  //   }
  // }, [projectId]);

  // useEffect(() => {
  //   fetchProject();
  // }, [fetchProject]);

  // useEffect(() => {
  //   fetchTasks();
  // }, [fetchTasks]);

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
            <span>Projects</span>
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
        <div
          className={clsx(
            'flex justify-center items-center gap-1',
            'ml-auto py-1 px-2',
            'rounded-lg',
            'bg-[#00A6E0]',
            'border border-[#7BD0FF]/30',
            PROJECT_STATUS_COLORS[project.status].border,
            PROJECT_STATUS_COLORS[project.status].bg,
          )}
        >
          <div
            className={clsx(
              'min-w-2 5 w-2 5 h-2 5',
              'rounded-full',
              PROJECT_STATUS_COLORS[project.status].bg,
            )}
          />
          <div
            className={clsx(
              'font-jetbrains-mono font-medium',
              'text-[#7BD0FF] leading-tight',
              PROJECT_STATUS_COLORS[project.status].text,
            )}
          >
            {project.status}
          </div>
        </div>
        <Button
          className="min-w-[100px]!"
          buttonStyle="secondary"
          type="button"
          icon={<IconShare2 className="min-[14px] w-[14px] h-auto" />}
          text="Share"
        />
        <Button
          buttonStyle="primary"
          type="button"
          icon={<IconPen3 className="min-[14px] w-[14px] h-auto" />}
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
          {/* <ProjectTaskTable tasks={tasks} /> */}
        </div>
        <div
          className={clsx('flex flex-col gap-4', 'basis-[305px] min-w-[305px]')}
        >
          <ProjectStatus project={project} />
          <ProjectTeamMembers members={project.members} />
        </div>
      </div>
    </main>
  );
}
