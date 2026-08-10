import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import clsx from 'clsx';

import { PROJECT_STATUS_COLORS } from '@/utils/project.utils';

import type { Project } from '@/types/project.types';

import ProjectAsTag from '@/components/reusable/ProjectAsTag';

interface ProjectDropdownProps {
  projects: Project[];
}

export default function ProjectDropdown({ projects }: ProjectDropdownProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);

  const dismiss = useDismiss(context);

  const role = useRole(context, {
    role: 'dialog',
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const setReferenceRef = useCallback(
    (node: HTMLButtonElement | null) => {
      refs.setReference(node);
    },
    [refs],
  );

  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  return (
    <>
      <button
        className="relative"
        ref={setReferenceRef}
        type="button"
        {...getReferenceProps()}
      >
        <ProjectAsTag
          title={projects[0].title}
          color={PROJECT_STATUS_COLORS[projects[0].status].hex ?? '#000000'}
        />
      </button>

      {isOpen && (
        <FloatingPortal>
          <div
            className={clsx(
              'z-50',
              'w-[240px] max-h-[280px]',
              'overflow-y-auto',
              'rounded-lg',
              'bg-[#131B2E]',
              'border border-[#464554]',
              'shadow-xl',
            )}
            ref={setFloatingRef}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div
              className={clsx(
                'text-center',
                'p-2',
                'bg-[#131b2e]',
                'border-b border-b-[#464554]',
              )}
            >
              Projects
            </div>
            <div
              className={clsx('flex flex-wrap gap-1.5', 'p-2', 'bg-[#171F33]')}
            >
              {projects.map((project) => (
                <button
                  className=""
                  key={project.id}
                  type="button"
                  onClick={() => {
                    router.replace(`/projects/${project.id}`);
                  }}
                >
                  {/* Project tag goes here */}
                  <ProjectAsTag
                    title={project.title}
                    color={project.primaryColor ?? '#000000'}
                  />
                </button>
              ))}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
