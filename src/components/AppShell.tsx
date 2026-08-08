import clsx from 'clsx';

import { useUiStore } from '@/hooks/ui/useUiStore';

import ProjectCreateModal from '@/components/ProjectCreateModal';
import ProjectUpdateModal from '@/components/ProjectUpdateModal';
import Sidebar from '@/components/Sidebar';
import Toast from '@/components/Toast';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const projectCreateModal = useUiStore((state) => state.projectCreateModal);

  const closeProjectCreateModal = useUiStore(
    (state) => state.closeProjectCreateModal,
  );

  const projectUpdateModal = useUiStore((state) => state.projectUpdateModal);

  const closeProjectUpdateModal = useUiStore(
    (state) => state.closeProjectUpdateModal,
  );

  return (
    <div
      className={clsx(
        'overflow-hidden',
        'flex flex-row',
        'w-full min-h-screen h-screen',
      )}
    >
      <Sidebar
        onNewProject={() => {
          console.log('onNewProject');
        }}
      />
      {children}
      <Toast />
      <ProjectCreateModal
        isOpen={projectCreateModal.isOpen}
        onClose={closeProjectCreateModal}
      />
      <ProjectUpdateModal
        isOpen={projectUpdateModal.isOpen}
        onClose={closeProjectUpdateModal}
        project={projectUpdateModal.project}
      />
    </div>
  );
}
