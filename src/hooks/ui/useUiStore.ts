import { create } from 'zustand';

import type { Project } from '@/types/project.types';
import type { Task } from '@/types/task.types';

interface UiState {
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

  taskCreateModal: {
    isOpen: boolean;
    project: Project | null;
  };
  openTaskCreateModal: (project: Project) => void;
  closeTaskCreateModal: () => void;

  taskUpdateModal: {
    isOpen: boolean;
    task: Task | null;
    project: Project | null;
  };
  openTaskUpdateModal: (task: Task, project: Project) => void;
  closeTaskUpdateModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
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

  taskCreateModal: {
    isOpen: false,
    task: null,
    project: null,
  },
  openTaskCreateModal: (project) =>
    set({
      taskCreateModal: {
        isOpen: true,
        project,
      },
    }),
  closeTaskCreateModal: () =>
    set({
      taskCreateModal: {
        isOpen: false,
        project: null,
      },
    }),

  taskUpdateModal: {
    isOpen: false,
    task: null,
    project: null,
  },
  openTaskUpdateModal: (task, project) =>
    set({
      taskUpdateModal: {
        isOpen: true,
        task,
        project,
      },
    }),
  closeTaskUpdateModal: () =>
    set({
      taskUpdateModal: {
        isOpen: false,
        task: null,
        project: null,
      },
    }),
}));
