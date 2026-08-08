import { create } from 'zustand';

import { type Project } from '@/types/project.types';

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
}));
