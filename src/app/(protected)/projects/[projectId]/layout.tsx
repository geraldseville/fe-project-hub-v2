'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useProject } from '@/hooks/queries/useProject';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { toCapitalize } from '@/utils/string.utils';

import Button from '@/components/elements/Button';
import SegmentedTab from '@/components/elements/SegmentedTabs';
import SkeletonLoading from '@/components/elements/SkeletonLoading';
import ProjectMembersUI from '@/components/shared/projects/ProjectMembersUI';
import ProjectStatusUI from '@/components/shared/projects/ProjectStatusUI';
import ProjectUrgencyUI from '@/components/shared/projects/ProjectUrgencyUI';
import {
  IconAngleRight,
  IconCalendar2,
  IconColumn1,
  IconGridDashboard,
  IconPen3,
  IconTable1,
} from '@/components/svgs/icons';

const tabs = ['overview', 'calendar', 'kanban', 'table'] as const;

type Tab = (typeof tabs)[number];

export default function ProjectItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  const pathname = usePathname();

  const router = useRouter();

  const projectId = params.projectId as string;

  const { data: project = null, isPending: isProjectPending } =
    useProject(projectId);

  const openProjectUpdateModal = useUiStore(
    (state) => state.openProjectUpdateModal,
  );

  const derivedTabs = tabs.map((item) => {
    const icon = {
      overview: IconGridDashboard,
      calendar: IconCalendar2,
      kanban: IconColumn1,
      table: IconTable1,
    };

    const ComponentIcon = icon[item];

    return {
      id: item,
      icon: <ComponentIcon className="min-w-3 w-3 h-auto" />,
      label: toCapitalize(item),
    };
  });

  const activeTab = pathname.split('/').pop() as Tab;

  return (
    <main
      className={clsx(
        'overflow-hidden',
        'flex flex-col',
        'w-full h-screen',
        'p-6',
      )}
    >
      {/* Head */}
      <div className="w-full">
        <div className={clsx('flex justify-start items-end gap-4')}>
          <div className="flex-1">
            {isProjectPending ? (
              <SkeletonLoading className="w-1/4 h-4" />
            ) : (
              <div
                className={clsx(
                  'font-hanken-grotesk',
                  'text-[#C7C4D7] leading-tight',
                  'whitespace-nowrap',
                  'flex justify-start items-center gap-2',
                )}
              >
                <Link href="/projects">Projects</Link>
                <IconAngleRight />
                {project ? <span>{project.title}</span> : <i>Untitled</i>}
              </div>
            )}
            <div
              className={clsx('flex justify-start items-center gap-3', 'mt-1')}
            >
              {isProjectPending || !project ? (
                <SkeletonLoading className="w-1/3 h-7.5" />
              ) : (
                <>
                  <div
                    className="min-w-5 w-5 h-5 rounded-md bg-foreground"
                    style={{
                      backgroundColor: project.primaryColor,
                    }}
                  />
                  <h1
                    className={clsx(
                      'font-hanken-grotesk font-bold',
                      'text-[#DAE2FD] text-[24px] leading-tight',
                      'line-clamp-1',
                    )}
                  >
                    {project ? project.title : <i>Untitled</i>}
                  </h1>
                  <ProjectStatusUI status={project.status} />
                  <ProjectUrgencyUI urgency={project.urgency} />
                </>
              )}
            </div>
            <p className={clsx('line-clamp-1', 'mt-2')}>
              {project ? project.description : null}
            </p>
          </div>

          {project && !isProjectPending && (
            <>
              <ProjectMembersUI members={project.members} />
              <Button
                buttonStyle="primary"
                type="button"
                icon={<IconPen3 className="min-w-3.5 w-3.5 h-auto" />}
                text="Edit Project"
                onClick={() => {
                  openProjectUpdateModal(project);
                }}
              />
            </>
          )}
        </div>
        <SegmentedTab
          classNames={{
            root: 'w-fit! mt-6! p-0! border-none!',
            tabItem: 'min-w-[140px]! w-fit!',
            tabItemSelected: 'text-[#060e20]!',
            tabIndicator: 'bg-[#c0c1ff]!',
          }}
          selected={{ id: activeTab.toLowerCase(), label: activeTab }}
          options={derivedTabs}
          onSelect={(selected) => {
            router.push(`/projects/${projectId}/${selected.id}`);
          }}
        />
      </div>
      {/* Body */}
      {children}
    </main>
  );
}
