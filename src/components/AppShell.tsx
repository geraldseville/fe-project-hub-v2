import clsx from 'clsx';

import { useKeyboardShortcut } from '@/hooks/ui/useKeyboardShortcut';
import { useUiStore } from '@/hooks/ui/useUiStore';

import Notification from '@/components/Notification';
import ProjectCreateModal from '@/components/ProjectCreateModal';
import ProjectUpdateModal from '@/components/ProjectUpdateModal';
import Sidebar from '@/components/Sidebar';
import SmartSearchModal from '@/components/SmartSearchModal';
import {
  IconCalendar2,
  IconCustomer1,
  IconFolder1,
  IconGridDashboard,
  IconNotifications,
  IconSettings3,
} from '@/components/svgs/icons';
import TaskCreateDrawer from '@/components/TaskCreateDrawer';
import TaskDeleteModal from '@/components/TaskDeleteModal';
import TaskUpdateDrawer from '@/components/TaskUpdateDrawer';
import Toast from '@/components/Toast';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const smartSearchModal = useUiStore((state) => state.smartSearchModal);

  const openSmartSearchModal = useUiStore(
    (state) => state.openSmartSearchModal,
  );

  const closeSmartSearchModal = useUiStore(
    (state) => state.closeSmartSearchModal,
  );

  useKeyboardShortcut({ key: 'k', ctrl: true, callback: openSmartSearchModal });

  const projectCreateModal = useUiStore((state) => state.projectCreateModal);

  const openProjectCreateModal = useUiStore(
    (state) => state.openProjectCreateModal,
  );

  const closeProjectCreateModal = useUiStore(
    (state) => state.closeProjectCreateModal,
  );

  const projectUpdateModal = useUiStore((state) => state.projectUpdateModal);

  const closeProjectUpdateModal = useUiStore(
    (state) => state.closeProjectUpdateModal,
  );

  const taskCreateDrawer = useUiStore((state) => state.taskCreateDrawer);

  const closeTaskCreateDrawer = useUiStore(
    (state) => state.closeTaskCreateDrawer,
  );

  const taskUpdateDrawer = useUiStore((state) => state.taskUpdateDrawer);

  const closeTaskUpdateDrawer = useUiStore(
    (state) => state.closeTaskUpdateDrawer,
  );

  const taskDeleteModal = useUiStore((state) => state.taskDeleteModal);

  const closeTaskDeleteModal = useUiStore(
    (state) => state.closeTaskDeleteModal,
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
        navList={[
          {
            icon: IconGridDashboard,
            label: 'Dashboard',
            href: '/dashboard',
          },
          {
            icon: IconFolder1,
            label: 'Projects',
            href: '/projects',
          },
          // {
          //   icon: IconCalendar2,
          //   label: 'Calendar',
          //   href: '/calendar',
          // },
          {
            icon: IconCustomer1,
            label: 'Teams',
            href: '/teams',
          },
          {
            icon: IconNotifications,
            label: 'Notifications',
            href: '/notifications',
          },
          {
            icon: IconSettings3,
            label: 'Settings',
            href: '/settings',
          },
        ]}
        onNewProject={openProjectCreateModal}
      />
      {children}
      <Toast />
      <Notification />
      <SmartSearchModal
        isOpen={smartSearchModal.isOpen}
        onClose={closeSmartSearchModal}
      />
      <ProjectCreateModal
        isOpen={projectCreateModal.isOpen}
        onClose={closeProjectCreateModal}
      />
      <ProjectUpdateModal
        isOpen={projectUpdateModal.isOpen}
        onClose={closeProjectUpdateModal}
        project={projectUpdateModal.project}
      />
      <TaskCreateDrawer
        isOpen={taskCreateDrawer.isOpen}
        onClose={closeTaskCreateDrawer}
        projectId={taskCreateDrawer.projectId}
        initialTask={taskCreateDrawer.initialTask}
      />
      <TaskUpdateDrawer
        isOpen={taskUpdateDrawer.isOpen}
        onClose={closeTaskUpdateDrawer}
        taskId={taskUpdateDrawer.taskId}
      />
      <TaskDeleteModal
        isOpen={taskDeleteModal.isOpen}
        onClose={closeTaskDeleteModal}
        taskId={taskDeleteModal.taskId}
      />
    </div>
  );
}
