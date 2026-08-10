'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { useProjects } from '@/hooks/queries/useProjects';
import { useUiStore } from '@/hooks/ui/useUiStore';

import { Project } from '@/types/project.types';

import Button from '@/components/elements/Button';
import SegmentedTab from '@/components/elements/SegmentedTabs';
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

  const { data: projects } = useProjects();

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
          {projects &&
            projects.length > 0 &&
            projects.map((projectItem: Project) => (
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
