'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useProjects } from '@/hooks/queries/useProjects';
import { useUiStore } from '@/hooks/ui/useUiStore';

import type { Project } from '@/types/project.types';

import AppShellHead from '@/components/AppShellHead';
import Button from '@/components/elements/Button';
import SegmentedTab from '@/components/elements/SegmentedTabs';
import SingleSelect from '@/components/elements/SingleSelect';
import SkeletonLoading from '@/components/elements/SkeletonLoading';
import { IconGrid1, IconListBullet, IconPlus1 } from '@/components/svgs/icons';

import ProjectDeleteModal from './ProjectDeleteModal';
import ProjectItemView from './ProjectItemView';

export default function ProjectsPage() {
  const router = useRouter();
  const { data: projects, isPending: isProjectsPending } = useProjects();
  const openProjectCreateModal = useUiStore(
    (state) => state.openProjectCreateModal,
  );
  const openProjectUpdateModal = useUiStore(
    (state) => state.openProjectUpdateModal,
  );

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
  }>({
    isOpen: false,
    project: null,
  });

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

  const closeDeleteProjectModal = () => {
    setIsDeleteProjectModal((prev) => ({
      ...prev,
      isOpen: false,
      project: null,
    }));
  };

  const handleOnPreview = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <main
      className={clsx('overflow-hidden', 'flex flex-col', 'w-full h-screen')}
    >
      {/* Head */}
      <AppShellHead />
      {/* Body */}
      <div className={clsx('overflow-y-auto', 'flex-1 min-h-0', 'py-4 px-6')}>
        {/* Project Item View */}
        <div className={clsx('flex justify-start items-center gap-4', 'mb-8')}>
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
              setProjectSort({
                id: selected.id,
                label: selected.label,
                value: selected.value as string,
              });
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
            className="ml-auto"
            type="button"
            icon={<IconPlus1 className="min-w-3.5 w-3.5 h-auto" />}
            text="Create Project"
            onClick={openProjectCreateModal}
          />
        </div>
        <div
          className={clsx(
            projectView.id === 'tab-grid' &&
              'grid auto-rows-55 gap-4 grid-cols-4 max-[1440px]:grid-cols-3 max-[1080px]:grid-cols-2',
            projectView.id === 'tab-list' && 'flex flex-col gap-4',
          )}
        >
          {isProjectsPending ? (
            Array.from({ length: 4 }).map((_, index) => {
              const view = projectView.id;

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
                      'flex justify-start items-center gap-4 min-h-32',
                  )}
                  key={`skeleton-loading-${index}`}
                >
                  {/* Grid View */}
                  {view === 'tab-grid' && (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="flex justify-start items-center gap-4">
                          <SkeletonLoading className="w-16 h-6 rounded-full" />
                          <SkeletonLoading className="w-16 h-6 rounded-full" />
                        </div>
                        <SkeletonLoading className="w-5 h-5" />
                      </div>
                      <SkeletonLoading className="w-3/4 h-5 mt-4" />
                      <div className="space-y-2 mt-4">
                        <SkeletonLoading className="w-full h-4" />
                        <SkeletonLoading className="w-2/3 h-4" />
                      </div>
                      <div className="flex justify-between items-center h-8 mt-4">
                        <div className="flex -space-x-2">
                          <SkeletonLoading className="w-8 h-8 rounded-full animate-none! border-2 border-[#131B2E]" />
                          <SkeletonLoading className="w-8 h-8 rounded-full animate-none! border-2 border-[#131B2E]" />
                          <SkeletonLoading className="w-8 h-8 rounded-full animate-none! border-2 border-[#131B2E]" />
                        </div>
                        <SkeletonLoading className="w-16 h-4" />
                      </div>
                    </>
                  )}
                  {/* List View */}
                  {view === 'tab-list' && (
                    <>
                      <div className="flex-1">
                        <SkeletonLoading className="w-3/4 h-5" />
                        <SkeletonLoading className="w-2/4 h-5 mt-4" />
                      </div>
                      <div
                        className={clsx(
                          'flex justify-start items-center gap-4',
                          'basis-50',
                        )}
                      >
                        <SkeletonLoading className="w-18 h-4" />
                        <SkeletonLoading className="w-18 h-4" />
                      </div>
                      <div className="flex basis-40 -space-x-2">
                        <SkeletonLoading className="w-8 h-8 rounded-full animate-none! border-2 border-[#131B2E]" />
                        <SkeletonLoading className="w-8 h-8 rounded-full animate-none! border-2 border-[#131B2E]" />
                        <SkeletonLoading className="w-8 h-8 rounded-full animate-none! border-2 border-[#131B2E]" />
                      </div>
                      <SkeletonLoading className="basis-40 h-4 rounded" />
                      <SkeletonLoading className="min-w-8 w-8 h-8" />
                    </>
                  )}
                </div>
              );
            })
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
                  projectView.id === 'tab-list' && 'flex-row h-32',
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
