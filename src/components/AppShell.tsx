import clsx from 'clsx';

import { useUiStore } from '@/hooks/ui/useUiStore';

import ProjectCreateModal from '@/components/ProjectCreateModal';
import ProjectUpdateModal from '@/components/ProjectUpdateModal';
import Sidebar from '@/components/Sidebar';
import {
  IconAnalytics2,
  IconCalendar2,
  IconCustomer1,
  IconFolder1,
  IconGridDashboard,
  IconNotifications,
  IconSettings3,
} from '@/components/svgs/icons';
import TaskCreateModal from '@/components/TaskCreateModal';
import TaskUpdateDrawer from '@/components/TaskUpdateDrawer';
import TaskUpdateModal from '@/components/TaskUpdateModal';
import Toast from '@/components/Toast';

export default function AppShell({ children }: { children: React.ReactNode }) {
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

  const taskCreateModal = useUiStore((state) => state.taskCreateModal);

  const closeTaskCreateModal = useUiStore(
    (state) => state.closeTaskCreateModal,
  );

  const taskUpdateModal = useUiStore((state) => state.taskUpdateModal);

  const closeTaskUpdateModal = useUiStore(
    (state) => state.closeTaskUpdateModal,
  );

  const taskUpdateDrawer = useUiStore((state) => state.taskUpdateDrawer);

  const closeTaskUpdateDrawer = useUiStore(
    (state) => state.closeTaskUpdateDrawer,
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
          //   icon: IconAnalytics2,
          //   label: 'Kanban',
          //   href: '/kanban',
          // },
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
          // {
          //   icon: IconNotifications,
          //   label: 'Notifications',
          //   href: '/notifications',
          // },
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
      <ProjectCreateModal
        isOpen={projectCreateModal.isOpen}
        onClose={closeProjectCreateModal}
      />
      <ProjectUpdateModal
        isOpen={projectUpdateModal.isOpen}
        onClose={closeProjectUpdateModal}
        project={projectUpdateModal.project}
      />
      <TaskCreateModal
        isOpen={taskCreateModal.isOpen}
        onClose={closeTaskCreateModal}
        project={taskCreateModal.project}
      />
      <TaskUpdateModal
        isOpen={taskUpdateModal.isOpen}
        onClose={closeTaskUpdateModal}
        task={taskUpdateModal.task}
        project={taskUpdateModal.project}
      />
      <TaskUpdateDrawer
        isOpen={taskUpdateDrawer.isOpen}
        onClose={closeTaskUpdateDrawer}
        taskId={taskUpdateDrawer.taskId}
        projectId={taskUpdateDrawer.projectId}
      />
    </div>
  );
}
