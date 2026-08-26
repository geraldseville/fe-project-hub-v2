import { create } from 'zustand';

import type { Project } from '@/types/project.types';
import type { CreateTaskDto } from '@/types/task.types';

interface UiState {
  smartSearchModal: {
    isOpen: boolean;
  };
  openSmartSearchModal: () => void;
  closeSmartSearchModal: () => void;

  projectCreateModal: {
    isOpen: boolean;
  };
  openProjectCreateModal: () => void;
  closeProjectCreateModal: () => void;
  toggleProjectCreateModal: () => void;

  projectUpdateModal: {
    isOpen: boolean;
    project: Project | null;
    onUpdate?: () => void;
  };
  openProjectUpdateModal: (project: Project, onUpdate?: () => void) => void;
  closeProjectUpdateModal: () => void;

  taskCreateDrawer: {
    isOpen: boolean;
    projectId: string;
    initialTask: CreateTaskDto | null;
  };
  openTaskCreateDrawer: (
    projectId: string,
    initialTask?: CreateTaskDto,
  ) => void;
  closeTaskCreateDrawer: () => void;

  taskUpdateDrawer: {
    isOpen: boolean;
    taskId: string;
  };
  openTaskUpdateDrawer: (taskId: string) => void;
  closeTaskUpdateDrawer: () => void;

  taskDeleteModal: {
    isOpen: boolean;
    taskId: string;
  };
  openTaskDeleteModal: (taskId: string) => void;
  closeTaskDeleteModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  smartSearchModal: {
    isOpen: false,
  },
  openSmartSearchModal: () =>
    set({
      smartSearchModal: {
        isOpen: true,
      },
    }),
  closeSmartSearchModal: () =>
    set({
      smartSearchModal: {
        isOpen: false,
      },
    }),

  projectCreateModal: {
    isOpen: false,
  },
  openProjectCreateModal: () =>
    set({
      projectCreateModal: {
        isOpen: true,
      },
    }),
  closeProjectCreateModal: () =>
    set({
      projectCreateModal: {
        isOpen: false,
      },
    }),
  toggleProjectCreateModal: () => {
    set((state) => ({
      projectCreateModal: {
        isOpen: !state.projectCreateModal.isOpen,
      },
    }));
  },

  projectUpdateModal: {
    isOpen: false,
    project: null,
  },
  openProjectUpdateModal: (project, onUpdate) =>
    set({
      projectUpdateModal: {
        isOpen: true,
        project,
        onUpdate,
      },
    }),
  closeProjectUpdateModal: () =>
    set({
      projectUpdateModal: {
        isOpen: false,
        project: null,
      },
    }),

  taskCreateDrawer: {
    isOpen: false,
    projectId: '',
    initialTask: null,
  },
  openTaskCreateDrawer: (projectId, initialTask = undefined) =>
    set({
      taskCreateDrawer: {
        isOpen: true,
        projectId,
        initialTask: initialTask ?? null,
      },
    }),
  closeTaskCreateDrawer: () =>
    set({
      taskCreateDrawer: {
        isOpen: false,
        projectId: '',
        initialTask: null,
      },
    }),

  taskUpdateDrawer: {
    isOpen: false,
    taskId: '',
  },
  openTaskUpdateDrawer: (taskId) =>
    set({
      taskUpdateDrawer: {
        isOpen: true,
        taskId,
      },
    }),
  closeTaskUpdateDrawer: () =>
    set({
      taskUpdateDrawer: {
        isOpen: false,
        taskId: '',
      },
    }),

  taskDeleteModal: {
    isOpen: false,
    taskId: '',
  },
  openTaskDeleteModal: (taskId) =>
    set({
      taskDeleteModal: {
        isOpen: true,
        taskId,
      },
    }),
  closeTaskDeleteModal: () => {
    set({
      taskDeleteModal: {
        isOpen: false,
        taskId: '',
      },
    });
  },
}));
