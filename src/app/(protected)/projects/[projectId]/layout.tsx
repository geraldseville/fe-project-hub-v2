'use client';

import React from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useProject } from '@/hooks/queries/useProject';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { toCapitalize } from '@/utils/string.utils';

import AppShellHead from '@/components/AppShellHead';
import Button from '@/components/elements/Button';
import SegmentedTab from '@/components/elements/SegmentedTabs';
import {
  IconCalendar2,
  IconColumn1,
  IconGridDashboard,
  IconPen3,
  IconTable1,
} from '@/components/svgs/icons';

const tabs = ['overview', 'calendar', 'kanban', 'table'] as const;

type Tab = (typeof tabs)[number];

export default function ProjectLayout({
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
      calendar2: IconCalendar2,
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
      className={clsx('overflow-hidden', 'flex flex-col', 'w-full h-screen')}
    >
      {/* Head */}
      <AppShellHead
        breadcrumb={{
          label: project?.title ?? '',
          href: `/projects/${projectId}`,
        }}
      />
      {/* SubHead */}
      <div className={clsx('flex justify-between items-center', 'py-4 px-6')}>
        <SegmentedTab
          classNames={{
            root: 'w-fit! p-0! border-none!',
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
        {project && !isProjectPending && (
          <>
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
      {/* Body */}
      {children}
    </main>
  );
}
