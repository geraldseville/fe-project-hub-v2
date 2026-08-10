'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useProjects } from '@/hooks/queries/useProjects';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { Project } from '@/types/project.types';

import Button from '@/components/elements/Button';
import SegmentedTab from '@/components/elements/SegmentedTabs';
import SingleSelect from '@/components/elements/SingleSelect';
import { IconGrid1, IconListBullet, IconPlus1 } from '@/components/svgs/icons';

import ProjectDeleteModal from './ProjectDeleteModal';
import ProjectItemView from './ProjectItemView';

export default function ProjectListPage() {
  const router = useRouter();

  const openProjectCreateModal = useUiStore(
    (state) => state.openProjectCreateModal,
  );

  const openProjectUpdateModal = useUiStore(
    (state) => state.openProjectUpdateModal,
  );

  const { data: projects, isPending: isProjectsPending } = useProjects();

  const [projectSort, setProjectSort] = useState<{
    id: string;
    label: string;
    value: string;
  }>({
    id: 'title',
    label: 'Title',
    value: 'title',
  });

  const [projectSearch, setProjectSearch] = useState<string>('');

  const visibleProjects = useMemo(() => {
    const sortOrder = 'asc';

    return (
      projects
        ?.filter((project) => {
          const query = projectSearch.trim().toLowerCase();

          if (!query) return true;

          return (
            project.title.toLowerCase().includes(query) ||
            project.description?.toLowerCase().includes(query)
          );
        })
        .sort((a, b) => {
          let comparison = 0;

          switch (projectSort.id) {
            case 'title':
              comparison = a.title.localeCompare(b.title);
              break;

            case 'status':
              comparison = a.status.localeCompare(b.status);
              break;

            case 'startDate':
              comparison =
                new Date(a.startDate ?? 0).getTime() -
                new Date(b.startDate ?? 0).getTime();
              break;

            case 'tasks':
              comparison = a.tasks.length - b.tasks.length;
              break;
          }

          return sortOrder === 'asc' ? comparison : -comparison;
        }) ?? []
    );
  }, [projectSearch, projectSort, projects]);

  const [projectView, setProjectView] = useState<{
    id: string;
    icon?: React.ReactNode;
  }>({
    id: 'tab-grid',
    icon: <IconListBullet className="w-5 h-5" />,
  });

  const [deleteProjectModal, setIsDeleteProjectModal] = useState<{
    isOpen: boolean;
    project: Project | null;
  }>({ isOpen: false, project: null });

  const closeDeleteProjectModal = () => {
    setIsDeleteProjectModal((prev) => ({
      ...prev,
      isOpen: false,
      project: null,
    }));
  };

  const handleOnPreview = (project: Project) => {
    router.replace(`/projects/${project.id}`);
  };

  return (
    <main className={clsx('overflow-auto', 'w-full h-screen', 'py-10 px-4')}>
      {/* Head */}
      <div className="flex justify-between items-center gap-4 max-[1080px]:flex-wrap">
        <div className="flex-1 max-[1080px]:basis-full">
          <div
            className={clsx(
              'font-hanken-grotesk font-bold',
              'text-[#DAE2FD] text-[24px] leading-tight',
            )}
          >
            Projects Page
          </div>
          <div
            className={clsx(
              'font-inter',
              'text-[#C7C4D7] text-[16px] leading-tight',
              'mt-1',
            )}
          >
            Manage and track your ongoing enterprise workstreams.
          </div>
        </div>
        {/* Project Sort */}
        <SingleSelect
          classNames={{ root: 'max-w-[150px]', trigger: 'h-10!' }}
          id="projectSort"
          value={projectSort}
          options={[
            {
              id: 'title',
              label: 'Title',
              value: 'title',
            },
            {
              id: 'status',
              label: 'Status',
              value: 'status',
            },
            {
              id: 'startDate',
              label: 'Start Date',
              value: 'startDate',
            },
            {
              id: 'tasks',
              label: 'Tasks',
              value: 'tasks',
            },
          ]}
          onChange={(selected) => {
            setProjectSort(selected);
          }}
        />
        {/* Project View Tab */}
        <SegmentedTab
          classNames={{
            root: 'h-[40px]!',
          }}
          id="projectView"
          selected={projectView}
          options={[
            {
              id: 'tab-grid',
              icon: <IconGrid1 className="w-3.5 h-3.5" />,
            },
            {
              id: 'tab-list',
              icon: <IconListBullet className="w-3.5 h-3.5" />,
            },
          ]}
          onSelect={(selected) => {
            setProjectView(selected);
          }}
        />
        {/* Project Create Button */}
        <Button
          className=""
          type="button"
          icon={<IconPlus1 className="min-w-3.5 w-3.5 h-auto" />}
          text="Create Project"
          onClick={openProjectCreateModal}
        />
      </div>
      {/* Body */}
      <div className="mt-10">
        {/* Project Item View */}
        <div
          className={clsx(
            projectView.id === 'tab-grid' &&
              'grid auto-rows-55 gap-4 grid-cols-4 max-[1440px]:grid-cols-3 max-[1080px]:grid-cols-2',
            projectView.id === 'tab-list' && 'flex flex-col gap-4',
          )}
        >
          {isProjectsPending ? (
            Array.from({ length: 4 }).map((_, index) => (
              <ProjectSkeleton
                key={`project-skeleton-${index}`}
                view={projectView.id}
              />
            ))
          ) : (
            <>
              {visibleProjects &&
                visibleProjects.length > 0 &&
                visibleProjects.map((projectItem: Project) => (
                  <ProjectItemView
                    key={projectItem.id}
                    view={projectView.id}
                    project={projectItem}
                    onTogglePreview={handleOnPreview}
                    onToggleEdit={(project) => {
                      openProjectUpdateModal(project);
                    }}
                    onToggleDelete={(project) => {
                      setIsDeleteProjectModal((prev) => ({
                        ...prev,
                        isOpen: true,
                        project,
                      }));
                    }}
                  />
                ))}
              {/* Create Project */}
              <button
                className={clsx(
                  'flex flex-col justify-center items-center gap-4',
                  'p-3',
                  'rounded-lg',
                  'border-2 border-dashed',
                  'border-[#464554] hover:border-primary',
                  projectView.id === 'tab-list' && 'flex-row h-[136px]',
                )}
                type="button"
                onClick={openProjectCreateModal}
              >
                <div
                  className={clsx(
                    'flex justify-center items-center',
                    'w-12 h-12',
                    'rounded-xl',
                    'bg-[#171F33]',
                  )}
                >
                  <IconPlus1 className="min-w-3.5 w-3.5 h-auto" />
                </div>
                <div
                  className={clsx(
                    'font-inter font-bold',
                    'text-[#C7C4D7] leading-tight tracking-[0.28px]',
                  )}
                >
                  Create Project
                </div>
              </button>
            </>
          )}
        </div>
      </div>
      {/* Project Delete Modal */}
      <ProjectDeleteModal
        isOpen={deleteProjectModal.isOpen}
        onClose={closeDeleteProjectModal}
        project={deleteProjectModal.project}
      />
    </main>
  );
}

