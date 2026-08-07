import { ReactNode } from 'react';

import { create } from 'zustand';

export type ToastStatus = 'success' | 'warning' | 'failed';

export interface Toast {
  id: string;
  status: ToastStatus;
  icon?: ReactNode;
  message: string;
  duration: number;
}

interface ToastState {
  // Toast
  toasts: Toast[];

  showToast: (toast: {
    status: ToastStatus;
    message: string;
    icon?: ReactNode;
    duration?: number;
  }) => void;

  success: (
    message: string,
    options?: {
      icon?: ReactNode;
      duration?: number;
    },
  ) => void;

  warning: (
    message: string,
    options?: {
      icon?: ReactNode;
      duration?: number;
    },
  ) => void;

  failed: (
    message: string,
    options?: {
      icon?: ReactNode;
      duration?: number;
    },
  ) => void;

  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  showToast: ({ status, message, icon, duration = 5000 }) => {
    const id = crypto.randomUUID();

    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          status,
          message,
          icon,
          duration,
        },
      ],
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  success: (message, options) =>
    get().showToast({
      status: 'success',
      message,
      ...options,
    }),

  warning: (message, options) =>
    get().showToast({
      status: 'warning',
      message,
      ...options,
    }),

  failed: (message, options) =>
    get().showToast({
      status: 'failed',
      message,
      ...options,
    }),
}));