function ProjectSkeleton({ view }: { view: string }) {
  return (
    <div
      className={clsx(
        'overflow-hidden',
        'p-6',
        'rounded-lg',
        'animate-pulse',
        'bg-[#131B2E]',
        'border border-l-[6px] border-[#464554]/30',
        view === 'tab-list' &&
          'flex justify-start items-center gap-4 min-h-[136px]',
      )}
    >
      {/* Grid View */}
      {view === 'tab-grid' && (
        <>
          {/* Status + Actions */}
          <div className="flex justify-between items-center">
            <div className="w-16 h-6 rounded-full bg-[#2D3449]" />
            <div className="w-5 h-5 rounded bg-[#2D3449]" />
          </div>

          {/* Title */}
          <div className="w-3/4 h-5 mt-4 rounded bg-[#2D3449]" />

          {/* Description */}
          <div className="space-y-2 mt-4">
            <div className="w-full h-4 rounded bg-[#2D3449]" />
            <div className="w-2/3 h-4 rounded bg-[#2D3449]" />
          </div>

          {/* Members + Tasks */}
          <div className="flex justify-between items-center h-8 mt-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#2D3449] border-2 border-[#131B2E]" />
              <div className="w-8 h-8 rounded-full bg-[#2D3449] border-2 border-[#131B2E]" />
              <div className="w-8 h-8 rounded-full bg-[#2D3449] border-2 border-[#131B2E]" />
            </div>

            <div className="w-16 h-4 rounded bg-[#2D3449]" />
          </div>
        </>
      )}

      {/* List View */}
      {view === 'tab-list' && (
        <>
          <div className="flex-1">
            <div className="w-3/4 h-5 rounded bg-[#2D3449]" />
            <div className="w-2/4 h-5 mt-4 rounded bg-[#2D3449]" />
          </div>

          <div className="basis-40 space-y-2">
            <div className="w-full h-4 rounded bg-[#2D3449]" />
          </div>

          <div className="flex basis-40 -space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#2D3449] border-2 border-[#131B2E]" />
            <div className="w-8 h-8 rounded-full bg-[#2D3449] border-2 border-[#131B2E]" />
            <div className="w-8 h-8 rounded-full bg-[#2D3449] border-2 border-[#131B2E]" />
          </div>

          <div className="basis-40 h-4 rounded bg-[#2D3449]" />

          <div className="min-w-8 w-8 h-8 rounded bg-[#2D3449]" />
        </>
      )}
    </div>
  );
}
